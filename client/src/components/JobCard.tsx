// JobCard Component
// Design: Modern Professional Analytics - Card-based display for job applications

import { JobApplication, JobStatus } from '@/types/job';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface JobCardProps {
  job: JobApplication;
  onEdit?: (job: JobApplication) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: JobStatus) => void;
}

const statusConfig: Record<JobStatus, { label: string; color: string; bgColor: string }> = {
  applied: { label: 'تم التقديم', color: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-50' },
  pending: { label: 'قيد الانتظار', color: 'bg-amber-100 text-amber-800', bgColor: 'bg-amber-50' },
  interview: { label: 'مقابلة', color: 'bg-purple-100 text-purple-800', bgColor: 'bg-purple-50' },
  accepted: { label: 'تم قبول الطلب', color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' },
  rejected: { label: 'تم الرفض', color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50' },
};

export default function JobCard({
  job,
  onEdit,
  onDelete,
  onStatusChange,
}: JobCardProps) {
  const statusInfo = statusConfig[job.status];

  return (
    <Card className={`p-6 hover:shadow-lg transition-all duration-300 ${statusInfo.bgColor}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">{job.jobTitle}</h3>
          <p className="text-sm text-muted-foreground">{job.companyName}</p>
        </div>
        <Badge className={`${statusInfo.color} border-0`}>{statusInfo.label}</Badge>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        {job.location && (
          <p className="text-muted-foreground">
            <span className="font-medium">الموقع:</span> {job.location}
          </p>
        )}
        {job.salary && (
          <p className="text-muted-foreground">
            <span className="font-medium">الراتب:</span> {job.salary}
          </p>
        )}
        <p className="text-muted-foreground">
          <span className="font-medium">تاريخ التقديم:</span>{' '}
          {format(job.appliedDate, 'dd MMMM yyyy', { locale: ar })}
        </p>
        {job.notes && (
          <p className="text-muted-foreground">
            <span className="font-medium">ملاحظات:</span> {job.notes}
          </p>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {onStatusChange && (
          <div className="flex gap-1 flex-wrap">
            {(['applied', 'pending', 'interview', 'accepted', 'rejected'] as JobStatus[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(job.id, status)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    job.status === status
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {statusConfig[status].label}
                </button>
              )
            )}
          </div>
        )}

        <div className="flex gap-2 ml-auto">
          {job.jobUrl && (
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs bg-accent text-accent-foreground px-3 py-1 rounded hover:opacity-90 transition-opacity"
            >
              <ExternalLink size={14} />
              الوظيفة
            </a>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(job)}
              className="h-8 w-8 p-0"
            >
              <Edit2 size={16} />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(job.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
