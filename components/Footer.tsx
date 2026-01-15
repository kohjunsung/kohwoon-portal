import React, { useState } from 'react';
import { X } from 'lucide-react';

const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | 'service' | null>(null);

  const Modal = ({ title, content, onClose }: { title: string, content: React.ReactNode, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );

  const TERMS_CONTENT = `제1조 (목적)
본 약관은 고운앤컴퍼니 주식회사(이하 "회사")가 제공하는 고운 파트너 포털 서비스(이하 "서비스")의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.

제2조 (용어의 정의)
1. "회원"이란 서비스를 이용하기 위해 회사와 이용계약을 체결하고 회사가 부여한 ID를 부여받은 자를 말합니다.
2. "서비스"란 회사가 회원에게 제공하는 마케팅 성과 리포트, 결제 관리, 파일 공유 등의 제반 서비스를 의미합니다.

제3조 (약관의 효력 및 변경)
1. 본 약관은 서비스를 이용하고자 하는 자가 동의하고 회사가 이를 승낙함으로써 효력이 발생합니다.
2. 회사는 관련 법령을 위배하지 않는 범위 내에서 본 약관을 개정할 수 있습니다.

제4조 (서비스의 제공)
회사는 다음 각 호의 서비스를 제공합니다.
1. 마케팅 성과 데이터 시각화 및 리포팅
2. 업무 요청 및 진행 상황 관리
3. 계약 및 결제 관련 문서 관리
4. 기타 회사가 정하는 업무 지원 서비스

(이하 생략 - 상세 내용은 계약서를 참조하시기 바랍니다.)`;

  const PRIVACY_CONTENT = `고운앤컴퍼니 주식회사(이하 "회사")는 개인정보보호법 등 관련 법령에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.

1. 개인정보의 처리 목적
회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
- 회원 가입 및 관리
- 서비스 제공 및 계약 이행
- 고충 처리 및 마케팅 업무 수행

2. 처리하는 개인정보의 항목
- 필수항목: 성명, 병원명, 아이디(이메일), 비밀번호, 휴대전화번호
- 선택항목: 사업자등록번호, 주소, 유선전화번호

3. 개인정보의 보유 및 이용기간
회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
- 회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료 시까지)

(이하 생략 - 상세 내용은 myclinicad.ai 홈페이지를 참조하시기 바랍니다.)`;

  const SERVICE_CONTENT = `[고운 파트너 포털 서비스 소개]

고운 파트너 포털은 병/의원 마케팅 성과를 투명하게 공유하고, 효율적인 업무 소통을 위해 제작된 B2B 전용 플랫폼입니다.

주요 기능:
1. 실시간 대시보드: 신환 수, ROAS, CAC 등 핵심 지표를 한눈에 확인
2. 월간 리포트: AI 인사이트가 포함된 상세 성과 보고서 열람
3. 간편 결제 관리: 세금계산서 및 거래명세서 원클릭 다운로드
4. 업무 요청 시스템: Kanban 보드를 통한 실시간 진행 현황 공유
5. 디지털 자산 관리: 로고, 배너, 원고 등 마케팅 자산 아카이빙

본 서비스는 고운앤컴퍼니와 마케팅 대행 계약을 체결한 클라이언트에게만 제공됩니다.`;

  return (
    <>
      <footer className="mt-auto py-12 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-8 text-xs text-gray-500 font-light">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-gray-900 tracking-tight">Kohwoon Ad</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-400">Marketing for Clinic & Hospital</span>
            </div>
            <div className="space-y-1">
              <p><strong className="text-gray-700">고운앤컴퍼니 주식회사</strong></p>
              <p>대표자: KOH JUNSUNG (고준성)</p>
              <p>사업자등록번호: 707-88-01791</p>
              <p>경기도 부천시 부천로 110-1, 한위빌딩 7층 고운앤컴퍼니</p>
              <p className="pt-2">세금계산서 및 입금문의: <a href="mailto:admin@kohwoonc.com" className="text-gray-900 underline decoration-gray-300 underline-offset-2">admin@kohwoonc.com</a></p>
            </div>
          </div>
          
          <div className="flex flex-col md:items-end gap-4">
            <div className="flex gap-6">
              <button onClick={() => setActiveModal('terms')} className="hover:text-gray-900 transition-colors">이용약관</button>
              <button onClick={() => setActiveModal('privacy')} className="hover:text-gray-900 transition-colors font-medium">개인정보처리방침</button>
              <button onClick={() => setActiveModal('service')} className="hover:text-gray-900 transition-colors">서비스 소개</button>
            </div>
            <p className="text-right text-gray-400">&copy; 2025 Kohwoon & Company Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {activeModal === 'terms' && <Modal title="이용약관" content={TERMS_CONTENT} onClose={() => setActiveModal(null)} />}
      {activeModal === 'privacy' && <Modal title="개인정보처리방침" content={PRIVACY_CONTENT} onClose={() => setActiveModal(null)} />}
      {activeModal === 'service' && <Modal title="서비스 소개" content={SERVICE_CONTENT} onClose={() => setActiveModal(null)} />}
    </>
  );
};

export default Footer;