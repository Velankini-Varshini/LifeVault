"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, UserPlus, Shield, Eye, Edit3, Trash2, 
  CheckCircle2, Clock, Mail, Search, Info 
} from "lucide-react";

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Editor" | "Viewer";
  status: "Active" | "Pending";
  joinedDate: string;
}

interface SharedDocument {
  id: string;
  name: string;
  category: string;
  sharedWith: string[];
}

interface SharingActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

export function FamilySharingView() {
  const [members, setMembers] = useState<FamilyMember[]>([
    { id: "m1", name: "Priya Nair", email: "priya@example.com", role: "Owner", status: "Active", joinedDate: "Jul 01, 2026" },
    { id: "m2", name: "Alina Nair", email: "alina@example.com", role: "Viewer", status: "Active", joinedDate: "Jul 14, 2026" },
    { id: "m3", name: "Rajesh Nair", email: "rajesh@example.com", role: "Editor", status: "Pending", joinedDate: "Jul 18, 2026" },
  ]);

  const [sharedDocs] = useState<SharedDocument[]>([
    { id: "d1", name: "Passport — Alina.pdf", category: "Identity", sharedWith: ["alina@example.com"] },
    { id: "d2", name: "Rental lease 2026.pdf", category: "Housing", sharedWith: ["alina@example.com", "rajesh@example.com"] },
    { id: "d3", name: "Car insurance policy.pdf", category: "Insurance", sharedWith: ["rajesh@example.com"] },
  ]);

  const [activities, setActivities] = useState<SharingActivity[]>([
    { id: "a1", user: "Priya Nair", action: "invited", target: "Rajesh Nair", time: "1 day ago" },
    { id: "a2", user: "Alina Nair", action: "accepted invitation to join vault", target: "LifeVault AI", time: "5 days ago" },
    { id: "a3", user: "Priya Nair", action: "shared document", target: "Rental lease 2026.pdf", time: "5 days ago" },
  ]);

  // Form State
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<FamilyMember["role"]>("Viewer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setIsSubmitting(true);
    setSuccessMessage(null);

    // Simulate API request
    setTimeout(() => {
      const newMember: FamilyMember = {
        id: `m-${Date.now()}`,
        name,
        email,
        role,
        status: "Pending",
        joinedDate: "Today",
      };

      setMembers([...members, newMember]);
      setActivities([
        {
          id: `a-${Date.now()}`,
          user: "Priya Nair",
          action: "invited",
          target: name,
          time: "Just now",
        },
        ...activities,
      ]);

      setIsSubmitting(false);
      setSuccessMessage(`Invitation successfully sent to ${name} (${email})`);
      setEmail("");
      setName("");
      setRole("Viewer");

      // Auto-clear success banner after 4 seconds
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 1000);
  };

  const handleRemoveMember = (id: string, memberName: string) => {
    if (confirm(`Are you sure you want to revoke vault access for ${memberName}?`)) {
      setMembers(members.filter((m) => m.id !== id));
      setActivities([
        {
          id: `a-${Date.now()}`,
          user: "Priya Nair",
          action: "revoked access for",
          target: memberName,
          time: "Just now",
        },
        ...activities,
      ]);
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeColor = (role: FamilyMember["role"]) => {
    switch (role) {
      case "Owner":
        return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700";
      case "Admin":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50";
      case "Editor":
        return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50";
      case "Viewer":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50";
    }
  };

  const getStatusBadgeColor = (status: FamilyMember["status"]) => {
    return status === "Active"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
      : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 animate-pulse";
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Welcome & Info */}
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Family Sharing
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Securely share access to your passports, insurance files, and other critical documents with trusted household members.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Active Members & Shared Docs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Members Table Container */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
              <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                Members with Vault Access
              </h3>
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-auto">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-48 min-h-[38px] rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-4 overflow-x-auto max-w-full">
              <table className="w-full text-left border-collapse text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800 font-semibold uppercase tracking-wider">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Joined</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <AnimatePresence>
                    {filteredMembers.map((member) => (
                      <motion.tr 
                        key={member.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="align-middle text-slate-700 dark:text-slate-300"
                      >
                        <td className="py-3.5 font-medium">
                          <div>
                            <p className="text-slate-900 dark:text-white font-semibold">{member.name}</p>
                            <p className="text-[10px] text-slate-400">{member.email}</p>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold ${getRoleBadgeColor(member.role)}`}>
                            {member.role === "Owner" ? (
                              <Shield className="h-3 w-3" />
                            ) : member.role === "Viewer" ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <Edit3 className="h-3 w-3" />
                            )}
                            {member.role}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusBadgeColor(member.status)}`}>
                            {member.status === "Active" ? (
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Clock className="h-3 w-3 text-amber-500" />
                            )}
                            {member.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-400 font-medium">{member.joinedDate}</td>
                        <td className="py-3.5 text-right">
                          {member.role !== "Owner" && (
                            <button
                              onClick={() => handleRemoveMember(member.id, member.name)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors dark:hover:bg-red-950/30 cursor-pointer active:scale-95"
                              title="Revoke access"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {filteredMembers.length === 0 && (
                <div className="py-8 text-center text-slate-400">No members found matching your search.</div>
              )}
            </div>
          </div>

          {/* Shared Documents Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 pb-4 dark:border-slate-800">
              Shared Document Policies
            </h3>
            <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {sharedDocs.map((doc) => (
                <li key={doc.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{doc.name}</p>
                    <p className="text-[10px] text-slate-400">{doc.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">Shared with:</span>
                    <div className="flex -space-x-1.5">
                      {doc.sharedWith.map((email, idx) => (
                        <span 
                          key={idx}
                          title={email}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 border border-indigo-200 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-400 uppercase"
                        >
                          {email.substring(0, 2)}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side: Invite Panel & Activity */}
        <div className="space-y-6">
          {/* Invite Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 relative overflow-hidden">
            <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 mb-4">
              <UserPlus className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
              Invite Family Member
            </h3>

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[11px] font-medium text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </motion.div>
            )}

            <form onSubmit={handleInvite} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajesh Nair"
                  className="mt-1 w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email Address
                </label>
                <div className="relative mt-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rajesh@example.com"
                    className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3.5 text-xs text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Access Permissions (Role)
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as FamilyMember["role"])}
                  className="mt-1 w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs text-slate-700 focus:border-indigo-400 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Viewer">Viewer (Can search and view documents)</option>
                  <option value="Editor">Editor (Can upload, delete, and view)</option>
                  <option value="Admin">Admin (Can invite members, delete all records)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[44px] rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                    <span>Sending Invite...</span>
                  </>
                ) : (
                  <span>Send Vault Invitation</span>
                )}
              </button>
            </form>
          </div>

          {/* Activity Log */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 mb-4">
              <Clock className="h-4.5 w-4.5 text-slate-400" />
              Sharing Activity
            </h3>
            
            <div className="relative border-l border-slate-100 pl-4 ml-2.5 space-y-4 text-xs dark:border-slate-800">
              {activities.map((act) => (
                <div key={act.id} className="relative">
                  <span className="absolute -left-[21px] flex h-2 w-2 items-center justify-center rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900" />
                  <p className="font-medium text-slate-800 dark:text-slate-300">
                    {act.user} <span className="text-slate-400 font-normal">{act.action}</span> {act.target}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{act.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-2 dark:border-blue-900/40 dark:bg-blue-950/15">
            <h4 className="text-[11px] font-semibold text-blue-800 dark:text-blue-400 uppercase flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Access Security
            </h4>
            <p className="text-[10px] text-blue-700/80 leading-relaxed dark:text-blue-400/80">
              Invited members are required to log in via Firebase Email or Google authentication. The Owner can revoke permissions or remove access at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
