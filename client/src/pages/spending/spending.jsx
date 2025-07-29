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
        plugins: {
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
        <div className="h-screen w-full flex flex-col md:flex-row p-4 gap-4">
          {/*Bin display and management*/}
            <div className="flex-1 max-w-xl w-full m-auto border-2 p-4 rounded bg-gray-100 flex flex-col">
                <h1 className="text-2xl font-bold mb-4 text-center">Your Bins</h1>
                <ul className="flex-1 mb-4 space-y-2">
                    {bins.map((bin, idx) => (
                        <li key={idx} 
                            className={`flex justify-between mb-2 ${bins.length > 0 ? 
                            'border pd-2 px-2 rounded' : ''}`
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
                <div className="flex flex-wrap gap-2">
                    <input 
                        value={binName}
                        onChange={e => setBinName(e.target.value)}
                        placeholder="Bin Name"
                        className="border p-2 rounded flex-1"
                        maxLength={20}
                    />
                    <input
                        value={percentage}
                        onChange={e => setPercentage(e.target.value)}
                        placeholder="Percentage"
                        type="number"
                        className="border p-2 rounded w-28"
                    />
                    <button
                        onClick={handleAddBin}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add Bin
                    </button>
                </div>
            </div>
            
            {/* pie chart */}
            <div className="flex-1 max-w-xl w-full m-auto p-4 rounded flex items-center justify-center">
                {bins.length > 0 ? (
                    <div className="w-80 h-80">
                      <Pie data={data} options={options}/>
                    </div>
                ) : (
                    <p className="text-gray-500 text-lg">No bins to display</p>
                )}
            </div>
        </div>
    );
}