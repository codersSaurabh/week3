import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TodoApp({ token }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/todos', config);
      setTodos(res.data);
    } catch (err) {
      console.error('Error fetching todos', err);
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/todos', { title: newTodo }, config);
      setNewTodo('');
      fetchTodos();
    } catch (err) {
      console.error('Error adding todo', err);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(`http://localhost:5000/api/todos/${id}`, { completed: !completed }, config);
      fetchTodos();
    } catch (err) {
      console.error('Error updating todo', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`, config);
      fetchTodos();
    } catch (err) {
      console.error('Error deleting todo', err);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>My To-Do List</h2>
      <form onSubmit={addTodo} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>Add</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #eee' }}>
            <span
              onClick={() => toggleTodo(todo.id, todo.completed)}
              style={{ textDecoration: todo.completed ? 'line-through' : 'none', cursor: 'pointer', color: todo.completed ? '#888' : '#000' }}
            >
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
