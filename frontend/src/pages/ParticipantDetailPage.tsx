import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UserCheck, Calendar, Shield, Activity, User, Copy, Check } from 'lucide-react';
import { Participant } from '../types';
import { getParticipantApi } from '../api/participants';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const ParticipantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchParticipant = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getParticipantApi(id);
      setParticipant(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve participant record';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipant();
  }, [id]);

  const handleCopyId = () => {
    if (participant) {
      navigator.clipboard.writeText(participant.participant_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Retrieving participant record..." />;
  }

  if (error || !participant) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/participants')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Participants
        </button>
        <ErrorMessage
          message={error || 'Participant record not found.'}
          onRetry={fetchParticipant}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb / Back button */}
      <div>
        <Link
          to="/participants"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Participants List
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
              <UserCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Participant {participant.subject_id}
                </h1>
                <StatusBadge status={participant.status} />
              </div>
              <p className="text-xs text-slate-500">Subject Profile & Protocol Details</p>
            </div>
          </div>
          <div>
            <StatusBadge studyGroup={participant.study_group} />
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 space-y-6">
          {/* UUID identifier box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Participant UUID
              </span>
              <code className="text-sm font-mono text-slate-800">{participant.participant_id}</code>
            </div>
            <button
              onClick={handleCopyId}
              className="self-start sm:self-center inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy UUID</span>
                </>
              )}
            </button>
          </div>

          {/* Key fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Study Arm</p>
                <p className="text-base font-bold text-slate-900 capitalize mt-0.5">
                  {participant.study_group}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Trial Status</p>
                <p className="text-base font-bold text-slate-900 capitalize mt-0.5">
                  {participant.status}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Enrollment Date</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  {participant.enrollment_date}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Demographics</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  {participant.age} Years Old • Gender {participant.gender}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
