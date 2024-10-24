import React from 'react';
import { useNavigate } from 'react-router-dom';
import Compair from "../icons/Compair";
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
      // Chuyển đổi giá thành số nguyên (loại bỏ phần thập phân) và định dạng với phân cách hàng nghìn
      const priceInt = Math.floor(price); // Loại bỏ phần thập phân
      return priceInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
    }
    return '0 ₫';
  };

  return (
    <div
      className="product-card-one w-full h-full bg-white relative group overflow-hidden"
      style={{ boxShadow: "0px 15px 64px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div
        className="product-card-img w-full h-[300px]"
        style={{
          background: `url(${imageUrl}) no-repeat center center/cover`,
        }}
      />

      <div className="absolute top-4 left-4 flex flex-col space-y-2 transition-transform duration-300 transform group-hover:translate-y-2 z-20">
        <button type="button" className="text-qblack group-hover:opacity-100 transition-opacity duration-300">
          <QuickViewIco />
        </button>
        <button type="button" className="text-qblack group-hover:opacity-100 transition-opacity duration-300">
          <ThinLove />
        </button>
      </div>

      <div className="product-card-details px-[30px] pb-[30px] relative">
        <div className="absolute w-full h-10 px-[30px] left-0 top-32 group-hover:top-16 transition-all duration-300 ease-in-out">
          <button
            type="button"
            className={type === 3 ? "blue-btn w-full" : "yellow-btn w-full"}
            style={{ padding: '12px 0', textAlign: 'center' }}
            onClick={handleTitleClick} // Gọi hàm điều hướng khi nhấp vào nút
          >
            <div className="flex items-center justify-center space-x-3">
              <span>
                <svg
                  width="14"
                  height="16"
                  viewBox="0 0 14 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-current"
                >
                  {/* SVG path */}
                </svg>
              </span>
              <span>Xem chi tiết</span>
            </div>
          </button>

        </div>

        <div className="product-card-title mt-5">
          <h4 className="font-700 text-lg text-qblack leading-8 cursor-pointer" onClick={handleTitleClick}>
            {data.name || 'Tên sản phẩm'}
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
          <span className="text-xl font-600 text-qblack">
            {formatPrice(data.price)}
          </span>
        </div>
      </div>
    </div>
  );
}
