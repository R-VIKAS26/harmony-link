import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/analytics/usage')
      .then(res => setUsers(res.data.users))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded-xl">
      <h2 className="text-xl mb-2">User Analytics</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            ID: {user.id}, Mood: {user.mood}, Genre: {user.genre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
