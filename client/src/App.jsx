import { Route, Routes } from "react-router-dom";
import Layout from './components/layout/layout.jsx'
import Navbar from './components/navbar/navbar.jsx'
import HomePage from './pages/home/home.jsx'
import LoginPage from './pages/login/login.jsx'
import Spending from './pages/spending/spending.jsx'
import Expenses from './pages/expenses/expenses.jsx'
import DataPage from './pages/data/data.jsx'

function App() {
  return (
    <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<LoginPage/> }/>
          <Route path={'/home'} element={<HomePage/> }/>
          <Route path={'/spending'} element={<Spending />} />
          <Route path={'/expenses'} element={<Expenses />} />
          <Route path="data" element={<DataPage />} />
        </Route>
    </Routes>
  );
}

export default App;
