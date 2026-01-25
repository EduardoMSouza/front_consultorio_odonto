import React from 'react';
import { User, SwitchCamera, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui-shadcn/button';

interface HeaderProps {
    dentistName: string;
    cro: string;
    onChangeDentist?: () => void;
}

export default function HeaderAgenda({ dentistName, cro, onChangeDentist }: HeaderProps) {
    return (
        <div className="bg-gradient-to-r from-blue-800 via-blue-100 to-white dark:from-slate-900 dark:via-blue-900/20 dark:to-slate-900 rounded-2xl p-6 shadow-lg border border-blue-200/50 dark:border-blue-800/30">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl shadow-md border border-blue-200 dark:border-blue-700">
                        <Calendar className="h-8 w-8 text-blue-700 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white dark:text-white mb-1">
                            Agenda
                        </h1>
                        <p className="text-white dark:text-blue-200 font-medium flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5">
                                <User className="h-4 w-4" />
                                {dentistName}
                            </span>
                            <span className="text-blue-400 dark:text-blue-500">•</span>
                            <span className="text-sm white dark:text-blue-300">{cro}</span>
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={onChangeDentist}
                        variant="outline"
                        className="h-11 px-5 bg-white dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/50 shadow-sm hover:shadow-md transition-all"
                    >
                        <SwitchCamera className="h-4 w-4 mr-2" />
                        Alterar Dentista
                    </Button>

                    <Button
                        className="h-11 px-6 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Agendamento
                    </Button>
                </div>
            </div>
        </div>
    );
}