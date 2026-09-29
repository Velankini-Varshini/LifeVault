import { Suspense } from "react";
import { VaultView } from "@/components/documents/VaultView";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-24 text-slate-500">Loading vault...</div>}>
      <VaultView />
    </Suspense>
  );
}
