import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { AiOutlineSearch, AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Pagination from "../component/Pagination";

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ id: '', name: '' });
  const [isEditing, setIsEditing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 10; // Số mục hiển thị trên mỗi trang

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
        const response = await axios.get('http://localhost:8080/api/staff/categoryadmin', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });

        setCategories(response.data);
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

  const handleEditCategory = (category) => {
    // Cập nhật trạng thái newCategory với dữ liệu của category
    setNewCategory({
      id: category.id,
      name: category.name,
    });
    setIsEditing(true); // Đang chỉnh sửa
    setShowForm(true);
  };

  const handleDeleteCategory = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa?',
      text: 'Thao tác này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/staff/categoryadmin/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Token để xác thực
          },
        });

        if (response.status === 200) {
          // Xóa loại sản phẩm thành công, cập nhật lại danh sách
          setCategories(categories.filter((category) => category.id !== id));
          toast.success("Loại sản phẩm đã được xóa thành công.");
        }
      } catch (error) {
        console.error("Lỗi khi xóa loại sản phẩm:", error);
        toast.error("Có lỗi xảy ra khi xóa loại sản phẩm. Vui lòng thử lại.");
      }
    }
  };


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFormSubmit = async () => {
    if (!newCategory.name) {
      toast.error("Tên loại sản phẩm là bắt buộc.");
      return;
    }

    try {

      if (isEditing) {
        // Nếu đang chỉnh sửa, sử dụng phương thức PUT để cập nhật loại sản phẩm
        const response = await axios.put(`http://localhost:8080/api/staff/categoryadmin/${newCategory.id}`, newCategory, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });

        // Cập nhật danh sách loại sản phẩm với dữ liệu đã chỉnh sửa

        setCategories(categories.map((cat) => (cat.id === newCategory.id ? response.data : cat)));
        toast.success("Loại sản phẩm đã được cập nhật thành công.");
      } else {
        // Nếu đang thêm mới, sử dụng phương thức POST để thêm loại sản phẩm
        const response = await axios.post('http://localhost:8080/api/staff/categoryadmin', newCategory, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });

        // Cập nhật danh sách loại sản phẩm với loại mới
        setCategories([...categories, response.data]);
        toast.success("Loại sản phẩm đã được thêm mới thành công.");
      }

      // Đóng form và xóa dữ liệu sau khi thêm hoặc chỉnh sửa thành công
      setShowForm(false);
      setNewCategory({ id: '', name: '' });
      setError(null);
    } catch (error) {
      console.error("Lỗi khi thêm/chỉnh sửa loại sản phẩm:", error);
      setError("Có lỗi xảy ra khi thêm/chỉnh sửa loại sản phẩm. Vui lòng thử lại.");
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
            {currentItems.map((category) => (
              <tr key={category.id} className="hover:bg-gray-100">
                <td className="py-4 px-6 border-b border-gray-200">{category.id}</td>
                <td className="py-4 px-6 border-b border-gray-200">{category.name}</td>

                <td className="py-4 px-6 border-b border-gray-200">
                  <button
                    onClick={() => handleEditCategory(category)}
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

      <Pagination
        totalItems={filteredCategories.length}
        itemsPerPage={itemsPerPage}
        paginate={paginate}
        currentPage={currentPage}
      />

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Chỉnh sửa loại sản phẩm" : "Thêm loại sản phẩm mới"}
            </h2>
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
                  {isEditing ? "Lưu" : "Thêm"}
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
