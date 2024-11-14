import { useState, useEffect } from 'react';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { SketchPicker } from 'react-color';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';


const SizeManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedSize, setSelectedSize] = useState({ id: '', name: '' });
  const [selectedStock, setSelectedStock] = useState('');
  const [addedItems, setAddedItems] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#FF0000'); // Mặc định là màu trắng
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số phần tử mỗi trang
  const token = Cookies.get('token');
  let userInfo = null;

  if (token) {
    try {
      userInfo = jwtDecode(token);
    } catch (error) {
      console.error("Token decoding error:", error);
    }
  }

  // Chuyển đổi danh sách sản phẩm sang định dạng options của react-select
  const productOptions = products.map((product) => ({
    value: product.id,
    label: product.name,
  }));

  // Hàm phân trang: Tính toán số phần tử hiển thị trên mỗi trang
  const totalPages = Math.ceil(addedItems.length / itemsPerPage);
  const currentItems = addedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Tạo các trang hiển thị
  const generatePageNumbers = () => {
    const pageNumbers = [];

    // Chỉ hiển thị 3 trang gần với trang hiện tại
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);

    // Thêm trang đầu
    if (start > 1) pageNumbers.push(1);
    // Nếu không phải trang đầu, thêm dấu ba chấm
    if (start > 2) pageNumbers.push('...');

    // Thêm các trang gần với trang hiện tại
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    // Nếu không phải trang cuối, thêm dấu ba chấm
    if (end < totalPages - 1) pageNumbers.push('...');
    // Thêm trang cuối
    if (end < totalPages) pageNumbers.push(totalPages);

    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();


  useEffect(() => {
    const fetchProducts = async () => {
      if (!userInfo) {
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8080/api/staff/products`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true,
        });

        const responseSize = await axios.get(`http://localhost:8080/api/staff/size`, {
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
      } finally {
        console.log();
        // loading
      }
    };
    fetchProducts();
  }, [token]);


  // Hàm gọi API để thêm Size và tạo Color mới
  const addSize = async () => {
    // Kiểm tra nếu không chọn màu sắc, sản phẩm hoặc kích thước
    if (!selectedColor || !selectedProduct || !selectedSize) {
      console.log('Vui lòng chọn đủ thông tin trước khi thêm Size!');
      toast.error('Vui lòng chọn đủ thông tin trước khi thêm Size!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      // Log dữ liệu trước khi gửi
      console.log('Dữ liệu sẽ được gửi:', {
        colorName: selectedColor,
        productId: selectedProduct,
        sizeName: selectedSize.name,
        quantityInStock: selectedStock
      });

      // Mã hóa màu sắc
      const colorName = encodeURIComponent(selectedColor);
      const sizeName = selectedSize.name;
      const productId = selectedProduct;
      const quantityInStock = selectedStock;

      // Gửi yêu cầu thêm Size
      const response = await axios.post(
        `http://localhost:8080/api/staff/size/add?colorName=${colorName}&productId=${productId}`,
        {
          name: sizeName,
          quantityInStock: quantityInStock,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      console.log('Thêm Size thành công:', response.data);
      toast.success('Thêm Size thành công!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Cập nhật lại danh sách các item trong state
      setAddedItems([...addedItems, response.data]);

    } catch (error) {
      console.error('Lỗi khi thêm Size:', error);
      toast.error('Lỗi khi thêm Size!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // Hàm gọi API để cập nhật Size
  const updateSize = async () => {
    if (!selectedSize || !selectedSize.id) {
      console.log('Vui lòng chọn một size để cập nhật!');
      toast.error('Vui lòng chọn một size để cập nhật!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return; // Dừng lại nếu chưa chọn size
    }

    try {
      // Log dữ liệu trước khi gửi
      console.log('Dữ liệu sẽ được gửi:', {
        id: selectedSize.id,
        name: selectedSize.name,
        colorName: selectedColor,
        productId: selectedProduct,
        quantityInStock: selectedStock
      });

      const { id, name } = selectedSize;
      const colorName = selectedColor;
      const productId = selectedProduct;
      const quantityInStock = selectedStock;

      const response = await axios.post(
        `http://localhost:8080/api/staff/size/update?colorName=${encodeURIComponent(colorName)}&productId=${productId}`,
        {
          id: id, // Gửi id size
          name: name, // Gửi name size
          quantityInStock: quantityInStock
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      console.log('Cập nhật Size thành công:', response.data);
      toast.success('Cập nhật Size thành công!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Cập nhật lại danh sách các item trong state
      const updatedItems = addedItems.map(item =>
        item.id === id ? response.data : item
      );
      setAddedItems(updatedItems);

    } catch (error) {
      console.error('Lỗi khi cập nhật Size:', error);
      toast.error('Lỗi khi cập nhật Size!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };




  const handleProductChange = (selectedOption) => {
    setSelectedProduct(selectedOption ? selectedOption.value : ""); // Lưu giá trị khi có lựa chọn
  };


  const deleteSize = async (sizeId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/staff/size/delete/${sizeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Size đã được xóa thành công", {
          position: "top-right",
          autoClose: 1000,
        });
        setAddedItems(addedItems.filter(item => item.id !== sizeId));
      } else {
        toast.error("Có lỗi xảy ra khi xóa Size.", {
          position: "top-right",
          autoClose: 1000,
        });
      }


      // Cập nhật lại danh sách size sau khi xóa
      setAddedItems(addedItems.filter(item => item.id !== sizeId));
    } catch (error) {
      console.error('Lỗi khi xóa Size:', error);
      toast.error('Lỗi khi xóa Size!', {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.hex); // Cập nhật màu khi người dùng chọn
  };
  const handleSizeChange = (e) => {
    const selectedOption = e.target.value.trim(); // Nhận giá trị size name

    // Tìm size từ danh sách sản phẩm
    const selectedSizeObject = sizes.find(size => size.name.toLowerCase() === selectedOption.toLowerCase());

    if (selectedSizeObject) {
      // Nếu tìm thấy trong danh sách sizes, chỉ cập nhật name, giữ nguyên id
      setSelectedSize(prevState => ({
        ...prevState,
        name: selectedSizeObject.name, // Cập nhật name mới
      }));
    } else {
      // Nếu không tìm thấy trong danh sách sizes, chỉ cập nhật name mới, giữ nguyên id
      setSelectedSize(prevState => ({
        ...prevState,
        name: selectedOption,  // Cập nhật name mới
      }));
    }
  };
  const handleStockChange = (e) => {
    setSelectedStock(e.target.value);
  };

  const handleEditProduct = (size) => {
    setEditIndex(size);
    setSelectedProduct(size.product.id);

    // Sửa phần này: Đảm bảo bạn đang set đúng đối tượng cho selectedSize
    setSelectedSize({ id: size.id, name: size.name }); // Cập nhật cả id và name
    setSelectedStock(size.quantityInStock);

    if (size.color && size.color.name) {
      setSelectedColor(size.color.name);
    } else {
      console.error("Color name is missing or invalid.");
      setSelectedColor('#FFFFFF'); // Đặt mặc định là trắng nếu không có màu
    }
  };

  const resetEditState = () => {
    setEditIndex(null);  // Reset chỉ số edit nếu có
    setSelectedProduct('');  // Đặt lại sản phẩm
    setSelectedSize({ id: '', name: '' });  // Đặt lại kích thước, id và name về mặc định
    setSelectedStock('');  // Đặt lại số lượng tồn kho về mặc định
    setSelectedColor('#FF0000');  // Đặt lại màu mặc định, nếu cần

    toast.info("Đã đặt lại trạng thái!", {
      position: "top-right",
      autoClose: 1000,
    });
  };



  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg">
      <ToastContainer position="top-right" autoClose={1000} />
      <div className="mb-6">
        <label className="block mb-4 text-lg font-semibold text-gray-800">
          Chọn sản phẩm:
          <Select
            value={productOptions.find((option) => option.value === selectedProduct)} // Gán giá trị hiện tại
            onChange={handleProductChange}
            options={productOptions} // Danh sách sản phẩm
            placeholder="-- Chọn sản phẩm --"
            className="mt-2"
            styles={{
              control: (base) => ({
                ...base,
                padding: "3px",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                boxShadow: "none",
                "&:hover": { borderColor: "#3b82f6" },
              }),
            }}
          />
        </label>

        <label className="block mb-4 text-lg font-semibold text-gray-800">
          Nhập kích thước:
          <input
            type="text"
            value={selectedSize.name}  // Gắn giá trị từ selectedSize.name
            onChange={handleSizeChange} // Gọi hàm handleSizeChange khi giá trị thay đổi
            placeholder="Nhập kích thước (ví dụ: S, M, L, XL)"
            className="block w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </label>

        <label className="block mb-4 text-lg font-semibold text-gray-800">
          Nhập số lượng tồn kho:
          <input
            type="text"
            value={selectedStock}
            onChange={handleStockChange}
            placeholder="Nhập số lượng tồn kho (ví dụ: 10, 20, 30, 100)"
            className="block w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </label>

        <div className="relative mb-6">
          <label className="block mb-2 text-lg font-semibold text-gray-800">
            Chọn màu:
          </label>
          <div
            onClick={() => setDisplayColorPicker(!displayColorPicker)}
            className="w-12 h-12 rounded-full cursor-pointer transition-transform duration-200 transform hover:scale-105 shadow-lg"
            style={{ backgroundColor: selectedColor }}
          ></div>

          {displayColorPicker && (
            <div className="absolute mt-2 z-10 bg-white p-4 rounded-lg shadow-2xl">
              <div
                className="fixed inset-0 bg-transparent"
                onClick={() => setDisplayColorPicker(false)}
              />
              <SketchPicker
                color={selectedColor}
                onChange={handleColorChange}
                disableAlpha={true}
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          {editIndex !== null ? (
            <>
              <button
                onClick={() => {
                  // Kiểm tra nếu chưa chọn một size hợp lệ
                  if (!selectedSize || !selectedSize.id) {
                    toast.error('Vui lòng chọn một size để cập nhật!', {
                      position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                    return; // Dừng lại nếu chưa chọn size
                  }
                  updateSize(selectedSize.id); // Truyền sizeId vào hàm
                }}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Cập nhật
              </button>

              <button
                onClick={resetEditState}
                className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
              >
                Đặt lại
              </button>
            </>
          ) : (
            <button
              onClick={addSize}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
              Thêm
            </button>
          )}
        </div>

      </div>

      <div className="container mx-auto p-6 bg-gray-50 rounded-lg ">
        <h2 className="text-2xl font-bold mb-6">Quản lý Kích thước Sản phẩm</h2>
        <div className="bg-white rounded-xl overflow-hidden">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wider">Sản phẩm</th>
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wider">Kích thước</th>
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wider">Màu</th>
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wider">Tồn kho</th>
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    Không có dữ liệu để hiển thị
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-300">
                    <td className="py-4 px-6 border-b">{item.product.name}</td>
                    <td className="py-4 px-6 border-b">{item.name}</td>
                    <td className="py-4 px-6 border-b flex items-center gap-2">
                      <span
                        className="inline-block w-6 h-6 rounded-full border border-gray-200"
                        style={{ backgroundColor: item.color.name }}
                      ></span>
                      {item.color.name}
                    </td>
                    <td className="py-4 px-6 border-b text-gray-600">{item.quantityInStock}</td>
                    <td className="py-4 px-6 border-b flex gap-3">
                      <button
                        onClick={() => handleEditProduct(item)}
                        className="flex items-center justify-center bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors duration-300 shadow-sm"
                        aria-label="Chỉnh sửa"
                      >
                        <AiOutlineEdit size={20} />
                      </button>
                      <button
                        onClick={() => deleteSize(item.id)}
                        className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 shadow-sm"
                        aria-label="Xóa"
                      >
                        <AiOutlineDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Phân trang */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 mx-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              disabled={currentPage === 1}
            >
              Trước
            </button>

            {/* Hiển thị các trang */}
            {pageNumbers.map((number, index) => (
              <button
                key={index}
                onClick={() => {
                  if (number !== '...') handlePageChange(number);
                }}
                className={`px-4 py-2 mx-2 text-lg rounded-lg ${number === currentPage
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-blue-500 border border-blue-500'
                  } hover:bg-blue-600 hover:text-white transition-colors duration-300`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 mx-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              disabled={currentPage === totalPages}
            >
              Sau
            </button>
          </div>
        </div>
      </div>

    </div>

  );
};

export default SizeManagementPage;
