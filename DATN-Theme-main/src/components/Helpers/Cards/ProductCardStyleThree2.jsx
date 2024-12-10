import React from "react";
import { useNavigate } from "react-router-dom";

function ProductCardStyleThree({ datas }) {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    if (datas.id) {
      navigate(`/products/${datas.id}`);
    } else {
      console.error("Data or data.id is missing");
    }
  };

  // Định dạng giá trị tiền tệ
  const formattedPrice = datas.price
    ? `${Math.round(datas.price).toLocaleString("vi-VN")} đ`
    : "N/A";
  const formattedDiscount = datas.discount
    ? `${Math.round(datas.discount).toLocaleString("vi-VN")} %`
    : "N/A";
  const formattedOriginalPrice = datas.originalPrice
    ? `${Math.round(datas.originalPrice).toLocaleString("vi-VN")} đ`
    : "N/A";

  return (
    <div className="group bg-white shadow-md rounded-lg hover:shadow-lg transition-all duration-300 p-4">
      {/* Hình ảnh sản phẩm */}
      <div className="relative w-full h-[300px] overflow-hidden rounded-lg">
        <img
          src={`/assets/images/${datas.firstImage}`}
          alt={datas.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* Nút giảm giá */}
        <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold py-1 px-3 rounded-lg shadow-lg transform hover:scale-105">
          -{formattedDiscount}
        </div>
        {/* Nút xem chi tiết */}
        <button
          className="absolute inset-x-0 bottom-[-40px] bg-black bg-opacity-75 text-white py-2 w-full text-center rounded-lg opacity-0 group-hover:opacity-100 group-hover:bottom-0 transition-all duration-300"
          onClick={handleDetailClick}
        >
          Xem chi tiết
        </button>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="mt-4 text-center">
        {/* Tên sản phẩm */}
        <h2
          className="text-lg font-semibold text-gray-800 cursor-pointer hover:underline"
          onClick={handleDetailClick} // Điều hướng khi nhấp vào tên
        >
          {datas.name}
        </h2>
        <p className="text-sm text-gray-500 line-through">
          Giá gốc: {formattedOriginalPrice}
        </p>
        <p className="text-xl font-bold text-red-600">{formattedPrice}</p>
      </div>
    </div>
  );
}

export default ProductCardStyleThree;
