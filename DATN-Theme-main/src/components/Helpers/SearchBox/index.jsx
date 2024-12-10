import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SearchBox({ className, type }) {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleRedirect = () => {
    if (searchText.trim()) {
      navigate(`/all-products?s=${searchText.trim()}`);
      window.location.reload();
    }
  };

  return (
    <div className={`flex items-center w-full max-w-xl mx-auto  ${className || ""}`}>
      {/* Vùng nhập tìm kiếm */}
      <div className="flex-1 flex items-center rounded-l-full  p-3">
        <input
          value={searchText}
          onChange={handleInputChange}
          type="text"
          className="w-full text-sm px-5 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
          placeholder="Tìm kiếm sản phẩm..."
        />
      </div>

      {/* Vùng nút tìm kiếm */}
      <button
        className="h-full px-6 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-r-full flex items-center justify-center hover:from-gray-600 hover:to-gray-800 transition-all duration-300 shadow-md"
        onClick={handleRedirect}
        type="button"
      >
        <span className="text-sm font-medium">Tìm kiếm</span>
      </button>

    </div>
  );
}
