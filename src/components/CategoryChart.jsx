import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORY_META } from '../constants/categories';

export default function CategoryChart({ expenses = [] }) {
  const [activeType, setActiveType] = useState('expense'); // 'expense' or 'income'
  const [activeIndex, setActiveIndex] = useState(null);

  // Group and sum categories by selected type
  const targetExpenses = expenses.filter(exp => 
    activeType === 'income' ? exp.type === 'income' : (exp.type === 'expense' || !exp.type)
  );

  const categoryMap = targetExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {});

  const chartData = Object.entries(categoryMap)
    .filter(([_, val]) => val > 0)
    .map(([category, value]) => ({
      name: category,
      value: Number(value.toFixed(2)),
      color: CATEGORY_META[category]?.chartColor || "#64748B"
    }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="rounded-xl border border-slate-850 bg-slate-950/90 p-3 shadow-xl backdrop-blur-md">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{data.name}</p>
          <p className="mt-1 text-base font-bold text-slate-100">₹{data.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-xs text-emerald-450 font-medium">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative flex flex-col items-stretch rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg shadow-slate-950/20">
      
      {/* Header controls for chart type */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-4 mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {activeType === 'income' ? 'Income Share' : 'Spending Share'}
        </span>
        
        {/* Toggle tabs */}
        <div className="flex bg-slate-950/80 rounded-lg p-0.5 border border-slate-800/50">
          <button
            onClick={() => { setActiveType('expense'); setActiveIndex(null); }}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              activeType === 'expense'
                ? 'bg-rose-500/15 border border-rose-500/20 text-rose-400'
                : 'text-slate-450 hover:text-slate-200'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => { setActiveType('income'); setActiveIndex(null); }}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              activeType === 'income'
                ? 'bg-emerald-500/15 border border-emerald-500/20 text-emerald-400'
                : 'text-slate-450 hover:text-slate-200'
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-56 flex-col items-center justify-center text-center p-6">
          <div className="rounded-full bg-slate-800/30 p-3 text-slate-500">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <p className="mt-3 text-xs text-slate-400">No {activeType} records available for the selected filters.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
          {/* Chart container */}
          <div className="relative h-48 w-48 shrink-0">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] text-slate-450 uppercase tracking-widest font-semibold">
                {activeIndex !== null ? chartData[activeIndex].name : "Total"}
              </span>
              <span className="text-base font-bold text-slate-100 mt-0.5 tracking-tight transition-all duration-200">
                ₹{(activeIndex !== null ? chartData[activeIndex].value : total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {activeIndex !== null && (
                <span className="text-[10px] text-emerald-450 font-bold">
                  {((chartData[activeIndex].value / total) * 100).toFixed(0)}%
                </span>
              )}
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      style={{
                        filter: activeIndex === index ? `drop-shadow(0 0 6px ${entry.color}80)` : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        opacity: activeIndex === null || activeIndex === index ? 1 : 0.6,
                        transform: activeIndex === index ? 'scale(1.025)' : 'scale(1)',
                        transformOrigin: '50% 50%'
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend list */}
          <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2.5 w-full self-center">
            {chartData.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(0);
              return (
                <div 
                  key={item.name}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`flex items-center gap-2.5 p-1.5 rounded-xl border border-transparent transition-all duration-200 cursor-pointer ${
                    activeIndex === index 
                      ? 'bg-slate-800/40 border-slate-700/50 shadow-sm' 
                      : 'hover:bg-slate-800/15'
                  }`}
                >
                  <div 
                    className="h-2.5 w-2.5 shrink-0 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-slate-200 truncate leading-none">{item.name}</span>
                    <span className="text-[10px] text-slate-450 font-bold mt-1">
                      ₹{item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
