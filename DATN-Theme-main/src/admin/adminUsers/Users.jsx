import { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Pagination from '../component/Pagination';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]); // Danh sách người dùng
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    fullname: '',
    email: '',
    phone: '',
    activated: false,
    roleId: null,
    image: null,
  });

  const token = Cookies.get('token');
  let userInfo = null;
  let role = null;

  if (token) {
    try {
      userInfo = jwtDecode(token);
      role = userInfo.roles;
    } catch (error) {
      console.error("Token decoding error:", error);
    }
  }
  const formData = new FormData();

  const [searchTerm, setSearchTerm] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const [sortConfig, setSortConfig] = useState({ key: 'fullname', direction: 'ascending' });

  const filteredUsers = users.filter((user) =>
    user.fullname.toLowerCase().includes(searchTerm) ||
    user.username.toLowerCase().includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm)
  );

  // Sort users based on the selected column
  const sortedUsers = filteredUsers.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });


  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 10; // Số mục hiển thị trên mỗi trang

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem) || sortedUsers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Hàm để thêm dữ liệu tĩnh vào danh sách người dùng

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

  useEffect(() => {
    fetchUsers();
  }, []);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSortChange = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = () => {
    setShowForm(true);
    setNewUser({ fullname: '', email: '', role: '', id: null });
  };

  const handleEditUser = (user) => {
    setPreviewImage(null);
    const updatedUser = { ...user };

    if (updatedUser.roleName === "ADMIN") {
      updatedUser.roleId = 1;
    } else if (updatedUser.roleName == "STAFF") {
      updatedUser.roleId = 2;
    } else {
      updatedUser.roleId = 3;
    }
    setNewUser(updatedUser);
    setShowForm(true);
  };

  const handleFormSubmit = async () => {

    if (!newUser.username || newUser.username.length < 1) {
      toast.error("Tên tài khoản là bắt buộc và phải có ít nhất 1 ký tự.");
      return;
    }

    if (!newUser.fullname) {
      toast.error("Họ và tên là bắt buộc.");
      return;
    }

    if (!newUser.email || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(newUser.email)) {
      toast.error("Email là bắt buộc và phải đúng định dạng.");
      return;
    }

    if (!newUser.phone && !/^\d{10,15}$/.test(newUser.phone)) {
      toast.error("Số điện thoại phải chứa từ 10 đến 15 chữ số.");
      return;
    }

    if (!newUser.roleId || [1, 2, 3].includes(newUser.roleId)) {
      toast.error("Vai trò là bắt buộc và phải là ID hợp lệ.");
      return;
    }

    try {
      // Append the account data as a JSON string
      formData.append("account", new Blob([JSON.stringify({
        username: newUser.username,
        fullname: newUser.fullname,
        email: newUser.email,
        phone: newUser.phone,
        activated: newUser.activated,
        roleId: newUser.roleId, // Kiểm tra nếu roleId là hợp lệ
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
        setUsers(users.map((u) => (u.id === newUser.id ? response.data.data : u)));
        setShowForm(false); // Ẩn form sau khi gửi thành công
        fetchUsers();
        toast.success("Cập nhật người dùng thành công!");
      } else {
        // Add a new user
        response = await axios.post(
          'http://localhost:8080/api/admin/useradmin/add',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        const user = newUser.id ? response.data : [...users, response.data.data];
        setUsers(user);
        setShowForm(false); // Ẩn form sau khi gửi thành công
        fetchUsers();
        toast.success("Tạo người mới dùng thành công!");
      }
    } catch (error) {
      var status = error.response.data.status;
      if (status == 409) {
        toast.error("Email này đã tồn tại");
        return;
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Cập nhật ảnh xem trước
      setPreviewImage(URL.createObjectURL(file));

      // Cập nhật dữ liệu user với file hình ảnh
      setNewUser({ ...newUser, image: file });
    }
  };



  if (role !== 'STAFF') {
    return (
      <div>
        <div className="flex justify-between items-center mb-6 space-x-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Add User Button */}
          {/* <button
            onClick={handleAddUser}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center"
          >
            <AiOutlinePlus className="mr-2" /> Thêm người dùng
          </button> */}
        </div>

        <div className="bg-white shadow-md rounded-lg p-5">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-500">
                <th onClick={() => handleSortChange('fullname')} className="cursor-pointer py-3 px-6 text-left text-sm font-semibold text-white">
                  Tên ⇅
                </th>
                <th onClick={() => handleSortChange('username')} className="cursor-pointer py-3 px-6 text-left text-sm font-semibold text-white">
                  Tên tài khoản ⇅
                </th>
                <th onClick={() => handleSortChange('phone')} className="cursor-pointer py-3 px-6 text-left text-sm font-semibold text-white">
                  Số điện thoại ⇅
                </th>
                <th onClick={() => handleSortChange('email')} className="cursor-pointer py-3 px-6 text-left text-sm font-semibold text-white">
                  Email ⇅
                </th>
                <th onClick={() => handleSortChange('roleName')} className="cursor-pointer py-3 px-6 text-left text-sm font-semibold text-white">
                  Vai trò ⇅
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-white">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="py-4 px-6 border-b border-gray-200">{user.fullname}</td>
                  <td className="py-4 px-6 border-b border-gray-200">{user.username}</td>
                  <td className="py-4 px-6 border-b border-gray-200">{user.phone}</td>
                  <td className="py-4 px-6 border-b border-gray-200">{user.email}</td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    {
                      {
                        ADMIN: 'Quản lý',
                        STAFF: 'Nhân viên',
                        USER: 'Khách hàng',
                      }[user.roleName] || user.roleName
                    }
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    <button onClick={() => handleEditUser(user)} className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-300 mr-2">
                      <AiOutlineEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <Pagination
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          paginate={paginate}
          currentPage={currentPage}
        />

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
                    name="username"
                    value={newUser.username}
                    onChange={handleFormChange}
                    readOnly={!!newUser.id}
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
                <select
                  name="roleId" // Matches the key in newUser state
                  value={newUser.roleId}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Chọn vai trò</option> {/* Placeholder option */}
                  <option value="1">ADMIN</option>
                  <option value="2">STAFF</option>
                  <option value="3">USER</option>
                </select>
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

              <div className="mb-4">
                <img
                  src={previewImage || "../../public/assets/images/" + newUser.image}
                  alt=""
                  className="w-32 h-32 object-cover rounded-full mx-auto"
                />
              </div>

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
    )
  } else {
    return (
      <h1 className='text-center'>Không có quyền truy cập</h1>
    );
  };

};

export default UserManagementPage;
