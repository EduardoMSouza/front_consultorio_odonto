"use client"

import React, { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui-shadcn/tabs";
import { Button } from "@/components/ui-shadcn/button";
import { AgendaFullCalendarMonth } from "@/components/core/agenda/calendario/AgendaFullCalendarMonth";
import { AgendaFullCalendarWeek } from "@/components/core/agenda/calendario/AgendaFullCalendarWeek";
import { AgendaFullCalendarDay } from "@/components/core/agenda/calendario/AgendaFullCalendarDay";

interface CalendarSectionProps {
    dentistaId: number;
    dentistaName: string;
}

export default function CalendarSection({ dentistaId, dentistaName }: CalendarSectionProps) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState<'month' | 'week' | 'day'>('week');

    const handleMonthDayClick = (date: Date) => {
        setSelectedDate(date);
        setView('day');
    };

    return (
        <div className="col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-800">

            <Tabs value={view} onValueChange={(v) => setView(v as 'month' | 'week' | 'day')}>
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
                    <TabsTrigger
                        value="month"
                        className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:shadow-md text-gray-600 dark:text-slate-400 font-medium transition-all"
                    >
                        Mensal
                    </TabsTrigger>
                    <TabsTrigger
                        value="week"
                        className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:shadow-md text-gray-600 dark:text-slate-400 font-medium transition-all"
                    >
                        Semanal
                    </TabsTrigger>
                    <TabsTrigger
                        value="day"
                        className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:shadow-md text-gray-600 dark:text-slate-400 font-medium transition-all"
                    >
                        Diária
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="month" className="mt-0">
                    <AgendaFullCalendarMonth
                        dentistaId={dentistaId}
                        initialDate={selectedDate}
                        onDayClick={handleMonthDayClick}
                    />
                </TabsContent>

                <TabsContent value="week" className="mt-0">
                    <AgendaFullCalendarWeek
                        dentistaId={dentistaId}
                        initialDate={selectedDate}
                    />
                </TabsContent>

                <TabsContent value="day" className="mt-0">
                    <AgendaFullCalendarDay
                        dentistaId={dentistaId}
                        initialDate={selectedDate}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}