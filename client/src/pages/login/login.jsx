import { useState } from 'react';
import { useAuth } from '../../context/authcontext/authcontext.jsx';
import { useNavigate } from 'react-router-dom';



export default function LoginPage() {

    const { login, register } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const action = e.nativeEvent.submitter.name; // gets name of the button clicked
    
        if (action === 'login') {
            const success = await login(username, password);
            if (!success){
                alert('Login failed')
            }
            else{
                alert('Login Successful')
                navigate('/');
            }
        } 
        else if (action === 'register') {
          const success = await register(username, password);
            if (!success){
                alert('Registration failed')
            }
            else{
                alert('Registration Successful')
                const loginSuccess = await login(username, password);
                    if (loginSuccess) {
                    navigate('/');
                    } 
                    else {
                        alert('Auto-login after registration failed. Please try logging in.');
                    }
            }
        }
    };
    
    return(
        <div className='h-screen w-full flex'>
            <form className="max-w-xl w-full m-auto border-2 p-4 rounded bg-gray-300 mt-[12%]"
                onSubmit={handleSubmit}>
                <input 
                    className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"
                    type="text" 
                    placeholder="Enter Username"
                    value={username}
                    onChange={ev => setUsername(ev.target.value)}
                />
                <input 
                    className="w-full block py-1 px-1 border-2 border-gray-100 rounded bg-white mb-1"
                    type="password" 
                    placeholder="Enter Password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                />
                <button 
                    className="block mb-1 w-full py-1 px-2 border-2 rounded bg-gray-600 text-white"
                    name="login"
                    type="submit">
                    Login
                </button>
                <button 
                    className="block mb-1 w-full py-1 px-2 border-2 rounded bg-gray-600 text-white"
                    name="register"
                    type="submit">
                    Register
                </button>
            </form>
        </div>
    );
}