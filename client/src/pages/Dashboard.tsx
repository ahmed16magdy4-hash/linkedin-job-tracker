// Dashboard Page
// Design: Modern Professional Analytics - Main dashboard for tracking job applications

import { useEffect, useState, useMemo } from 'react';
import { JobApplication, JobStatus, JobStats } from '@/types/job';
import { subscribeToJobs, addJob, updateJob, deleteJob } from '@/lib/jobService';
import JobCard from '@/components/JobCard';
import AddJobModal from '@/components/AddJobModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Search,
  Calendar,
  MapPin,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { subDays, subMonths, isAfter } from 'date-fns';

type DateFilter = 'all' | '7days' | '30days' | '3months';

export default function Dashboard() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState<JobStats>({
    total: 0,
    applied: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    interview: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<JobStatus | 'all'>('all');

  // Advanced filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToJobs(
      (updatedJobs) => {
        setJobs(updatedJobs);
        const newStats: JobStats = {
          total: updatedJobs.length,
          applied: updatedJobs.filter((j) => j.status === 'applied').length,
          pending: updatedJobs.filter((j) => j.status === 'pending').length,
          accepted: updatedJobs.filter((j) => j.status === 'accepted').length,
          rejected: updatedJobs.filter((j) => j.status === 'rejected').length,
          interview: updatedJobs.filter((j) => j.status === 'interview').length,
        };
        setStats(newStats);
      },
      (error) => {
        console.error('Error loading jobs:', error);
        toast.error('حدث خطأ في تحميل البيانات');
      }
    );
    return () => unsubscribe();
  }, []);

  // Get unique locations for filter
  const uniqueLocations = useMemo(() => {
    const locs = new Set(jobs.map((j) => j.location).filter(Boolean));
    return Array.from(locs) as string[];
  }, [jobs]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (dateFilter !== 'all') count++;
    if (locationFilter !== 'all') count++;
    return count;
  }, [searchQuery, dateFilter, locationFilter]);

  // Apply all filters
  const filteredJobs = useMemo(() => {
    let result = jobs;

    // Status filter
    if (selectedFilter !== 'all') {
      result = result.filter((job) => job.status === selectedFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.companyName.toLowerCase().includes(q) ||
          job.jobTitle.toLowerCase().includes(q) ||
          (job.notes && job.notes.toLowerCase().includes(q))
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      let cutoff: Date;
      switch (dateFilter) {
        case '7days':
          cutoff = subDays(now, 7);
          break;
        case '30days':
          cutoff = subDays(now, 30);
          break;
        case '3months':
          cutoff = subMonths(now, 3);
          break;
        default:
          cutoff = new Date(0);
      }
      result = result.filter((job) => isAfter(new Date(job.appliedDate), cutoff));
    }

    // Location filter
    if (locationFilter !== 'all') {
      result = result.filter((job) => job.location === locationFilter);
    }

    return result;
  }, [jobs, selectedFilter, searchQuery, dateFilter, locationFilter]);

  const handleAddJob = async (input: any) => {
    setIsLoading(true);
    try {
      await addJob(input);
    } catch (error) {
      console.error('Error adding job:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: JobStatus) => {
    try {
      await updateJob(id, { status });
      toast.success('تم تحديث حالة الوظيفة');
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('حدث خطأ في تحديث الوظيفة');
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الوظيفة؟')) return;
    try {
      await deleteJob(id);
      toast.success('تم حذف الوظيفة');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('حدث خطأ في حذف الوظيفة');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDateFilter('all');
    setLocationFilter('all');
    setSelectedFilter('all');
  };

  const statCards = [
    {
      label: 'إجمالي التقديمات',
      value: stats.total,
      icon: Briefcase,
      gradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      label: 'قيد الانتظار',
      value: stats.pending,
      icon: Clock,
      gradient: 'from-amber-500 to-amber-600',
      lightBg: 'bg-amber-50 dark:bg-amber-950/30',
    },
    {
      label: 'المقابلات',
      value: stats.interview,
      icon: Users,
      gradient: 'from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50 dark:bg-purple-950/30',
    },
    {
      label: 'المقبولة',
      value: stats.accepted,
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-emerald-600',
      lightBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      label: 'المرفوضة',
      value: stats.rejected,
      icon: XCircle,
      gradient: 'from-red-500 to-red-600',
      lightBg: 'bg-red-50 dark:bg-red-950/30',
    },
  ];

  const statusFilters: { value: JobStatus | 'all'; label: string; emoji: string }[] = [
    { value: 'all', label: 'الكل', emoji: '📋' },
    { value: 'applied', label: 'تم التقديم', emoji: '📨' },
    { value: 'pending', label: 'قيد الانتظار', emoji: '⏳' },
    { value: 'interview', label: 'مقابلات', emoji: '🎤' },
    { value: 'accepted', label: 'مقبول', emoji: '✅' },
    { value: 'rejected', label: 'مرفوض', emoji: '❌' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-accent/80 text-white py-10 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">متتبع وظائف LinkedIn</h1>
              <p className="text-white/70 text-sm">
                تابع جميع طلبات التوظيف الخاصة بك في مكان واحد
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="bg-white/15 backdrop-blur-sm border border-white/20 text-white hover:bg-white/25 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              <Plus className="mr-2 h-5 w-5" />
              إضافة وظيفة
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={index}
                className={`${card.lightBg} border-0 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer`}
                onClick={() => {
                  const statusMap: Record<number, JobStatus | 'all'> = {
                    0: 'all',
                    1: 'pending',
                    2: 'interview',
                    3: 'accepted',
                    4: 'rejected',
                  };
                  setSelectedFilter(statusMap[index]);
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">{card.label}</p>
                    <p className="text-2xl font-bold text-foreground">{card.value}</p>
                  </div>
                  <div className={`w-11 h-11 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon size={20} className="text-white" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Search & Filters Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ابحث عن شركة أو وظيفة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 h-10 rounded-xl border-border/50 bg-card"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Toggle Filters */}
            <Button
              variant={showFilters ? 'default' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-xl h-10 gap-2"
            >
              <SlidersHorizontal size={16} />
              فلاتر
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-white/20 rounded-full text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {activeFilterCount > 0 && (
              <Button variant="ghost" onClick={clearFilters} className="rounded-xl h-10 text-xs text-muted-foreground">
                مسح الكل
              </Button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="flex gap-3 flex-wrap p-4 bg-card rounded-2xl border border-border/50 animate-in slide-in-from-top-2 duration-200">
              {/* Date Filter */}
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-muted-foreground" />
                <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
                  <SelectTrigger className="w-[160px] h-9 rounded-xl text-sm">
                    <SelectValue placeholder="الفترة الزمنية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الأوقات</SelectItem>
                    <SelectItem value="7days">آخر 7 أيام</SelectItem>
                    <SelectItem value="30days">آخر 30 يوم</SelectItem>
                    <SelectItem value="3months">آخر 3 شهور</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              {uniqueLocations.length > 0 && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-muted-foreground" />
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-[160px] h-9 rounded-xl text-sm">
                      <SelectValue placeholder="الموقع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">كل المواقع</SelectItem>
                      {uniqueLocations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {statusFilters.map((filter) => {
            const count =
              filter.value === 'all'
                ? stats.total
                : stats[filter.value as keyof JobStats];
            return (
              <Button
                key={filter.value}
                variant={selectedFilter === filter.value ? 'default' : 'outline'}
                onClick={() => setSelectedFilter(filter.value)}
                className={`rounded-xl text-sm transition-all duration-200 ${
                  selectedFilter === filter.value
                    ? 'shadow-md shadow-primary/25 scale-105'
                    : 'hover:scale-105'
                }`}
                size="sm"
              >
                <span className="mr-1.5">{filter.emoji}</span>
                {filter.label} ({count})
              </Button>
            );
          })}
        </div>

        {/* Results count */}
        {(searchQuery || dateFilter !== 'all' || locationFilter !== 'all') && (
          <p className="text-sm text-muted-foreground mb-4">
            عرض {filteredJobs.length} من {jobs.length} وظيفة
          </p>
        )}

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onStatusChange={handleUpdateStatus}
                onDelete={handleDeleteJob}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Briefcase size={36} className="text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-lg font-medium mb-1">
                {searchQuery || dateFilter !== 'all' || locationFilter !== 'all'
                  ? 'لا توجد نتائج تطابق البحث'
                  : selectedFilter === 'all'
                    ? 'لا توجد وظائف حتى الآن'
                    : 'لا توجد وظائف في هذه الحالة'}
              </p>
              <p className="text-muted-foreground/70 text-sm">
                {selectedFilter === 'all' && !searchQuery
                  ? 'ابدأ بإضافة وظيفة جديدة!'
                  : 'جرب تغيير الفلاتر أو البحث'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Job Modal */}
      <AddJobModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleAddJob}
        isLoading={isLoading}
      />
    </div>
  );
}
