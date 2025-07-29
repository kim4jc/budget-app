import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider} from './context/authcontext/authcontext.jsx';
import { BinsProvider } from './context/authcontext/binscontext.jsx';
import { ExpenseProvider } from './context/authcontext/expensecontext.jsx';
import { IncomeProvider } from './context/authcontext/incomecontext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BinsProvider>
          <ExpenseProvider>
            <IncomeProvider>
              <App />
            </IncomeProvider>
          </ExpenseProvider>
        </BinsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);