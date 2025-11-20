export enum VendorStatus {
  ACTIVE = 'Active',
  AT_RISK = 'At Risk',
  RENEWAL_DUE = 'Renewal Due'
}

export interface KPI {
  id: string;
  label: string;
  value: string;
  status: 'good' | 'warning' | 'danger' | 'neutral';
  trend?: string;
  icon?: 'chart' | 'shield' | 'dollar' | 'file';
}

export interface Vendor {
  id: string;
  name: string;
  logoInitials: string;
  status: VendorStatus;
  contractValue: string;
  renewalDate: string;
  description: string;
  contextData: string; // Data fed to the AI
  spendData: { month: string; amount: number }[];
  contractFileName: string;
  kpis: KPI[];
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatState {
  chatId: string;
  messages: Message[];
  isLoading: boolean;
}