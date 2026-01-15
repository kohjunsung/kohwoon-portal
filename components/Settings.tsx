import React, { useState } from 'react';
import { Bell, User, MessageSquare, Clock, MapPin, Phone, ExternalLink, Save, Edit2, Globe, Map, Search, Link2, Key } from 'lucide-react';
import { CLINIC_INFO, db } from '../services/mockData';
import { User as UserType } from '../types';

interface SettingsProps {
  user: UserType;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [notifications, setNotifications] = useState({
    kakao: true,
    email: false,
    reports: true,
    blog: true
  });
  
  const [isEditing, setIsEditing] = useState(false);
  // Fetch settings for the logged-in user (or simulate it)
  const [clinicInfo, setClinicInfo] = useState(db.getSettings(user.id) || CLINIC_INFO);

  // Integration State
  const [slackWebhook, setSlackWebhook] = useState('');
  const [kakaoKey, setKakaoKey] = useState('');

  const toggleNoti = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInfoChange = (key: string, value: string) => {
    setClinicInfo(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
      setIsEditing(false);
      db.updateSettings(user.id, clinicInfo);
      
      // Simulate Notification to Admin
      if (user.role !== 'admin') {
          console.log("Admin Notified: Clinic Info Updated by User");
          alert("정보가 수정되었습니다. 담당자에게 변경 사항이 알림으로 전송되었습니다.");
      } else {
          alert("정보가 저장되었습니다.");
      }
  };

  const handleIntegrationSave = () => {
      alert("연동 정보가 안전하게 저장되었습니다.");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">설정</h1>
        <p className="text-gray-500 text-sm mt-1">알림 설정, 서비스 연동 및 병원 기본 정보를 관리합니다.</p>
      </header>

      {/* Integration Hub (Admin Only or Visible to Owner) */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Link2 size={18} className="text-brand-orange"/>
                서비스 연동 허브 (Integration)
            </h2>
        </div>
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Slack Integration */}
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" alt="Slack" className="w-4 h-4" />
                        Slack 웹훅 연동
                    </label>
                    <div className="flex gap-2">
                        <input 
                            type="password" 
                            placeholder="https://hooks.slack.com/services/..."
                            value={slackWebhook}
                            onChange={(e) => setSlackWebhook(e.target.value)}
                            className="flex-1 border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors"
                        />
                    </div>
                    <p className="text-xs text-gray-400">주요 알림 및 작업 요청을 슬랙 채널로 수신합니다.</p>
                </div>

                {/* Kakao AlimTalk Integration */}
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                        <MessageSquare size={16} className="text-yellow-400 fill-yellow-400" />
                        카카오 알림톡 API 연동
                    </label>
                     <div className="flex gap-2">
                        <input 
                            type="password" 
                            placeholder="API Key 입력"
                            value={kakaoKey}
                            onChange={(e) => setKakaoKey(e.target.value)}
                            className="flex-1 border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors"
                        />
                    </div>
                    <p className="text-xs text-gray-400">비즈니스 채널을 통한 자동 알림 발송을 위해 API 키가 필요합니다.</p>
                </div>
            </div>
            <div className="flex justify-end pt-2">
                <button 
                    onClick={handleIntegrationSave}
                    className="text-xs px-4 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition-colors"
                >
                    연동 정보 저장
                </button>
            </div>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Bell size={18} className="text-brand-orange"/>
                알림 설정 (Notification)
            </h2>
        </div>
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium text-gray-900">카카오 알림톡 수신</h3>
                    <p className="text-sm text-gray-500">주요 보고서 및 이슈 발생 시 알림톡을 받습니다.</p>
                </div>
                <button 
                    onClick={() => toggleNoti('kakao')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${notifications.kakao ? 'bg-brand-orange' : 'bg-gray-200'}`}
                >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${notifications.kakao ? 'left-6.5 translate-x-1' : 'left-0.5'}`} />
                </button>
            </div>
            
            <hr className="border-gray-100" />

            <div className="space-y-4">
                <p className="text-sm font-medium text-gray-700">세부 알림 설정</p>
                <div className="flex items-center gap-3">
                    <input 
                        type="checkbox" 
                        id="noti_reports" 
                        checked={notifications.reports}
                        onChange={() => toggleNoti('reports')}
                        className="w-4 h-4 text-brand-orange border-gray-300 rounded focus:ring-brand-orange" 
                    />
                    <label htmlFor="noti_reports" className="text-sm text-gray-600">월간 성과 보고서 발행 알림</label>
                </div>
                <div className="flex items-center gap-3">
                    <input 
                        type="checkbox" 
                        id="noti_blog" 
                        checked={notifications.blog}
                        onChange={() => toggleNoti('blog')}
                        className="w-4 h-4 text-brand-orange border-gray-300 rounded focus:ring-brand-orange" 
                    />
                    <label htmlFor="noti_blog" className="text-sm text-gray-600">블로그 포스팅 업로드 알림</label>
                </div>
            </div>
        </div>
      </section>

      {/* Clinic Info */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <User size={18} className="text-brand-orange"/>
                병원 기본 정보
            </h2>
            <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all ${isEditing ? 'bg-brand-orange text-white shadow-md shadow-orange-200' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
                {isEditing ? <><Save size={14}/> 저장 완료</> : <><Edit2 size={14}/> 정보 수정</>}
            </button>
        </div>
        
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Basic Info */}
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">병원명</label>
                        {isEditing ? (
                            <input type="text" value={clinicInfo.name} onChange={(e) => handleInfoChange('name', e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" placeholder="병원명 입력"/>
                        ) : (
                            <div className="text-gray-900 font-bold text-lg">{clinicInfo.name || '-'}</div>
                        )}
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">대표자</label>
                        {isEditing ? (
                            <input type="text" value={clinicInfo.representative} onChange={(e) => handleInfoChange('representative', e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" placeholder="대표자명 입력"/>
                        ) : (
                            <div className="text-gray-900 font-medium">{clinicInfo.representative || '-'}</div>
                        )}
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-1"><MapPin size={12}/> 주소</label>
                        {isEditing ? (
                            <input type="text" value={clinicInfo.address} onChange={(e) => handleInfoChange('address', e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" placeholder="병원 주소 입력"/>
                        ) : (
                            <div className="text-gray-900">{clinicInfo.address || '-'}</div>
                        )}
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-1"><Phone size={12}/> 전화번호</label>
                        {isEditing ? (
                            <input type="text" value={clinicInfo.phone} onChange={(e) => handleInfoChange('phone', e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" placeholder="02-0000-0000"/>
                        ) : (
                            <div className="text-gray-900 font-medium">{clinicInfo.phone || '-'}</div>
                        )}
                    </div>
                </div>

                {/* Digital Assets */}
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-1"><Globe size={12}/> 공식 블로그 URL</label>
                        {isEditing ? (
                            <input type="text" value={clinicInfo.blogUrl} onChange={(e) => handleInfoChange('blogUrl', e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" placeholder="https://blog.naver.com/..."/>
                        ) : (
                            clinicInfo.blogUrl ? <a href={clinicInfo.blogUrl} target="_blank" rel="noreferrer" className="text-brand-orange hover:underline truncate block font-medium">{clinicInfo.blogUrl}</a> : <span className="text-gray-400">-</span>
                        )}
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-1"><Map size={12}/> 스마트플레이스 URL</label>
                        {isEditing ? (
                            <input type="text" value={clinicInfo.placeUrl} onChange={(e) => handleInfoChange('placeUrl', e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" placeholder="https://map.naver.com/..."/>
                        ) : (
                            clinicInfo.placeUrl ? <a href={clinicInfo.placeUrl} target="_blank" rel="noreferrer" className="text-brand-orange hover:underline truncate block font-medium">{clinicInfo.placeUrl}</a> : <span className="text-gray-400">-</span>
                        )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-1"><Search size={12}/> 네이버 계정 정보</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs text-gray-500 block mb-1">ID</span>
                                {isEditing ? (
                                    <input type="text" value={clinicInfo.naverId} onChange={(e) => handleInfoChange('naverId', e.target.value)} className="w-full border border-gray-200 p-2 rounded-lg text-sm bg-white" placeholder="ID"/>
                                ) : (
                                    <span className="font-mono text-gray-900">{clinicInfo.naverId || '-'}</span>
                                )}
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 block mb-1">PW</span>
                                {isEditing ? (
                                    <input type="text" value={clinicInfo.naverPw} onChange={(e) => handleInfoChange('naverPw', e.target.value)} className="w-full border border-gray-200 p-2 rounded-lg text-sm bg-white" placeholder="PW"/>
                                ) : (
                                    <span className="font-mono text-gray-900">{clinicInfo.naverPw || '-'}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-gray-100 my-8"/>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-1"><Clock size={12}/> 진료 시간</label>
                    {isEditing ? (
                        <textarea value={clinicInfo.hours} onChange={(e) => handleInfoChange('hours', e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl text-sm h-32 resize-none focus:border-black outline-none transition-colors" placeholder="진료 시간 입력"/>
                    ) : (
                        <div className="text-gray-900 whitespace-pre-line leading-relaxed">{clinicInfo.hours || '-'}</div>
                    )}
                    <div className="mt-4">
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">점심시간</span>
                        {isEditing ? (
                            <input type="text" value={clinicInfo.lunch} onChange={(e) => handleInfoChange('lunch', e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:border-black outline-none transition-colors" placeholder="13:00 - 14:00"/>
                        ) : (
                            <div className="text-gray-900">{clinicInfo.lunch || '-'}</div>
                        )}
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-1"><MessageSquare size={12}/> 원장님 인터뷰 및 병원 철학</label>
                    
                    {/* Simulated Notion Embed View */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden h-64 bg-white flex flex-col relative">
                        <div className="bg-gray-50 border-b border-gray-100 p-2 flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-red-400"></div>
                             <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                             <div className="w-3 h-3 rounded-full bg-green-400"></div>
                             <div className="ml-2 text-xs text-gray-400 flex-1 text-center font-mono">notion.so/embed/philosophy...</div>
                        </div>
                        {isEditing ? (
                            <textarea 
                                value={clinicInfo.philosophy} 
                                onChange={(e) => handleInfoChange('philosophy', e.target.value)}
                                className="w-full h-full p-4 resize-none outline-none text-sm leading-relaxed"
                                placeholder="노션 페이지 URL 또는 텍스트 입력"
                            />
                        ) : (
                            <div className="p-6 overflow-y-auto">
                                <h3 className="font-bold text-lg mb-2">원장님 인터뷰</h3>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                    {clinicInfo.philosophy || '등록된 정보가 없습니다.'}
                                </p>
                            </div>
                        )}
                         {!isEditing && clinicInfo.philosophy && (
                            <a href="#" target="_blank" rel="noreferrer" className="absolute bottom-4 right-4 bg-black text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-gray-800 transition-colors shadow-lg">
                                <ExternalLink size={10} /> 원문 보기
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;