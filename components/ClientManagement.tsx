import React, { useState, useEffect } from 'react';
import { Users, Plus, MoreHorizontal, Search, Edit, Trash2, X, Save, ShieldAlert, ShieldCheck } from 'lucide-react';
import { db } from '../services/mockData';
import { Client, User } from '../types';

interface ClientManagementProps {
    user: User;
    type: 'client' | 'admin';
    onUpdate?: () => void; // Callback to refresh app state
}

const ClientManagement: React.FC<ClientManagementProps> = ({ user, type, onUpdate }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({
      clinicName: '',
      name: '',
      email: '',
      phone: '',
      status: 'active',
      role: 'user'
  });

  const isMasterAdmin = user.email === 'kwad@kohwoonc.com';
  // Allow management if managing Clients OR if managing Admins AND user is Master
  const canManage = type === 'client' || isMasterAdmin;

  useEffect(() => {
      refreshClients();
  }, [type]); // Refresh when switching modes

  const refreshClients = () => {
      setClients([...db.getClients()]);
  };

  const filteredClients = clients.filter(c => 
    c.role === (type === 'client' ? 'user' : 'admin') &&
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.clinicName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenModal = (client?: Client) => {
      if (client) {
          setEditingClient(client);
          setFormData(client);
      } else {
          setEditingClient(null);
          setFormData({
            clinicName: '',
            name: '',
            email: '',
            phone: '',
            status: 'active',
            role: type === 'client' ? 'user' : 'admin' // Pre-set role based on current view
          });
      }
      setIsModalOpen(true);
  };

  const handleSave = () => {
      if (!formData.clinicName || !formData.name || !formData.email) {
          alert('필수 정보를 모두 입력해주세요.');
          return;
      }

      const clientData = {
          ...formData,
          role: type === 'client' ? 'user' : 'admin' // Force role based on current view
      } as Client;

      if (editingClient) {
          // Update
          const updated: Client = {
              ...editingClient,
              ...clientData
          };
          db.updateClient(updated);
          alert('계정 정보가 수정되었습니다.');
      } else {
          // Create
          const newClient: Client = {
              id: `u-${Date.now()}`,
              joinedAt: new Date().toISOString().split('T')[0],
              ...clientData
          };
          db.addClient(newClient);
          alert('신규 계정이 생성되었습니다.');
      }
      
      setIsModalOpen(false);
      refreshClients();
      if (onUpdate) onUpdate(); // Trigger sidebar refresh
  };

  const handleDelete = (id: string) => {
      if (window.confirm('정말 이 계정을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.')) {
          db.deleteClient(id);
          refreshClients();
          if (onUpdate) onUpdate(); // Trigger sidebar refresh
      }
  };

  return (
    <div className="space-y-6">
       <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
              {type === 'client' ? '고객 관리' : '관리자 계정 관리'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
              {type === 'client'
                ? '등록된 병원 클라이언트 계정을 관리합니다.'
                : '내부 운영자(Admin) 계정을 관리합니다 (마스터 전용).'}
          </p>
        </div>
        {canManage && (
            <button 
                onClick={() => handleOpenModal()}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-xl text-sm font-bold shadow-lg transition-all ${type === 'client' ? 'bg-black hover:bg-gray-800 shadow-gray-200' : 'bg-brand-orange hover:bg-orange-600 shadow-orange-200'}`}
            >
                <Plus size={16} />
                {type === 'client' ? '신규 병원 등록' : '신규 관리자 등록'}
            </button>
        )}
      </header>

       {/* Search Bar */}
       <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
            type="text" 
            placeholder={type === 'client' ? "병원명, 원장님, 이메일 검색..." : "이름, 이메일 검색..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black text-sm transition-all shadow-sm"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
         <table className="w-full text-sm text-left">
             <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 text-xs uppercase tracking-wider">
                 <tr>
                     <th className="px-6 py-4">
                         {type === 'client' ? '병원명 / 소속' : '소속 / 부서'}
                     </th>
                     <th className="px-6 py-4">사용자명</th>
                     <th className="px-6 py-4">계정 (Email)</th>
                     <th className="px-6 py-4">권한</th>
                     <th className="px-6 py-4">가입일</th>
                     <th className="px-6 py-4">상태</th>
                     <th className="px-6 py-4 text-right">관리</th>
                 </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                 {filteredClients.length > 0 ? filteredClients.map(client => (
                     <tr key={client.id} className="hover:bg-gray-50/80 transition-colors">
                         <td className="px-6 py-4 font-bold text-gray-900">{client.clinicName}</td>
                         <td className="px-6 py-4 text-gray-700">{client.name}</td>
                         <td className="px-6 py-4 text-gray-500 font-mono">{client.email}</td>
                         <td className="px-6 py-4">
                             <span className={`px-2 py-0.5 rounded text-xs font-bold border ${client.role === 'admin' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200'}`}>
                                 {client.role === 'admin' ? 'ADMIN' : 'USER'}
                             </span>
                         </td>
                         <td className="px-6 py-4 text-gray-500">{client.joinedAt}</td>
                         <td className="px-6 py-4">
                             <span className={`px-2 py-1 rounded text-xs font-bold ${client.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                 {client.status === 'active' ? '이용중' : '중지됨'}
                             </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                             {canManage ? (
                                 <div className="flex items-center justify-end gap-2">
                                     <button onClick={() => handleOpenModal(client)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"><Edit size={16}/></button>
                                     <button onClick={() => handleDelete(client.id)} className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"><Trash2 size={16}/></button>
                                 </div>
                             ) : (
                                 <span className="text-gray-300 text-xs">권한 없음</span>
                             )}
                         </td>
                     </tr>
                 )) : (
                     <tr>
                         <td colSpan={7} className="px-6 py-20 text-center text-gray-400">
                             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                 {type === 'client' ? <Users size={32} className="opacity-30" /> : <ShieldCheck size={32} className="opacity-30" />}
                             </div>
                             <p>{type === 'client' ? '등록된 병원 계정이 없습니다.' : '등록된 관리자 계정이 없습니다.'}</p>
                         </td>
                     </tr>
                 )}
             </tbody>
         </table>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                        {editingClient ? '계정 정보 수정' : (type === 'client' ? '신규 병원 등록' : '신규 관리자 등록')}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            {type === 'client' ? '병원명 / 소속' : '소속 / 부서'} <span className="text-red-500">*</span>
                        </label>
                        <input type="text" value={formData.clinicName} onChange={e => setFormData({...formData, clinicName: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" placeholder={type === 'client' ? "예: 고운 성형외과" : "예: Kohwoon Ad HQ"}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">사용자명 <span className="text-red-500">*</span></label>
                            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" placeholder="예: 홍길동"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">연락처</label>
                            <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" placeholder="010-0000-0000"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">이메일 (로그인 ID) <span className="text-red-500">*</span></label>
                        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" placeholder="email@example.com"/>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">계정 상태</label>
                             <select 
                                value={formData.status} 
                                onChange={e => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
                                className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors bg-white"
                            >
                                <option value="active">이용중 (Active)</option>
                                <option value="inactive">중지됨 (Inactive)</option>
                            </select>
                        </div>
                         {/* Role is hidden/fixed based on type */}
                         <div className="hidden">
                             <input type="text" value={type === 'client' ? 'user' : 'admin'} readOnly />
                         </div>
                    </div>

                    {!editingClient && (
                         <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-500 mt-4 flex items-start gap-2">
                            <ShieldAlert size={14} className="mt-0.5 flex-shrink-0" />
                            <p>초기 비밀번호는 <strong>{type === 'client' ? 'user1234' : 'admin1234'}</strong> 로 자동 설정됩니다.</p>
                         </div>
                    )}
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="px-5 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">취소</button>
                    <button onClick={handleSave} className={`px-5 py-3 text-sm text-white rounded-xl font-bold flex items-center gap-2 shadow-lg transition-colors ${type === 'client' ? 'bg-black hover:bg-gray-800 shadow-gray-200' : 'bg-brand-orange hover:bg-orange-600 shadow-orange-200'}`}>
                        <Save size={16}/> {editingClient ? '저장하기' : '등록하기'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;