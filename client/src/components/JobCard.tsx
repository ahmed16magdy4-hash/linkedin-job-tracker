// JobCard Component
// Design: Modern Professional Analytics - Premium card display for job applications

import { JobApplication, JobStatus } from '@/types/job';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink, MapPin, DollarSign, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface JobCardProps {
  job: JobApplication;
  onEdit?: (job: JobApplication) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: JobStatus) => void;
}

const statusConfig: Record<JobStatus, { label: string; emoji: string; color: string; bgColor: string; borderColor: string }> = {
  applied: {
    label: 'تم التقديم',
    emoji: '📨',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    bgColor: 'hover:border-blue-300 dark:hover:border-blue-700',
    borderColor: 'border-l-blue-500',
  },
  pending: {
    label: 'قيد الانتظار',
    emoji: '⏳',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    bgColor: 'hover:border-amber-300 dark:hover:border-amber-700',
    borderColor: 'border-l-amber-500',
  },
  interview: {
    label: 'مقابلة',
    emoji: '🎤',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    bgColor: 'hover:border-purple-300 dark:hover:border-purple-700',
    borderColor: 'border-l-purple-500',
  },
  accepted: {
    label: 'مقبول',
    emoji: '✅',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    bgColor: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    borderColor: 'border-l-emerald-500',
  },
  rejected: {
    label: 'مرفوض',
    emoji: '❌',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    bgColor: 'hover:border-red-300 dark:hover:border-red-700',
    borderColor: 'border-l-red-500',
  },
};

export default function JobCard({
  job,
  onDelete,
  onStatusChange,
}: JobCardProps) {
  const statusInfo = statusConfig[job.status];

  return (
    <Card
      className={`group relative overflow-hidden border-l-4 ${statusInfo.borderColor} ${statusInfo.bgColor} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-foreground mb-0.5 truncate">{job.jobTitle}</h3>
            <p className="text-sm text-muted-foreground font-medium">{job.companyName}</p>
          </div>
          <Badge className={`${statusInfo.color} border-0 text-xs font-medium shrink-0 ml-2`}>
            <span className="mr-1">{statusInfo.emoji}</span>
            {statusInfo.label}
          </Badge>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {job.location && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin size={12} className="shrink-0 text-muted-foreground/70" />
              <span className="truncate">{job.location}</span>
            </div>
          )}
          {job.salary && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <DollarSign size={12} className="shrink-0 text-muted-foreground/70" />
              <span className="truncate">{job.salary}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar size={12} className="shrink-0 text-muted-foreground/70" />
            <span>{format(job.appliedDate, 'dd MMM yyyy', { locale: ar })}</span>
          </div>
          {job.notes && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground col-span-2">
              <FileText size={12} className="shrink-0 text-muted-foreground/70" />
              <span className="truncate">{job.notes}</span>
            </div>
          )}
        </div>

        {/* Status Quick Actions */}
        {onStatusChange && (
          <div className="flex gap-1 flex-wrap mb-3">
            {(['applied', 'pending', 'interview', 'accepted', 'rejected'] as JobStatus[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(job.id, status)}
                  className={`text-[10px] px-2 py-1 rounded-lg transition-all duration-200 ${
                    job.status === status
                      ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:scale-105'
                  }`}
                >
                  {statusConfig[status].emoji} {statusConfig[status].label}
                </button>
              )
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex gap-1.5">
            {job.jobUrl && (
              <a
                href={job.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors font-medium"
              >
                <ExternalLink size={12} />
                فتح الرابط
              </a>
            )}
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(job.id)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
            >
              <Trash2 size={14} />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
