import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AiOutlineEdit } from 'react-icons/ai';
import Select from 'react-select';
const FlashSaleManagementPage = () => {

  const MySwal = withReactContent(Swal);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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


  // Hàm kiểm tra ngày tháng năm hợp lệ
  const isValidDate = (dateString) => {
    // Regex cho phép cả ngày giờ có giây hoặc không có giây
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;

    // Nếu không đúng định dạng, trả về false
    if (!regex.test(dateString)) return false;

    // Kiểm tra ngày tháng năm hợp lệ
    const date = new Date(dateString);

    // Kiểm tra ngày có hợp lệ không (NaN là không hợp lệ)
    if (isNaN(date.getTime())) return false;

    return true;
  };

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
  const handleEditFlashSale = (flashSale) => {
    setName(flashSale.name);

    // Chuyển mảng thành chuỗi hợp lệ cho Date
    const startDateValue = new Date(formatDateString(flashSale.startdate));
    const endDateValue = new Date(formatDateString(flashSale.enddate));

    // Kiểm tra nếu ngày bắt đầu và ngày kết thúc hợp lệ
    if (!isNaN(startDateValue.getTime()) && !isNaN(endDateValue.getTime())) {
      setStartDate(formatDateTimeLocal(startDateValue));
      setEndDate(formatDateTimeLocal(endDateValue));
    } else {
      console.error('Ngày không hợp lệ:', flashSale.startdate, flashSale.enddate);
    }

    setSelectedFlashSale(flashSale);
  };

  // Hàm chuyển mảng thành chuỗi định dạng yyyy-MM-ddTHH:mm:ss
  const formatDateString = (dateArray) => {
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
    return formattedDate;
  };

  // Hàm định dạng lại đối tượng Date thành định dạng datetime-local
  const formatDateTimeLocal = (date) => {
    if (!date || isNaN(date.getTime())) return '';  // Nếu không phải là ngày hợp lệ, trả về chuỗi rỗng

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };


  const handleSaveFlashSale = async (event) => {
    event.preventDefault();

    // Kiểm tra ngày bắt đầu và ngày kết thúc
    if (!isValidDate(startDate)) {
      toast.error("Ngày bắt đầu không hợp lệ.");
      return;
    }

    if (!isValidDate(endDate)) {
      toast.error("Ngày kết thúc không hợp lệ.");
      return;
    }

    // Kiểm tra nếu ngày bắt đầu > ngày kết thúc
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Ngày bắt đầu không thể lớn hơn ngày kết thúc!");
      return;
    }

    // Kiểm tra nếu startDate và endDate không hợp lệ
    if (!startDate || !endDate) {
      toast.error("Vui lòng chọn ngày bắt đầu và ngày kết thúc hợp lệ.");
      setLoading(false);
      return;
    }
    setLoading(true);
    const flashSaleData = {
      name,
      startdate: startDate,
      enddate: endDate,
    };

    const token = Cookies.get('token'); // Lấy token từ cookie

    try {
      if (selectedFlashSale) {
        // Nếu đang chỉnh sửa thì gọi PUT để cập nhật
        await axios.put(
          `http://localhost:8080/api/staff/product-flashsale/${selectedFlashSale.id}`,
          flashSaleData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        toast.success("Cập nhật Flash Sale thành công!");
      } else {
        // Nếu không có selectedFlashSale thì gọi POST để thêm mới
        const response = await axios.post(
          'http://localhost:8080/api/staff/product-flashsale/addFlashsale',
          flashSaleData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        Swal.fire({
          icon: 'success',
          title: 'Thêm Flash Sale thành công!',
          text: `Flash Sale ${response.data.name} đã được tạo.`,
        });
      }

      // Reset form và tải lại danh sách flash sales
      setName('');
      setStartDate('');
      setEndDate('');
      setSelectedFlashSale(null);
      fetchFlashSales(); // Tải lại flash sales mới
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể lưu Flash Sale. Vui lòng kiểm tra lại dữ liệu.',
      });
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm hủy, đặt lại giá trị form về mặc định
  const handleCancel = () => {
    // Reset lại các giá trị state về mặc định
    setName(''); // reset tên chương trình
    setStartDate(''); // reset ngày bắt đầu
    setEndDate(''); // reset ngày kết thúc

    // Nếu cần reset cả selectedFlashSale
    setSelectedFlashSale(null);
  };


  // Lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      if (!userInfo) {
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8080/api/guest/products`, {
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
      await axios.put(`http://localhost:8080/api/staff/product-flashsale/${id}/toggle-active`, null, {
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
      const response = await axios.get(`http://localhost:8080/api/staff/product-flashsale/flashsales`, {
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
      const response = await axios.get(`http://localhost:8080/api/staff/product-flashsale`, {
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
        const response = await axios.get(`http://localhost:8080/api/staff/product-flashsale/flashsales`, {
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
        const response = await axios.get(`http://localhost:8080/api/staff/product-flashsale`, {
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

      const response = await axios.post('http://localhost:8080/api/staff/product-flashsale/add', requestData, {
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
    MySwal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi Flash Sale?',
      icon: 'warning',
      showCancelButton: true, // Đảm bảo nút hủy hiển thị
      confirmButtonText: 'Có', // Cấu hình nút "Có"
      cancelButtonText: 'Không', // Cấu hình nút "Không"
      reverseButtons: true, // Đảo ngược thứ tự các nút (Có bên trái, Không bên phải)
      customClass: {
        confirmButton: 'bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500', // Màu cho nút "Có"
        cancelButton: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-2 focus:ring-gray-500', // Màu cho nút "Không"
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Người dùng đã chọn "Có"
        try {
          const response = await axios.delete(
            `http://localhost:8080/api/staff/product-flashsale/delete/${productId}/${flashsaleId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            toast.success(response.data); // Hiển thị thông báo thành công
            // Cập nhật danh sách sản phẩm trong flashsale sau khi xóa
            await fetchProductFlashSales();
          }
        } catch (error) {
          console.error('Lỗi khi xóa ProductFlashsale:', error);
          toast.error('Có lỗi xảy ra khi xóa ProductFlashsale.');
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Người dùng đã chọn "Không"
        toast.info('Hành động xóa đã bị hủy.');
      }
    });
  };




  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <ToastContainer position="top-right" autoClose={1000} />

      <div className="container mx-auto p-6">
        <h2 className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-red-500 via-orange-400 to-yellow-500 mb-8 text-center 
  bg-clip-text  transition-all duration-300 p-6 rounded-lg 
  hover:scale-105 transform">
          Quản lý Chương Trình Giảm Giá
        </h2>

        <form className="space-y-6" onSubmit={handleSaveFlashSale}>
          {/* Tên Chương Trình */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg font-semibold text-gray-700">
              Tên chương trình:
            </label>
            <input
              type="text"
              id="name"
              placeholder="Nhập tên chương trình"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Nút Thêm hoặc Cập Nhật */}
          <button
            type="submit"
            disabled={loading}
            className="w-40 p-4 bg-transparent text-blue-600 font-semibold border-4 border-blue-600 rounded-full shadow-xl relative overflow-hidden group focus:outline-none"
          >
            <span className="absolute inset-0 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-all duration-500 ease-in-out z-0"></span>
            <span className="relative z-10 text-blue group-hover:text-white">
              {loading ? 'Đang xử lý...' : selectedFlashSale ? 'Cập nhật' : 'Thêm mới'}
            </span>
          </button>

          {/* Nút Hủy */}
          <button
            type="button"
            onClick={handleCancel}
            className="w-40 p-4 bg-gray-200 text-gray-800 font-semibold rounded-full shadow-xl hover:bg-gray-300"
          >
            Hủy
          </button>
        </form>


      </div>

      <div className="mt-6">
        <h2 className="text-4xl font-extrabold text-red-600 mb-6 text-center 
  shadow-md hover:shadow-lg transition-all duration-300 
  p-4 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white">
          Quản lý Sản Phẩm Trong Chương Trình Giảm Giá
        </h2>


        {/* Chọn sản phẩm */}
        <div className="mb-6">
          <label className="block mb-4 text-lg font-semibold text-gray-800">
            Chọn sản phẩm:
            <Select
              value={productOptions.find(option => option.value === selectedProduct)} // Tìm giá trị phù hợp để hiển thị
              onChange={(selectedOption) => setSelectedProduct(selectedOption ? selectedOption.value : null)} // Lưu chỉ giá trị ID
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
              value={flashSaleOptions.find(option => option.value === selectedFlashSale)} // Tìm giá trị phù hợp để hiển thị
              onChange={(selectedOption) => setSelectedFlashSale(selectedOption ? selectedOption.value : null)} // Lưu chỉ giá trị ID
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
          className="w-40 p-4 bg-transparent text-blue-600 font-semibold border-4 border-blue-600 rounded-full shadow-xl relative overflow-hidden group focus:outline-none"
        >
          <span
            className="absolute inset-0 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-all duration-500 ease-in-out z-0"
          ></span>
          <span className="relative z-10 text-blue group-hover:text-white">
            {loading ? 'Đang xử lý...' : 'Thêm mới'}
          </span>
        </button>

      </div>

      {/* Danh sách Flash Sale */}
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
        <p className="text-lg font-bold text-red-600 bg-red-100 p-4 border border-red-600 rounded-md text-center mt-2 mb-5 ">
          LƯU Ý: CHỈ ĐƯỢC PHÉP BẬT 1 CHƯƠNG TRÌNH FLASH SALES!!!
        </p>
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
                      onClick={() => handleEditFlashSale(item)} // Gọi hàm handleEditFlashSale khi nhấn vào nút
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-300 mr-2"
                    >
                      <AiOutlineEdit />
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

