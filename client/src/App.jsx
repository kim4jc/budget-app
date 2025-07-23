import { Route, Routes } from "react-router-dom";
import HomePage from './pages/home/home.jsx'
import LoginPage from './pages/login/login.jsx'
function App() {
  return (
    <Routes>
        <Route index element={<HomePage/> }/>
        <Route path={'/login'} element={<LoginPage/> }/>
    </Routes>
  );
}

export default App;
