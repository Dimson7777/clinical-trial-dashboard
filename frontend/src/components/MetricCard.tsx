import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number | null;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'sky' | 'emerald' | 'blue' | 'amber' | 'purple' | 'teal';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'sky',
}) => {
  const colorMap = {
    sky: {
      bg: 'bg-sky-50',
      iconBg: 'bg-sky-500',
      border: 'border-sky-100',
      text: 'text-sky-600',
    },
    emerald: {
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-500',
      border: 'border-emerald-100',
      text: 'text-emerald-600',
    },
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-500',
      border: 'border-blue-100',
      text: 'text-blue-600',
    },
    amber: {
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-500',
      border: 'border-amber-100',
      text: 'text-amber-600',
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-500',
      border: 'border-purple-100',
      text: 'text-purple-600',
    },
    teal: {
      bg: 'bg-teal-50',
      iconBg: 'bg-teal-500',
      border: 'border-teal-100',
      text: 'text-teal-600',
    },
  };

  const scheme = colorMap[color];

  return (
    <div className={`p-6 rounded-xl bg-white border ${scheme.border} shadow-xs hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`p-2.5 rounded-lg ${scheme.bg} text-${color}-600`}>
          <Icon className={`w-5 h-5 ${scheme.text}`} />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
          {value !== null && value !== undefined ? value : '—'}
        </h3>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
};
