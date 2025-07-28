import React from 'react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-800">

            {/* Main Content */}
            <div className="flex flex-col md:flex-row p-5 gap-5 max-w-7xl mx-auto mt-5">

                {/* Left Panel: Daily Spending & Expense History */}
                <div className="flex flex-col gap-5 md:w-1/3 lg:w-1/4">

                    {/* Daily Spending */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-blue-700 pb-3 mb-4 border-b border-gray-200">Daily Spend</h2>
                        {/* Placeholder data */}
                        <p className="text-3xl font-bold text-gray-900 mb-2">$XX.XX</p>
                        <p className="text-gray-600 text-lg">Some details about today's spending.</p>
                    </div>

                    {/* Expense History */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-blue-700 pb-3 mb-4 border-b border-gray-200">Expense History</h2>
                        <ul className="list-none p-0 m-0">
                            {/* Placeholder Data */}
                            <li className="py-2 border-b border-dashed border-gray-200 text-lg">July 27, 2025: Groceries - $45.00</li>
                            <li className="py-2 border-b border-dashed border-gray-200 text-lg">July 26, 2025: Coffee - $5.50</li>
                            <li className="py-2 text-lg">July 25, 2025: Dinner Out - $35.75</li>
                        </ul>
                    </div>
                </div>

                {/* Center Panel: Bar Chart */}
                <div className="flex-grow bg-white p-6 rounded-lg shadow-md flex justify-center items-center min-h-[300px]">
                    {/* In a real app, a charting library component would go here */}
                    <p className="text-xl text-gray-500">Bar Chart</p>
                    {/* <BarChartComponent data={otherData} /> */}
                </div>

                {/* Right Panel: Bins Button & Pie Chart */}
                <div className="flex flex-col gap-5 md:w-1/3 lg:w-1/4">

                    {/* Bins Button */}
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <button className="w-full py-4 text-2xl font-bold bg-green-500 text-white rounded-md shadow-lg hover:bg-green-600 transition duration-300">
                            Bins
                        </button>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md flex justify-center items-center min-h-[300px]">
                        {/* In a real app, a charting library component would go here */}
                        <p className="text-xl text-gray-500">Pie Chart</p>
                        {/* <PieChartComponent data={otherData} /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}