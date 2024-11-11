import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';


const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: { id: null, name: '' }, // Khởi tạo category là một đối tượng
    images: [],
    sizes: [],
  });

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
    const fetchProducts = async () => {
      if (!userInfo) {
        setError("Không tìm thấy thông tin người dùng.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/admin/products`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true,
        });

        const responseCategory = await axios.get(`http://localhost:8080/api/admin/categoryadmin`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true,
        });
        setCategories(responseCategory.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);


  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category ? { id: product.category.id, name: product.category.name } : { id: null, name: '' }, // Đảm bảo category có cả id và name
      images: product.images || [],
      sizes: product.sizes || [],
    });
    setIsEditMode(true);
    setShowForm(true);
  };

  const updateProduct = async (id, productData) => {
    const token = Cookies.get('token');
    if (!token) {
      console.error("Không có token xác thực.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8080/api/admin/products/${id}`, {
        ...productData,
        category: { id: productData.category.id } // Đảm bảo gửi đúng id của category
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      console.log("Cập nhật sản phẩm thành công:", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      throw error;
    }
  };

  const handleFormSubmit = async () => {
    if (isEditMode && currentProduct) {
      try {
        // Gọi API để cập nhật sản phẩm
        const updatedProduct = await updateProduct(currentProduct.id, newProduct);

        // Cập nhật danh sách sản phẩm với sản phẩm đã chỉnh sửa
        const updatedProducts = products.map((product) =>
          product.id === currentProduct.id ? { ...product, ...updatedProduct } : product
        );
        setProducts(updatedProducts);

        // Reset lại trạng thái và ẩn form
        handleCancelForm(); // Gọi hàm này để reset trạng thái
      } catch (error) {
        setError("Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại.");
      }
    } else {
      // Logic để thêm sản phẩm mới (nếu cần thiết)
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'categoryId') {
      // Khi chọn một category mới, chỉ cập nhật ID của category
      setNewProduct((prev) => ({
        ...prev,
        category: { ...prev.category, id: value },
      }));
    } else {
      setNewProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...newProduct.images];
    updatedImages[index] = value;
    setNewProduct({ ...newProduct, images: updatedImages });
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...newProduct.sizes];
    updatedSizes[index] = { ...updatedSizes[index], [field]: value };
    setNewProduct({ ...newProduct, sizes: updatedSizes });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setIsEditMode(false);
    setCurrentProduct(null);
    setNewProduct({ name: '', price: '', description: '', category: '', images: [], sizes: [] });
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const updatedImages = [...newProduct.images];
        updatedImages[index] = {
          image: reader.result, // URL tạm thời để hiển thị hình ảnh
          fileName: file.name,  // Lưu tên file để hiển thị trong input text
        };

        setNewProduct({ ...newProduct, images: updatedImages });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    setIsEditMode(false);
    setShowForm(true);
    setCurrentProduct(null);
    setNewProduct({ name: '', price: '', description: '', category: { id: null }, images: [], sizes: [] });
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Form tìm kiếm */}

      <div className="mb-4 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <div className="relative w-full md:w-2/3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-400"
            placeholder="🔍 Nhập tên sản phẩm để tìm kiếm"
          />
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center bg-green-500 text-white px-5 py-3 rounded-lg shadow-md hover:bg-green-600 transition duration-300 transform hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Thêm sản phẩm mới
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">{isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Tên sản phẩm</label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Loại sản phẩm</label>
                <select
                  name="categoryId"
                  value={newProduct.category.id || ""}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                >
                  <option value="">Chọn loại sản phẩm</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Giá</label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Mô tả</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Hình ảnh</label>
                {newProduct.images.map((imageObj, index) => (
                  <div key={index} className="mb-2 flex items-center">
                    <img
                      src={imageObj.image || "/assets/images/placeholder.png"}
                      alt={`Product image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded mr-2 cursor-pointer"
                      onClick={() => document.getElementById(`fileInput-${index}`).click()}
                    />
                    <input
                      type="text"
                      value={imageObj.fileName || ""}
                      readOnly
                      className="border border-gray-300 p-2 rounded-lg w-full mr-2"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      id={`fileInput-${index}`}
                      style={{ display: "none" }}
                      onChange={(e) => handleFileChange(e, index)}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setNewProduct((prev) => ({ ...prev, images: [...prev.images, { image: "" }] }))
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-green-600 transition duration-300"
                >
                  Thêm hình ảnh
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Kích thước và số lượng</label>
                {newProduct.sizes.map((size, index) => (
                  <div key={index} className="mb-2 flex">
                    <input
                      type="text"
                      placeholder="Kích thước"
                      value={size.name}
                      onChange={(e) => handleSizeChange(index, "name", e.target.value)}
                      className="w-1/3 border border-gray-300 p-2 rounded-lg mr-2"
                    />
                    <input
                      type="text"
                      placeholder="Màu sắc"
                      value={size.color?.name || ""}
                      onChange={(e) => handleSizeChange(index, "color", { name: e.target.value })}
                      className="w-1/3 border border-gray-300 p-2 rounded-lg mr-2"
                    />
                    <input
                      type="number"
                      placeholder="Số lượng"
                      value={size.quantityInStock}
                      onChange={(e) => handleSizeChange(index, "quantityInStock", e.target.value)}
                      className="w-1/3 border border-gray-300 p-2 rounded-lg"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setNewProduct((prev) => ({
                      ...prev,
                      sizes: [...prev.sizes, { name: "", color: { name: "" }, quantityInStock: 0 }],
                    }))
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-green-600 transition duration-300"
                >
                  Thêm size
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600 transition duration-300"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  {isEditMode ? "Lưu thay đổi" : "Thêm sản phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-5 mt-6">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-500">
              <th className="py-3 px-6 text-left text-sm font-semibold text-white">Hình ảnh</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-white">Tên sản phẩm</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-white">Giá</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-white">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-300">
                <td className="py-3 px-6">
                  <img
                    src={`/assets/images/${product.firstImage}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                </td>
                <td className="py-3 px-6">{product.name}</td>
                <td className="py-3 px-6">{product.price}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-yellow-600 transition duration-300"
                  >
                    <AiOutlineEdit />
                  </button>
                  <button
                    // onClick={() => handleEditProduct(product)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-yellow-600 transition duration-300"
                  >
                    <AiOutlineDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default ProductManagementPage;
