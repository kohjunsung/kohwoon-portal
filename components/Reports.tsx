import React, { useState, useEffect } from 'react';
import { FileText, ChevronRight, ExternalLink, Calendar, X, ChevronLeft, Sparkles, Plus, Trash2, Link as LinkIcon, Save } from 'lucide-react';
import { db } from '../services/mockData';
import { Report, User } from '../types';

interface ReportsProps {
  user: User;
  selectedClientId: string;
}

const Reports: React.FC<ReportsProps> = ({ user, selectedClientId }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date()); 
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReport, setNewReport] = useState<Partial<Report>>({
      title: '',
      type: 'performance',
      summary: '',
      notionUrl: ''
  });

  useEffect(() => {
    // Refresh reports when client changes or modal closes
    setReports(db.getReports(selectedClientId));
  }, [selectedClientId, isModalOpen]);

  const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  
  const filteredReports = reports.filter(r => r.month === currentMonthStr);
  const performanceReport = filteredReports.find(r => r.type === 'performance');

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const handleAddReport = () => {
    if (!newReport.title || !newReport.notionUrl) {
        alert("제목과 노션 링크는 필수입니다.");
        return;
    }

    const report: Report = {
        id: `r-${Date.now()}`,
        clientId: selectedClientId,
        title: newReport.title!,
        type: newReport.type as 'service' | 'performance',
        date: new Date().toISOString().split('T')[0],
        month: currentMonthStr, // Assign to current view month
        notionUrl: newReport.notionUrl!,
        status: 'published',
        summary: newReport.summary
    };

    db.addReport(report);
    setNewReport({ title: '', type: 'performance', summary: '', notionUrl: '' });
    setIsModalOpen(false);
    alert('보고서가 등록되었습니다.');
  };

  const handleDeleteReport = (id: string) => {
    if (window.confirm('정말 이 보고서를 삭제하시겠습니까?')) {
        db.deleteReport(id);
        setReports(prev => prev.filter(r => r.id !== id));
        setSelectedReport(null);
    }
  };

  // Convert Notion URL to Embed URL if possible (Simple check)
  const getEmbedUrl = (url: string) => {
      // Basic heuristic: if it's a standard notion link, try to use it as src.
      // Notion pages usually need 'https://v1.embednotion.com/...' or similar proxies for public embedding without iframe restrictions,
      // OR assuming the user provides a valid Embed link from Notion (Share -> Embed).
      // For this SaaS context, we assume the Admin inputs a valid embeddable URL.
      return url;
  };

  return (
    <div className="space-y-6 flex flex-col min-h-[calc(100vh-8rem)]">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">보고서</h1>
            <p className="text-gray-500 text-sm mt-1">매월 발행되는 마케팅 상세 리포트 및 인사이트</p>
        </div>
        
        <div className="flex items-center gap-3">
            {/* Month Navigation */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                <button onClick={() => handleMonthChange('prev')} className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-gray-900 transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <span className="px-4 font-bold text-gray-900 min-w-[100px] text-center">
                    {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                </span>
                <button onClick={() => handleMonthChange('next')} className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-gray-900 transition-colors">
                    <ChevronRight size={20} />
                </button>
            </div>

            {user.role === 'admin' && (
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-black transition-all"
                >
                    <Plus size={16} />
                    <span className="hidden md:inline">보고서 등록</span>
                </button>
            )}
        </div>
      </header>

      {/* AI Insight */}
      {performanceReport?.summary && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 shadow-sm animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-indigo-600" />
                <h3 className="font-bold text-indigo-900">Kohwoon AI Insight</h3>
            </div>
            <p className="text-indigo-800 text-sm leading-relaxed font-medium">
                "{performanceReport.summary}"
            </p>
        </div>
      )}

      {selectedReport ? (
        // Notion Embed Viewer
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedReport(null)} className="md:hidden text-gray-500"><ChevronLeft/></button>
              <div className={`w-2 h-2 rounded-full ${selectedReport.type === 'performance' ? 'bg-indigo-500' : 'bg-green-500'}`} />
              <h3 className="font-bold text-gray-800 text-sm md:text-base">{selectedReport.title}</h3>
            </div>
            <div className="flex gap-2">
                <a 
                    href={selectedReport.notionUrl} 
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs md:text-sm text-gray-500 hover:text-brand-orange px-3 py-1.5 rounded hover:bg-gray-50 transition-colors"
                >
                    <ExternalLink size={14} />
                    <span className="hidden md:inline">새 창으로 열기</span>
                </a>
                {user.role === 'admin' && (
                    <button 
                    onClick={() => handleDeleteReport(selectedReport.id)}
                    className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition-colors"
                    title="보고서 삭제"
                    >
                    <Trash2 size={18} />
                    </button>
                )}
                <button 
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded transition-colors"
                >
                <X size={18} />
                </button>
            </div>
          </div>
          
          <div className="flex-1 bg-gray-100 relative">
             <iframe 
                src={getEmbedUrl(selectedReport.notionUrl)}
                className="w-full h-full border-none"
                title="Notion Report"
                allowFullScreen
             />
          </div>
        </div>
      ) : (
        // List View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.length > 0 ? filteredReports.map(report => (
            <div 
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="group cursor-pointer bg-white p-6 rounded-2xl border border-gray-100 hover:border-brand-orange/40 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full -mr-8 -mt-8 transition-colors group-hover:from-orange-50"></div>
              
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                    <div className={`p-3 rounded-xl ${report.type === 'performance' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'}`}>
                    <FileText size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                        {report.date} 발행
                    </span>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-brand-orange transition-colors mb-2">
                    {report.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                    {report.summary || '상세 리포트를 확인하려면 클릭하세요.'}
                </p>
                
                <div className="flex items-center text-sm font-bold text-gray-400 group-hover:text-gray-900 transition-colors">
                    <span>리포트 보기</span>
                    <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="text-gray-300" size={32}/>
                </div>
                <h3 className="text-gray-900 font-bold mb-1">발행된 보고서가 없습니다.</h3>
                <p className="text-gray-500 text-sm">{user.role === 'admin' ? '우측 상단 버튼을 눌러 새 보고서를 등록해주세요.' : '해당 월의 리포트가 아직 발행되지 않았습니다.'}</p>
            </div>
          )}
        </div>
      )}

      {/* Add Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">신규 보고서 등록</h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-sm text-gray-600 mb-4 border border-gray-100">
                        <Calendar size={16} className="text-brand-orange"/>
                        <span>발행 월: <strong>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</strong></span>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">보고서 제목 <span className="text-red-500">*</span></label>
                        <input type="text" value={newReport.title} onChange={e => setNewReport({...newReport, title: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" placeholder="예: 2025년 6월 월간 성과 리포트"/>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">보고서 유형</label>
                             <select 
                                value={newReport.type} 
                                onChange={e => setNewReport({...newReport, type: e.target.value as any})}
                                className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors bg-white"
                            >
                                <option value="performance">성과 리포트 (Performance)</option>
                                <option value="service">서비스 리포트 (Service)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <LinkIcon size={12}/> Notion 링크 (Embed URL) <span className="text-red-500">*</span>
                        </label>
                        <input type="text" value={newReport.notionUrl} onChange={e => setNewReport({...newReport, notionUrl: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" placeholder="https://notion.so/embed/..."/>
                        <p className="text-[10px] text-gray-400 mt-1.5">* Notion 페이지의 'Share > Embed' 링크를 입력하거나, 공개 페이지 URL을 입력하세요.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">AI 인사이트 / 요약</label>
                        <textarea value={newReport.summary} onChange={e => setNewReport({...newReport, summary: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl text-sm h-24 resize-none focus:border-black outline-none transition-colors" placeholder="보고서의 핵심 내용을 요약해주세요." />
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="px-5 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">취소</button>
                    <button onClick={handleAddReport} className="px-5 py-3 text-sm bg-brand-orange text-white rounded-xl font-bold hover:bg-orange-600 flex items-center gap-2 shadow-lg shadow-orange-100 transition-colors">
                        <Save size={16}/> 등록하기
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Reports;