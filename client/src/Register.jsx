import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register(){
    const [form, setForm] = useState({name:'', email:'', password:''});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post('http://localhost:5000/api/auth/register', form);
            localStorage.setItem('token', res.data.token);
            alert('Register Success');
            navigate('/dashboard');
        }catch(err){
            alert(err.response.data.msg);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                <input type="text" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full p-2 border mb-3 rounded"/>
                <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="w-full p-2 border mb-3 rounded" required/>
                <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} className="w-full p-2 border mb-3 rounded" required/>
                <button className="w-full bg-green-500 text-white p-2 rounded">Register</button>
                <p className="mt-3">Have account? <Link to="/login" className="text-blue-500">Login</Link></p>
            </form>
        </div>
    )
}