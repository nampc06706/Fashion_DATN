import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho toast
import QuickViewIco from '../Helpers/icons/QuickViewIco';
import Modal from 'react-modal';

// Đặt root element cho modal (nếu cần thiết, tuỳ thuộc vào thư viện sử dụng)
Modal.setAppElement('#root');



export default function ProductsTable({ className, accountId }) {
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở modal
  const token = Cookies.get('token');
  const [favourites, setFavourites] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProductImage, setCurrentProductImage] = useState("");
  let userInfo;

  if (token) {
    try {
      userInfo = jwtDecode(token);
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
    }
  }

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/favourites/account/${accountId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setFavourites(response.data);
      } catch (err) {
        setError(err.response ? err.response.data : 'Có lỗi xảy ra khi lấy dữ liệu.');
        console.error('Lỗi khi lấy danh sách yêu thích:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [accountId, token]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (favourites.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const productIds = Array.from(new Set(
          favourites.map(item => item.sizeId.product.id)
        ));

        const productRequests = productIds.map(id =>
          axios.get(`http://localhost:8080/api/guest/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );

        const responses = await Promise.all(productRequests);
        const productDetails = responses.reduce((acc, response) => {
          const product = response.data;
          acc[product.id] = product;
          return acc;
        }, {});

        setProducts(productDetails);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
        setError("Không thể lấy thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [favourites, token]);

  const handleRemoveFavourite = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/user/favourites/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFavourites(prevFavourites => prevFavourites.filter(item => item.id !== id));

      toast.success("Đã xóa sản phẩm khỏi danh sách yêu thích!");
    } catch (error) {
      console.error("Lỗi khi xóa yêu thích:", error);
      toast.error("Không thể xóa sản phẩm yêu thích.");
    }
  };
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;


  const handleOpenModal = (productImage) => {
    setCurrentProductImage(productImage);
    setIsModalOpen(true);

    // Kiểm tra phần tử có tồn tại trước khi gọi focus()
    const modalElement = document.getElementById('modal');
    if (modalElement) {
      modalElement.focus();
    }
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Trở lại focus ở nơi phù hợp khi đóng modal
    document.getElementById('openModalButton').focus();
  };

  return (
    <div className={`w-full ${className || ""}`}>
      <ToastContainer />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favourites.length > 0 ? (
          favourites.map((item) => {
            const product = products[item.sizeId.product.id] || {};
            const productPrice = parseFloat(product.price) || 0;
            return (
              <div key={item.id} className="border border-[#EDEDED] rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden group">
                {/* Hình ảnh sản phẩm */}
                <div className="relative group">
                  <img
                    src={`/assets/images/${product.firstImage}`}
                    className="w-full h-[250px] object-contain transition-transform duration-300 group-hover:scale-105"
                    alt={product.name || 'Sản phẩm'}
                  />
                  {/* Overlay và nút Quick View */}
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-50 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      id="openModalButton"
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transform transition duration-200"
                      onClick={() => handleOpenModal(product.firstImage)}
                    >
                      <QuickViewIco />
                    </button>
                  </div>
                  {/* Nút xóa khỏi danh sách yêu thích */}
                  <span
                    className="absolute top-2 right-2  p-2  cursor-pointer git transform transition duration-200 hover:scale-105"
                    onClick={() => handleRemoveFavourite(item.id)}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.7 0.3C9.3 -0.1 8.7 -0.1 8.3 0.3L5 3.6L1.7 0.3C1.3 -0.1 0.7 -0.1 0.3 0.3C-0.1 0.7 -0.1 1.3 0.3 1.7L3.6 5L0.3 8.3C-0.1 8.7 -0.1 9.3 0.3 9.7C0.7 10.1 1.3 10.1 1.7 9.7L5 6.4L8.3 9.7C8.7 10.1 9.3 10.1 9.7 9.7C10.1 9.3 10.1 8.7 9.7 8.3L6.4 5L9.7 1.7C10.1 1.3 10.1 0.7 9.7 0.3Z"
                        fill="#E07A7A"
                      />
                    </svg>
                  </span>
                </div>
                {/* Thông tin sản phẩm */}
                <div className="p-4">
                  <p className="text-lg font-semibold text-gray-800 truncate">{product.name || 'Tên sản phẩm'}</p>
                  <div className="flex gap-2 items-center mt-2"><span className="text-sm text-gray-600">Màu:</span>
                    <span
                      className="w-[15px] h-[15px] inline-block rounded-full border border-gray-400"
                      style={{ backgroundColor: item.sizeId.color.name }}
                    ></span>
                    <span className="text-sm text-gray-600">Kích thước: {item.sizeId.name || "N/A"}</span>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xl font-semibold text-qblack">{formatPrice(productPrice)}</span>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-blue-600 text-white py-2 hover:bg-blue-700 transition duration-300 ease-in-out"
                    >
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-6">
            <p className="text-lg font-medium text-gray-500">Không có sản phẩm nào trong danh sách yêu thích.</p>
          </div>
        )}
      </div>

      {/* Modal hiển thị hình ảnh */}
      <Modal
        id="modal"
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Zoom Image"
        className="relative bg-white p-4 rounded-lg max-w-[90%] max-h-[90%] overflow-hidden z-50"
        overlayClassName="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-40"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
      >
        <div className="relative bg-white p-4 rounded-lg">
          <button
            onClick={handleCloseModal}
            className="absolute top-2 right-2 bg-gray-200 rounded-full p-2 hover:bg-gray-300 focus:outline-none"
          >
            ✕
          </button>
          <img
            src={`/assets/images/${currentProductImage}`}
            className="w-full h-auto max-h-[80vh] object-contain"
            alt="Full view"
          />
        </div>
      </Modal>

    </div>
  );
}
