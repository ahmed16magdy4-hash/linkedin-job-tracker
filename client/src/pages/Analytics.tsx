// Analytics Page
// Design: Modern Professional Analytics - Charts and insights for job tracking activity

import { useEffect, useState, useMemo } from 'react';
import { JobApplication, JobStats } from '@/types/job';
import { subscribeToJobs } from '@/lib/jobService';
import { Card } from '@/components/ui/card';
import {
  BarChart3,
  TrendingUp,
  Target,
  Zap,
  Calendar,
  Building2,
  Award,
  Activity,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { format, subDays, startOfWeek, eachDayOfInterval, eachWeekOfInterval, subMonths, isWithinInterval } from 'date-fns';
import { ar } from 'date-fns/locale';

const STATUS_COLORS: Record<string, string> = {
  applied: '#3B82F6',
  pending: '#F59E0B',
  interview: '#8B5CF6',
  accepted: '#10B981',
  rejected: '#EF4444',
};

const STATUS_LABELS: Record<string, string> = {
  applied: 'تم التقديم',
  pending: 'قيد الانتظار',
  interview: 'مقابلة',
  accepted: 'مقبول',
  rejected: 'مرفوض',
};

export default function Analytics() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToJobs(
      (updatedJobs) => setJobs(updatedJobs),
      (error) => console.error('Error loading jobs:', error)
    );
    return () => unsubscribe();
  }, []);

  // ===== Computed Data =====

  const stats: JobStats = useMemo(() => ({
    total: jobs.length,
    applied: jobs.filter((j) => j.status === 'applied').length,
    pending: jobs.filter((j) => j.status === 'pending').length,
    accepted: jobs.filter((j) => j.status === 'accepted').length,
    rejected: jobs.filter((j) => j.status === 'rejected').length,
    interview: jobs.filter((j) => j.status === 'interview').length,
  }), [jobs]);

  // Status distribution for pie chart
  const statusPieData = useMemo(() => {
    return Object.entries(STATUS_LABELS)
      .map(([key, label]) => ({
        name: label,
        value: jobs.filter((j) => j.status === key).length,
        color: STATUS_COLORS[key],
      }))
      .filter((d) => d.value > 0);
  }, [jobs]);

  // Applications over time (weekly)
  const weeklyData = useMemo(() => {
    if (jobs.length === 0) return [];
    const now = new Date();
    const start = subMonths(now, 3);
    const weeks = eachWeekOfInterval({ start, end: now }, { weekStartsOn: 6 });

    return weeks.map((weekStart) => {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const count = jobs.filter((j) => {
        const d = new Date(j.appliedDate);
        return isWithinInterval(d, { start: weekStart, end: weekEnd });
      }).length;
      return {
        week: format(weekStart, 'dd MMM', { locale: ar }),
        count,
      };
    });
  }, [jobs]);

  // Top companies
  const topCompanies = useMemo(() => {
    const companyMap: Record<string, number> = {};
    jobs.forEach((j) => {
      companyMap[j.companyName] = (companyMap[j.companyName] || 0) + 1;
    });
    return Object.entries(companyMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 7)
      .map(([name, count]) => ({ name, count }));
  }, [jobs]);

  // Activity heatmap (last 90 days)
  const heatmapData = useMemo(() => {
    const now = new Date();
    const start = subDays(now, 89);
    const days = eachDayOfInterval({ start, end: now });

    return days.map((day) => {
      const count = jobs.filter((j) => {
        const d = new Date(j.appliedDate);
        return format(d, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      }).length;
      return {
        date: day,
        count,
        label: format(day, 'dd MMM', { locale: ar }),
        dayOfWeek: day.getDay(),
      };
    });
  }, [jobs]);

  // Acceptance rate
  const acceptanceRate = useMemo(() => {
    const decided = stats.accepted + stats.rejected;
    if (decided === 0) return 0;
    return Math.round((stats.accepted / decided) * 100);
  }, [stats]);

  // Most active day
  const mostActiveDay = useMemo(() => {
    const dayMap: Record<string, number> = {};
    jobs.forEach((j) => {
      const day = format(new Date(j.appliedDate), 'EEEE', { locale: ar });
      dayMap[day] = (dayMap[day] || 0) + 1;
    });
    const sorted = Object.entries(dayMap).sort(([, a], [, b]) => b - a);
    return sorted[0]?.[0] || '-';
  }, [jobs]);

  // Quick stats cards
  const quickStats = [
    {
      label: 'إجمالي التقديمات',
      value: stats.total,
      icon: BarChart3,
      gradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      label: 'معدل القبول',
      value: `${acceptanceRate}%`,
      icon: Target,
      gradient: 'from-emerald-500 to-emerald-600',
      lightBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      label: 'المقابلات',
      value: stats.interview,
      icon: Award,
      gradient: 'from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50 dark:bg-purple-950/30',
    },
    {
      label: 'أنشط يوم',
      value: mostActiveDay,
      icon: Zap,
      gradient: 'from-amber-500 to-amber-600',
      lightBg: 'bg-amber-50 dark:bg-amber-950/30',
    },
  ];

  // Get heatmap intensity color
  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-muted/40 dark:bg-muted/20';
    if (count === 1) return 'bg-emerald-200 dark:bg-emerald-800';
    if (count === 2) return 'bg-emerald-300 dark:bg-emerald-700';
    if (count <= 4) return 'bg-emerald-400 dark:bg-emerald-600';
    return 'bg-emerald-500 dark:bg-emerald-500';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-accent/80 text-white py-10 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BarChart3 size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">التحليلات</h1>
              <p className="text-white/70 text-sm">تتبع نشاطك وأداءك في التقديم على الوظائف</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className={`${stat.lightBg} border-0 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`w-11 h-11 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon size={20} className="text-white" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Applications Over Time */}
          <Card className="lg:col-span-2 p-6 border-0 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-primary" />
              <h3 className="text-base font-bold text-foreground">التقديمات عبر الأسابيع</h3>
            </div>
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="التقديمات"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    fill="url(#colorCount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-muted-foreground">
                <p>لا توجد بيانات كافية بعد</p>
              </div>
            )}
          </Card>

          {/* Status Distribution */}
          <Card className="p-6 border-0 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Activity size={18} className="text-primary" />
              <h3 className="text-base font-bold text-foreground">توزيع الحالات</h3>
            </div>
            {statusPieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {statusPieData.map((entry, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-muted-foreground">{entry.name}</span>
                      </div>
                      <span className="font-semibold text-foreground">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-muted-foreground">
                <p>لا توجد بيانات</p>
              </div>
            )}
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Companies */}
          <Card className="p-6 border-0 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Building2 size={18} className="text-primary" />
              <h3 className="text-base font-bold text-foreground">أكثر الشركات تقديماً</h3>
            </div>
            {topCompanies.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topCompanies} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar
                    dataKey="count"
                    name="التقديمات"
                    fill="hsl(var(--primary))"
                    radius={[0, 6, 6, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-muted-foreground">
                <p>لا توجد بيانات</p>
              </div>
            )}
          </Card>

          {/* Activity Heatmap */}
          <Card className="p-6 border-0 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Calendar size={18} className="text-primary" />
              <h3 className="text-base font-bold text-foreground">نشاط التقديم (آخر 90 يوم)</h3>
            </div>
            <div className="flex flex-wrap gap-1">
              {heatmapData.map((day, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-sm ${getHeatmapColor(day.count)} transition-colors`}
                  title={`${day.label}: ${day.count} تقديم`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4 text-[10px] text-muted-foreground">
              <span>أقل</span>
              <div className="flex gap-0.5">
                <div className="w-3 h-3 rounded-sm bg-muted/40" />
                <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-800" />
                <div className="w-3 h-3 rounded-sm bg-emerald-300 dark:bg-emerald-700" />
                <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-600" />
                <div className="w-3 h-3 rounded-sm bg-emerald-500" />
              </div>
              <span>أكثر</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
