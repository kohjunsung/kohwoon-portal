import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, ArrowUpRight, Plus, AlertCircle, CheckCircle2, Clock, XCircle, GripVertical, Calendar, User as UserIcon, Phone, Edit2, Save, X, Activity, Trash2
} from 'lucide-react';
import { db } from '../services/mockData';
import { Task, User, Metric } from '../types';

interface DashboardProps {
  user: User;
  selectedClientId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, selectedClientId }) => {
  const [taskRequest, setTaskRequest] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Metrics Edit Modal State
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<Metric>({
      month: new Date().toISOString().slice(0, 7), // YYYY-MM
      newPatients: 0,
      roas: 0,
      cac: 0,
      spend: 0
  });

  // Load Data based on selection
  useEffect(() => {
    refreshData();
  }, [selectedClientId]);

  const refreshData = () => {
    setTasks(db.getTasks(selectedClientId));
    const loadedMetrics = db.getMetrics(selectedClientId);
    setMetrics([...loadedMetrics]); // Ensure new array reference
  };

  // Derived Metrics (Handle empty states)
  const currentMonth = metrics.length > 0 ? metrics[metrics.length - 1] : { newPatients: 0, roas: 0, cac: 0, month: '데이터 없음' };
  const prevMonth = metrics.length > 1 ? metrics[metrics.length - 2] : { newPatients: 0, roas: 0 };
  
  const patientGrowth = prevMonth.newPatients ? Math.round(((currentMonth.newPatients - prevMonth.newPatients) / prevMonth.newPatients) * 100) : 0;
  const roasGrowth = prevMonth.roas ? Math.round(((currentMonth.roas - prevMonth.roas) / prevMonth.roas) * 100) : 0;

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskRequest.trim()) return;

    // Simulate Notification
    db.sendNotification('kakao', 'admin', `New Task from ${selectedClientId}: ${taskRequest}`);
    
    // Alert User
    alert("[알림톡] 요청하신 업무가 정상적으로 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.");

    const newTask: Task = {
      id: Date.now().toString(),
      clientId: selectedClientId,
      title: taskRequest,
      description: '',
      status: 'not_started',
      date: new Date().toISOString().split('T')[0],
      requester: user.name,
      progress: 0,
      assignee: '미정'
    };

    db.addTask(newTask);
    setTasks(prev => [newTask, ...prev]);
    setTaskRequest('');
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Task['status']) => {
    if (user.role !== 'admin') return;
    e.preventDefault();
    
    if (draggedTaskId) {
      const updatedTasks = tasks.map(t => t.id === draggedTaskId ? { ...t, status: targetStatus } : t);
      setTasks(updatedTasks);
      
      const task = updatedTasks.find(t => t.id === draggedTaskId);
      if (task) {
        db.updateTask(task);
        if (targetStatus === 'in_progress') {
             console.log(`[ALIMTALK] Task '${task.title}' status changed to ${targetStatus}`);
        }
      }
      setDraggedTaskId(null);
    }
  };

  const saveTask = () => {
    if (editingTask) {
        setTasks(prev => prev.map(t => t.id === editingTask.id ? editingTask : t));
        db.updateTask(editingTask);
        setEditingTask(null);
    }
  };

  const deleteTask = () => {
    if (editingTask && window.confirm("정말 이 업무를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.")) {
      const idToDelete = editingTask.id;
      db.deleteTask(idToDelete);
      // Force filter safely
      setTasks(prevTasks => prevTasks.filter(t => t.id !== idToDelete));
      setEditingTask(null);
    }
  };

  const handleSaveMetric = () => {
      db.updateMetric(selectedClientId, editingMetric);
      alert('성과 데이터가 저장되었습니다.');
      setIsMetricModalOpen(false);
      refreshData();
  };

  const openMetricModal = () => {
      // Pre-fill with existing data for current month if exists, else defaults
      const currentMonthKey = new Date().toISOString().slice(0, 7);
      const existing = metrics.find(m => m.month === currentMonthKey);
      if (existing) {
          setEditingMetric(existing);
      } else {
          setEditingMetric({
            month: currentMonthKey,
            newPatients: 0,
            roas: 0,
            cac: 0,
            spend: 0
          });
      }
      setIsMetricModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">대시보드</h1>
          <p className="text-gray-500 mt-2 font-light">실시간 마케팅 성과와 프로젝트 진행 상황을 확인하세요.</p>
        </div>
        <div className="flex flex-col md:items-end gap-1">
           <div className="flex items-center gap-3">
               <div className="text-right">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">오늘 날짜</span>
                <p className="text-sm font-medium text-gray-700 font-mono">{new Date().toLocaleDateString()}</p>
               </div>
               {user.role === 'admin' && (
                   <button 
                    onClick={openMetricModal}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                    title="성과 데이터 수정"
                   >
                       <Edit2 size={16} />
                   </button>
               )}
           </div>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
            { label: '당월 신환 수', value: `${currentMonth.newPatients}명`, growth: patientGrowth, icon: Users, color: 'brand-orange', bg: 'orange-50' },
            { label: '당월 ROAS', value: `${currentMonth.roas}%`, growth: roasGrowth, icon: TrendingUp, color: 'blue-600', bg: 'blue-50' },
            { label: 'CAC (신규문의단가)', value: `${currentMonth.cac?.toLocaleString()}원`, sub: metrics.length > 0 ? '효율적 예산 집행 중' : '데이터 집계 중', icon: DollarSign, color: 'emerald-600', bg: 'emerald-50' }
        ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <stat.icon size={64} className={`text-${stat.color.split('-')[0]}-500`} />
                </div>
                <div className="relative z-10">
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">{stat.value}</h3>
                    {metrics.length > 0 && stat.growth !== undefined ? (
                        <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
                            <ArrowUpRight size={14} />
                            <span>{stat.growth}%</span>
                            <span className="text-gray-400 font-normal ml-1">전월 대비</span>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 mt-3">{stat.sub}</p>
                    )}
                </div>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
                <h3 className="font-bold text-lg text-gray-900">월별 성과 리포트</h3>
                <p className="text-sm text-gray-400">최근 6개월 간의 주요 지표 추이</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-orange"></div>
                  <span className="text-xs font-medium text-gray-600">신환 수</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <span className="text-xs font-medium text-gray-600">ROAS</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            {metrics.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} hide />
                    <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', padding: '12px 16px' }} 
                    cursor={{fill: '#f8fafc'}}
                    />
                    <Bar yAxisId="left" dataKey="newPatients" fill="#FF5A2C" radius={[6, 6, 0, 0]} barSize={40} name="신환 수" />
                    <Line yAxisId="right" type="monotone" dataKey="roas" stroke="#cbd5e1" strokeWidth={3} dot={{fill: 'white', strokeWidth: 3, r: 4}} activeDot={{r: 6}} name="ROAS" />
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Activity size={48} className="mb-2 opacity-20"/>
                    <p>표시할 데이터가 없습니다.</p>
                </div>
            )}
          </div>
        </div>

        {/* Quick Request */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
          <h3 className="font-bold text-lg text-gray-900 mb-2 relative z-10">빠른 작업 요청</h3>
          <p className="text-sm text-gray-500 mb-6 relative z-10">
            수정이 필요하거나 새로운 요청사항이 있으신가요? 
            간단히 남겨주시면 담당자가 확인합니다.
          </p>
          <form onSubmit={handleTaskSubmit} className="flex-1 flex flex-col relative z-10">
            <textarea 
              className="flex-1 w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black text-sm mb-4 transition-all placeholder:text-gray-400"
              placeholder="예) 7월 여름 이벤트 배너 문구 수정 요청합니다..."
              value={taskRequest}
              onChange={(e) => setTaskRequest(e.target.value)}
            ></textarea>
            <button 
              type="submit"
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={18} />
              요청하기
            </button>
          </form>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h3 className="font-bold text-lg text-gray-900">프로젝트 현황판</h3>
                <p className="text-sm text-gray-400">실시간 업무 진행 상황</p>
            </div>
            {user.role === 'admin' && (
                <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <GripVertical size={14} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-500">드래그하여 상태 변경 가능</span>
                </div>
            )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {(['not_started', 'in_progress', 'completed', 'stopped'] as const).map((statusKey) => {
            const statusConfig = {
              not_started: { label: '시작 전', color: 'bg-gray-100 text-gray-600' },
              in_progress: { label: '진행 중', color: 'bg-blue-50 text-blue-600' },
              completed: { label: '완료됨', color: 'bg-emerald-50 text-emerald-600' },
              stopped: { label: '보류/중단', color: 'bg-rose-50 text-rose-600' }
            };
            const colTasks = tasks.filter(t => t.status === statusKey);
            
            return (
              <div 
                key={statusKey} 
                className={`bg-slate-50/50 rounded-2xl p-4 flex flex-col h-full border border-slate-100 transition-colors ${user.role === 'admin' ? 'hover:bg-slate-50' : ''}`}
                onDragOver={e => user.role === 'admin' && e.preventDefault()}
                onDrop={(e) => handleDrop(e, statusKey)}
              >
                <div className="flex items-center justify-between mb-4 px-1">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusConfig[statusKey].color}`}>
                      {statusConfig[statusKey].label}
                  </span>
                  <span className="text-xs font-medium text-gray-400">
                    {colTasks.length}
                  </span>
                </div>
                
                <div className="space-y-3 flex-1 min-h-[150px]">
                  {colTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`bg-white p-5 rounded-xl shadow-sm border border-gray-100 group transition-all duration-200 ${user.role === 'admin' ? 'cursor-move hover:shadow-md hover:border-brand-orange/30' : ''}`}
                      draggable={user.role === 'admin'}
                      onDragStart={(e) => user.role === 'admin' && setDraggedTaskId(task.id)}
                      onClick={() => user.role === 'admin' && setEditingTask(task)}
                    >
                      <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-bold text-gray-900 leading-tight">{task.title}</h4>
                      </div>
                      
                      <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-50">
                           <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-400 font-medium">마감일</span>
                              <span className={`font-mono ${task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-rose-500 font-bold' : 'text-gray-600'}`}>
                                  {task.dueDate || '-'}
                              </span>
                           </div>
                           <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-400 font-medium">담당자</span>
                              <span className="text-gray-700">{task.assignee || '-'}</span>
                           </div>
                      </div>

                      {task.progress !== undefined && task.status !== 'not_started' && (
                          <div className="w-full bg-gray-100 rounded-full h-1 mt-3 overflow-hidden">
                              <div className="bg-brand-orange h-1 rounded-full transition-all duration-500" style={{ width: `${task.progress}%` }}></div>
                          </div>
                      )}
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                      <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl min-h-[100px]">
                          <span className="text-xs text-gray-400 font-medium">업무 없음</span>
                      </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">업무 상세 수정</h3>
                    <button type="button" onClick={() => setEditingTask(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
                </div>
                <div className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">업무명</label>
                        <input type="text" value={editingTask.title} onChange={e => setEditingTask({...editingTask, title: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">상세 설명</label>
                        <textarea value={editingTask.description || ''} onChange={e => setEditingTask({...editingTask, description: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl text-sm h-24 resize-none focus:border-black outline-none transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">담당자</label>
                            <input type="text" value={editingTask.assignee || ''} onChange={e => setEditingTask({...editingTask, assignee: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" />
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">담당자 연락처</label>
                            <input type="text" value={editingTask.assigneeContact || ''} onChange={e => setEditingTask({...editingTask, assigneeContact: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">마감일</label>
                            <input type="date" value={editingTask.dueDate || ''} onChange={e => setEditingTask({...editingTask, dueDate: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">진행률 (%)</label>
                            <input type="number" min="0" max="100" value={editingTask.progress || 0} onChange={e => setEditingTask({...editingTask, progress: parseInt(e.target.value)})} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" />
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-between gap-3">
                    <button type="button" onClick={deleteTask} className="px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2">
                         <Trash2 size={16}/> 삭제
                    </button>
                    <div className="flex gap-3">
                        <button type="button" onClick={() => setEditingTask(null)} className="px-5 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">취소</button>
                        <button type="button" onClick={saveTask} className="px-5 py-3 text-sm bg-brand-orange text-white rounded-xl font-bold hover:bg-orange-600 flex items-center gap-2 shadow-lg shadow-orange-100 transition-colors">
                            <Save size={16}/> 저장하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Metric Edit Modal */}
      {isMetricModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
             <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">성과 데이터 입력 (Admin)</h3>
                    <button onClick={() => setIsMetricModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
                 </div>
                 <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">대상 월 (YYYY-MM)</label>
                        <input type="month" value={editingMetric.month} onChange={e => setEditingMetric({...editingMetric, month: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">신환 수 (명)</label>
                            <input type="number" value={editingMetric.newPatients} onChange={e => setEditingMetric({...editingMetric, newPatients: Number(e.target.value)})} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">ROAS (%)</label>
                            <input type="number" value={editingMetric.roas} onChange={e => setEditingMetric({...editingMetric, roas: Number(e.target.value)})} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" />
                         </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CAC (원)</label>
                            <input type="number" value={editingMetric.cac} onChange={e => setEditingMetric({...editingMetric, cac: Number(e.target.value)})} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">총 집행 비용 (원)</label>
                            <input type="number" value={editingMetric.spend} onChange={e => setEditingMetric({...editingMetric, spend: Number(e.target.value)})} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" />
                         </div>
                     </div>
                 </div>
                 <div className="mt-8 flex justify-end gap-3">
                     <button onClick={() => setIsMetricModalOpen(false)} className="px-5 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">취소</button>
                     <button onClick={handleSaveMetric} className="px-5 py-3 text-sm bg-brand-orange text-white rounded-xl font-bold hover:bg-orange-600 flex items-center gap-2 shadow-lg shadow-orange-100 transition-colors">
                        <Save size={16}/> 저장하기
                     </button>
                 </div>
             </div>
          </div>
      )}
    </div>
  );
};

export default Dashboard;