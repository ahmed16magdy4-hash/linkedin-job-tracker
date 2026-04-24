// Dashboard Page
// Design: Modern Professional Analytics - Main dashboard for tracking job applications

import { useEffect, useState } from 'react';
import { JobApplication, JobStatus, JobStats } from '@/types/job';
import { subscribeToJobs, addJob, updateJob, deleteJob } from '@/lib/jobService';
import JobCard from '@/components/JobCard';
import AddJobModal from '@/components/AddJobModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Briefcase, Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import { toast } from 'sonner';

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

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToJobs(
      (updatedJobs) => {
        setJobs(updatedJobs);
        // Calculate stats
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

  const filteredJobs =
    selectedFilter === 'all'
      ? jobs
      : jobs.filter((job) => job.status === selectedFilter);

  const statCards = [
    {
      label: 'إجمالي التقديمات',
      value: stats.total,
      icon: Briefcase,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      label: 'قيد الانتظار',
      value: stats.pending,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
      borderColor: 'border-amber-200',
    },
    {
      label: 'المقابلات',
      value: stats.interview,
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      label: 'المقبولة',
      value: stats.accepted,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600',
      borderColor: 'border-green-200',
    },
    {
      label: 'المرفوضة',
      value: stats.rejected,
      icon: XCircle,
      color: 'bg-red-50 text-red-600',
      borderColor: 'border-red-200',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-8 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">متتبع وظائف LinkedIn</h1>
              <p className="text-primary-foreground/80">
                تابع جميع طلبات التوظيف الخاصة بك في مكان واحد
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="bg-accent text-accent-foreground hover:opacity-90"
            >
              <Plus className="mr-2 h-5 w-5" />
              إضافة وظيفة
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={index}
                className={`p-6 border-l-4 ${card.borderColor} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
                    <p className="text-3xl font-bold text-foreground">{card.value}</p>
                  </div>
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <Icon size={24} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('all')}
            className="rounded-full"
          >
            الكل ({stats.total})
          </Button>
          <Button
            variant={selectedFilter === 'applied' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('applied')}
            className="rounded-full"
          >
            تم التقديم ({stats.applied})
          </Button>
          <Button
            variant={selectedFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('pending')}
            className="rounded-full"
          >
            قيد الانتظار ({stats.pending})
          </Button>
          <Button
            variant={selectedFilter === 'interview' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('interview')}
            className="rounded-full"
          >
            مقابلات ({stats.interview})
          </Button>
          <Button
            variant={selectedFilter === 'accepted' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('accepted')}
            className="rounded-full"
          >
            مقبول ({stats.accepted})
          </Button>
          <Button
            variant={selectedFilter === 'rejected' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('rejected')}
            className="rounded-full"
          >
            مرفوض ({stats.rejected})
          </Button>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="col-span-full text-center py-12">
              <Briefcase size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">
                {selectedFilter === 'all'
                  ? 'لا توجد وظائف حتى الآن. ابدأ بإضافة وظيفة جديدة!'
                  : `لا توجد وظائف في حالة \"${
                      selectedFilter === 'applied'
                        ? 'تم التقديم'
                        : selectedFilter === 'pending'
                          ? 'قيد الانتظار'
                          : selectedFilter === 'interview'
                            ? 'مقابلة'
                            : selectedFilter === 'accepted'
                              ? 'مقبول'
                              : 'مرفوض'
                    }\"`}
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
