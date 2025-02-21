import { useEffect, useState } from "react";

function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/users/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log("Users fetched:", data);
        setUsers(data);
      })
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default UsersList;
