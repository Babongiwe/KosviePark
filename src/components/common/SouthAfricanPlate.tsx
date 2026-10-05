import React from 'react';

interface SouthAfricanPlateProps {
  plateNumber: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'standard' | 'free-state' | 'gauteng';
  isAlert?: boolean;
}

export const SouthAfricanPlate: React.FC<SouthAfricanPlateProps> = ({
  plateNumber = 'FSK 123 GP',
  size = 'md',
  variant = 'free-state',
  isAlert = false,
}) => {
  const safePlateNumber = plateNumber || 'FSK 123 GP';

  const sizeMap = {
    sm: 'text-xs px-2 py-0.5 min-w-[90px]',
    md: 'text-sm px-3 py-1 min-w-[120px]',
    lg: 'text-base px-4 py-1.5 min-w-[160px] font-bold',
    xl: 'text-2xl px-6 py-2.5 min-w-[220px] font-extrabold tracking-wider',
  };

  const getProvinceText = () => {
    const upper = safePlateNumber.toUpperCase();
    if (upper.endsWith('FS') || variant === 'free-state') return 'FREE STATE';
    if (upper.endsWith('GP')) return 'GAUTENG';
    if (upper.endsWith('NC')) return 'NORTHERN CAPE';
    if (upper.endsWith('WC') || upper.startsWith('CA') || upper.startsWith('CAA')) return 'WESTERN CAPE';
    return 'SOUTH AFRICA';
  };

  return (
    <div
      className={`inline-flex items-center justify-between border-2 rounded ${
        isAlert
          ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-sm'
          : 'bg-white border-slate-900 text-slate-900 shadow-sm'
      } font-mono-plate font-bold select-none ${sizeMap[size]}`}
      style={{
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      {/* South Africa Emblem / Cheetah Badge placeholder */}
      <div className="flex items-center gap-1 opacity-75">
        <span className="text-[10px] uppercase font-sans font-bold tracking-tight text-blue-900">
          🇿🇦
        </span>
      </div>

      {/* Main Plate Number */}
      <div className="mx-2 text-center tracking-wider">{safePlateNumber.toUpperCase()}</div>

    </div>
  );
};
