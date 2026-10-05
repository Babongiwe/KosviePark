import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'blue' | 'amber' | 'emerald' | 'purple' | 'rose';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
  onClick,
}) => {
  const colorMap = {
    blue: {
      iconBg: 'bg-blue-50 text-blue-700',
      border: 'border-blue-100 hover:border-blue-300',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-700',
      border: 'border-amber-100 hover:border-amber-300',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-700',
      border: 'border-emerald-100 hover:border-emerald-300',
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-700',
      border: 'border-purple-100 hover:border-purple-300',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-700',
      border: 'border-rose-100 hover:border-rose-300',
    },
  };

  const selectedColor = colorMap[color];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-5 border ${selectedColor.border} shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 font-heading tracking-tight">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${selectedColor.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs">
          <span className={trend.isPositive ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
            {trend.value}
          </span>
          <span className="text-slate-400">vs last cycle</span>
        </div>
      )}
    </div>
  );
};
