import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FlashSaleManagementPage = () => {
  const [isFormVisible, setFormVisible] = useState(false);
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

  // Lấy danh sách FlashSale từ API
  useEffect(() => {
    const fetchFlashSales = async () => {
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
    fetchFlashSales();
  }, [token]);
  // Lấy danh sách ProductFlashSale từ API
  useEffect(() => {
    const fetchProductFlashSales = async () => {
      if (!userInfo) {
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8080/api/admin/product-flashsale`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        //console.log(response.data)
        setProductFlashSales(response.data);
      } catch (error) {
        // console.error('Lỗi khi lấy dữ liệu ProductFlashSale:', error);
        // toast.error('Không thể lấy dữ liệu ProductFlashSale.');
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

  const handleShowDetails = (id) => {
    //console.log("Product ID clicked:", id);  // Debug log id
    const selected = productFlashSales.find(item => item.flashsale && item.flashsale.id === id);
    //console.log("Selected FlashSale:", selected);  // Debug log selected product

    if (selected) {
      setSelectedFlashSale(selected);  // Lưu sản phẩm được chọn vào state
      setFormVisible(true);  // Hiển thị form chi tiết
    }
  };


  // Hàm đóng form khi click bên ngoài
  const handleOutsideClick = (e) => {
    if (e.target.id === 'overlay') {
      setFormVisible(false);
      setSelectedFlashSale(null);
    }
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
      <ToastContainer position="top-right" autoClose={1000} />
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
      {/* Chọn chương trình giảm giá */}
      <div className="mb-6">
        <label className="block mb-4 text-lg font-semibold text-gray-800">
          Chọn chương trình giảm giá:
          <select
            value={selectedFlashSale}
            onChange={(e) => setSelectedFlashSale(e.target.value)}
            className="block w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn chương trình giảm giá --</option>
            {flashSales.map((flashsale) => (
              <option key={flashsale.id} value={flashsale.id}>
                {flashsale.name}
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
        className="w-30 p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
      >
        Thêm vào Flash Sale
      </button>



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
                      <span className="text-red-600 font-semibold">Đã kết thúc</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className={`py-2 px-6 rounded-lg font-semibold focus:outline-none transition duration-300 ease-in-out transform ${item.isactive
                          ? "bg-green-100 text-green-600 hover:bg-green-200 hover:scale-105 focus:ring-2 focus:ring-green-500"
                          : "bg-red-100 text-red-600 hover:bg-red-200 hover:scale-105 focus:ring-2 focus:ring-red-500"
                        }`}
                    >
                      {item.isactive ? (
                        <span className="text-green-600">Tắt</span>
                      ) : (
                        <span className="text-red-600">Bật</span>
                      )}
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => item.id && handleShowDetails(item.id)} // Kiểm tra item.id trước khi gọi hàm
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


      {selectedFlashSale && selectedFlashSale.flashsale && selectedFlashSale.flashsale.id && isFormVisible && (
        <div
          id="overlay"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-8 rounded-lg shadow-xl w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-3xl font-semibold mb-6 text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
              Chi tiết Flash Sale {selectedFlashSale.flashsale.name}
            </h2>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="px-6 py-4 text-left">Hình ảnh</th>
                    <th className="px-6 py-4 text-left">Sản phẩm</th>
                    <th className="px-6 py-4 text-left">%</th>
                    <th className="px-6 py-4 text-left">Giá cũ</th>
                    <th className="px-6 py-4 text-left">Giá mới</th>
                    <th className="px-6 py-4 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {productFlashSales
                    .filter(product => product.flashsale && product.flashsale.id === selectedFlashSale.flashsale.id)
                    .map((product, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="px-6 py-3 border-b">
                          <img
                            src={`/assets/images/${product.firstImage}`}
                            alt="Product"
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </td>
                        <td className="px-6 py-3 border-b">{product.name}</td>
                        <td className="px-6 py-3 border-b font-bold text-green-500">
                          {parseInt(product.discount, 10)}%
                        </td>
                        <td className="px-6 py-3 border-b text-gray-600 line-through">
                          {Math.floor(product.originalPrice)}VND
                        </td>
                        <td className="px-6 py-3 border-b font-bold text-red-500">
                          {Math.floor(product.price)}VND
                        </td>
                        <td className="px-6 py-3 border-b">
                          <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                            XÓA
                          </button>
                        </td>

                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default FlashSaleManagementPage;

