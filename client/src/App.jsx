import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if(token){
      axios.get(`${API}/tasks`, {
        headers: { 'x-auth-token': token }
      })
      .then(res => setTasks(res.data))
      .catch(err => {
        console.log(err);
        if(err.response?.status === 401) handleLogout();
      });
    }
  }, [token]);

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${API}/auth/register`, { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch(err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch(err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  const handleAddTask = async () => {
    if(!title) return alert('Title podu bro');
    try {
      const res = await axios.post(`${API}/tasks`, { title, description }, {
        headers: { 'x-auth-token': token }
      });
      setTasks([res.data,...tasks]);
      setTitle(''); setDescription('');
    } catch(err) {
      alert('Task not add');
    }
  };

  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/tasks/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setTasks(tasks.filter(task => task._id !== id)); 
    } catch(err) {
      alert('Not Delete ');
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await axios.put(`${API}/tasks/${id}`, {}, {
        headers: { 'x-auth-token': token }
      });
      setTasks(tasks.map(task => task._id === id ? res.data : task)); 
    } catch(err) {
      alert('Not Update');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setTasks([]);
  }

  if(!token){
    return (
      <div style={{padding: '20px'}}>
        <h2>Login / Register</h2>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /> <br/><br/>
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /> <br/><br/>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleRegister} style={{marginLeft: '10px'}}>Register</button>
      </div>
    )
  }

  return (
    <div style={{padding: '20px'}}>
      <h2>Tasks</h2>
      <button style={{background:'red', color:'white'}} onClick={handleLogout}>Logout</button>
      <div style={{marginTop: '10px'}}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <div style={{marginTop: '20px'}}>
        {tasks.length === 0? <p>No tasks yet. Add one!</p> : 
          tasks.map(task => (
            <div key={task._id} style={{border:'1px solid #ccc', padding:'10px', margin:'5px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <b style={{textDecoration: task.completed ? 'line-through' : 'none'}}>{task.title}</b> - {task.description}
              </div>
              <div>
                <input 
                  type="checkbox" 
                  checked={task.completed}
                  onChange={() => handleComplete(task._id)}
                /> Done
                <button onClick={() => handleDelete(task._id)} style={{marginLeft:'10px', background:'red', color:'white'}}>Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default App