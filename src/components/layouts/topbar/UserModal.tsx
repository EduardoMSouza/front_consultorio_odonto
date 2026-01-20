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
            <div className="p-4 flex items-center gap-3 border-b border-slate-200 dark:border-slate-700">
                <img src={userData.avatar} className="w-12 h-12 rounded-full" />
                <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                        {userData.name}
                    </p>
                    <p className="text-sm text-slate-500">{userData.role}</p>
                </div>
            </div>

            <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Mail size={16} />
                    {userData.email}
                </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 p-2">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                    <User size={16} /> Meu perfil
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                    <Settings size={16} /> Configurações
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                    <LogOut size={16} /> Sair
                </button>
            </div>
        </div>
    );
}
