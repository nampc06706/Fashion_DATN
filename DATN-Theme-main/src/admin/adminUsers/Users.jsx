import { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import Cookies from 'js-cookie';
import axios from 'axios';
const UserManagementPage = () => {
  const [users, setUsers] = useState([]); // Danh sách người dùng
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    fullname: '',
    email: '',
    phone: '',
    activated: false,
    roleId: null,
    image: null, // Thêm trường cho hình ảnh
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const token = Cookies.get('token');

  const formData = new FormData();

  // Hàm để thêm dữ liệu tĩnh vào danh sách người dùng
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/admin/useradmin`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Thêm token xác thực
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Để gửi kèm cookie nếu cần
        });
        setUsers(response.data); // Cập nhật state `users` từ phản hồi của API
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = () => {
    setShowForm(true);
    setNewUser({ name: '', email: '', role: '', id: null }); // Đặt lại form khi thêm người dùng mới
  };

  const handleEditUser = (user) => {
    console.log(user);
    setNewUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };

  const handleFormSubmit = async () => {
    try {
      // Append the account data as a JSON string
      formData.append("account", new Blob([JSON.stringify({
        fullname: newUser.fullname,
        email: newUser.email,
        phone: newUser.phone,
        activated: newUser.activated,
        roleId: newUser.id, // Kiểm tra nếu roleId là hợp lệ
      })], { type: "application/json" }));

      // Thêm tệp hình ảnh vào FormData nếu có
      if (newUser.image instanceof File) {
        formData.append("image", newUser.image);
      }

      let response;
      if (newUser.id) {
        // Update existing user
        response = await axios.put(
          `http://localhost:8080/api/admin/useradmin/${newUser.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            },
          }
        );
      } else {
        // Add a new user
        response = await axios.post(
          'http://localhost:8080/api/admin/useradmin',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              // Không cần thiết lập Content-Type cho FormData
            },
          }
        );
      }

      // Cập nhật danh sách người dùng sau khi thêm hoặc cập nhật
      const user = newUser.id ? response.data : [...users, response.data];
      
      setUsers(user);
      setShowForm(false); // Ẩn form sau khi gửi thành công
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };


  const handleCancelForm = () => {
    setPreviewUrl(null)
    setShowForm(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Lấy tệp đầu tiên
    if (file) {
      setNewUser((prevUser) => ({
        ...prevUser,
        image: file, // Cập nhật tệp hình ảnh vào state
      }));
    }
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
              <th className="py-3 px-6 text-left text-sm font-semibold text-white">Tên tài khoản</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-white">Số điện thoại</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-white">Email</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-white">Vai trò</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-white">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="py-4 px-6 border-b border-gray-200">{user.fullname}</td>
                <td className="py-4 px-6 border-b border-gray-200">{user.username}</td>
                <td className="py-4 px-6 border-b border-gray-200">{user.phone}</td>
                <td className="py-4 px-6 border-b border-gray-200">{user.email}</td>
                <td className="py-4 px-6 border-b border-gray-200">{user.roleName}</td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <button onClick={() => handleEditUser(user)} className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-300 mr-2">
                    <AiOutlineEdit />
                  </button>
                  <button onClick={() => handleDeleteUser(user)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300">
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
            <h2 className="text-xl font-bold mb-4 text-center">
              {newUser.id ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
            </h2>

            {/* Row for Tên and Số điện thoại fields */}
            <div className="flex space-x-4 mb-4">
              <div className="w-1/2">
                <label className="block text-gray-700">Tên tài khoản</label>
                <input
                  type="text"
                  name="name"
                  value={newUser.username}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="w-1/2">
                <label className="block text-gray-700">Họ và tên</label>
                <input
                  type="text"
                  name="fullname"
                  value={newUser.fullname}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Số điện thoại</label>
              <input
                type="phone"
                name="phone"
                value={newUser.phone}
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
                value={newUser.id}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Image Upload Section */}
            <div className="mb-4">
              <label className="block text-gray-700">Hình ảnh</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="mb-4">
                <img
                  src={previewUrl}
                  alt="User Preview"
                  className="w-32 h-32 object-cover rounded-full mx-auto"
                />
              </div>
            )}

            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mr-2"
                onClick={handleCancelForm}
              >
                Hủy
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={handleFormSubmit}
              >
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
