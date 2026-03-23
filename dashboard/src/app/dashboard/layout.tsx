"use client";
import React, { useEffect } from "react";
import AppShell from "@/components/layout/Shell";
import { listenToMessages } from "@/lib/notifications";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        listenToMessages();
    }, []);

    return <AppShell>{children}</AppShell>;
}
