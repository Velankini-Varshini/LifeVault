import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createWorker } from "tesseract.js";

export const maxDuration = 60;
export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  const log = (step: string, data?: any) => {
    console.log(`[UPLOAD PIPELINE] [${step}]`, data !== undefined ? JSON.stringify(data, null, 2) : "");
  };

  try {
    // ─── STEP 1: Authenticate User ──────────────────────────────────────────
    log("1. Auth: Checking Supabase session");
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
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

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      log("1. Auth: UNAUTHORIZED", { authError });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    log("1. Auth: SUCCESS", { userId: user.id, email: user.email });

    // ─── STEP 2: Parse File ───────────────────────────────────────────────────
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      log("2. FormData: No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    log("2. File Info", {
      name: file.name,
      type: file.type,
      sizeBytes: file.size,
    });

    // ─── STEP 3: Buffer Conversion ───────────────────────────────────────────
    const buffer = Buffer.from(await file.arrayBuffer());
    log("3. Buffer: Created successfully", { length: buffer.length });

    // ─── STEP 4: Storage Upload ──────────────────────────────────────────────
    const fileExt = file.name.split(".").pop() ?? "bin";
    const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    log("4. Storage: Uploading to bucket 'documents'", { fileName });

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(fileName, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      log("4. Storage: FAILED", { error: uploadError.message });
      return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(fileName);
    log("4. Storage: Upload SUCCESS", { publicUrl });

    // ─── STEP 5: Create Initial Database Record (Pending) ────────────────────
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const { data: docRecord, error: dbError } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_url: publicUrl,
        file_type: isPdf ? "pdf" : "image",
        file_size_bytes: file.size,
        ocr_status: "pending",
      })
      .select()
      .single();

    if (dbError || !docRecord) {
      log("5. DB: Insert FAILED", { error: dbError?.message });
      return NextResponse.json({ error: "Failed to create database record" }, { status: 500 });
    }
    log("5. DB: Record Created", { id: docRecord.id });

    // ─── STEP 6: Smart Extraction Pipeline ────────────────────────────────────
    let extractedText = "";
    let extractionMethod = "";
    let processingError: string | null = null;

    if (isPdf) {
      log("6. PDF Pipeline: Attempting digital text extraction with pdf-parse");
      try {
        // Require directly to bypass CJS/ESM bundling issues in Next.js
        const pdfParse = require("pdf-parse/lib/pdf-parse.js");
        const pdfData = await pdfParse(buffer);
        const rawText = pdfData?.text ? pdfData.text.trim() : "";
        log("6. PDF Pipeline: pdf-parse raw text length", { length: rawText.length });

        if (rawText.length > 20) {
          extractedText = rawText;
          extractionMethod = "pdf-parse (digital PDF)";
          log("6. PDF Pipeline: Digital text extraction SUCCESS", {
            method: extractionMethod,
            extractedLength: extractedText.length,
            snippet: extractedText.substring(0, 300),
          });
        } else {
          log("6. PDF Pipeline: PDF has no embedded text (scanned PDF image). Switching to Gemini Vision.");
        }
      } catch (pdfErr: any) {
        log("6. PDF Pipeline: pdf-parse warning/error", { message: pdfErr?.message });
      }

      // Fallback to Gemini Vision for scanned PDF images if digital extraction returned no text
      if (!extractedText) {
        log("6. PDF Pipeline: Running Gemini Vision on PDF inlineData");
        try {
          const base64Data = buffer.toString("base64");
          const visionModel = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
          const visionResult = await visionModel.generateContent([
            {
              inlineData: {
                mimeType: "application/pdf" as const,
                data: base64Data,
              },
            },
            "Extract ALL readable text from this PDF document verbatim. Return raw plain text only.",
          ]);
          extractedText = visionResult.response.text();
          extractionMethod = "gemini-1.5-flash vision (scanned PDF)";
          log("6. PDF Pipeline: Gemini Vision SUCCESS", {
            method: extractionMethod,
            extractedLength: extractedText.length,
            snippet: extractedText.substring(0, 300),
          });
        } catch (visionErr: any) {
          log("6. PDF Pipeline: Gemini Vision FAILED", { error: visionErr?.message });
          processingError = visionErr?.message || String(visionErr);
        }
      }
    } else {
      // JPG / PNG Image Branch -> Tesseract OCR
      log("6. Image Pipeline: Running Tesseract.js OCR");
      try {
        const worker = await createWorker("eng");
        const { data: { text } } = await worker.recognize(buffer);
        extractedText = text;
        await worker.terminate();
        extractionMethod = "tesseract-ocr (image)";
        log("6. Image Pipeline: Tesseract SUCCESS", {
          extractedLength: extractedText.length,
          snippet: extractedText.substring(0, 200),
        });
      } catch (ocrErr: any) {
        log("6. Image Pipeline: Tesseract FAILED", { error: ocrErr?.message });
        processingError = ocrErr?.message || String(ocrErr);
      }
    }

    // ─── STEP 7: Structured Metadata Extraction via Gemini ──────────────────
    let aiMetadata: Record<string, any> = {};

    if (extractedText && extractedText.length > 5) {
      log("7. Metadata AI: Sending extracted text to Gemini 1.5 Flash for JSON structuring");
      try {
        const metaModel = genAI.getGenerativeModel({
          model: "gemini-3.6-flash",
          generationConfig: { responseMimeType: "application/json" },
        });

        const metaPrompt = `
          Analyze the following document text extracted from a user's personal/official document.
          Extract and return ONLY a valid JSON object with these exact keys:
          {
            "category": "Exactly one of: Identity, Insurance, Warranty, Housing, Medical, Financial, Education, Other",
            "person_name": "Full name of the recipient or person the document belongs to, or null",
            "document_number": "Certificate ID, ID number, policy number, or credential reference number, or null",
            "issue_date": "Issue date or completion date in YYYY-MM-DD format (e.g. 2026-03-31), or null",
            "expiry_date": "Expiry or valid-until date in YYYY-MM-DD format, or null",
            "address": "Physical address if present in document, or null",
            "summary": "1-2 sentence concise summary of the document and recipient"
          }

          Extracted Document Text:
          """
          ${extractedText.substring(0, 15000)}
          """
        `;

        const metaResult = await metaModel.generateContent(metaPrompt);
        const rawJson = metaResult.response.text();
        log("7. Metadata AI: Gemini JSON response", { rawJson });

        aiMetadata = JSON.parse(rawJson);
        log("7. Metadata AI: Parsed metadata", aiMetadata);
      } catch (metaErr: any) {
        log("7. Metadata AI: Structuring failed (using fallback category 'Education')", { error: metaErr?.message });
        aiMetadata = { category: isPdf ? "Education" : "Other", summary: "Extracted text successfully stored." };
      }
    } else {
      log("7. Metadata AI: Skipped (no text extracted)");
    }

    // ─── STEP 8: Save to Supabase Database ──────────────────────────────────
    const finalStatus = extractedText && extractedText.length > 5 ? "completed" : "failed";
    log("8. DB Update: Updating record", {
      docId: docRecord.id,
      ocrStatus: finalStatus,
      method: extractionMethod,
      extractedTextLength: extractedText.length,
      category: aiMetadata.category,
      personName: aiMetadata.person_name,
      docNumber: aiMetadata.document_number,
      issueDate: aiMetadata.issue_date,
    });

    const { data: finalDoc, error: updateError } = await supabase
      .from("documents")
      .update({
        ocr_status: finalStatus,
        extracted_text: extractedText || null,
        category: aiMetadata.category || (isPdf ? "Education" : "Other"),
        person_name: aiMetadata.person_name || null,
        document_number: aiMetadata.document_number || null,
        issue_date: aiMetadata.issue_date || null,
        expiry_date: aiMetadata.expiry_date || null,
        address: aiMetadata.address || null,
        summary: aiMetadata.summary || null,
      })
      .eq("id", docRecord.id)
      .select()
      .single();

    if (updateError) {
      log("8. DB Update: FAILED", { error: updateError.message });
      return NextResponse.json({ success: true, document: docRecord, warning: "Text extracted but DB update failed" });
    }

    log("PIPELINE COMPLETE - SUCCESS!");
    return NextResponse.json({
      success: true,
      document: finalDoc,
      extractionMethod,
      extractedLength: extractedText.length,
    });

  } catch (err: any) {
    console.error("[UPLOAD PIPELINE] CRITICAL SERVER ERROR:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
