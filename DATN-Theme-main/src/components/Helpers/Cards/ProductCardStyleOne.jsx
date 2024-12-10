import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Star from '../icons/Star';
import axios from 'axios';

export default function ProductCardStyleOne({ data = {}, type = 1, productId }) {
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleTitleClick = (id) => {
    if (id) {
      navigate(`/products/${id}`);
      window.scrollTo(0, 0); // Cuộn lên đầu trang
    } else {
      console.error('Dữ liệu hoặc productId bị thiếu');
    }
  };

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

  useEffect(() => {
    fetchRelatedProducts();
  }, [productId]);

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
        <div className="flex overflow-x-auto space-x-6 p-6">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((product) => (
              <div key={product.id} className="product-card-one flex-shrink-0 w-60 h-full bg-gray-100 rounded-xl relative shadow-md group">
                <div className="product-card p-4">
                  <div
                    className="product-card-img w-full h-56 bg-cover bg-center rounded-xl"
                    style={{
                      backgroundImage: `url(${product.firstImage ? `/assets/images/${product.firstImage}` : '/assets/images/sanpham1.jpg'})`,
                    }}
                  />
                  <div className="product-card-info mt-4">
                    <h4
                      className="font-bold text-xl text-gray-800 hover:text-blue-600 cursor-pointer"
                      onClick={() => handleTitleClick(product.id)}
                    >
                      {product.name || 'Tên sản phẩm'}
                    </h4>

                  </div>

                  <div className="product-card-price mt-4">
                    <span className="text-lg font-semibold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
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
