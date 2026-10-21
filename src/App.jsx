
import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000/api/employee';

function App() {

  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [editId, setEditId] = useState(null);

  // Fetch  employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API);

       setEmployees(res.data.data ?? res.data);
    } catch (error) {
          console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {

       fetchEmployees();
  }, []);

  // Handle form inputs
  const handleChange = (e) => {

       setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId !== null) {

        await axios.patch(`${API}/${editId}`, form);

      } else {
        await axios.post(API, form);
      }

      setForm({ name: '', email: '', role: '' });
      setEditId(null);
      fetchEmployees();

    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  // Edit employee
  const handleEdit = (employee) => {

    setForm({
       name: employee.name,
        email: employee.email,
      role: employee.role,
    });
    setEditId(employee.id);
  };

  // Delete employee
  const handleDelete = async (id) => {
    try {
        await axios.delete(`${API}/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto' }}>

      <h1>Employee Management</h1>

      <form onSubmit={handleSubmit}>
        <input
           name="name"
           placeholder="Employee Name"
            value={form.name}
            onChange={handleChange}
           required
        />
      <input
           name="email"
           type="email"
           placeholder="Email"
           value={form.email}
           onChange={handleChange}
           required
        />
        <input name="role" placeholder="Role" value={form.role} onChange={handleChange} required   />

        <button type="submit">{editId !== null ? 'Update Employee' : 'Add Employee'}</button>

        {editId !== null && (
             <button
             type="button"
             onClick={() => {
              setEditId(null);
              setForm({ name: '', email: '', role: '' });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Employees</h2>

      <table border="2" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td> 
              <td>{employee.role}</td>
              <td>
                <button onClick={() => handleEdit(employee)}>
                  Edit
                </button>

           <button onClick={() => handleDelete(employee.id)}>
                  Delete
                </button>      
              </td>
               </tr>
          ))}
          </tbody>  </table> </div>
  );
}

export default App;
