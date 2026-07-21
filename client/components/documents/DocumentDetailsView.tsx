"use client";

import React, { useState } from "react";
import { 
  FileText, Image as ImageIcon, Download, Share2, Trash2, 
  Shield, Clock, Users, ArrowLeft, Sparkles 
} from "lucide-react";
import { vaultDocuments } from "@/components/documents/vault-data";
import { StatusBadge } from "@/components/documents/StatusBadge";
import Link from "next/link";

export function DocumentDetailsView({ docId }: { docId: string }) {
  const doc = vaultDocuments.find((d) => d.id === docId) || vaultDocuments[0];
  const [sharedUsers, setSharedUsers] = useState([
    { name: "Priya Nair", email: "priya@example.com", role: "Owner" },
    { name: "Alina Nair", email: "alina@example.com", role: "Viewer" },
  ]);
  const [newEmail, setNewEmail] = useState("");

  if (!doc) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <Shield className="h-12 w-12 text-slate-300" />
        <h2 className="mt-4 font-display text-lg font-semibold text-slate-900">Document not found</h2>
        <Link href="/documents" className="mt-2 text-sm text-indigo-600 hover:text-indigo-700">
          Return to vault
        </Link>
      </div>
    );
  }

  const Icon = doc.fileKind === "pdf" ? FileText : ImageIcon;

  const handleAddShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    setSharedUsers([...sharedUsers, { name: newEmail.split("@")[0], email: newEmail, role: "Viewer" }]);
    setNewEmail("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link 
          href="/documents" 
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-semibold tracking-tight text-slate-900 truncate max-w-md">
            {doc.name}
          </h1>
          <p className="text-xs text-slate-500">
            {doc.category} · Updated {doc.uploadedAt}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Mock File Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-slate-50" />
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50">
                <Download className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50">
                <Share2 className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-red-600 shadow-sm hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Premium Document Preview Card mockup */}
            <div className="relative z-10 w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-lg shadow-slate-900/5 select-none">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-indigo-50 text-indigo-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {doc.category} Document
                  </span>
                </div>
                <StatusBadge status={doc.status} />
              </div>

              <div className="mt-4 space-y-3">
                <div className="font-display text-sm font-bold text-slate-900 truncate">
                  {doc.name}
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div>
                    <span className="text-slate-400">Owner</span>
                    <p className="font-medium text-slate-700">Priya Nair</p>
                  </div>
                  <div>
                    <span className="text-slate-400">File Type</span>
                    <p className="font-medium text-slate-700 uppercase">{doc.fileKind}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Expires</span>
                    <p className="font-mono font-medium text-slate-700">{doc.expiryDate ?? "Never"}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">File Size</span>
                    <p className="font-medium text-slate-700">{doc.sizeLabel}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded bg-slate-200/50 p-3 text-[10px] font-mono text-slate-500 leading-relaxed truncate">
                [OCR_EXTRACTED]: {doc.summary}
              </div>
            </div>
            
            <p className="mt-4 text-xs text-slate-400 z-10">
              Interactive high-fidelity PDF viewer will render on production deployment.
            </p>
          </div>

          {/* AI Summary and Extracted Info section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-display text-base font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-indigo-600" />
              AI Summary & Insights
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              {doc.summary}
            </p>
            <div className="mt-4 bg-indigo-50/50 rounded-xl border border-indigo-100 p-4 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-800">
                Suggested Actions
              </span>
              <ul className="text-xs text-indigo-700 space-y-1.5 list-disc pl-4">
                {doc.expiryDate && (
                  <li>Renew this document before the expiry date ({doc.expiryDate}).</li>
                )}
                <li>Ensure family member Alina has viewer access to this document.</li>
                <li>Set up automatic backup alerts in Settings → Notifications.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Metadata, Sharing, Timeline */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-display text-sm font-semibold text-slate-900 mb-4">Metadata</h3>
            <dl className="space-y-3.5 text-xs">
              <div className="flex justify-between">
                <dt className="text-slate-500">Document ID</dt>
                <dd className="font-mono text-slate-900">{doc.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Category</dt>
                <dd className="text-slate-900 font-medium">{doc.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Uploaded</dt>
                <dd className="text-slate-900">{doc.uploadedAt}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Expires</dt>
                <dd className="font-mono text-slate-900">{doc.expiryDate ?? "—"}</dd>
              </div>
              {doc.daysLeft !== null && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Days Remaining</dt>
                  <dd className={`font-mono font-medium ${doc.daysLeft < 30 ? "text-red-600" : "text-slate-700"}`}>
                    {doc.daysLeft} days
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Sharing Settings Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-display text-sm font-semibold text-slate-900 flex items-center justify-between mb-4">
              <span>Sharing Settings</span>
              <Users className="h-4 w-4 text-slate-400" />
            </h3>
            
            <div className="space-y-3">
              {sharedUsers.map((usr, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-medium text-slate-900">{usr.name}</p>
                    <p className="text-[10px] text-slate-500">{usr.email}</p>
                  </div>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                    usr.role === "Owner" ? "bg-slate-100 text-slate-700" : "bg-indigo-50 text-indigo-700"
                  }`}>
                    {usr.role}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddShare} className="mt-4 flex gap-2">
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="partner@example.com"
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
              <button 
                type="submit" 
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
              >
                Share
              </button>
            </form>
          </div>

          {/* Timeline / Audit logs Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-display text-sm font-semibold text-slate-900 flex items-center gap-1.5 mb-4">
              <Clock className="h-4.5 w-4.5 text-slate-400" />
              Activity Timeline
            </h3>

            <div className="relative border-l border-slate-100 pl-4 ml-2.5 space-y-4 text-xs">
              <div className="relative">
                <span className="absolute -left-[21px] flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-white" />
                <p className="font-medium text-slate-800">Document Scanned & Extracted</p>
                <p className="text-[10px] text-slate-400">Today, 2:32 PM by System OCR</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] flex h-2.5 w-2.5 items-center justify-center rounded-full bg-indigo-500 ring-4 ring-white" />
                <p className="font-medium text-slate-800">Shared Access Modified</p>
                <p className="text-[10px] text-slate-400">Yesterday, 5:11 PM by Priya Nair</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] flex h-2.5 w-2.5 items-center justify-center rounded-full bg-slate-300 ring-4 ring-white" />
                <p className="font-medium text-slate-800">Document Uploaded</p>
                <p className="text-[10px] text-slate-400">{doc.uploadedAt} by Priya Nair</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
