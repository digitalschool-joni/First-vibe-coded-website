export enum OpportunityType {
  SCHOLARSHIP = 'Scholarship',
  INTERNSHIP = 'Internship',
  WORKSHOP = 'Workshop',
  MENTORSHIP = 'Mentorship',
  JOB = 'Entry Level Job',
  APPRENTICESHIP = 'Apprenticeship'
}

export enum Category {
  TECH = 'Technology',
  ARTS = 'Arts & Design',
  TRADES = 'Skilled Trades',
  ACADEMIC = 'Academic',
  COMMUNITY = 'Community Service'
}

export interface Opportunity {
  id: number;
  title: string;
  organization: string;
  type: OpportunityType;
  category: Category;
  location: string;
  is_remote: boolean;
  stipend_amount: number; // 0 if unpaid/n/a
  deadline: string;
  description: string;
  requirements?: string[];
  posted_at?: string;
  logo_color?: string; // Fallback visual
  logo_url?: string; // New: Actual Image
  posted_by_user_id?: number; // Links opp to a company account
}

export interface SqlQueryResult {
  query: string;
  results: Opportunity[];
  executionTimeMs: number;
  error?: string;
}

export type UserRole = 'seeker' | 'admin' | 'company';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  hasSeenOnboarding: boolean;
}

export interface UserProfile {
  id: number;
  user_id: number;
  name: string;
  email: string;
  bio: string;
  skills: string[];
  resume_url?: string;
  experience: {
    role: string;
    company: string;
    duration: string;
  }[];
}

export enum ApplicationStatus {
  APPLIED = 'Applied',
  REVIEWING = 'Under Review',
  INTERVIEW = 'Interview',
  OFFER = 'Offer',
  REJECTED = 'Not Selected'
}

export interface Application {
  id: number;
  opportunity_id: number;
  opportunity: Opportunity;
  user_id: number;
  applicant_name?: string; // For admin display
  status: ApplicationStatus;
  applied_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface ResourceArticle {
  id: number;
  title: string;
  category: string;
  readTime: string;
  description: string;
  content: string; // Full HTML/Markdown content
  date: string;
  author: string;
}

export type ViewState = 'auth' | 'discover' | 'profile' | 'applications' | 'detail' | 'admin_dashboard' | 'company_dashboard' | 'inbox' | 'resources' | 'settings';
