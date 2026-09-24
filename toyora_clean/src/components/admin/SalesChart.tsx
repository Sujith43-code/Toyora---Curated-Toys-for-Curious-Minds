import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, DollarSign, ShoppingBag } from 'lucide-react';

type TimeRange = '7d' | '30d' | '90d';

interface DataPoint {
  label: string;
  revenue: number;
  orders: number;
}

const DATA_7D: DataPoint[] = [
  { label: 'Mon', revenue: 12400, orders: 11 },
  { label: 'Tue', revenue: 18900, orders: 16 },
  { label: 'Wed', revenue: 15200, orders: 14 },
  { label: 'Thu', revenue: 22800, orders: 19 },
  { label: 'Fri', revenue: 31500, orders: 27 },
  { label: 'Sat', revenue: 42100, orders: 36 },
  { label: 'Sun', revenue: 38700, orders: 32 },
];

const DATA_30D: DataPoint[] = [
  { label: 'Week 1', revenue: 112000, orders: 88 },
  { label: 'Week 2', revenue: 145000, orders: 112 },
  { label: 'Week 3', revenue: 182000, orders: 140 },
  { label: 'Week 4', revenue: 198000, orders: 156 },
];

const DATA_90D: DataPoint[] = [
  { label: 'Jul', revenue: 480000, orders: 390 },
  { label: 'Aug', revenue: 590000, orders: 470 },
  { label: 'Sep', revenue: 637000, orders: 512 },
];

export const SalesChart: React.FC = () => {
  const [range, setRange] = useState<TimeRange>('7d');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const data = range === '7d' ? DATA_7D : range === '30d' ? DATA_30D : DATA_90D;
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1000);

  const totalRangeRevenue = data.reduce((acc, d) => acc + d.revenue, 0);
  const totalRangeOrders = data.reduce((acc, d) => acc + d.orders, 0);
  const avgOrderValue = totalRangeOrders > 0 ? Math.round(totalRangeRevenue / totalRangeOrders) : 0;

  // Chart dimensions
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const points = data.map((d, index) => {
    const x = paddingX + (index / Math.max(1, data.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - (d.revenue / maxRevenue) * chartHeight;
    return { x, y, ...d };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  const areaPoints = `${paddingX},${paddingY + chartHeight} ${polylinePoints} ${paddingX + chartWidth},${paddingY + chartHeight}`;

  return (
    <div className="bg-white rounded-2xl border border-[#E9E6DC] p-5 space-y-5 shadow-2xs">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F4F2EA]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-base text-[#19191B]">Store Sales Overview</h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> +18.4%
            </span>
          </div>
          <p className="text-xs text-[#7A7A80]">Revenue trends and daily order volumes</p>
        </div>

        {/* Range selector pill */}
        <div className="inline-flex items-center p-1 bg-[#FAF9F5] rounded-xl border border-[#E9E6DC] text-xs font-semibold self-start sm:self-auto">
          {(['7d', '30d', '90d'] as TimeRange[]).map(r => (
            <button
              key={r}
              onClick={() => {
                setRange(r);
                setHoveredIdx(null);
              }}
              className={`px-3 py-1 rounded-lg transition-colors ${
                range === r ? 'bg-[#19191B] text-white font-bold shadow-2xs' : 'text-[#7A7A80] hover:text-[#19191B]'
              }`}
            >
              {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Strips */}
      <div className="grid grid-cols-3 gap-3 bg-[#FAF9F5] p-3 rounded-xl border border-[#E9E6DC] text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#7A7A80]">Period Revenue</span>
          <div className="font-display font-bold text-sm sm:text-base text-[#19191B]">
            ₹{totalRangeRevenue.toLocaleString('en-IN')}
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-[#7A7A80]">Total Orders</span>
          <div className="font-display font-bold text-sm sm:text-base text-[#19191B]">
            {totalRangeOrders} orders
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-[#7A7A80]">Avg Order Value</span>
          <div className="font-display font-bold text-sm sm:text-base text-[#D85A38]">
            ₹{avgOrderValue.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D85A38" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#D85A38" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingY + chartHeight * ratio;
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={y}
                x2={svgWidth - paddingX}
                y2={y}
                stroke="#E9E6DC"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
            );
          })}

          {/* Area Fill */}
          <polygon points={areaPoints} fill="url(#revenueGradient)" />

          {/* Line */}
          <polyline
            fill="none"
            stroke="#D85A38"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />

          {/* Interactive Data Nodes */}
          {points.map((p, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)}>
                {/* Outer halo on hover */}
                {isHovered && (
                  <circle cx={p.x} cy={p.y} r="8" fill="#D85A38" fillOpacity="0.2" />
                )}
                {/* Node circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? '5' : '3.5'}
                  fill={isHovered ? '#D85A38' : '#19191B'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />
                {/* X Axis Label */}
                <text
                  x={p.x}
                  y={svgHeight - 8}
                  textAnchor="middle"
                  fill="#7A7A80"
                  fontSize="11"
                  fontWeight="600"
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Box */}
        {hoveredIdx !== null && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#19191B] text-white text-xs p-2.5 rounded-xl shadow-xl border border-[#2C2D30] flex items-center gap-3 animate-in fade-in zoom-in-95 duration-150 pointer-events-none z-10"
          >
            <div>
              <div className="text-[10px] font-bold text-[#A0A0A5] uppercase">
                {points[hoveredIdx].label}
              </div>
              <div className="font-display font-bold text-white text-sm">
                ₹{points[hoveredIdx].revenue.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="border-l border-[#3A3B40] pl-3 text-emerald-400 font-semibold">
              {points[hoveredIdx].orders} orders
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
