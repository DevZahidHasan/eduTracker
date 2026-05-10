'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, Clock, BookOpen, User as UserIcon } from 'lucide-react';
import { ConfigOption } from '@/lib/features/configSlice';

import { Routine, Period, DayOfWeek } from '@/types/models';

interface RoutineEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (routines: DayRoutine[]) => void;
  initialRoutines: Routine[];
  subjects: ConfigOption[];
  teachers: ConfigOption[];
}

interface LocalPeriod {
  id?: number;
  subjectId: string;
  teacherId: number;
  startTime: string;
  endTime: string;
  periodNumber: number;
}

interface DayRoutine {
  dayOfWeek: DayOfWeek;
  periods: LocalPeriod[];
}

const DAYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export function RoutineEditorModal({
  isOpen,
  onClose,
  onSave,
  initialRoutines,
  subjects,
  teachers
}: RoutineEditorModalProps) {
  const [routines, setRoutines] = useState<DayRoutine[]>([]);
  const [activeDay, setActiveDay] = useState<DayOfWeek>('MONDAY');

  useEffect(() => {
    // Initialize routines from initialRoutines or create empty ones for each day
    const normalizedRoutines = DAYS.map(day => {
      const existing = initialRoutines.find(r => r.dayOfWeek === day);
      return {
        dayOfWeek: day,
        periods: existing ? existing.periods.map((p) => ({
          id: p.id,
          subjectId: p.subjectId,
          teacherId: p.teacherId,
          startTime: p.startTime,
          endTime: p.endTime,
          periodNumber: p.periodNumber || 1
        })) : []
      };
    });
    setRoutines(normalizedRoutines as DayRoutine[]);
  }, [initialRoutines, isOpen]);

  const addPeriod = (day: DayOfWeek) => {
    setRoutines(prev => prev.map(r => {
      if (r.dayOfWeek === day) {
        return {
          ...r,
          periods: [
            ...r.periods,
            {
              subjectId: subjects[0]?.value || '',
              teacherId: parseInt(teachers[0]?.value || '0'),
              startTime: '08:00',
              endTime: '09:00',
              periodNumber: r.periods.length + 1
            }
          ]
        };
      }
      return r;
    }));
  };

  const removePeriod = (day: DayOfWeek, index: number) => {
    setRoutines(prev => prev.map(r => {
      if (r.dayOfWeek === day) {
        const newPeriods = [...r.periods];
        newPeriods.splice(index, 1);
        return { ...r, periods: newPeriods };
      }
      return r;
    }));
  };

  const updatePeriod = (day: DayOfWeek, index: number, field: keyof LocalPeriod, value: any) => {
    setRoutines(prev => prev.map(r => {
      if (r.dayOfWeek === day) {
        const newPeriods = [...r.periods];
        let finalValue = value;
        if (field === 'teacherId') finalValue = parseInt(value);
        newPeriods[index] = { ...newPeriods[index], [field]: finalValue };
        return { ...r, periods: newPeriods };
      }
      return r;
    }));
  };

  const handleSave = () => {
    onSave(routines);
  };

  const activeRoutine = routines.find(r => r.dayOfWeek === activeDay);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Class Routine"
      className="max-w-4xl w-full"
    >
      <div className="flex flex-col h-[600px]">
        {/* Day Selector */}
        <div className="flex border-b overflow-x-auto no-scrollbar py-2">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 text-xs font-bold rounded-full mr-2 transition-all whitespace-nowrap ${
                activeDay === day 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Periods List */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {activeDay} Schedule
            </h3>
            <Button size="sm" onClick={() => addPeriod(activeDay)} className="h-8">
              <Plus className="h-4 w-4 mr-1" />
              Add Period
            </Button>
          </div>

          {activeRoutine && activeRoutine.periods.length > 0 ? (
            <div className="space-y-4">
              {activeRoutine.periods.map((period, idx) => (
                <div key={idx} className="flex flex-wrap items-end gap-4 p-4 rounded-xl border bg-muted/20 relative group">
                  <div className="flex-1 min-w-[150px] space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> Subject
                    </label>
                    <select
                      value={period.subjectId}
                      onChange={(e) => updatePeriod(activeDay, idx, 'subjectId', e.target.value)}
                      className="w-full h-9 text-sm px-2 rounded-md border bg-white focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      {subjects.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>

                  <div className="flex-1 min-w-[150px] space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <UserIcon className="h-3 w-3" /> Teacher
                    </label>
                    <select
                      value={period.teacherId}
                      onChange={(e) => updatePeriod(activeDay, idx, 'teacherId', e.target.value)}
                      className="w-full h-9 text-sm px-2 rounded-md border bg-white focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      {teachers.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>

                  <div className="w-24 space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Start</label>
                    <Input
                      type="time"
                      value={period.startTime}
                      onChange={(e) => updatePeriod(activeDay, idx, 'startTime', e.target.value)}
                      className="h-9 px-2 bg-white"
                    />
                  </div>

                  <div className="w-24 space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">End</label>
                    <Input
                      type="time"
                      value={period.endTime}
                      onChange={(e) => updatePeriod(activeDay, idx, 'endTime', e.target.value)}
                      className="h-9 px-2 bg-white"
                    />
                  </div>

                  <div className="w-16 space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Period</label>
                    <Input
                      type="number"
                      value={period.periodNumber}
                      onChange={(e) => updatePeriod(activeDay, idx, 'periodNumber', parseInt(e.target.value))}
                      className="h-9 px-2 bg-white"
                    />
                  </div>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg shrink-0"
                    onClick={() => removePeriod(activeDay, idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border-2 border-dashed rounded-2xl bg-muted/10">
              <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-20" />
              <p className="text-muted-foreground text-sm font-medium">No periods added for {activeDay}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-3 text-primary hover:bg-primary/5 font-bold"
                onClick={() => addPeriod(activeDay)}
              >
                + Add First Period
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-6 border-t mt-auto">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Full Weekly Routine</Button>
        </div>
      </div>
    </Modal>
  );
}
