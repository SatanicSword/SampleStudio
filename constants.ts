import { Vendor, VendorStatus } from './types';

export const VENDORS: Vendor[] = [
  {
    id: 'honeywell',
    name: 'Honeywell',
    logoInitials: 'HW',
    status: VendorStatus.ACTIVE,
    contractValue: '$2.4M / yr',
    renewalDate: 'Oct 15, 2025',
    description: 'Building automation systems and HVAC maintenance services.',
    contractFileName: 'MSA-2023-HW-Signed.pdf',
    contextData: `
      Vendor: Honeywell
      Contract ID: MSA-2023-HW-001
      Type: Master Services Agreement (Facilities)
      Start Date: Oct 15, 2023
      End Date: Oct 15, 2025
      Annual Value: $2,400,000 USD
      Payment Terms: Net 45
      Active Disputes: None
      SLA Performance: 98.5% (Target 99%)
      Key Contact: Sarah Connor (Account Director)
      Notes: Upcoming quarterly business review scheduled for next month. Focus on energy efficiency upgrades.
    `,
    spendData: [
      { month: 'Jan', amount: 200 },
      { month: 'Feb', amount: 210 },
      { month: 'Mar', amount: 195 },
      { month: 'Apr', amount: 200 },
      { month: 'May', amount: 220 },
      { month: 'Jun', amount: 200 },
    ],
    kpis: [
      { id: 'uptime', label: 'Uptime SLA', value: '99.95%', status: 'good', trend: '+0.05%', icon: 'chart' },
      { id: 'reliability', label: 'Reliability Matrix', value: 'High', status: 'good', icon: 'shield' },
      { id: 'commercial', label: 'Commercial Impact', value: '$2.4M', status: 'neutral', icon: 'dollar' },
      { id: 'changes', label: 'Contract Changes', value: '0 Pending', status: 'good', icon: 'file' }
    ]
  },
  {
    id: 'sap',
    name: 'SAP',
    logoInitials: 'SAP',
    status: VendorStatus.AT_RISK,
    contractValue: '$5.8M / yr',
    renewalDate: 'Dec 31, 2024',
    description: 'Enterprise ERP software licensing and cloud services.',
    contractFileName: 'ELA-2021-SAP-Final.pdf',
    contextData: `
      Vendor: SAP
      Contract ID: ELA-2021-SAP-992
      Type: Enterprise License Agreement
      Start Date: Jan 1, 2021
      End Date: Dec 31, 2024
      Annual Value: $5,800,000 USD
      Payment Terms: Net 30
      Active Disputes: 1 (Overage charges for Q1 2024)
      SLA Performance: 99.99% (Target 99.9%)
      Key Contact: Hans Gruber (Regional VP)
      Notes: Renewal negotiation critical. Client looking to migrate 20% of workload to AWS. Contract creates lock-in clauses that need review.
    `,
    spendData: [
      { month: 'Jan', amount: 480 },
      { month: 'Feb', amount: 480 },
      { month: 'Mar', amount: 550 }, // Spike due to overage
      { month: 'Apr', amount: 480 },
      { month: 'May', amount: 480 },
      { month: 'Jun', amount: 480 },
    ],
    kpis: [
      { id: 'uptime', label: 'Uptime SLA', value: '98.2%', status: 'warning', trend: '-1.2%', icon: 'chart' },
      { id: 'reliability', label: 'Reliability Matrix', value: 'Medium', status: 'warning', icon: 'shield' },
      { id: 'commercial', label: 'Commercial Impact', value: '$5.8M', status: 'danger', icon: 'dollar' },
      { id: 'changes', label: 'Contract Changes', value: '2 Critical', status: 'danger', icon: 'file' }
    ]
  }
];

export const SUGGESTED_PROMPTS = [
  "Summarize the current contract status.",
  "Are there any active risks or disputes?",
  "Draft a renewal notice email.",
  "Analyze the spending trend."
];