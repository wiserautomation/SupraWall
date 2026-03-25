// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import {
    collection,
    query,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    onSnapshot
} from "firebase/firestore";
import {
    Users,
    Plus,
    Mail,
    Trash2,
    Shield,
    ShieldCheck,
    UserPlus,
    Search,
    ExternalLink,
    Filter
} from "lucide-react";

interface TeamMember {
    id: string;
    email: string;
    role: "admin" | "auditor" | "viewer";
    status: "active" | "invited";
    addedAt: any;
}

export default function TeamPage() {
    const [user] = useAuthState(auth);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInviting, setIsInviting] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<"admin" | "auditor" | "viewer">("viewer");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!user) return;

        // Listen for team members in the organization's sub-collection
        const membersRef = collection(db, "organizations", user.uid, "members");
        const q = query(membersRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const memberList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as TeamMember));

            // Add owner as a virtual member if not present
            if (!memberList.find(m => m.email === user.email)) {
                memberList.unshift({
                    id: "owner",
                    email: user.email!,
                    role: "admin",
                    status: "active",
                    addedAt: null
                });
            }

            setMembers(memberList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !inviteEmail) return;

        try {
            await addDoc(collection(db, "organizations", user.uid, "members"), {
                email: inviteEmail,
                role: inviteRole,
                status: "invited",
                addedAt: serverTimestamp()
            });
            setInviteEmail("");
            setIsInviting(false);
        } catch (error) {
            console.error("Error inviting member:", error);
        }
    };

    const removeMember = async (memberId: string) => {
        if (!user || memberId === "owner") return;
        if (!confirm("Are you sure you want to remove this team member?")) return;

        try {
            await deleteDoc(doc(db, "organizations", user.uid, "members", memberId));
        } catch (error) {
            console.error("Error removing member:", error);
        }
    };

    const filteredMembers = members.filter(m =>
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20 text-neutral-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mr-3"></div>
                Loading team...
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <Users className="w-3 h-3" />
                        <span>Workforce Governance</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white italic">
                        Team <span className="text-neutral-400 not-italic font-light">Management</span>
                    </h1>
                    <p className="text-neutral-400 max-w-2xl text-lg">
                        Control administrative access and define granular roles for your security team.
                    </p>
                </div>
                <button
                    onClick={() => setIsInviting(true)}
                    className="group bg-white text-black hover:bg-emerald-400 hover:text-black px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center shadow-lg shadow-white/5 active:scale-95"
                >
                    <UserPlus className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                    Invite Member
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Members", value: members.length, icon: Users, color: "emerald" },
                    { label: "Pending Invites", value: members.filter(m => m.status === "invited").length, icon: Mail, color: "violet" },
                    { label: "Admins", value: members.filter(m => m.role === "admin").length, icon: ShieldCheck, color: "blue" },
                ].map((stat, i) => (
                    <div key={i} className="bg-neutral-900/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl group hover:border-white/[0.1] transition-all duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:scale-110 transition-transform duration-500`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-3xl font-bold text-white tabular-nums">{stat.value}</span>
                        </div>
                        <p className="text-neutral-400 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-neutral-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/20">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by email or role..."
                            className="w-full bg-black border border-white/[0.1] rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 text-neutral-400 hover:text-white bg-white/[0.05] border border-white/10 rounded-xl transition-all">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-neutral-900/40 text-neutral-400 text-xs font-bold uppercase tracking-widest">
                                <th className="px-8 py-5">User</th>
                                <th className="px-8 py-5">Role</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="group hover:bg-white/[0.01] transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/[0.1] flex items-center justify-center text-emerald-400 font-bold text-sm mr-4 shadow-inner">
                                                {member.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white tracking-tight">{member.email}</p>
                                                {member.id === "owner" && (
                                                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-tighter">Organization Owner</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center">
                                            {member.role === "admin" ? (
                                                <ShieldCheck className="w-4 h-4 text-emerald-400 mr-2" />
                                            ) : (
                                                <Shield className="w-4 h-4 text-neutral-400 mr-2" />
                                            )}
                                            <span className={`text-sm font-medium ${member.role === 'admin' ? 'text-white' : 'text-neutral-400'} capitalize`}>
                                                {member.role}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${member.status === 'active'
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                                            }`}>
                                            <span className={`w-1 h-1 rounded-full mr-1.5 animate-pulse ${member.status === 'active' ? 'bg-emerald-400' : 'bg-violet-400'
                                                }`} />
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            {member.id !== "owner" && (
                                                <button
                                                    onClick={() => removeMember(member.id)}
                                                    className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button className="p-2 text-neutral-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal */}
            {isInviting && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60 animate-in fade-in duration-300">
                    <div className="bg-neutral-950 border border-white/[0.1] w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl shadow-emerald-500/5 slide-in-from-bottom-8 animate-in duration-500">
                        <div className="p-8 border-b border-white/10 bg-gradient-to-br from-neutral-900 to-black">
                            <h3 className="text-2xl font-bold text-white mb-2 italic">Invite <span className="text-emerald-400 not-italic">Team Member</span></h3>
                            <p className="text-neutral-400 text-sm">Add a colleague to your security organization.</p>
                        </div>
                        <form onSubmit={handleInvite} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-black border border-white/[0.1] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all"
                                        placeholder="colleague@company.com"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Security Role</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {["admin", "auditor", "viewer"].map((role) => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setInviteRole(role as any)}
                                            className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${inviteRole === role
                                                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/5'
                                                    : 'bg-neutral-900 border-white/10 text-neutral-400 hover:border-white/[0.1] hover:text-neutral-300'
                                                }`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-neutral-600 mt-2 px-1 italic">
                                    {inviteRole === 'admin' && "Full access to policies, agents, and team management."}
                                    {inviteRole === 'auditor' && "Can view all logs and monitor agent activity, but cannot change policies."}
                                    {inviteRole === 'viewer' && "Read-only access to the dashboard and monitoring metrics."}
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsInviting(false)}
                                    className="flex-1 py-4 text-sm font-bold text-neutral-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/10 active:scale-95 flex items-center justify-center"
                                >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Send Invite
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {filteredMembers.length === 0 && (
                <div className="bg-neutral-900/20 border border-white/10 border-dashed rounded-[40px] p-20 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-neutral-900 rounded-3xl flex items-center justify-center text-neutral-400 mb-6 ring-1 ring-white/10 shadow-2xl">
                        <Users className="w-10 h-10 opacity-20" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 italic">No Team <span className="text-neutral-400 not-italic">Members Found</span></h3>
                    <p className="text-neutral-400 max-w-sm mb-8">No members match your current filter. Try adjusting your search or inviting more colleagues.</p>
                </div>
            )}
        </div>
    );
}
