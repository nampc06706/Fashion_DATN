import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import QuickViewIco from "../icons/QuickViewIco";

// Cấu hình mặc định cho modal
Modal.setAppElement("#root");

function ProductCardStyleThree({ datas }) {
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở modal
  const navigate = useNavigate();

  const handleDetailClick = () => {
    if (datas.id) {
      navigate(`/products/${datas.id}`);
    } else {
      console.error("Data or data.id is missing");
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const formattedPrice = datas.price
    ? `${Math.round(datas.price).toLocaleString("vi-VN")} ₫`
    : "N/A";

  return (
    <div className="group w-full max-w-[300px] bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Hình ảnh */}
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={`/assets/images/${datas.firstImage}`}
          alt={datas.name}
          className="w-full h-[250px] object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* Nút chức năng */}
        <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-50 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
            onClick={handleOpenModal} // Mở modal khi nhấn nút
          >
            <QuickViewIco />
          </button>
        </div>
      </div>

      {/* Nội dung */}
      <div className="p-4 flex flex-col items-center">
        <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">
          {datas.name}
        </h2>
        <p className="text-sm text-gray-600 mb-4">{formattedPrice}</p>
        <button
          onClick={handleDetailClick}
          className="w-full py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
        >
          Xem chi tiết
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Zoom Image"
        className="flex justify-center items-center inset-0 bg-black bg-opacity-50 p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75"
      >
        <div className="relative bg-white p-4 rounded-lg">
          <button
            onClick={handleCloseModal}
            className="absolute top-2 right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300"
          >
            ✕
          </button>
          <img
            src={`/assets/images/${datas.firstImage}`}
            alt={datas.name}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
        </div>
      </Modal>
    </div>
  );
}

export default ProductCardStyleThree;
