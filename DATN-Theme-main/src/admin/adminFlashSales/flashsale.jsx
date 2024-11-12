import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const FlashSaleManagementPage = () => {

  const MySwal = withReactContent(Swal);

  const [isFormVisible, setFormVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productFlashSales, setProductFlashSales] = useState([]);
  const [flashSales, setFlashSales] = useState([]);
  const [discount, setDiscount] = useState('');
  const [loading, setLoading] = useState(false);
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

  // Toggle isActive cho Flashsale
  const handleToggleIsActive = async (id) => {
    setLoading(true);
    try {
      // Gọi API toggle cho Flashsale
      await axios.put(`http://localhost:8080/api/admin/product-flashsale/${id}/toggle-active`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      toast.success('Cập nhật trạng thái Flashsale thành công!');

      // Lấy lại danh sách Flashsale sau khi cập nhật
      await fetchFlashSales();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái Flashsale.');
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách FlashSale từ API
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
      console.error('Lỗi khi lấy dữ liệu Flashsale:', error);
      toast.error('Không thể lấy dữ liệu Flashsale.');
    }
  };
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

  // Chuyển đổi dữ liệu thành định dạng phù hợp với react-select
  const flashSaleOptions = flashSales.map((flashsale) => ({
    value: flashsale.id,
    label: flashsale.name,
  }));
  // Chuyển đổi dữ liệu sản phẩm sang định dạng mà react-select yêu cầu
  const productOptions = products.map((product) => ({
    value: product.id,
    label: product.name,
  }));

  // Hàm đóng form khi click bên ngoài
  const handleOutsideClick = (e) => {
    if (e.target.id === 'overlay') {
      setFormVisible(false);
      setSelectedFlashSale(null);
    }
  };

  // Thêm sản phẩm vào Flash Sale
  const handleAddToFlashSale = async (e) => {
    e.preventDefault();

    // Kiểm tra điều kiện không hợp lệ cho discount
    if (!selectedProduct || !selectedFlashSale || !discount) {
      toast.error('Vui lòng chọn sản phẩm, flashsale và nhập mức giảm giá.');
      return;
    }

    const discountValue = parseFloat(discount);

    if (discountValue <= 0 || discountValue > 100) {
      toast.error('Mức giảm giá phải nằm trong khoảng từ 0 đến 100.');
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        productId: parseInt(selectedProduct),
        flashsaleId: parseInt(selectedFlashSale),
        discount: discountValue,
      };

      const response = await axios.post('http://localhost:8080/api/admin/product-flashsale/add', requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success('Thêm sản phẩm vào Flash Sale thành công!');
        // Lấy lại danh sách Flash Sale sau khi thêm sản phẩm
        await fetchProductFlashSales();
      }
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm vào Flash Sale:', error);
      toast.error('Có lỗi xảy ra khi thêm sản phẩm vào Flash Sale.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProductFlashsale = (productId, flashsaleId) => {
    confirmAlert({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi Flash Sale?',
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            try {
              const response = await axios.delete(`http://localhost:8080/api/admin/product-flashsale/delete/${productId}/${flashsaleId}`, {
                headers: {
                  Authorization: `Bearer ${token}`, // Đảm bảo token đã được định nghĩa đúng
                },
              });

              if (response.status === 200) {
                toast.success(response.data); // Hiển thị thông báo thành công
                // Cập nhật danh sách sản phẩm trong flashsale sau khi xóa
                await fetchProductFlashSales(); // Gọi lại API để lấy danh sách cập nhật
              }
            } catch (error) {
              console.error('Lỗi khi xóa ProductFlashsale:', error);
              toast.error('Có lỗi xảy ra khi xóa ProductFlashsale.');
            }
          },
        },
        {
          label: 'Không',
          onClick: () => {
            toast.info('Hành động xóa đã bị hủy.');
          },
        },
      ],
    });
  };



  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <ToastContainer position="top-right" autoClose={1000} />

      <div className="container mx-auto p-6">
        <h2 className="text-4xl font-extrabold text-red-600 mb-6">
          Quản lý Chương Trình Giảm Giá
        </h2>
        <form className="space-y-6">
          {/* Tên Chương Trình */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg font-semibold text-gray-700">
              Tên chương trình:
            </label>
            <input
              type="text"
              id="name"
              placeholder="Nhập tên chương trình"
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Ngày Bắt Đầu */}
          <div className="mb-4">
            <label htmlFor="startdate" className="block text-lg font-semibold text-gray-700">
              Ngày bắt đầu:
            </label>
            <input
              type="datetime-local"
              id="startdate"
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Ngày Kết Thúc */}
          <div className="mb-4">
            <label htmlFor="enddate" className="block text-lg font-semibold text-gray-700">
              Ngày kết thúc:
            </label>
            <input
              type="datetime-local"
              id="enddate"
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mức Giảm Giá */}
          <div className="mb-4">
            <label htmlFor="discount" className="block text-lg font-semibold text-gray-700">
              Mức giảm giá (%):
            </label>
            <input
              type="number"
              id="discount"
              min="1"
              max="100"
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Nút Thêm */}
          <button
            type="button"
            disabled={loading}
            className="w-30 p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Đang xử lý...' : 'Thêm mới'}
          </button>
        </form>
      </div>

      <div className="mt-6">
        <h2 className="text-4xl font-extrabold text-red-600 mb-6">
          Quản lý Sản Phẩm Trong Chương Trình Giảm Giá
        </h2>

        {/* Chọn sản phẩm */}
        <div className="mb-6">
          <label className="block mb-4 text-lg font-semibold text-gray-800">
            Chọn sản phẩm:
            <Select
              value={selectedProduct}
              onChange={(selectedOption) => setSelectedProduct(selectedOption)}
              options={productOptions}
              placeholder="Tìm sản phẩm..."
              className="mt-2"
            />
          </label>
        </div>

        {/* Chọn chương trình giảm giá */}
        <div className="mb-6">
          <label className="block mb-4 text-lg font-semibold text-gray-800">
            Chọn chương trình giảm giá:
            <Select
              value={selectedFlashSale}
              onChange={(selectedOption) => setSelectedFlashSale(selectedOption)}
              options={flashSaleOptions}
              placeholder="Tìm chương trình giảm giá..."
              className="mt-2"
            />
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
          type="button"
          onClick={handleAddToFlashSale}
          disabled={loading}
          className="w-30 p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
        >
          {loading ? 'Đang xử lý...' : 'Thêm sản phẩm'}
        </button>
      </div>

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
                      onClick={() => handleToggleIsActive(item.id)}
                      disabled={loading}
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
                          <button
                            onClick={() => handleDeleteProductFlashsale(product.id, selectedFlashSale.flashsale.id)}
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                          >
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

