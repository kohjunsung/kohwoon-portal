import React, { useState } from 'react';
import { Folder, Download, Search, FileText, Image as ImageIcon, FileArchive, Upload, Eye, X, File } from 'lucide-react';
import { FILES_DATA } from '../services/mockData';
import { User, ClinicFile, CATEGORIES } from '../types';

interface FilesProps {
  user: User;
}

const Files: React.FC<FilesProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState<ClinicFile[]>(FILES_DATA);
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<ClinicFile | null>(null);
  
  const getFileIcon = (type: string) => {
    if (type.includes('PDF')) return <FileText className="text-rose-500" size={24} />;
    if (type.includes('AI') || type.includes('JPG') || type.includes('PNG')) return <ImageIcon className="text-blue-500" size={24} />;
    if (type.includes('ZIP')) return <FileArchive className="text-amber-500" size={24} />;
    return <FileText className="text-gray-400" size={24} />;
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const determineCategory = (filename: string): ClinicFile['category'] => {
      const lower = filename.toLowerCase();
      if (lower.includes('계약서') || lower.includes('contract')) return 'contract';
      if (lower.includes('보고서') || lower.includes('report') || lower.includes('내역서')) return 'report';
      if (lower.includes('로고') || lower.includes('원본') || lower.includes('이미지') || lower.includes('배너')) return 'asset';
      return 'other';
  };

  const handleUpload = () => {
    // Simulation
    const newFileName = `2024_07_디자인_시안_v2.png`;
    const category = determineCategory(newFileName);
    
    const newFile: ClinicFile = {
        id: `f-${Date.now()}`,
        clientId: user.id,
        name: newFileName,
        type: 'PNG',
        size: '3.5 MB',
        date: new Date().toISOString().split('T')[0],
        category: category,
        url: '#'
    };
    
    setFiles([newFile, ...files]);
    alert(`파일이 업로드되었습니다. '${CATEGORIES[category]}' 카테고리로 자동 분류되었습니다.`);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">파일함</h1>
          <p className="text-gray-500 text-sm mt-1">자동 분류된 프로젝트 파일들을 안전하게 관리합니다.</p>
        </div>
        <div className="flex gap-2">
            {user.role === 'admin' && (
                 <button 
                    onClick={handleUpload}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all"
                 >
                    <Upload size={16} />
                    파일 업로드
                </button>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                <Download size={16} />
                전체 다운로드
            </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
            type="text" 
            placeholder="파일명 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black text-sm transition-all shadow-sm"
        />
      </div>

      {/* Files Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        {user.role === 'admin' && (
            <div 
                className={`border-b border-gray-100 p-6 border-dashed border-2 m-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${isDragging ? 'border-brand-orange bg-orange-50' : 'border-gray-200 hover:border-brand-orange/50 hover:bg-gray-50'}`}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onClick={handleUpload}
            >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                    <Upload size={20} className={isDragging ? 'text-brand-orange' : 'text-gray-400'}/>
                </div>
                <span className="text-sm font-bold text-gray-700">클릭 또는 파일을 이곳에 드래그하세요</span>
                <span className="text-xs text-gray-400 mt-1">PDF, AI, PNG, JPG, ZIP 지원</span>
            </div>
        )}
        
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-gray-400 font-medium border-b border-gray-100 text-xs uppercase tracking-wider">
                    <tr>
                        <th className="px-6 py-4">파일명</th>
                        <th className="px-6 py-4">카테고리</th>
                        <th className="px-6 py-4">크기</th>
                        <th className="px-6 py-4">등록일</th>
                        <th className="px-6 py-4 text-right">작업</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredFiles.length > 0 ? (
                        filteredFiles.map((file) => (
                            <tr key={file.id} className="hover:bg-gray-50/80 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            {getFileIcon(file.type)}
                                        </div>
                                        <span className="font-bold text-gray-900">{file.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                        file.category === 'contract' ? 'bg-rose-50 text-rose-600' :
                                        file.category === 'report' ? 'bg-indigo-50 text-indigo-600' :
                                        file.category === 'asset' ? 'bg-blue-50 text-blue-600' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                        {CATEGORIES[file.category]}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{file.size}</td>
                                <td className="px-6 py-4 text-gray-500">{file.date}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => setPreviewFile(file)}
                                            className="text-gray-400 hover:text-brand-orange transition-colors p-2 rounded-full hover:bg-orange-50"
                                            title="미리보기"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button className="text-gray-400 hover:text-black transition-colors p-2 rounded-full hover:bg-gray-100" title="다운로드">
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="px-6 py-20 text-center text-gray-400">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Folder size={32} className="opacity-30" />
                                </div>
                                <p>파일이 없습니다.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

       {/* File Preview Modal */}
       {previewFile && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-4xl h-[85vh] rounded-3xl flex flex-col shadow-2xl">
                  <div className="flex justify-between items-center p-6 border-b border-gray-100">
                      <h3 className="font-bold text-xl text-gray-900 truncate pr-4">{previewFile.name}</h3>
                      <button onClick={() => setPreviewFile(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"><X size={20}/></button>
                  </div>
                  <div className="flex-1 bg-gray-50 flex items-center justify-center p-8 rounded-b-3xl overflow-hidden relative">
                      {/* Simple Preview Simulation */}
                      <div className="text-center text-gray-400">
                          {previewFile.type.includes('Image') ? (
                              <img src={previewFile.url} alt="Preview" className="max-h-full max-w-full object-contain shadow-lg" />
                          ) : (
                              <>
                                <File size={64} className="mx-auto mb-4 opacity-20"/>
                                <p className="text-lg font-medium text-gray-500">파일 미리보기</p>
                                <p className="text-sm mt-2 opacity-60 mb-6">현재 {previewFile.type} 형식은 뷰어 연동이 필요합니다.</p>
                                <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold">다운로드하여 보기</button>
                              </>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Files;