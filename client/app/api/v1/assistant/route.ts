import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("[ASSISTANT] Unauthorized user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    console.log(`[ASSISTANT] Processing query for user ${user.id}: "${query}"`);

    // 2. Fetch user's documents for context
    const { data: docs, error: dbError } = await supabase
      .from("documents")
      .select("id, file_name, category, extracted_text, summary, issue_date, expiry_date, person_name, document_number, address")
      .eq("user_id", user.id);

    if (dbError) {
      console.error("[ASSISTANT] DB error:", dbError);
      throw dbError;
    }

    console.log(`[ASSISTANT] Found ${docs?.length ?? 0} document(s) in vault`);

    // 3. Build RAG context from all user documents (full text up to 15,000 chars per doc)
    let contextStr = "You currently have no documents stored in your vault.";
    const sources: { id: string; name: string; category: string }[] = [];

    if (docs && docs.length > 0) {
      contextStr = docs.map((doc, i) => {
        sources.push({ id: doc.id, name: doc.file_name, category: doc.category || "Uncategorized" });
        return `
--- DOCUMENT ${i + 1} ---
Filename: ${doc.file_name}
Category: ${doc.category || "Uncategorized"}
Summary: ${doc.summary || "N/A"}
Person Name: ${doc.person_name || "N/A"}
Document/Certificate ID: ${doc.document_number || "N/A"}
Issue Date / Completion Date: ${doc.issue_date || "N/A"}
Expiry Date: ${doc.expiry_date || "N/A"}
Full Extracted Document Content:
"""
${doc.extracted_text || doc.summary || "No text available"}
"""
-----------------------`;
      }).join("\n");
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("[ASSISTANT] GEMINI_API_KEY missing");
      return NextResponse.json({ error: "GEMINI_API_KEY environment variable is not configured." }, { status: 500 });
    }

    // 4. Query Gemini 3.6 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const prompt = `
You are LifeVault AI, a secure and smart assistant grounded in the user's personal document vault.
Answer the user's question accurately using ONLY the document context provided below.

=== USER DOCUMENT VAULT CONTEXT ===
${contextStr}
====================================

USER QUESTION: "${query}"

INSTRUCTIONS:
1. Provide a direct, helpful, and friendly answer based on the vault documents.
2. If the user asks about dates (like completion date, issue date, or expiry date), cite the exact date found in the text or metadata.
3. Mention the specific document filename where you found the information.
4. If the question cannot be answered from the provided documents, politely state that you couldn't find relevant details in their vault. Do NOT fabricate information.
`;

    console.log("[ASSISTANT] Sending query prompt to Gemini 1.5 Flash...");
    const result = await model.generateContent(prompt);
    const replyText = result.response.text();
    console.log("[ASSISTANT] Gemini response received successfully!");

    return NextResponse.json({
      reply: replyText,
      sources: docs && docs.length > 0 ? sources : [],
    });

  } catch (err: any) {
    console.error("[ASSISTANT ERROR]:", err);
    return NextResponse.json({ error: err?.message || "Failed to generate AI response" }, { status: 500 });
  }
}
