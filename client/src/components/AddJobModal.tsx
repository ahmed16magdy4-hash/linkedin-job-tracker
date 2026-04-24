// AddJobModal Component
// Design: Modern Professional Analytics - Modal for adding new job applications

import { useState } from 'react';
import { CreateJobInput, JobStatus } from '@/types/job';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface AddJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateJobInput) => Promise<void>;
  isLoading?: boolean;
}

const statusOptions: { value: JobStatus; label: string }[] = [
  { value: 'applied', label: 'تم التقديم' },
  { value: 'pending', label: 'قيد الانتظار' },
  { value: 'interview', label: 'مقابلة' },
  { value: 'accepted', label: 'تم قبول الطلب' },
  { value: 'rejected', label: 'تم الرفض' },
];

export default function AddJobModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: AddJobModalProps) {
  const [formData, setFormData] = useState<CreateJobInput>({
    companyName: '',
    jobTitle: '',
    jobUrl: '',
    status: 'applied',
    notes: '',
    salary: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName.trim() || !formData.jobTitle.trim()) {
      toast.error('يرجى ملء اسم الشركة واسم الوظيفة');
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        companyName: '',
        jobTitle: '',
        jobUrl: '',
        status: 'applied',
        notes: '',
        salary: '',
        location: '',
      });
      onOpenChange(false);
      toast.success('تم إضافة الوظيفة بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة الوظيفة');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>إضافة وظيفة جديدة</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">اسم الشركة *</Label>
            <Input
              id="company"
              placeholder="مثال: Google"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">اسم الوظيفة *</Label>
            <Input
              id="title"
              placeholder="مثال: Senior Software Engineer"
              value={formData.jobTitle}
              onChange={(e) =>
                setFormData({ ...formData, jobTitle: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">رابط الوظيفة</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://..."
              value={formData.jobUrl}
              onChange={(e) =>
                setFormData({ ...formData, jobUrl: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">الموقع</Label>
            <Input
              id="location"
              placeholder="مثال: Dubai, UAE"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">الراتب</Label>
            <Input
              id="salary"
              placeholder="مثال: 150,000 - 200,000 AED"
              value={formData.salary}
              onChange={(e) =>
                setFormData({ ...formData, salary: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">الحالة</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value as JobStatus })
              }
              disabled={isLoading}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea
              id="notes"
              placeholder="أضف أي ملاحظات إضافية..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              disabled={isLoading}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'جاري الإضافة...' : 'إضافة الوظيفة'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
