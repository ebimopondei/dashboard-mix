
import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';

interface SpineCamerasViewProps {
  onBack: () => void;
  shopName?: string;
}

interface AIEvent {
  id: string;
  time: string;
  type: 'unusual_motion' | 'crowd_detected' | 'after_hours' | 'shelf_empty';
  narration: string;
}

type VisionViewMode = 'LIVE' | 'ARCHIVE_LIST' | 'ARCHIVE_DETAIL';

export const SpineCamerasView: React.FC<SpineCamerasViewProps> = ({ onBack, shopName }) => {
  const [viewMode, setViewMode] = useState<VisionViewMode>('LIVE');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeCam, setActiveCam] = useState<'central' | 'spot1' | 'spot2'>('central');
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [showSnapshotFlash, setShowSnapshotFlash] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [playbackEvent, setPlaybackEvent] = useState<AIEvent | null>(null);

  // Generate last 30 days for archive
  const archiveDays = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      days.push({
        date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        eventsCount: Math.floor(Math.random() * 12) + 2,
        isToday: i === 0
      });
    }
    return days;
  }, []);

  const aiEvents: AIEvent[] = [
    { id: 'e1', time: '14:23', type: 'unusual_motion', narration: 'Fast movement detected near the back storage entrance.' },
    { id: 'e2', time: '12:05', type: 'crowd_detected', narration: 'High foot traffic at Main Counter. Potential need for second staff.' },
    { id: 'e3', time: '10:42', type: 'shelf_empty', narration: 'Product display 4 (Ankara Fabrics) appears depleted.' },
    { id: 'e4', time: '08:15', type: 'after_hours', narration: 'Opening procedures started 15 minutes later than scheduled.' },
  ];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSnapshot = () => {
    setShowSnapshotFlash(true);
    triggerToast("Snapshot saved to your device gallery.");
    setTimeout(() => setShowSnapshotFlash(false), 200);
  };

  const toggleAlarm = () => {
    setIsAlarmActive(!isAlarmActive);
    if (!isAlarmActive) {
      triggerToast("EMERGENCY ALARM ACTIVATED");
    } else {
      triggerToast("Alarm deactivated.");
    }
  };

  const handlePlayEvent = (event: AIEvent) => {
    setPlaybackEvent(event);
    triggerToast(`Playing event snippet from ${event.time}`);
  };

  const openDayArchive = (date: string) => {
    setSelectedDate(date);
    setViewMode('ARCHIVE_DETAIL');
    triggerToast(`Loading archive for ${date}`);
  };

  const toggleArchiveMode = () => {
    if (viewMode === 'LIVE') {
      setViewMode('ARCHIVE_LIST');
      triggerToast("Opening 30-day Archive");
    } else {
      setViewMode('LIVE');
      setSelectedDate(null);
      setPlaybackEvent(null);
      triggerToast("Returning to Live View");
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-black flex flex-col animate-in slide-in-from-right duration-400 overflow-hidden transition-colors duration-300 ${isAlarmActive ? 'ring-inset ring-[12px] ring-rose-600/50' : ''}`}>
      {/* Flash Effect */}
      {showSnapshotFlash && (
        <div className="fixed inset-0 bg-white z-[200] animate-out fade-out duration-300 pointer-events-none" />
      )}

      {/* Alarm Red Overlay */}
      {isAlarmActive && (
        <div className="fixed inset-0 bg-rose-600/10 pointer-events-none z-[150] animate-pulse" />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[250] bg-slate-900 border border-white/10 px-4 py-2 rounded-full shadow-2xl animate-in slide-in-from-top-4">
          <p className={`text-xs font-black uppercase tracking-widest ${toastMessage.includes('ALARM') ? 'text-rose-500' : 'text-primary'}`}>
            {toastMessage}
          </p>
        </div>
      )}

      {/* Dynamic Header */}
      <header className="flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-md border-b border-white/5 shrink-0 z-50">
        <div className="flex items-center gap-4">
            <button 
                onClick={viewMode === 'ARCHIVE_DETAIL' ? () => setViewMode('ARCHIVE_LIST') : onBack}
                className="size-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
                <Icon name="arrow_back" />
            </button>
            <div>
                <h1 className="text-white font-black text-sm uppercase tracking-widest">{shopName || 'Spine Vision'}</h1>
                <div className="flex items-center gap-2">
                    <div className={`size-1.5 rounded-full ${viewMode === 'LIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${viewMode === 'LIVE' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {viewMode === 'LIVE' ? 'Live • Synced' : viewMode === 'ARCHIVE_LIST' ? 'Historical Archive' : `Archive: ${selectedDate}`}
                    </span>
                </div>
            </div>
        </div>
        <div className="flex gap-2">
            <button 
              onClick={() => triggerToast("Vision hardware settings panel")}
              className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white active:scale-95"
            >
                <Icon name="settings" className="text-xl" />
            </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        
        {viewMode === 'ARCHIVE_LIST' ? (
          /* ARCHIVE LIST MODE */
          <div className="p-4 space-y-6 animate-in slide-in-from-bottom duration-400">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-white font-black text-xs uppercase tracking-widest">Last 30 Days Record</h2>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Select a day to play</span>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {archiveDays.map((day, idx) => (
                <button 
                  key={idx}
                  onClick={() => openDayArchive(day.date)}
                  className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all active:scale-[0.98] group"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                      <Icon name="event" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold">{day.date}</p>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                        {day.isToday ? 'Latest Recording' : 'Completed Capture'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                      <p className="text-primary font-black text-xs">{day.eventsCount}</p>
                      <p className="text-[8px] text-slate-500 uppercase font-black">AI Insights</p>
                    </div>
                    <Icon name="play_circle" className="text-primary text-3xl group-hover:scale-110 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* LIVE OR ARCHIVE DETAIL MODE */
          <>
            <section className="p-4 space-y-4">
                {/* Primary View */}
                <div 
                  className={`relative aspect-video rounded-3xl overflow-hidden border shadow-2xl group transition-all duration-300 ${activeCam === 'central' ? 'ring-2 ring-primary border-transparent' : 'border-white/5 bg-slate-800'}`}
                  onClick={() => setActiveCam('central')}
                >
                    <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] z-10" />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                        {viewMode === 'LIVE' ? (
                          <Icon name="videocam" className="text-6xl text-slate-700 animate-pulse" />
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Icon name="play_circle" className="text-6xl text-primary animate-pulse" />
                            <span className="text-[10px] font-black text-primary uppercase">
                              {playbackEvent ? `Playing Snippet @ ${playbackEvent.time}` : 'Time-lapse Playback'}
                            </span>
                          </div>
                        )}
                    </div>

                    {/* HUD Overlays */}
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
                        <div className="px-2 py-1 bg-black/40 backdrop-blur-md rounded border border-white/10 text-[8px] font-black text-white uppercase">
                            CAM 01: CENTRAL HUB
                        </div>
                        <div className="px-2 py-1 bg-black/40 backdrop-blur-md rounded border border-white/10 text-[8px] font-mono text-white/80">
                            {viewMode === 'LIVE' ? 'FPS: 30.2 • 2K RESOLUTION' : 'ARCHIVE PLAYBACK • 16X SPEED'}
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                        <div className={`px-2 py-1 ${viewMode === 'LIVE' ? 'bg-rose-600' : 'bg-blue-600'} rounded text-[10px] font-black text-white animate-pulse uppercase tracking-widest`}>
                          {viewMode === 'LIVE' ? 'REC' : 'PLAY'}
                        </div>
                    </div>

                    <div className={`absolute inset-0 border-2 transition-all pointer-events-none ${activeCam === 'central' ? 'border-emerald-500/20' : 'border-transparent'}`} />
                </div>

                {/* Sync'd Spot Views Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div 
                      className={`relative aspect-[4/3] rounded-[2rem] overflow-hidden border shadow-lg group transition-all duration-300 ${activeCam === 'spot1' ? 'ring-2 ring-primary border-transparent' : 'border-white/5 bg-slate-900'}`}
                      onClick={() => setActiveCam('spot1')}
                    >
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                            <Icon name="center_focus_weak" className="text-3xl text-slate-600" />
                        </div>
                        <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[7px] font-black text-white uppercase border border-white/5">SPOT A: REGISTER</div>
                        <div className="absolute top-3 right-3">
                             <div className={`size-1.5 rounded-full ${viewMode === 'LIVE' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                        </div>
                    </div>
                    <div 
                      className={`relative aspect-[4/3] rounded-[2rem] overflow-hidden border shadow-lg group transition-all duration-300 ${activeCam === 'spot2' ? 'ring-2 ring-primary border-transparent' : 'border-white/5 bg-slate-900'}`}
                      onClick={() => setActiveCam('spot2')}
                    >
                         <div className="absolute inset-0 flex items-center justify-center opacity-30">
                            <Icon name="center_focus_weak" className="text-3xl text-slate-600" />
                        </div>
                        <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[7px] font-black text-white uppercase border border-white/5">SPOT B: BACK DOOR</div>
                         <div className="absolute top-3 right-3">
                             <div className={`size-1.5 rounded-full ${viewMode === 'LIVE' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Monitoring Timeline */}
            <section className="px-4 mt-4 space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <Icon name="auto_awesome" className="text-purple-400" />
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">AI Intelligence Feed</h3>
                    </div>
                    <button 
                      onClick={() => triggerToast("Filtering records...")}
                      className="text-[10px] font-black text-slate-500 uppercase underline underline-offset-4 active:text-white"
                    >
                      {viewMode === 'ARCHIVE_DETAIL' ? selectedDate : 'Today'}
                    </button>
                </div>

                <div className="space-y-4">
                    {viewMode === 'ARCHIVE_DETAIL' && (
                      <button 
                        onClick={() => setViewMode('LIVE')}
                        className="w-full py-3 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest animate-in slide-in-from-top-2"
                      >
                        <Icon name="live_tv" className="text-sm" />
                        Resume Live Stream
                      </button>
                    )}
                    
                    {aiEvents.map((event, idx) => (
                        <div key={event.id} className="relative pl-8 group animate-in slide-in-from-right duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                            {idx !== aiEvents.length - 1 && (
                                <div className="absolute left-[11px] top-6 bottom-[-20px] w-px bg-white/5" />
                            )}
                            
                            <div className="absolute left-0 top-0 size-6 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center z-10 group-hover:border-purple-500 transition-colors">
                                <div className={`size-1.5 rounded-full ${event.type === 'unusual_motion' ? 'bg-rose-500 animate-ping' : 'bg-purple-500'}`} />
                            </div>

                            <div 
                              onClick={() => handlePlayEvent(event)}
                              className={`border rounded-3xl p-5 transition-all cursor-pointer ${playbackEvent?.id === event.id ? 'bg-primary/5 border-primary/40' : 'bg-white/5 border-white/5 hover:bg-white/[0.08]'}`}
                            >
                                <div className="flex justify-between items-start mb-3 text-left">
                                    <div>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">{event.time}</span>
                                        <h4 className="text-sm font-black text-white leading-none">
                                            {event.type.replace(/_/g, ' ')}
                                        </h4>
                                    </div>
                                    <button className={`p-2 rounded-xl transition-all ${playbackEvent?.id === event.id ? 'bg-primary text-white' : 'bg-white/5 text-primary hover:bg-primary hover:text-white'}`}>
                                        <Icon name={playbackEvent?.id === event.id ? "pause" : "play_arrow"} className="text-sm" />
                                    </button>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium text-left">
                                    "{event.narration}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
          </>
        )}
      </div>

      {/* Control Footer */}
      <div className="p-4 bg-slate-900 border-t border-white/5 z-50 shrink-0">
          <div className="max-w-md mx-auto flex justify-between gap-4">
              <button 
                onClick={toggleAlarm}
                disabled={viewMode !== 'LIVE'}
                className={`flex-1 flex flex-col items-center gap-1 py-2 transition-all active:scale-95 ${isAlarmActive ? 'text-rose-500 scale-110' : 'text-rose-600/50 hover:text-rose-600'} ${viewMode !== 'LIVE' ? 'opacity-20' : ''}`}
              >
                  <Icon name="campaign" className={isAlarmActive ? "animate-tada" : ""} />
                  <span className="text-[8px] font-black uppercase">{isAlarmActive ? 'STOP' : 'Alarm'}</span>
              </button>
              <button 
                onClick={handleSnapshot}
                className="flex-1 flex flex-col items-center gap-1 py-2 text-slate-400 hover:text-white transition-all active:scale-95"
              >
                  <Icon name="photo_camera" />
                  <span className="text-[8px] font-black uppercase">Snapshot</span>
              </button>
              <button 
                onClick={toggleArchiveMode}
                className={`flex-1 flex flex-col items-center gap-1 py-2 transition-all active:scale-95 ${viewMode !== 'LIVE' ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
              >
                  <Icon name={viewMode === 'LIVE' ? "history" : "live_tv"} />
                  <span className="text-[8px] font-black uppercase">{viewMode === 'LIVE' ? 'Archive' : 'Exit Archive'}</span>
              </button>
          </div>
      </div>
    </div>
  );
};
