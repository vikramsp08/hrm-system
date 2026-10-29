import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeCRUD = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    salary: '',
    joinDate: '',
    phone: '',
    address: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('hrm_token');
      const res = await axios.get('http://localhost:5000/api/employees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data.data || []);
    } catch (err) {
      setError('Failed to fetch employees list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setFormData({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      position: emp.position,
      salary: emp.salary,
      joinDate: emp.joinDate ? emp.joinDate.split('T')[0] : '',
      phone: emp.phone || '',
      address: emp.address || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee record?')) return;
    try {
      const token = localStorage.getItem('hrm_token');
      await axios.delete(`http://localhost:5000/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Employee record deleted');
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const token = localStorage.getItem('hrm_token');
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/employees/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Employee updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/employees', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('New employee onboarded successfully');
      }

      setFormData({
        name: '',
        email: '',
        department: '',
        position: '',
        salary: '',
        joinDate: '',
        phone: '',
        address: ''
      });
      setEditingId(null);
      setShowForm(false);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-title">
          <span>👥 Employee Management (HR Directory)</span>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: '',
                email: '',
                department: '',
                position: '',
                salary: '',
                joinDate: '',
                phone: '',
                address: ''
              });
              setShowForm(!showForm);
            }}
            className="btn btn-primary btn-sm"
          >
            {showForm ? 'Close Form' : '+ Add New Employee'}
          </button>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>
              {editingId ? 'Edit Employee Details' : 'Onboard New Employee'}
            </h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Work Email *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={onChange}
                  disabled={!!editingId}
                  required
                />
              </div>

              <div className="form-group">
                <label>Department *</label>
                <input
                  type="text"
                  name="department"
                  className="form-control"
                  value={formData.department}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Position / Title *</label>
                <input
                  type="text"
                  name="position"
                  className="form-control"
                  value={formData.position}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Salary (USD/Year) *</label>
                <input
                  type="number"
                  name="salary"
                  className="form-control"
                  value={formData.salary}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Join Date *</label>
                <input
                  type="date"
                  name="joinDate"
                  className="form-control"
                  value={formData.joinDate}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={onChange}
                />
              </div>

              <div className="form-group">
                <label>Residential Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  value={formData.address}
                  onChange={onChange}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Save Changes' : 'Create Record'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p>Loading directory...</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Salary</th>
                  <th>Joined</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td><strong>{emp.name}</strong></td>
                    <td>{emp.email}</td>
                    <td>{emp.department}</td>
                    <td>{emp.position}</td>
                    <td>${Number(emp.salary).toLocaleString()}</td>
                    <td>{new Date(emp.joinDate).toLocaleDateString()}</td>
                    <td>{emp.phone || 'N/A'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEdit(emp)}
                          className="btn btn-secondary btn-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(emp._id)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeCRUD;
