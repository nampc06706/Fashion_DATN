import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FlashSaleManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productFlashSales, setProductFlashSales] = useState([]);
  const [flashSales, setFlashSales] = useState([]);
  const [discount, setDiscount] = useState('');
  const [selectedFlashSale, setSelectedFlashSale] = useState(null); // Trạng thái lưu thông tin Flash Sale
  const token = Cookies.get('token');
  let userInfo = null;

  if (token) {
    try {
      userInfo = jwtDecode(token);
    } catch (error) {
      console.error('Token decoding error:', error);
    }
  }

  // Lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      if (!userInfo) {
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8080/api/admin/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
        toast.error('Không thể lấy dữ liệu sản phẩm.');
      }
    };
    fetchProducts();
  }, [token]);

  // Lấy danh sách ProductFlashSale từ API
  useEffect(() => {
    const fetchProductFlashSales = async () => {
      if (!userInfo) {
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8080/api/admin/product-flashsale/flashsales`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        setFlashSales(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu ProductFlashSale:', error);
        toast.error('Không thể lấy dữ liệu ProductFlashSale.');
      }
    };
    fetchProductFlashSales();
  }, [token]);

  // Chuyển mảng thành đối tượng Date
  const convertArrayToDate = (dateArray) => {
    return new Date(
      dateArray[0], // year
      dateArray[1] - 1, // month
      dateArray[2], // day
      dateArray[3] || 0, // hour
      dateArray[4] || 0, // minute
      dateArray[5] || 0 // second
    );
  };

  // Hàm xử lý khi nhấn nút "Xem chi tiết"
  const handleShowDetails = (flashSaleId) => {
    const flashSale = productFlashSales.find(flashSale => flashSale.id === flashSaleId);
    setSelectedFlashSale(flashSale); // Cập nhật trạng thái với chương trình Flash Sale đã chọn
  };

  // Hàm xử lý khi thêm sản phẩm vào Flash Sale
  const handleAddToFlashSale = async () => {
    if (!selectedProduct || !discount) {
      toast.error('Vui lòng chọn sản phẩm và nhập mức giảm giá.');
      return;
    }

    const newFlashSaleData = {
      productId: selectedProduct,
      discount: discount,
    };

    try {
      // Giả sử có API để thêm sản phẩm vào Flash Sale
      await axios.post('http://localhost:8080/api/admin/add-to-flashsale', newFlashSaleData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      toast.success('Sản phẩm đã được thêm vào Flash Sale thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm vào Flash Sale:', error);
      toast.error('Không thể thêm sản phẩm vào Flash Sale.');
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Quản lý Flash Sale</h2>

      {/* Chọn sản phẩm */}
      <div className="mb-6">
        <label className="block mb-4 text-lg font-semibold text-gray-800">
          Chọn sản phẩm:
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="block w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn sản phẩm --</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Mức giảm giá */}
      <div className="mb-6">
        <label className="block mb-4 text-lg font-semibold text-gray-800">
          Mức giảm giá (%):
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="Nhập mức giảm giá"
            className="block w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>

      {/* Nút thêm vào Flash Sale */}
      <button
        onClick={handleAddToFlashSale}
        className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
      >
        Thêm vào Flash Sale
      </button>

      <ToastContainer position="top-center" autoClose={3000} />

      {/* Danh sách Flash Sale */}
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Danh sách Flash Sale</h2>
        <table className="w-full table-auto border-collapse bg-white shadow-sm rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Chương trình</th>
              <th className="px-4 py-3 text-left">Ngày Bắt Đầu</th>
              <th className="px-4 py-3 text-left">Ngày Kết Thúc</th>
              <th className="px-4 py-3 text-left">Trạng Thái</th>
              <th className="px-4 py-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {flashSales.length > 0 ? (
              flashSales.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{new Date(convertArrayToDate(item.startdate)).toLocaleString()}</td>
                  <td className="px-4 py-3">{new Date(convertArrayToDate(item.enddate)).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {item.isactive ? (
                      <span className="text-green-600 font-semibold">Đang diễn ra</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Kết thúc</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleShowDetails(item.id)}
                      className="text-blue-500 hover:text-blue-700 font-semibold py-2 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Không có sản phẩm nào trong Flash Sale.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Hiển thị chi tiết chương trình Flash Sale */}
      {selectedFlashSale && (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Chi tiết chương trình Flash Sale</h2>
          <div className="mb-4">
            <p className="text-gray-600">ID: {selectedFlashSale.id}</p>
            <p className="text-gray-600">Tên chương trình: {selectedFlashSale.name}</p>
            <p className="text-gray-600">Ngày bắt đầu: {new Date(convertArrayToDate(selectedFlashSale.startdate)).toLocaleString()}</p>
            <p className="text-gray-600">Ngày kết thúc: {new Date(convertArrayToDate(selectedFlashSale.enddate)).toLocaleString()}</p>
            <p className="text-gray-600">Trạng thái: {selectedFlashSale.isactive ? 'Đang diễn ra' : 'Kết thúc'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashSaleManagementPage;

