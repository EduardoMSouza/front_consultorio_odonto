// app/(protected)/layout.tsx
import ClientLayout from '../ClientLayout';

export default function ProtectedLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return <ClientLayout>{children}</ClientLayout>;
}

