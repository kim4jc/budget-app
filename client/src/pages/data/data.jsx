import React, { useMemo } from 'react';
import { useExpenses } from '../../context/authcontext/expensecontext.jsx';
import { useIncome } from '../../context/authcontext/incomecontext.jsx';
import { useBins } from '../../context/authcontext/binscontext.jsx';

import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

export default function DataPage() {
  const { expenses } = useExpenses();
  const { income } = useIncome();
  const { bins } = useBins();

  const totals = useMemo(() => {
    const totalIncome = (income ?? []).reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
    const totalExpenses = (expenses ?? []).reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
    const net = totalIncome - totalExpenses;
    const binPct = (bins ?? []).reduce((s, b) => s + (parseFloat(b.percentage) || 0), 0);
    const remainingPct = Math.max(0, 100 - binPct);
    return { totalIncome, totalExpenses, net, binPct, remainingPct };
  }, [income, expenses, bins]);

  const incomeVsExpenseBar = useMemo(() => ({
    labels: ['Income', 'Expenses', 'Net'],
    datasets: [{ label: 'Amount ($)', data: [totals.totalIncome, totals.totalExpenses, totals.net], borderWidth: 1 }]
  }), [totals]);

  const cashflowLine = useMemo(() => {
    const tx = [
      ...(income ?? []).map(i => ({ label: i.name || 'Income', amount: parseFloat(i.amount) || 0 })),
      ...(expenses ?? []).map(e => ({ label: e.name || 'Expense', amount: -(parseFloat(e.amount) || 0) }))
    ];
    const labels = tx.map((t, idx) => `${idx + 1}. ${t.label}`);
    let running = 0;
    const data = tx.map(t => (running += t.amount));
    return { labels, datasets: [{ label: 'Cumulative Balance ($)', data, fill: false, tension: 0.2, borderWidth: 2, pointRadius: 3 }] };
  }, [income, expenses]);

  const binsTargetBar = useMemo(() => ({
    labels: (bins ?? []).map(b => b.name),
    datasets: [{ label: 'Target Amount ($) per Bin', data: (bins ?? []).map(b => ((parseFloat(b.percentage) || 0) / 100) * totals.totalIncome), borderWidth: 1 }]
  }), [bins, totals.totalIncome]);

  const iePie = useMemo(() => ({
    labels: ['Income', 'Expenses'],
    datasets: [{ data: [Math.max(totals.totalIncome, 0.0001), Math.max(totals.totalExpenses, 0)] }]
  }), [totals]);

  const commonOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, tooltip: { enabled: true } } };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Data</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4"><h3 className="text-sm text-gray-500">Total Income</h3><p className="text-2xl font-semibold">${totals.totalIncome.toFixed(2)}</p></div>
        <div className="bg-white rounded-lg shadow-md p-4"><h3 className="text-sm text-gray-500">Total Expenses</h3><p className="text-2xl font-semibold">${totals.totalExpenses.toFixed(2)}</p></div>
        <div className="bg-white rounded-lg shadow-md p-4"><h3 className="text-sm text-gray-500">Net</h3><p className={`text-2xl font-semibold ${totals.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>${totals.net.toFixed(2)}</p></div>
        <div className="bg-white rounded-lg shadow-md p-4"><h3 className="text-sm text-gray-500">Bins Coverage</h3><p className="text-lg">{totals.binPct.toFixed(0)}% allocated{totals.remainingPct > 0 ? `, ${totals.remainingPct.toFixed(0)}% remaining` : ''}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md min-h-[360px]"><h2 className="text-lg font-semibold mb-4">Income vs Expenses</h2><div className="h-[280px]"><Bar data={incomeVsExpenseBar} options={commonOptions} /></div></div>
        <div className="bg-white p-6 rounded-lg shadow-md min-h-[360px]"><h2 className="text-lg font-semibold mb-4">Cumulative Balance</h2><div className="h-[280px]"><Line data={cashflowLine} options={commonOptions} /></div></div>
        <div className="bg-white p-6 rounded-lg shadow-md min-h-[360px]"><h2 className="text-lg font-semibold mb-4">Bin Targets (based on income)</h2>{(bins ?? []).length > 0 && totals.totalIncome > 0 ? (<div className="h-[280px]"><Bar data={binsTargetBar} options={commonOptions} /></div>) : (<p className="text-gray-500">Add income and bins to see targets.</p>)}</div>
        <div className="bg-white p-6 rounded-lg shadow-md min-h-[360px]"><h2 className="text-lg font-semibold mb-4">Income vs Expense Share</h2><div className="h-[280px] flex items-center justify-center">{totals.totalIncome + totals.totalExpenses > 0 ? (<div className="w-64 h-64"><Pie data={iePie} options={commonOptions} /></div>) : (<p className="text-gray-500">No data yet.</p>)}</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Income</h2>
          {(income ?? []).length === 0 ? <p className="text-gray-500">No income items.</p> : (
            <table className="w-full text-left"><thead><tr className="text-gray-500"><th className="py-2">Name</th><th className="py-2">Amount ($)</th></tr></thead>
              <tbody>{income.map((i, idx) => (<tr key={idx} className="border-t"><td className="py-2">{i.name}</td><td className="py-2">{Number(i.amount).toFixed(2)}</td></tr>))}</tbody>
            </table>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Expenses</h2>
          {(expenses ?? []).length === 0 ? <p className="text-gray-500">No expenses yet.</p> : (
            <table className="w-full text-left"><thead><tr className="text-gray-500"><th className="py-2">Name</th><th className="py-2">Amount ($)</th></tr></thead>
              <tbody>{expenses.map((e, idx) => (<tr key={idx} className="border-t"><td className="py-2">{e.name}</td><td className="py-2">{Number(e.amount).toFixed(2)}</td></tr>))}</tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
