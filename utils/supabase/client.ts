export const MOCK_DOCUMENTS = [
  {
    id: "doc_1",
    user_id: "123",
    file_name: "Passport_Priya.pdf",
    category: "Identity",
    extracted_text: "Passport of Priya Nair. Issue date 2020-01-01. Expiry date 2030-01-01. Passport number A1234567.",
    summary: "Indian Passport for Priya Nair.",
    issue_date: "2020-01-01",
    expiry_date: "2030-01-01",
    file_size_bytes: 2500000,
    ocr_status: "completed",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    person_name: "Priya Nair",
    document_number: "A1234567"
  },
  {
    id: "doc_2",
    user_id: "123",
    file_name: "Health_Insurance_Policy.pdf",
    category: "Insurance",
    extracted_text: "Health Insurance Policy. Valid until next month. Policy number H-987654. Covers full hospitalization.",
    summary: "Health Insurance covering hospitalization.",
    issue_date: "2023-10-15",
    expiry_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(), // Expires in 12 days (urgent)
    file_size_bytes: 1200000,
    ocr_status: "completed",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    person_name: "Priya Nair",
    document_number: "H-987654"
  },
  {
    id: "doc_3",
    user_id: "123",
    file_name: "Driving_License.jpg",
    category: "Identity",
    extracted_text: "Driving License valid for LMV. Number DL-142536. Expiry 2028-05-10.",
    summary: "Driving License for Light Motor Vehicles.",
    issue_date: "2018-05-10",
    expiry_date: "2028-05-10",
    file_size_bytes: 850000,
    ocr_status: "completed",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    person_name: "Priya Nair",
    document_number: "DL-142536"
  },
  {
    id: "doc_4",
    user_id: "123",
    file_name: "Rental_Agreement_2024.pdf",
    category: "Housing",
    extracted_text: "Rental agreement for Apartment 4B. Valid for 11 months from Jan 2024.",
    summary: "Rental Agreement for residential apartment.",
    issue_date: "2024-01-01",
    expiry_date: "2024-11-30",
    file_size_bytes: 3400000,
    ocr_status: "completed",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    person_name: "Priya Nair",
    document_number: null
  },
  {
    id: "doc_5",
    user_id: "123",
    file_name: "Tax_Return_FY23.pdf",
    category: "Financial",
    extracted_text: "Income Tax Return Acknowledgement for Assessment Year 2023-2024.",
    summary: "ITR Acknowledgment for FY23.",
    issue_date: "2023-07-25",
    expiry_date: null,
    file_size_bytes: 900000,
    ocr_status: "completed",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 100).toISOString(),
    person_name: "Priya Nair",
    document_number: "ITR-998877"
  }
];

export function createClient(...args: any[]) {
  const makeQuery = (data: any) => {
    const p: any = Promise.resolve({ data, error: null as any });
    p.order = (...args: any[]) => makeQuery(data);
    p.single = (...args: any[]) => makeQuery(data ? data[0] || null : null);
    p.limit = (...args: any[]) => makeQuery(data);
    p.eq = (...args: any[]) => makeQuery(data);
    return p;
  };

  return {
    auth: {
      getUser: async (...args: any[]) => ({ data: { user: { id: "123", email: "priya@example.com" } }, error: null as any })
    },
    from: (table: string) => ({
      select: (...args: any[]) => {
        if (table === 'documents') return makeQuery(MOCK_DOCUMENTS);
        return makeQuery([]);
      },
      delete: (...args: any[]) => ({
        eq: (...args: any[]) => makeQuery(null)
      }),
      update: (...args: any[]) => ({
        eq: (...args: any[]) => makeQuery(null)
      }),
      insert: (...args: any[]) => makeQuery({ id: "123" })
    }),
    storage: {
      from: (bucket: string) => ({
        createSignedUrl: async (...args: any[]) => ({ data: { signedUrl: "https://example.com/mock-url" }, error: null as any }),
        remove: async (...args: any[]) => ({ data: null, error: null as any }),
        getPublicUrl: (...args: any[]) => ({ data: { publicUrl: "https://example.com/mock-url" } }),
        upload: async (...args: any[]) => ({ data: { path: "mock-path" }, error: null as any })
      })
    }
  };
}
