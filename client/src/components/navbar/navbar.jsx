import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authcontext/authcontext.jsx';

export default function Navbar() {
   //imported username and logout function from useAuth context
  const { user, logout } = useAuth();

  return (
    //always render the links
    //links will be to the left side of navbar
    <nav className="w-full flex items-center justify-between bg-gray-800 text-white px-4 py-2">
        <div className="flex space-x-4 w-7/10">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to ="/expenses" className="hover:underline">Expenses</Link>
            <Link to ="/data" className="hover:underline">Data</Link>
            <Link to="/spending" className="hover:underline">Bins</Link>
        </div>
        

        {/* Right side of navbar will conditionally render login/logout based on if user is logged in.
        also will conditionally render "Welcome, {username}*/}
        <div className="flex items-center space-x-4">
            {user && <span>Welcome, {user.username}</span>}
            {user ? (
                <button onClick={logout} className="hover:underline">Logout</button>
            ) : (
                <Link to="/login" className="hover:underline">Login</Link>
            )}
        </div>
    </nav>
  );
}