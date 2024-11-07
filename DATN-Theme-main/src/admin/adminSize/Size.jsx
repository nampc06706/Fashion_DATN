import React, { useState, useEffect } from 'react';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';


const sizes = [
  { id: 1, name: "S", description: "Small" },
  { id: 2, name: "M", description: "Medium" },
  { id: 3, name: "L", description: "Large" },
];

const colors = [
  { id: 1, name: "Đỏ", code: "#FF0000" },
  { id: 2, name: "Xanh lá", code: "#00FF00" },
  { id: 3, name: "Xanh dương", code: "#0000FF" },
  { id: 4, name: "Vàng", code: "#FFFF00" },
  { id: 5, name: "Đen", code: "#000000" },
  { id: 6, name: "White", code: "#FFFFFF" },
];

const SizeManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(''); // Mới thêm
  const [addedItems, setAddedItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

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

        const responseSize = await axios.get(`http://localhost:8080/api/admin/size`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true,
        });
        setAddedItems(responseSize.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      } finally {
      }
    };
    fetchProducts();
  }, [token]);

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value); // Cập nhật màu đã chọn
  };

  const handleAdd = () => {
    if (selectedProduct && selectedSize && selectedColor) {
      const newItem = {
        product: products.find(p => p.id === parseInt(selectedProduct)),
        size: sizes.find(s => s.id === parseInt(selectedSize)),
        color: colors.find(c => c.id === parseInt(selectedColor)), // Thêm màu vào mục
        createdAt: new Date().toLocaleDateString(),
      };
      setAddedItems([...addedItems, newItem]);
      setSelectedProduct('');
      setSelectedSize('');
      setSelectedColor(''); // Đặt lại màu
    }
  };

  const handleDeleteProduct = (id) => {
    setAddedItems(addedItems.filter(item => item.product.id !== id));
  };

  const handleEditProduct = (size) => {
    setEditIndex(size);
    setSelectedProduct(size.product.id);
    setSelectedSize(size.id);
    setSelectedColor(size.color.id); // Lấy màu để chỉnh sửa
  };

  const handleUpdateProduct = () => {
    if (editIndex !== null) {
      const updatedItems = [...addedItems];
      updatedItems[editIndex] = {
        product: products.find(p => p.id === parseInt(selectedProduct)),
        size: sizes.find(s => s.id === parseInt(selectedSize)),
        color: colors.find(c => c.id === parseInt(selectedColor)), // Cập nhật màu
        createdAt: new Date().toLocaleDateString(),
      };
      setAddedItems(updatedItems);
      resetEditState();
    }
  };

  const resetEditState = () => {
    setEditIndex(null);
    setSelectedProduct('');
    setSelectedSize('');
    setSelectedColor(''); // Đặt lại màu
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <label className="block mb-2">
          Chọn sản phẩm:
          <select
            value={selectedProduct}
            onChange={handleProductChange}
            className="block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">-- Chọn sản phẩm --</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block mb-2">
          Chọn kích thước:
          <select
            value={selectedSize}
            onChange={handleSizeChange}
            className="block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">-- Chọn kích thước --</option>
            {sizes.map((size) => (
              <option key={size.id} value={size.id}>
                {size.name} - {size.description}
              </option>
            ))}
          </select>
        </label>

        <label className="block mb-2">
          Chọn màu:
          <select
            value={selectedColor}
            onChange={handleColorChange}
            className="block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">-- Chọn màu --</option>
            {colors.map((color) => (
              <option key={color.id} value={color.id}>
                {color.name}
              </option>
            ))}
          </select>
        </label>

        <button 
          onClick={handleAdd} 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Thêm
        </button>
      </div>

      <h2 className="text-xl font-bold mb-2">Danh sách đã thêm</h2>
      <div className="bg-white shadow-md rounded-lg p-5">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-500">
              <th className="py-3 px-6 text-left text-sm font-semibold text-white">Sản phẩm</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-white">Kích thước</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-white">Màu</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-white">Ngày tạo</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-white">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {addedItems.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-4 px-6 border-b border-gray-200">{item.product.name}</td>
                <td className="py-4 px-6 border-b border-gray-200">{item.name}</td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <span className="inline-block w-4 h-4" style={{ backgroundColor: item.color.name }}></span> {item.color.name}
                </td>
                <td className="py-4 px-6 border-b border-gray-200">{item.createdAt}</td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <button
                    onClick={() => handleEditProduct(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-300 mr-2"
                  >
                    <AiOutlineEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(item.product.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    <AiOutlineDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* {addedItems.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-4 px-6 border-b border-gray-200">{item.product.name}</td>
                <td className="py-4 px-6 border-b border-gray-200">{item.size.name} - {item.size.description}</td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <span className="inline-block w-4 h-4" style={{ backgroundColor: item.color.code }}></span> {item.color.name}
                </td>
                <td className="py-4 px-6 border-b border-gray-200">{item.createdAt}</td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <button
                    onClick={() => handleEditProduct(index)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-300 mr-2"
                  >
                    <AiOutlineEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(item.product.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    <AiOutlineDelete />
                  </button>
                </td>
              </tr>
            ))} */}

        {editIndex !== null && (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Chỉnh sửa mục đã chọn</h3>
            <label className="block mb-2">
              Chọn sản phẩm:
              <select
                value={selectedProduct}
                onChange={handleProductChange}
                className="block w-full p-2 border border-gray-300 rounded"
              >
                <option value="">-- Chọn sản phẩm --</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block mb-2">
              Chọn kích thước:
              <select
                value={selectedSize}
                onChange={handleSizeChange}
                className="block w-full p-2 border border-gray-300 rounded"
              >
                <option value="">-- Chọn kích thước --</option>
                {sizes.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.name} - {size.description}
                  </option>
                ))}
              </select>
            </label>

            <label className="block mb-2">
              Chọn màu:
              <select
                value={selectedColor}
                onChange={handleColorChange}
                className="block w-full p-2 border border-gray-300 rounded"
              >
                <option value="">-- Chọn màu --</option>
                {colors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                  </option>
                ))}
              </select>
            </label>

            <button 
              onClick={handleUpdateProduct} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Cập nhật
            </button>
            <button 
              onClick={resetEditState} 
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 ml-2"
            >
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeManagementPage;
