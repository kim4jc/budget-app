import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authcontext/authcontext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
   //imported username and logout function from useAuth context
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');  //takes user to the login page after logging out
  };

  if (!user) return null; // Hide navbar if not logged in

  return (
    <nav className="w-full flex items-center justify-between bg-gray-800 text-white px-4 py-2">
      <div className="flex space-x-4 w-7/10">
        <Link to="/home" className="hover:underline">Home</Link>
        <Link to="/expenses" className="hover:underline">Expenses</Link>
        <Link to="/data" className="hover:underline">Data</Link>
        <Link to="/spending" className="hover:underline">Bins</Link>
      </div>

      <div className="flex items-center space-x-4">
        <span>Welcome, {user.username}</span>
        <button onClick={handleLogout} className="hover:underline">Logout</button>
      </div>
    </nav>
  );
}