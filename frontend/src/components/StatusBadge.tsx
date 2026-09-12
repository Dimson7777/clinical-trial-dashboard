import React from 'react';
import { ParticipantStatus, StudyGroup, Gender } from '../types';

interface StatusBadgeProps {
  status?: ParticipantStatus | string;
  studyGroup?: StudyGroup | string;
  gender?: Gender | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, studyGroup, gender }) => {
  if (status) {
    const statusMap: Record<string, { label: string; bg: string; text: string; dot: string }> = {
      active: { label: 'Active', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
      completed: { label: 'Completed', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
      withdrawn: { label: 'Withdrawn', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
    };
    const config = statusMap[status.toLowerCase()] || {
      label: status,
      bg: 'bg-slate-50 border-slate-200',
      text: 'text-slate-700',
      dot: 'bg-slate-400',
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    );
  }

  if (studyGroup) {
    const isTreatment = studyGroup.toLowerCase() === 'treatment';
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider border ${
          isTreatment
            ? 'bg-purple-50 text-purple-700 border-purple-200'
            : 'bg-teal-50 text-teal-700 border-teal-200'
        }`}
      >
        {studyGroup}
      </span>
    );
  }

  if (gender) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
        {gender}
      </span>
    );
  }

  return null;
};
