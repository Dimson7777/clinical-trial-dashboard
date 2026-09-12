import React, { useState } from 'react';
import { X, Check, Copy, UserCheck, Calendar, Shield, Activity, User } from 'lucide-react';
import { Participant } from '../types';
import { StatusBadge } from './StatusBadge';

interface ParticipantDetailModalProps {
  participant: Participant | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ParticipantDetailModal: React.FC<ParticipantDetailModalProps> = ({
  participant,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !participant) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(participant.participant_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Participant {participant.subject_id}</h3>
                <StatusBadge status={participant.status} />
              </div>
              <p className="text-xs text-slate-500">Clinical Record & Trial Assignment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* UUID box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                System UUID (participant_id)
              </span>
              <button
                onClick={handleCopyId}
                className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-medium"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <code className="text-xs font-mono text-slate-800 break-all select-all">
              {participant.participant_id}
            </code>
          </div>

          {/* Grid of properties */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <Shield className="w-4 h-4 text-purple-500" />
                <span>Study Arm</span>
              </div>
              <StatusBadge studyGroup={participant.study_group} />
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>Trial Status</span>
              </div>
              <StatusBadge status={participant.status} />
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <Calendar className="w-4 h-4 text-sky-500" />
                <span>Enrollment Date</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">{participant.enrollment_date}</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <User className="w-4 h-4 text-amber-500" />
                <span>Demographics</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {participant.age} yrs • Gender {participant.gender}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
