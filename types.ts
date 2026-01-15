export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  clinicName: string;
  role: UserRole;
  email: string;
  avatar?: string;
}

export interface Client extends User {
  joinedAt: string;
  status: 'active' | 'inactive';
  phone: string;
  businessNumber?: string;
  representative?: string;
}

export interface Metric {
  month: string;
  newPatients: number;
  cac: number;
  roas: number;
  spend: number;
}

export interface Task {
  id: string;
  clientId: string; // Linked to specific client
  title: string;
  description?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'stopped';
  date: string;
  requester: string;
  dueDate?: string;
  progress?: number;
  assignee?: string;
  assigneeContact?: string;
}

export interface Report {
  id: string;
  clientId: string;
  title: string;
  type: 'service' | 'performance';
  date: string;
  month: string;
  notionUrl: string;
  status: 'published' | 'draft';
  summary?: string;
}

export interface Payment {
  id: string;
  clientId: string;
  month: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  type: 'regular' | 'irregular';
  invoiceUrl?: string;
  contractUrl?: string;
  estimateUrl?: string;
  dueDate: string;
  description?: string;
}

export interface ClinicFile {
  id: string;
  clientId: string;
  name: string;
  type: string;
  size: string;
  date: string;
  category: 'report' | 'contract' | 'asset' | 'other';
  url: string; // For real file linking
}

export interface ClinicSettings {
  clientId: string;
  name: string;
  representative: string;
  phone: string;
  address: string;
  hours: string;
  lunch: string;
  blogUrl: string;
  placeUrl: string;
  naverId: string;
  naverPw: string;
  philosophy: string; // Notion URL or text
}

export const CATEGORIES: Record<string, string> = {
  report: '보고서',
  contract: '계약서',
  asset: '디자인/자료',
  other: '기타'
};