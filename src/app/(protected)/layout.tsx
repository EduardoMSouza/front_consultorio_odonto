// app/(protected)/layout.tsx
import ClientLayout from '../ClientLayout';
import React from "react";

export default function ProtectedLayout({children,}: { children: React.ReactNode; }) {
    return <ClientLayout>{children}</ClientLayout>;
}

