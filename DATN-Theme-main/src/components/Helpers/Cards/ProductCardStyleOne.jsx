
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Star from '../icons/Star';
import axios from 'axios';

export default function ProductCardStyleOne({ data = {}, type = 1, productId }) {
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm điều hướng đến trang chi tiết sản phẩm
  const handleTitleClick = (id) => {
    if (id) {
      navigate(`/products/${id}`);
    } else {
      console.error('Dữ liệu hoặc productId bị thiếu');
    }
  };

  // Hàm lấy sản phẩm liên quan từ API
  const fetchRelatedProducts = async () => {
    if (productId) {
      try {
        const response = await axios.get(`http://localhost:8080/api/guest/products/related?productId=${productId}`);
        if (response.data && Array.isArray(response.data)) {
          setRelatedProducts(response.data);
        } else {
          console.error('Dữ liệu không hợp lệ:', response.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm liên quan:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Gọi hàm để lấy sản phẩm liên quan khi component được mount
  useEffect(() => {
    fetchRelatedProducts();
  }, [productId]);

  // Hàm định dạng giá
  const formatPrice = (price) => {
    if (price) {
      const priceInt = Math.floor(price);
      return priceInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
    }
    return '0 ₫';
  };

  return (
    <div>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="flex overflow-x-auto space-x-4 p-4">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((product) => (
              <div key={product.id} className="product-card-one flex-shrink-0 w-48 h-full bg-white relative group shadow-lg">
                <div className="product-card">
                  <div
                    className="product-card-img w-full h-48"
                    style={{
                      background: `url(${product.firstImage ? `/assets/images/${product.firstImage}` : '/assets/images/sanpham1.jpg'}) no-repeat center center/cover`,
                    }}
                  />
                  <div className="product-card-title mt-2">
                    <h4
                      className="font-bold text-lg text-qblack leading-8 cursor-pointer"
                      onClick={() => handleTitleClick(product.id)}
                    >
                      {product.name || 'Tên sản phẩm'}
                    </h4>
                    <div className="product-card-rating flex items-center mt-1 space-x-1">
                      <Star />
                      <Star />
                      <Star />
                      <Star />
                      <Star />
                    </div>
                  </div>

                  <div className="product-card-price mt-3">
                    <span className="text-xl font-semibold text-qblack">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
                <div className="product-card-details relative">
                  {/* Nút thụt xuống bình thường */}
                  <div className="absolute w-full h-10 left-0 top-0 transition-all duration-300 ease-in-out">
                    <button
                      type="button"
                      className={`w-full ${type === 3 ? 'blue-btn' : 'yellow-btn'}`}
                      style={{ padding: '12px 0', textAlign: 'center' }}
                      onClick={() => handleTitleClick(product.id)}
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <span>Xem chi tiết</span>
                      </div>
                    </button>
                  </div>


                </div>
              </div>
            ))
          ) : (
            <p>Không có sản phẩm liên quan nào.</p>
          )}

        </div>
      )}
    </div>
  );
}
