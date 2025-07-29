import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/navbar.jsx';

export default function Layout(){
    return (
        <main className="p-2.5 max-w-full mx-auto">
            <Navbar/>
            <Outlet/>
        </main>
    );
}