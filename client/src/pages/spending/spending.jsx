import { useState } from 'react';
import { useBins } from '../../context/authcontext/binscontext.jsx';
import { Pie } from 'react-chartjs-2'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BinsPage() {
    const { bins, addBin, removeBin } = useBins();
    const [binName, setBinName] = useState('');
    const [percentage, setPercentage] = useState('');

    const handleAddBin = () => {
        // Check if bin is named 
        if (binName.trim() == '') {
          alert('Bin must be named.')
          return
        }

        // Check if whole number between 1-100
        const percInt = Number(percentage);
        const isInteger = Number.isInteger(percInt);

        if (!isInteger || percInt < 1 || percInt > 100) {
          alert('Percentage must be a whole number between 1 and 100.');
          return;
        }

        // Ensure cumulative percent doesn't exceed 100
        const totalPercent = bins.reduce((sum, bin) => sum + bin.percentage, 0);
        const available = 100 - totalPercent;

        if (percInt > available) {
          alert(`Cannot add bin. Maximum allowed percentage is ${available}%.`);
          return;
        }

        // All checks successful, adding bin
        addBin(binName, percInt);
        setBinName('');
        setPercentage('');    
    };

    const totalPercent = bins.reduce((sum, bin) => sum + bin.percentage, 0);
    const remaining = Math.max(0, 100 - totalPercent);

    const data = {
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

    const options = {

        responsive: true,
        plugins: {
            legend: {
                desiplay: true,
                position: 'bottom',
            },

            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        return `${value}%`;
                    }
                }
            }
        }
    }

    return (

        <div className="min-h-screen p-8 flex flex-col md:flex-row font-sans bg-gray-100 text-gray-800 mt-5 gap-4">
          {/*Bin display and management*/}
            <div className="flex-1 max-w-xl w-full m-auto p-4 flex flex-col bg-white rounded-lg shadow-md">
                <h1 className="text-xl font-semibold text-blue-700 pb-3 mb-4 text-left border-b border-gray-200">Your Bins</h1>
                <ul className=" mb-4 space-y-2">
                    {bins.map((bin, idx) => (
                        <li key={idx} 
                            className={`flex justify-between mb-2 ${bins.length > 0 ? 
                            'border-b border-dashed border-gray-300 py-2 text-lg' : ''}`

                        }>
                            <span>{bin.name} - {bin.percentage}%</span>
                            <button
                                onClick={() => removeBin(bin.name)}
                                className="text-red-500 hover:underline">
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="flex flex-wrap gap-2 pb-2">

                    <input 
                        value={binName}
                        onChange={e => setBinName(e.target.value)}
                        placeholder="Bin Name"

                        className="border border-gray-200 p-2 rounded min-w-0 flex-grow"

                        maxLength={20}
                    />
                    <input
                        value={percentage}
                        onChange={e => setPercentage(e.target.value)}
                        placeholder="Percentage"
                        type="number"

                        className="border border-gray-200 p-2 rounded w-28"

                    />
                    <button
                        onClick={handleAddBin}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add Bin
                    </button>
                </div>
            </div>
            
            {/* pie chart */}

            <div className="flex-1 max-w-xl w-full m-auto p-4 rounded flex flex-col bg-white rounded-lg shadow-md">
                <h1 className="text-xl font-semibold text-blue-700 pb-3 mb-4 text-left border-b border-gray-200">Graph</h1>
                {bins.length > 0 ? (
                    <div className="w-80 h-80 mx-auto py-2">

                      <Pie data={data} options={options}/>
                    </div>
                ) : (
                    <p className="text-gray-500 text-lg">No bins to display</p>
                )}
            </div>
        </div>
    );
}