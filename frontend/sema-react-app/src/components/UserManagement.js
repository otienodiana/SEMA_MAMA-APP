import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { FaEdit, FaTrash, FaUserShield } from "react-icons/fa";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState([]);
  const [availablePermissions] = useState([
    'manage_users',
    'manage_content',
    'manage_forums',
    'manage_appointments',
    'view_analytics',
    'send_messages',
    'manage_roles'
  ]);
  const [roleOptions, setRoleOptions] = useState(["admin", "healthcare_provider", "mom"]);  // Add this line

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(`${API_BASE_URL}/api/users/roles/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data?.roles) {
        // Update available role options with custom roles
        const customRoles = response.data.roles.map(role => role.name);
        setRoleOptions(prevRoles => [...prevRoles, ...customRoles]);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchUsers(),
        fetchRoles()
      ]);
    };
    fetchData();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) throw new Error("No access token found");

      const response = await axios.get(`${API_BASE_URL}/api/users/users/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data?.users) {
        setUsers(response.data.users);
      } else {
        throw new Error("Invalid response format");
      }

    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const token = localStorage.getItem("access");
      const response = await axios.delete(`${API_BASE_URL}/api/users/delete/${userId}/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setUsers(users.filter(user => user.id !== userId));
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.detail || "Failed to delete user");
    }
  };

  const handleRoleChange = async (userId) => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.post(
        `${API_BASE_URL}/api/users/assign-role/${userId}/`, 
        { role: newRole },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        setShowRoleModal(false);
        // Add success message
        alert("Role updated successfully!");
      }
    } catch (err) {
      console.error("Role change error:", err);
      const errorMsg = err.response?.data?.detail || "Failed to update role";
      setError(errorMsg);
      alert(errorMsg);
    }
  };

  const handleCreateRole = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.post(
        `${API_BASE_URL}/api/users/roles/create/`,
        {
          name: newRoleName,
          permissions: newRolePermissions
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        alert("Role created successfully!");
        setShowCreateRoleModal(false);
        // Refresh roles list
        fetchRoles();
      }
    } catch (err) {
      console.error("Role creation error:", err);
      setError(err.response?.data?.detail || "Failed to create role");
    }
  };

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h2>User Management</h2>
        <button onClick={() => setShowCreateRoleModal(true)} className="create-role-btn">
          Create New Role
        </button>
      </div>
      <div className="users-list">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-avatar">
              {user.profile_photo ? (
                <img src={user.profile_photo} alt={user.username} />
              ) : (
                <div className="default-avatar">{user.username[0]}</div>
              )}
            </div>
            <div className="user-info">
              <h3>{user.username}</h3>
              <p>{user.email}</p>
              <p>Role: {user.role}</p>
            </div>
            <div className="user-actions">
              <FaUserShield 
                className="action-icon"
                onClick={() => {
                  setSelectedUser(user);
                  setNewRole(user.role);
                  setShowRoleModal(true);
                }}
                title="Change Role"
              />
              <FaTrash 
                className="action-icon delete"
                onClick={() => handleDeleteUser(user.id)}
                title="Delete User"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Role Change Modal */}
      {showRoleModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Change User Role</h3>
            <p>Change role for: {selectedUser?.username}</p>
            <select 
              value={newRole} 
              onChange={(e) => setNewRole(e.target.value)}
            >
              {roleOptions.map(role => (  // Now using roleOptions from state
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <div className="modal-actions">
              <button onClick={() => handleRoleChange(selectedUser.id)}>
                Save
              </button>
              <button onClick={() => setShowRoleModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {showCreateRoleModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create New Role</h3>
            <div className="form-group">
              <label>Role Name:</label>
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Enter role name"
              />
            </div>
            <div className="form-group">
              <label>Permissions:</label>
              <div className="permissions-list">
                {availablePermissions.map(permission => (
                  <label key={permission} className="permission-item">
                    <input
                      type="checkbox"
                      checked={newRolePermissions.includes(permission)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewRolePermissions([...newRolePermissions, permission]);
                        } else {
                          setNewRolePermissions(newRolePermissions.filter(p => p !== permission));
                        }
                      }}
                    />
                    {permission.replace(/_/g, ' ').toUpperCase()}
                  </label>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handleCreateRole}>Create Role</button>
              <button onClick={() => setShowCreateRoleModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
