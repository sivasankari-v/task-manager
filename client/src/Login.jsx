import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(){
    const [form, setForm] = useState({email:'', password:''});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post('http://localhost:5000/api/auth/login', form);
            localStorage.setItem('token', res.data.token);
            alert('Login Success');
            navigate('/dashboard');
        }catch(err){
            alert(err.response.data.msg);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="w-full p-2 border mb-3 rounded"/>
                <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} className="w-full p-2 border mb-3 rounded"/>
                <button className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
                <p className="mt-3">No account? <Link to="/register" className="text-blue-500">Register</Link></p>
            </form>
        </div>
    )
}