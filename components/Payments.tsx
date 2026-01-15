import React, { useState } from 'react';
import { Download, CreditCard, Copy, Check, Upload, Plus, FileText, Eye, X, File } from 'lucide-react';
import { PAYMENTS_DATA } from '../services/mockData';
import { User, Payment } from '../types';

interface PaymentsProps {
  user: User;
}

const Payments: React.FC<PaymentsProps> = ({ user }) => {
  const [payments, setPayments] = useState<Payment[]>(PAYMENTS_DATA);
  const [copied, setCopied] = React.useState(false);
  const [previewFile, setPreviewFile] = useState<{url: string, title: string} | null>(null);

  const BANK_INFO = {
      bankName: "하나은행",
      accountNumber: "245-910003-73004",
      owner: "고운앤컴퍼니 주식회사",
      email: "admin@kohwoonc.com"
  };

  const handleCopyBank = () => {
    navigator.clipboard.writeText(`${BANK_INFO.bankName} ${BANK_INFO.accountNumber}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = (id: string, newStatus: Payment['status']) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const StatusBadge = ({ status, onChange, isEditable }: { status: Payment['status'], onChange: (s: Payment['status']) => void, isEditable: boolean }) => {
     const config = {
         paid: { bg: 'bg-emerald-500', text: 'text-white', label: '결제완료' },
         pending: { bg: 'bg-amber-400', text: 'text-white', label: '결제대기' },
         overdue: { bg: 'bg-rose-500', text: 'text-white', label: '미납' }
     };
     const current = config[status];

     if (isEditable) {
         return (
             <div className="relative group inline-block">
                 <button className={`${current.bg} ${current.text} px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:opacity-90 transition-opacity min-w-[80px]`}>
                     {current.label}
                 </button>
                 <div className="absolute top-full left-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-20 hidden group-hover:block animate-in fade-in zoom-in-95 duration-200 p-1">
                     {Object.entries(config).map(([key, val]) => (
                         <button 
                            key={key} 
                            onClick={() => onChange(key as Payment['status'])}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                         >
                             {val.label}
                         </button>
                     ))}
                 </div>
             </div>
         )
     }

     return (
        <span className={`${current.bg} ${current.text} px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm`}>
            {current.label}
        </span>
     );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">결제 관리</h1>
            <p className="text-gray-500 mt-2 font-light">세금계산서, 계약서, 견적서 통합 관리</p>
        </div>
        {user.role === 'admin' && (
            <button 
                className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl text-sm font-bold"
            >
                <Plus size={16} />
                추가 견적 등록
            </button>
        )}
      </header>

      {/* Modern Bank Info Card */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-100/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-gray-50 to-transparent rounded-bl-full -mr-20 -mt-20 pointer-events-none transition-transform duration-700 group-hover:scale-105"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-2">
                <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Payment Information</p>
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight font-mono">{BANK_INFO.bankName} {BANK_INFO.accountNumber}</h2>
                    <button 
                        onClick={handleCopyBank}
                        className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        title="계좌번호 복사"
                    >
                        {copied ? <Check size={18} className="text-emerald-500"/> : <Copy size={18} />}
                    </button>
                </div>
                <p className="text-gray-500 font-medium">예금주: {BANK_INFO.owner}</p>
            </div>
            <div className="text-right hidden md:block border-l border-gray-100 pl-8">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Inquiry</p>
                <p className="text-sm text-gray-500 mb-1">세금계산서 발행 및 입금 확인</p>
                <a href={`mailto:${BANK_INFO.email}`} className="text-lg font-bold text-gray-900 hover:text-brand-orange transition-colors font-mono">{BANK_INFO.email}</a>
            </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <h3 className="font-bold text-gray-900">청구 및 발행 내역</h3>
            <button className="text-xs text-gray-500 hover:text-brand-orange font-bold flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg hover:bg-orange-50">
                <Download size={14}/> 전체 내역 다운로드
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-gray-400 font-medium border-b border-gray-100 text-xs uppercase tracking-wider bg-white">
                    <tr>
                        <th className="px-8 py-5">구분</th>
                        <th className="px-6 py-5">상세 내용</th>
                        <th className="px-6 py-5">금액 (VAT 포함)</th>
                        <th className="px-6 py-5">납부 기한</th>
                        <th className="px-6 py-5">상태</th>
                        <th className="px-6 py-5 text-center">세금계산서</th>
                        <th className="px-8 py-5 text-center">계약서/견적서</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {payments.length > 0 ? payments.map(payment => (
                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-8 py-5 font-bold text-gray-900">
                                <div className="flex items-center gap-2">
                                    {payment.month}
                                    {payment.type === 'irregular' && <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md text-[10px] border border-purple-100 font-bold">비정기</span>}
                                </div>
                            </td>
                            <td className="px-6 py-5 text-gray-600">
                                {user.role === 'admin' && payment.type === 'irregular' ? (
                                    <input defaultValue={payment.description} className="border-b border-gray-300 focus:border-brand-orange outline-none bg-transparent w-full py-1 transition-colors" placeholder="내용 입력" />
                                ) : (
                                    payment.description || '-'
                                )}
                            </td>
                            <td className="px-6 py-5 text-gray-900 font-bold">{payment.amount.toLocaleString()}원</td>
                            <td className="px-6 py-5 text-gray-500 font-mono text-xs">{payment.dueDate}</td>
                            <td className="px-6 py-5">
                                <StatusBadge 
                                    status={payment.status} 
                                    onChange={(s) => handleStatusChange(payment.id, s)} 
                                    isEditable={user.role === 'admin'}
                                />
                            </td>
                            <td className="px-6 py-5 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    {payment.invoiceUrl ? (
                                        <>
                                            <button 
                                                onClick={() => setPreviewFile({url: '#', title: '세금계산서 미리보기'})}
                                                className="text-gray-400 hover:text-brand-orange transition-colors p-1.5 hover:bg-orange-50 rounded-lg" title="미리보기"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button className="text-gray-400 hover:text-gray-900 transition-colors p-1.5 hover:bg-gray-100 rounded-lg" title="다운로드">
                                                <Download size={18} />
                                            </button>
                                        </>
                                    ) : user.role === 'admin' ? (
                                        <button className="text-xs text-brand-orange border border-brand-orange/30 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors font-bold">등록</button>
                                    ) : (
                                        <span className="text-gray-300 text-xs">-</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-8 py-5 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    {(payment.contractUrl || payment.estimateUrl) ? (
                                        <>
                                            <button 
                                                onClick={() => setPreviewFile({url: '#', title: payment.type === 'regular' ? '계약서 미리보기' : '견적서 미리보기'})}
                                                className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 hover:bg-blue-50 rounded-lg" title="미리보기"
                                            >
                                                <FileText size={18} />
                                            </button>
                                            <button className="text-gray-400 hover:text-gray-900 transition-colors p-1.5 hover:bg-gray-100 rounded-lg" title="다운로드">
                                                <Download size={18} />
                                            </button>
                                        </>
                                    ) : user.role === 'admin' ? (
                                         <button className="text-xs text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors flex items-center gap-1 font-medium">
                                            <Upload size={12}/> 업로드
                                         </button>
                                    ) : (
                                        <span className="text-gray-300 text-xs">-</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    )) : (
                         <tr>
                            <td colSpan={7} className="px-6 py-20 text-center text-gray-400">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CreditCard size={32} className="opacity-30" />
                                </div>
                                <p>결제 내역이 없습니다.</p>
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
                      <h3 className="font-bold text-xl text-gray-900">{previewFile.title}</h3>
                      <button onClick={() => setPreviewFile(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
                  </div>
                  <div className="flex-1 bg-gray-50 flex items-center justify-center p-8 rounded-b-3xl">
                      <div className="text-center text-gray-400">
                          <File size={64} className="mx-auto mb-4 opacity-20"/>
                          <p className="text-lg font-medium text-gray-500">문서 미리보기</p>
                          <p className="text-sm mt-2 opacity-60">PDF 뷰어 연동 준비 중입니다.</p>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Payments;