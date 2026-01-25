'use client';

import { User, Settings, LogOut, Mail } from 'lucide-react';

interface UserData {
    name: string;
    email: string;
    role: string;
    avatar: string;
}

interface Props {
    userData: UserData;
    onClose: () => void;
}

export default function UserModal({ userData, onClose }: Props) {
    return (
        <div
            className="absolute right-0 top-14 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50"
            onClick={(e) => e.stopPropagation()}
        >

            <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <User size={16} />
                    {userData.name}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Mail size={16} />
                    {userData.email}
                </div>
            </div>
        </div>
    );
}
