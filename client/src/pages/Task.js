import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Task() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const res = await fetch('http://localhost:5000/api/tasks', {
            headers: { 'x-auth-token': token }
        });
        const data = await res.json();
        setTasks(data);
    }

    const handleAddTask = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:5000/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify({ title, description })
        });
        setTitle(''); setDescription('');
        fetchTasks();
    }

    const handleDelete = async (id) => {
        await fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE', headers: { 'x-auth-token': token } });
        fetchTasks();
    }

    const handleComplete = async (id) => {
        await fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'PUT', headers: { 'x-auth-token': token } });
        fetchTasks();
    }

    return (
        <div style={{padding: '20px'}}>
            <h2>TASK MANAGER V2</h2> 
            <button onClick={() => {localStorage.removeItem('token'); navigate('/')}}>Logout</button>
            
            <form onSubmit={handleAddTask}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
                <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                <button>Add Task</button>
            </form>

            {tasks.map(task => (
                <div key={task._id} style={{border: '2px solid blue', marginTop: '10px', padding: '10px'}}>
                    <span style={{textDecoration: task.completed ? 'line-through' : ''}}>{task.title} - {task.description}</span>
                    <button onClick={() => handleComplete(task._id)}>DONE</button>
                    <button onClick={() => handleDelete(task._id)}>DELETE</button>
                </div>
            ))}
        </div>
    )
}