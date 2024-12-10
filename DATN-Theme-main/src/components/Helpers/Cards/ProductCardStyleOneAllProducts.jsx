import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuickViewIco from "../icons/QuickViewIco";
import Star from "../icons/Star";
import ThinLove from "../icons/ThinLove";

export default function ProductCardStyleOne({ data = {}, type = 1 }) {
  const navigate = useNavigate();
  const imageUrl = data.firstImage ? `/assets/images/${data.firstImage}` : '/assets/images/sanpham1.jpg';

  const handleTitleClick = () => {
    if (data.id) {
      navigate(`/products/${data.id}`);
    } else {
      console.error('Data or data.id is missing');
    }
  };

  const formatPrice = (price) => {
    if (price) {
      const priceInt = Math.floor(price);
      return priceInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
    }
    return '0 ₫';
  };

  return (
    <div className="product-card w-full max-w-xs mx-auto bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 ">
      {/* Product Image */}
      <div
        className="relative w-full h-64 bg-center bg-cover group"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 group-hover:opacity-0 transition-opacity duration-300"></div>
      </div>

      {/* Product Details */}
      <div className="product-card-details p-5">
        {/* Title */}
        <h4
          className="text-2xl font-semibold text-gray-900 cursor-pointer group-hover:text-blue-600 transition-all"
          onClick={handleTitleClick}
        >
          {data.name || 'Tên sản phẩm'}
        </h4>

        {/* Price */}
        <div className="product-card-price mt-4">
          <span className="text-lg font-bold text-gray-900">{formatPrice(data.price)}</span>
        </div>

        {/* Button "View Detail" */}
        <div className="mt-6">
          <button
            type="button"
            className={`w-full py-3 rounded-full text-white font-semibold text-lg uppercase ${type === 3 ? 'bg-blue-600' : 'bg-yellow-500'} hover:bg-opacity-90 transition-all`}
            onClick={handleTitleClick}
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-sm">Xem chi tiết</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
