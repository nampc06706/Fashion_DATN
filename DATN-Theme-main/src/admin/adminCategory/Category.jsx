import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { AiOutlineSearch, AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai';

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ id: '', name: '' });


  const token = Cookies.get('token');
  let userInfo = null;

  if (token) {
    try {
      userInfo = jwtDecode(token);
    } catch (error) {
      console.error("Token decoding error:", error);
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      if (!userInfo) {
        setError("Không tìm thấy thông tin người dùng.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/api/admin/categoryadmin', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });

        setCategories(response.data);

        console.log("data cate: ", response.data)
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu loại sản phẩm:", error);
        setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  const handleAddCategory = () => {
    setTimeout(() => {
      setShowForm(true);
    }, 300);
  };

  const handleEditCategory = (id) => {
    // Logic chỉnh sửa loại sản phẩm
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleFormSubmit = async () => {
    if (!newCategory.name) {
      setError("Tên loại sản phẩm là bắt buộc."); // Kiểm tra nếu tên không rỗng
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8080/api/admin/categoryadmin', newCategory, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
  
      // Cập nhật danh sách loại sản phẩm với loại mới
      setCategories([...categories, response.data]);
      setShowForm(false);
      setNewCategory({ name: '', description: '' });
    } catch (error) {
      console.error("Lỗi khi thêm loại sản phẩm:", error);
      setError("Có lỗi xảy ra khi thêm loại sản phẩm. Vui lòng thử lại.");
    }
  };
  

  const handleFormChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };



  const handleCancelForm = () => {
    setShowForm(false);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md p-5 flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm loại sản phẩm..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleSearch}
          />
          <AiOutlineSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
        <button
          onClick={handleAddCategory}
          className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-md shadow-md transition-transform duration-200 transform active:translate-y-1"
        >
          <AiOutlinePlus className="mr-2" />
          Thêm loại sản phẩm
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-5">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-3 px-6 bg-gray-50 text-left text-sm font-semibold text-gray-600">ID loại sản phẩm</th>
              <th className="py-3 px-6 bg-gray-50 text-left text-sm font-semibold text-gray-600">Tên loại sản phẩm</th>
              <th className="py-3 px-6 bg-gray-50 text-left text-sm font-semibold text-gray-600">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-100">
                <td className="py-4 px-6 border-b border-gray-200">{category.id}</td>
                <td className="py-4 px-6 border-b border-gray-200">{category.name}</td>

                <td className="py-4 px-6 border-b border-gray-200">
                  <button
                    onClick={() => handleEditCategory(category.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-300 mr-2"
                  >
                    <AiOutlineEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    <AiOutlineDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Thêm loại sản phẩm mới</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Tên loại sản phẩm</label>
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Mô tả</label>
                <textarea
                  name="description"
                  value={newCategory.description}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="mr-2 bg-gray-300 px-4 py-2 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Thêm
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
          </div>
        </div>
      )}

      {loading && <p className="text-gray-500">Đang tải dữ liệu...</p>}
    </div>
  );
};

export default CategoryManagementPage;
