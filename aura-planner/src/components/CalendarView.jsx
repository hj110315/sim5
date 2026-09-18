import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Trash2, Calendar as CalendarIcon, Tag } from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function CalendarView({ onBackToLobby }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [deadlines] = useLocalStorage('aura_deadlines', []);
  const [events, setEvents] = useLocalStorage('aura_calendar_events', {});
  
  const [newEventText, setNewEventText] = useState('');
  const [eventType, setEventType] = useState('exam');

  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const dayEvents = events[dateKey] || [];
  const dayDeadlines = deadlines.filter(d => d.dueDate === dateKey);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const addEvent = (e) => {
    e.preventDefault();
    if (!newEventText.trim()) return;
    
    const newEntry = {
      id: Date.now(),
      title: newEventText.trim(),
      type: eventType,
    };

    setEvents({
      ...events,
      [dateKey]: [...dayEvents, newEntry]
    });
    setNewEventText('');
  };

  const deleteEvent = (eventId) => {
    const updated = dayEvents.filter(e => e.id !== eventId);
    setEvents({
      ...events,
      [dateKey]: updated
    });
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'exam': return 'bg-rose-500/30 text-rose-200 border-rose-400/40';
      case 'assignment': return 'bg-amber-500/30 text-amber-200 border-amber-400/40';
      case 'rest': return 'bg-emerald-500/30 text-emerald-200 border-emerald-400/40';
      default: return 'bg-sky-500/30 text-sky-200 border-sky-400/40';
    }
  };

  return (
    <div className="w-full p-6 text-white max-w-6xl mx-auto space-y-6">
      <header className="glass-panel p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onBackToLobby} className="glass-button p-2 text-xs" title="Return to Lobby">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-wider flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-emerald-300" /> MONTHLY ACADEMIC RADAR
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="glass-button p-2">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono font-bold text-sm px-3">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="glass-button p-2">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 space-y-4">
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-white/50 border-b border-white/10 pb-2">
            <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day) => {
              const formattedDayKey = format(day, 'yyyy-MM-dd');
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isCurrentDay = isToday(day);

              const dayNoteCount = (events[formattedDayKey] || []).length;
              const dayDeadlineCount = deadlines.filter(d => d.dueDate === formattedDayKey).length;
              const hasItems = dayNoteCount > 0 || dayDeadlineCount > 0;

              return (
                <div
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-[70px] p-2 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white/25 border-white/80 shadow-lg scale-105 z-10'
                      : isCurrentMonth
                      ? 'bg-white/5 border-white/10 hover:bg-white/15 text-white'
                      : 'bg-white/[0.02] border-transparent text-white/20'
                  } ${isCurrentDay ? 'ring-2 ring-amber-300/70' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-mono font-bold ${isCurrentDay ? 'text-amber-300' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    {isCurrentDay && <span className="text-[9px] bg-amber-400/30 text-amber-200 px-1 rounded">TODAY</span>}
                  </div>

                  {hasItems && isCurrentMonth && (
                    <div className="flex gap-1 flex-wrap mt-1">
                      {dayDeadlineCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" title="Deadline" />
                      )}
                      {dayNoteCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400" title="Event/Note" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-panel p-6 space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-lg font-bold text-amber-300">
              {format(selectedDate, 'EEEE, MMM d')}
            </h2>
            <p className="text-xs text-white/60">Schedule & Deadlines</p>
          </div>

          <form onSubmit={addEvent} className="space-y-3">
            <input
              type="text"
              placeholder="Add exam, assignment, or rest plan..."
              value={newEventText}
              onChange={(e) => setNewEventText(e.target.value)}
              className="glass-input w-full text-xs"
            />
            <div className="flex gap-2">
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="glass-input flex-1 text-xs bg-slate-900/80 text-white"
              >
                <option value="exam">Exam / Quiz</option>
                <option value="assignment">Assignment</option>
                <option value="rest">Guilt-Free Rest</option>
              </select>
              <button type="submit" className="glass-button px-3 text-xs flex items-center gap-1 font-bold">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </form>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {dayDeadlines.map((d) => (
              <div key={d.id} className="glass-card p-3 border-l-4 border-l-rose-400 text-xs flex justify-between items-center">
                <div>
                  <p className="font-semibold text-rose-200">[Radar Deadline] {d.title}</p>
                  <p className="text-[10px] text-white/60">Priority: {d.priority}</p>
                </div>
              </div>
            ))}

            {dayEvents.map((e) => (
              <div key={e.id} className={`glass-card p-3 border border-white/10 text-xs flex justify-between items-center ${getTypeStyle(e.type)}`}>
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="font-medium">{e.title}</span>
                </div>
                <button onClick={() => deleteEvent(e.id)} className="text-white/40 hover:text-rose-300">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {dayDeadlines.length === 0 && dayEvents.length === 0 && (
              <p className="text-xs text-white/40 italic text-center py-6">No scheduled events or deadlines for this date.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
