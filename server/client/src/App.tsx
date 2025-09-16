import React, { useEffect, useState } from 'react';

interface Group {
  id: number;
  name: string;
}

function App() {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/groups')
      .then(res => res.json())
      .then(data => setGroups(data));
  }, []);

  return (
    <div>
      <h1>Groups</h1>
      <ul>
        {groups.map(group => (
          <li key={group.id}>{group.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
