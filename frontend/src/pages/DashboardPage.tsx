import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Activity,
  CheckCircle2,
  AlertOctagon,
  Shield,
  Calendar,
  UserPlus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Metrics, Participant } from '../types';
import { getMetricsApi } from '../api/metrics';
import { getParticipantsApi } from '../api/participants';
import { MetricCard } from '../components/MetricCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { AddParticipantModal } from '../components/AddParticipantModal';
import { StatusBadge } from '../components/StatusBadge';

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [recentParticipants, setRecentParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [metricsData, participantsData] = await Promise.all([
        getMetricsApi(),
        getParticipantsApi(),
      ]);
      setMetrics(metricsData);
      setRecentParticipants(participantsData.slice(0, 5));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch trial metrics and data.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Calculating real-time trial metrics..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} onRetry={fetchData} />
      </div>
    );
  }

  if (!metrics) return null;

  const treatmentPct =
    metrics.total_participants > 0
      ? Math.round((metrics.treatment / metrics.total_participants) * 100)
      : 0;
  const controlPct =
    metrics.total_participants > 0
      ? Math.round((metrics.control / metrics.total_participants) * 100)
      : 0;

  const activePct =
    metrics.total_participants > 0
      ? Math.round((metrics.active / metrics.total_participants) * 100)
      : 0;
  const completedPct =
    metrics.total_participants > 0
      ? Math.round((metrics.completed / metrics.total_participants) * 100)
      : 0;
  const withdrawnPct =
    metrics.total_participants > 0
      ? Math.round((metrics.withdrawn / metrics.total_participants) * 100)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Trial Operations Overview</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              Live
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time enrollment, retention, and study arm distribution analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Enroll Participant
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Cohort"
          value={metrics.total_participants}
          subtitle="Enrolled trial participants"
          icon={Users}
          color="sky"
        />
        <MetricCard
          title="Active Participants"
          value={metrics.active}
          subtitle={`${activePct}% of current cohort`}
          icon={Activity}
          color="emerald"
        />
        <MetricCard
          title="Completed Protocol"
          value={metrics.completed}
          subtitle={`${completedPct}% study completion`}
          icon={CheckCircle2}
          color="blue"
        />
        <MetricCard
          title="Withdrawn"
          value={metrics.withdrawn}
          subtitle={`${withdrawnPct}% attrition rate`}
          icon={AlertOctagon}
          color="amber"
        />
      </div>

      {/* Secondary Metrics & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Group Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" />
              Study Arm Distribution
            </h2>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-purple-600" />
                  Treatment Arm
                </span>
                <span>
                  {metrics.treatment} ({treatmentPct}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${treatmentPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-teal-600" />
                  Control Arm
                </span>
                <span>
                  {metrics.control} ({controlPct}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-teal-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${controlPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
              <p className="text-xs text-purple-700 font-medium">Treatment</p>
              <p className="text-xl font-bold text-purple-900 mt-0.5">{metrics.treatment}</p>
            </div>
            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
              <p className="text-xs text-teal-700 font-medium">Control</p>
              <p className="text-xl font-bold text-teal-900 mt-0.5">{metrics.control}</p>
            </div>
          </div>
        </div>

        {/* Cohort Demographics */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-600" />
            Cohort Demographics
          </h2>

          <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-sky-700">Average Participant Age</p>
              <p className="text-3xl font-extrabold text-sky-950 mt-1">
                {metrics.average_age !== null ? `${metrics.average_age} yrs` : 'N/A'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-sky-100 text-sky-700">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-2 pt-2 text-xs text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Status Retention Rate</span>
              <span className="font-semibold text-slate-900">
                {metrics.total_participants > 0
                  ? `${Math.round(((metrics.active + metrics.completed) / metrics.total_participants) * 100)}%`
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Attrition Rate</span>
              <span className="font-semibold text-slate-900">{withdrawnPct}%</span>
            </div>
          </div>
        </div>

        {/* Recent Enrollments Quick List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Participants</h2>
            <button
              onClick={() => navigate('/participants')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentParticipants.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No participants enrolled yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentParticipants.map((p) => (
                <div key={p.participant_id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{p.subject_id}</p>
                    <p className="text-[11px] text-slate-400">{p.enrollment_date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge studyGroup={p.study_group} />
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Participant Modal */}
      <AddParticipantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchData();
        }}
      />
    </div>
  );
};
