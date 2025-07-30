import { useState } from 'react';
import { useExpenses } from '../../context/authcontext/expensecontext.jsx';
import { useIncome } from '../../context/authcontext/incomecontext.jsx';

export default function ExpensesPage() {
    const { expenses, addExpense, removeExpense } = useExpenses();
    const { income, addIncome, removeIncome } = useIncome();

    const [expenseName, setExpenseName] = useState('');
    const [amount, setAmount] = useState('');
    const [incomeName, setIncomeName] = useState('');
    const [incomeAmount, setIncomeAmount] = useState('');

    // Validate and add income
    const handleAddIncome = () => {
        if(incomeName.trim() == '') {
            alert('Please enter a name for the income.');
            return;
        }

        const parsedAmount = parseFloat(incomeAmount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert('Please enter a valid positive income amount.');
            return;
        }

        addIncome(incomeName.trim(), parsedAmount.toFixed(2));
        setIncomeName('');
        setIncomeAmount('');
    };

    // Validate and add expense
    const handleAddExpense = () => {
        if (!expenseName.trim()) {
            alert('Please enter a name for the expense.');
            return;
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert('Please enter a valid positive expense amount.')
            return;
        }

        addExpense(expenseName.trim(), parsedAmount.toFixed(2));
        setExpenseName('');
        setAmount('');
    };

    return (

        <div className="flex flex-col md:flex-row bg-gray-100 font-sans min-h-screen p-8 mt-5 gap-4">
            {/* Income list */}
            <div className="flex-1 max-w-xl w-full m-auto p-4 flex flex-col bg-white rounded-lg shadow-md">
                <h1 className="text-xl font-semibold text-blue-700 pb-3 mb-4 text-left border-b border-gray-200">Income</h1>
                <ul className="flex-1 mb-4 space-y-2">
                    {income.map((inc, idx) => (
                        <li key={idx} 
                            className={`flex justify-between mb-2 ${income.length > 0 ? 

                            'border-b border-dashed border-gray-300 py-2 text-lg' : ''}`
                        }>
                            <span>{inc.name} ${inc.amount}</span>
                            <button
                                onClick={() => removeIncome(inc.name)}
                                className="text-red-500 hover:underline">
                                Remove
                            </button>
                          </li>
                    ))}
                </ul>
                {/* Income Input */}

                <div className="flex flex-wrap gap-2 pb-2">
                    <input
                        value={incomeName}
                        onChange={(e) => setIncomeName(e.target.value)}
                        placeholder="Income Name"

                        className="border border-gray-200 p-2 rounded min-w-0 flex-grow"
                        maxLength={20}
                    />
                    <input
                        value={incomeAmount}
                        onChange={(e) => setIncomeAmount(e.target.value)}
                        placeholder="Amount"
                        type="number"

                        className="border border-gray-200 p-2 rounded w-28"
                    />
                    <button
                        onClick={handleAddIncome}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Add
                    </button>
                </div>
            </div>

            {/* Expenses list */}

            <div className="flex-1 max-w-xl w-full m-auto p-4 flex flex-col bg-white rounded-lg shadow-md">
                <h1 className="text-xl font-semibold text-blue-700 pb-3 mb-4 text-left border-b border-gray-200">Expenses</h1>
                <ul className=" mb-4 space-y-2">
                    {expenses.map((exp, idx) => (
                        <li key={idx} 
                            className={`flex justify-between mb-2 ${expenses.length > 0 ? 
                            'border-b border-dashed border-gray-300 py-2 text-lg' : ''}`

                        }>
                            <span>{exp.name} -${exp.amount}</span>
                            <button
                                onClick={() => removeExpense(exp.name)}
                                className="text-red-500 hover:underline">
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
                {/* Expense Input */}

                <div className="flex flex-wrap gap-2 pb-2">
                    <input
                        value={expenseName}
                        onChange={(e) => setExpenseName(e.target.value)}
                        placeholder="Expense Name"

                        className="border border-gray-200 p-2 rounded min-w-0 flex-grow"

                        maxLength={20}
                    />
                    <input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                        type="number"

                        className="border border-gray-200 p-2 rounded w-28"

                    />
                    <button
                        onClick={handleAddExpense}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}