// Job application types
// Design: Modern Professional Analytics - Data model for tracking LinkedIn job applications

export type JobStatus = 'applied' | 'pending' | 'accepted' | 'rejected' | 'interview';

export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  status: JobStatus;
  appliedDate: Date;
  notes?: string;
  salary?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobStats {
  total: number;
  applied: number;
  pending: number;
  accepted: number;
  rejected: number;
  interview: number;
}

export interface CreateJobInput {
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  status?: JobStatus;
  appliedDate?: Date;
  notes?: string;
  salary?: string;
  location?: string;
}
