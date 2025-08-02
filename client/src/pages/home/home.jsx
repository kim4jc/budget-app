import React, { useState, useEffect } from 'react';
import { useBins } from '../../context/authcontext/binscontext.jsx';
import { useIncome } from '../../context/authcontext/incomecontext.jsx'; // Import the useIncome hook
import { Pie, Bar } from 'react-chartjs-2';
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

// Register Chart.js components
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

// Helper function to format date (e.g., "Jul 27")
const formatDateShort = (date) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
};

// Helper function to get days of the current week (Sunday to Saturday)
const getWeekDays = (referenceDate = new Date()) => {
    const today = new Date(referenceDate);
    today.setHours(0,0,0,0);
    const currentDayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        days.push(date);
    }
    return days;
};

export default function HomePage() {
    // We will now manage our own expenses state here, fetched directly from the API
    const [expenses, setExpenses] = useState([]);
    const { bins } = useBins();
    // NEW: Use the income context to get income data
    const { income } = useIncome();
    const [currentWeekDates, setCurrentWeekDates] = useState([]);
    const [dynamicBarData, setDynamicBarData] = useState({
        labels: [],
        datasets: []
    });
    const [expenseHistoryItems, setExpenseHistoryItems] = useState([]);

    // NEW STATE: Daily spending target, starting with a default value.
    const [dailySpendingTarget, setDailySpendingTarget] = useState(50);
    // NEW STATE: Calculate and store the total savings
    const [totalSavings, setTotalSavings] = useState(0);

    // Function to calculate daily totals from actual expenses
    const calculateDailyTotalsFromExpenses = (allExpenses, weekDates) => {
        const dailyTotals = Array(7).fill(0);
        const weekStartMs = weekDates[0].getTime();
        const weekEndMs = weekDates[6].getTime() + (24 * 60 * 60 * 1000) - 1;

        allExpenses.forEach(exp => {
            const expenseDate = new Date(exp.createdAt);
            const expenseTimeMs = expenseDate.getTime();

            if (expenseTimeMs >= weekStartMs && expenseTimeMs <= weekEndMs) {
                const dayOfWeek = expenseDate.getDay();
                dailyTotals[dayOfWeek] += exp.amount;
            }
        });
        return dailyTotals;
    };

    // useEffect to fetch expenses from the API once on mount
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch expenses');
                }

                const data = await response.json();
                setExpenses(data); // Set the local expenses state

                // Prepare data for Expense History: Get 3 most recent transactions
                const sortedTransactions = [...data].sort((a, b) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return dateB.getTime() - dateA.getTime();
                });
                setExpenseHistoryItems(sortedTransactions.slice(0, 3));

            } catch (err) {
                console.error('Error fetching and processing expenses:', err);
                // Optionally, handle error state for the user
            }
        };

        fetchExpenses();
    }, []); // Empty dependency array means this runs only once on mount

    // NEW useEffect: This will re-run whenever 'expenses', 'income', or 'dailySpendingTarget' changes
    useEffect(() => {
        // Calculate total savings
        const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        setTotalSavings(totalIncome - totalExpenses);

        const weekDates = getWeekDays();
        setCurrentWeekDates(weekDates);

        const spendingValues = calculateDailyTotalsFromExpenses(expenses, weekDates);

        const newBarData = {
            labels: weekDates.map(date => date.toDateString()),
            datasets: [
                {
                    type: 'bar',
                    label: 'Daily Spending',
                    data: spendingValues,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
                {
                    type: 'line',
                    label: 'Spending Target',
                    data: Array(7).fill(dailySpendingTarget),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    tension: 0,
                }
            ]
        };
        setDynamicBarData(newBarData);
    }, [expenses, dailySpendingTarget, income]); // Added 'income' to the dependency array

    // --- Pie Chart Data and Options (unchanged) ---
    const totalPercent = bins.reduce((sum, bin) => sum + bin.percentage, 0);
    const remaining = Math.max(0, 100 - totalPercent);

    const pieData = {
        labels: [
            ...bins.map(bin => bin.name),
            ...(remaining > 0 ? ['Remaining'] : [])
        ],
        datasets: [
            {
                data: [
                    ...bins.map(bin => bin.percentage),
                    ...(remaining > 0 ? [remaining] : [])
                ],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ],
                borderColor: '#fff',
                borderWidth: 1,
            },
        ]
    };

    const pieOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        return `${value}%`;
                    }
                }
            },
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 20,
                }
            },
            title: {
                display: true,
                text: 'Spending Allocation',
                font: {
                    size: 18
                },
                padding: {
                    top: 10,
                    bottom: 20
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    const barOptions = {
        plugins: {
            title: {
                display: true,
                text: 'Daily Spending Overview',
                font: {
                    size: 18
                },
                padding: {
                    top: 10,
                    bottom: 20
                }
            },
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Day of the Week'
                },
                ticks: {
                    callback: function(value, index, ticks) {
                        const date = currentWeekDates[index];
                        if (date) {
                            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                            const monthDate = formatDateShort(date);
                            return [dayName, monthDate];
                        }
                        return '';
                    }
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Spending ($)'
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
            {/* Main Content */}
            <div className="flex flex-col md:flex-row p-5 gap-5 max-w-7xl mx-auto mt-5">

                {/* Left Panel: Daily Spending, Spending Target & Expense History */}
                <div className="flex flex-col gap-5 md:w-1/3 lg:w-1/4">

                    {/* NEW: Daily Spending field - MOVED FROM RIGHT PANEL */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-blue-700 pb-3 mb-4 border-b border-gray-200">Daily Spend</h2>
                        <p className="text-3xl font-bold text-gray-900 mb-2">
                          ${(expenses
                                .filter(exp => new Date(exp.createdAt).toDateString() === new Date().toDateString())
                                .reduce((sum, exp) => sum + exp.amount, 0)
                            ).toFixed(2)}
                        </p>
                        <p className="text-gray-600 text-lg">Total spending for today.</p>
                    </div>

                    {/* Daily Spending Target */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-blue-700 pb-3 mb-4 border-b border-gray-200">Daily Spending Target</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl text-gray-800 font-bold">$</span>
                            <input
                                type="number"
                                value={dailySpendingTarget}
                                onChange={(e) => setDailySpendingTarget(parseFloat(e.target.value))}
                                className="border border-gray-200 p-2 rounded w-full text-2xl"
                                placeholder="e.g. 50"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Expense History */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-blue-700 pb-3 mb-4 border-b border-gray-200">Expense History</h2>
                        <ul className="list-none p-0 m-0">
                            {expenseHistoryItems.length > 0 ? (
                                expenseHistoryItems.map((item, index) => (
                                    <li key={item.id}
                                        className={`py-2 ${index < expenseHistoryItems.length -1 ? 'border-b border-dashed border-gray-200' : ''} text-lg`}>
                                        <span className="font-semibold">{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}:</span> {item.name} - <span className="font-bold">${item.amount.toFixed(2)}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-500 text-lg">No recent expenses to display.</li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Center Panel: Bar Chart */}
                <div className="flex-grow bg-white p-6 rounded-lg shadow-md flex justify-center items-center min-h-[300px]">
                    <div className="w-full h-full max-w-2xl max-h-[400px]">
                        {dynamicBarData.labels.length > 0 && dynamicBarData.datasets.length > 0 ? (
                            <Bar data={dynamicBarData} options={barOptions} />
                        ) : (
                            <p className="text-xl text-gray-500">Add expenses to see your spending history!</p>
                        )}
                    </div>
                </div>

                {/* Right Panel: Savings & Pie Chart */}
                <div className="flex flex-col gap-5 md:w-1/3 lg:w-1/4">

                    {/* MOVED: Savings Field - MOVED FROM LEFT PANEL */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-blue-700 pb-3 mb-4 border-b border-gray-200">Savings</h2>
                        <p className="text-3xl font-bold text-gray-900 mb-2">
                           ${totalSavings.toFixed(2)}
                        </p>
                        <p className="text-gray-600 text-lg">Your current total balance.</p>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md flex justify-center items-center min-h-[300px]">
                        {bins.length > 0 || remaining > 0 ? (
                            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                                <Pie data={pieData} options={pieOptions} />
                            </div>
                        ) : (
                            <p className="text-gray-500 text-lg">No bins to display</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
