import React, { useState, useEffect } from 'react';
import { useExpenses } from '../../context/authcontext/expensecontext.jsx'; // Import useExpenses context
import { useBins } from '../../context/authcontext/binscontext.jsx';
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
const getWeekDays = (referenceDate = new Date()) => { // Added referenceDate parameter
    const today = new Date(referenceDate); // Use the reference date
    today.setHours(0,0,0,0); // Normalize to start of day (important for daily comparisons)
    const currentDayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDayOfWeek); // Go back to Sunday at 00:00:00

    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        days.push(date); // Add the Date object for each day
    }
    return days; // Returns an array of Date objects for Sun, Mon, ..., Sat
};

export default function HomePage() {
    // Get expenses from context
    const { expenses } = useExpenses();
    const { bins } = useBins();

    const [currentWeekDates, setCurrentWeekDates] = useState([]);
    const [dynamicBarData, setDynamicBarData] = useState({
        labels: [],
        datasets: []
    });
    const [expenseHistoryItems, setExpenseHistoryItems] = useState([]);

    // Function to calculate daily totals from actual expenses
    const calculateDailyTotalsFromExpenses = (allExpenses, weekDates) => {
        const dailyTotals = Array(7).fill(0); // Initialize with 0 for each day
        const weekStartMs = weekDates[0].getTime();
        // End of Saturday (inclusive)
        const weekEndMs = weekDates[6].getTime() + (24 * 60 * 60 * 1000) - 1;

        allExpenses.forEach(exp => {
            const expenseDate = new Date(exp.date); // Convert ISO string back to Date object
            const expenseTimeMs = expenseDate.getTime();

            // Check if expense falls within the current week
            if (expenseTimeMs >= weekStartMs && expenseTimeMs <= weekEndMs) {
                const dayOfWeek = expenseDate.getDay(); // 0 for Sun, 1 for Mon, etc.
                dailyTotals[dayOfWeek] += exp.amount;
            }
        });
        return dailyTotals;
    };

    // Use useEffect to react to changes in 'expenses'
    useEffect(() => {
        const weekDates = getWeekDays(); // Get current week dates
        setCurrentWeekDates(weekDates);

        // Filter and process expenses for the bar chart
        const spendingValues = calculateDailyTotalsFromExpenses(expenses, weekDates);
        const dailySpendingTarget = 50; // Your test value for the dotted line

        const newBarData = {
            labels: weekDates.map(date => date.toDateString()), // Use full date string as internal label
            datasets: [
                {
                    type: 'bar',
                    label: 'Daily Spending',
                    data: spendingValues, // Use calculated totals
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

        // Prepare data for Expense History: Get 3 most recent transactions
        const sortedTransactions = [...expenses].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB.getTime() - dateA.getTime(); // Sort descending (most recent first)
        });
        setExpenseHistoryItems(sortedTransactions.slice(0, 3)); // Get top 3
    }, [expenses]); // IMPORTANT: Add 'expenses' to dependency array so it re-runs when expenses change

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
                    // X-axis labels
                    callback: function(value, index, ticks) {
                        const date = currentWeekDates[index];
                        if (date) {
                            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                            const monthDate = formatDateShort(date); // e.g., "Jul 27"
                            return [dayName, monthDate]; // Multiline label
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

                {/* Left Panel: Daily Spending & Expense History */}
                <div className="flex flex-col gap-5 md:w-1/3 lg:w-1/4">

                    {/* Daily Spending */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-blue-700 pb-3 mb-4 border-b border-gray-200">Daily Spend</h2>

                        {/* Calculate and display today's total spending based on 'expenses' */}
                        <p className="text-3xl font-bold text-gray-900 mb-2">
                          ${(expenses
                                .filter(exp => new Date(exp.date).toDateString() === new Date().toDateString())
                                .reduce((sum, exp) => sum + exp.amount, 0)
                            ).toFixed(2)}
                        </p>
                        <p className="text-gray-600 text-lg">Total spending for today.</p>
                    </div>

                    {/* Expense History */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-blue-700 pb-3 mb-4 border-b border-gray-200">Expense History</h2>
                        <ul className="list-none p-0 m-0">

                            {/* Dynamically rendered Expense History Items */}
                            {expenseHistoryItems.length > 0 ? (
                                expenseHistoryItems.map((item, index) => (
                                    // Use a unique key. If your expensecontext.jsx was updated with 'id', use item.id
                                    <li key={item.id || `${item.name}-${item.amount}-${item.date}`}
                                        className={`py-2 ${index < expenseHistoryItems.length -1 ? 'border-b border-dashed border-gray-200' : ''} text-lg`}>
                                        <span className="font-semibold">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}:</span> {item.name} - <span className="font-bold">${item.amount.toFixed(2)}</span>
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

                {/* Right Panel: Bins Button & Pie Chart */}
                <div className="flex flex-col gap-5 md:w-1/3 lg:w-1/4">


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