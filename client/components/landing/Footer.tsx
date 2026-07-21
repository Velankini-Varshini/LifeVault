import Link from "next/link";
import { Vault } from "lucide-react";

const columns = [
  {
    heading: "Product",
    links: ["Features", "AI assistant", "Pricing", "Family sharing", "Changelog"],
  },
  {
    heading: "Company",
    links: ["About", "Blog", "Careers", "Contact"],
  },
  {
    heading: "Resources",
    links: ["Help center", "Security", "Status", "API docs"],
  },
  {
    heading: "Legal",
    links: ["Privacy policy", "Terms of service", "Data processing"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600">
                <Vault className="h-4 w-4 text-white" strokeWidth={2.25} />
              </span>
              <span className="font-display text-[15px] font-semibold tracking-tight text-slate-900">
                LifeVault <span className="text-indigo-600">AI</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-slate-500">
              The AI-powered vault to securely organize, search, and manage your
              important personal documents.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="text-sm font-medium text-slate-900">{col.heading}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-900">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} LifeVault AI. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-900">Twitter</a>
            <a href="#" className="hover:text-slate-900">LinkedIn</a>
            <a href="#" className="hover:text-slate-900">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
