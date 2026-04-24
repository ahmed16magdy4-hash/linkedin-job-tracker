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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CalendarIcon, Building2, Briefcase, Link2, MapPin, DollarSign, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateJobInput) => Promise<void>;
  isLoading?: boolean;
}

const statusOptions: { value: JobStatus; label: string; emoji: string }[] = [
  { value: 'applied', label: 'تم التقديم', emoji: '📨' },
  { value: 'pending', label: 'قيد الانتظار', emoji: '⏳' },
  { value: 'interview', label: 'مقابلة', emoji: '🎤' },
  { value: 'accepted', label: 'تم قبول الطلب', emoji: '✅' },
  { value: 'rejected', label: 'تم الرفض', emoji: '❌' },
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
    appliedDate: new Date(),
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
        appliedDate: new Date(),
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
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center gap-2">
              <Briefcase size={22} />
              إضافة وظيفة جديدة
            </DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Company & Job Title - 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="company" className="text-xs font-medium flex items-center gap-1.5">
                <Building2 size={13} className="text-muted-foreground" />
                اسم الشركة *
              </Label>
              <Input
                id="company"
                placeholder="مثال: Google"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                disabled={isLoading}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-medium flex items-center gap-1.5">
                <Briefcase size={13} className="text-muted-foreground" />
                اسم الوظيفة *
              </Label>
              <Input
                id="title"
                placeholder="مثال: Software Engineer"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
                disabled={isLoading}
                className="h-9 text-sm"
              />
            </div>
          </div>

          {/* Job URL */}
          <div className="space-y-1.5">
            <Label htmlFor="url" className="text-xs font-medium flex items-center gap-1.5">
              <Link2 size={13} className="text-muted-foreground" />
              رابط الوظيفة
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://..."
              value={formData.jobUrl}
              onChange={(e) =>
                setFormData({ ...formData, jobUrl: e.target.value })
              }
              disabled={isLoading}
              className="h-9 text-sm"
            />
          </div>

          {/* Location & Salary - 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs font-medium flex items-center gap-1.5">
                <MapPin size={13} className="text-muted-foreground" />
                الموقع
              </Label>
              <Input
                id="location"
                placeholder="مثال: Dubai, UAE"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                disabled={isLoading}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="salary" className="text-xs font-medium flex items-center gap-1.5">
                <DollarSign size={13} className="text-muted-foreground" />
                الراتب
              </Label>
              <Input
                id="salary"
                placeholder="مثال: 15,000 EGP"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                disabled={isLoading}
                className="h-9 text-sm"
              />
            </div>
          </div>

          {/* Date & Status - 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            {/* Date Picker */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium flex items-center gap-1.5">
                <CalendarIcon size={13} className="text-muted-foreground" />
                تاريخ التقديم
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-9 justify-start text-right text-sm font-normal",
                      !formData.appliedDate && "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    {formData.appliedDate
                      ? format(formData.appliedDate, 'dd MMM yyyy', { locale: ar })
                      : 'اختر التاريخ'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.appliedDate}
                    onSelect={(date) =>
                      setFormData({ ...formData, appliedDate: date || new Date() })
                    }
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-xs font-medium">الحالة</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as JobStatus })
                }
                disabled={isLoading}
              >
                <SelectTrigger id="status" className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <span>{option.emoji}</span>
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-medium flex items-center gap-1.5">
              <FileText size={13} className="text-muted-foreground" />
              ملاحظات
            </Label>
            <Textarea
              id="notes"
              placeholder="أضف أي ملاحظات إضافية..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              disabled={isLoading}
              rows={2}
              className="text-sm resize-none"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="rounded-xl"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-gradient-to-r from-primary to-primary/80 shadow-md shadow-primary/25"
            >
              {isLoading ? 'جاري الإضافة...' : '✨ إضافة الوظيفة'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
