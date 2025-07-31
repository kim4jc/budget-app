import { useState, useEffect } from 'react';
import { useAuth } from '../../context/authcontext/authcontext.jsx';
import { useNavigate } from 'react-router-dom';



export default function LoginPage() {

    const { user, login, register } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const action = e.nativeEvent.submitter.name; // gets name of the button clicked
        try{
            //if trying to login
            if (action === 'login') {
                const loginData = await login(username, password);
                console.log('Login response:', loginData);

                if (!loginData){
                    alert('Login failed')
                }
                else{
                    //if successful navigate to home
                    alert('Login Successful')
                    navigate('/home');
                }
            } 
            //if trying to register
            else if (action === 'register') {
              const regResponse = await register(username, password);
              console.log('Registration response:', regResponse);

                if (!regResponse){
                    alert('Registration failed')
                }
                //if successful call the login after registration and navigate to home
                else{
                    alert('Registration Successful')
                    const loginData = await login(username, password);
                    console.log('Auto-login after register response:', loginData);
                    if(loginData){
                        navigate('/home');
                        } 
                        else {
                            alert('Auto-login after registration failed. Please try logging in.');
                        }
                }
            }
        }
        catch(err){
            console.error('Error: ', err);
            alert(err.message || 'Something went wrong');
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