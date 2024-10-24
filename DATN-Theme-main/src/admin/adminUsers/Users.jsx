import { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]); // Danh sách người dùng
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', id: null });

  // Hàm để thêm dữ liệu tĩnh vào danh sách người dùng
  useEffect(() => {
    const initialUsers = [
      { id: 1, name: 'Nguyễn Văn A', email: 'a@example.com', role: 'Quản trị viên' },
      { id: 2, name: 'Trần Thị B', email: 'b@example.com', role: 'Người dùng' },
      { id: 3, name: 'Lê Văn C', email: 'c@example.com', role: 'Người dùng' },
    ];
    setUsers(initialUsers);
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = () => {
    setShowForm(true);
    setNewUser({ name: '', email: '', role: '', id: null }); // Đặt lại form khi thêm người dùng mới
  };

  const handleEditUser = (index) => {
    const user = users[index];
    setNewUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };

  const handleFormSubmit = () => {
    if (newUser.id) {
      // Cập nhật người dùng
      const updatedUsers = users.map(user => (user.id === newUser.id ? newUser : user));
      setUsers(updatedUsers);
    } else {
      // Thêm người dùng mới
      setUsers([...users, { ...newUser, id: Date.now() }]);
    }
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button onClick={handleAddUser} className="bg-green-600 text-white px-4 py-2 rounded flex items-center">
          <AiOutlinePlus className="mr-2" /> Thêm người dùng
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-5">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-500">
              <th className="py-3 px-6 text-left text-sm font-semibold text-white">Tên</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-white">Email</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-white">Vai trò</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-white">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="py-4 px-6 border-b border-gray-200">{user.name}</td>
                <td className="py-4 px-6 border-b border-gray-200">{user.email}</td>
                <td className="py-4 px-6 border-b border-gray-200">{user.role}</td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <button onClick={() => handleEditUser(index)} className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-300 mr-2">
                    <AiOutlineEdit />
                  </button>
                  <button onClick={() => handleDeleteUser(index)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300">
                    <AiOutlineDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-center">{newUser.id ? "Chỉnh sửa người dùng" : "Thêm người dùng"}</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Tên</label>
              <input
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Vai trò</label>
              <input
                type="text"
                name="role"
                value={newUser.role}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-end">
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mr-2" onClick={handleCancelForm}>
                Hủy
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={handleFormSubmit}>
                {newUser.id ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
