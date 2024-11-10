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
    <div className={`w-full h-full flex items-center border border-qgray-border bg-white ${className || ""}`}>
      <div className="flex-1 bg-red-500 h-full">
        <form onSubmit={(e) => { e.preventDefault(); handleRedirect(); }} className="h-full">
          <input
            value={searchText}
            onChange={handleInputChange}
            type="text"
            className="search-input"
            placeholder="Tìm kiếm sản phẩm..."
          />
        </form>
      </div>
      <div className="w-[1px] h-[22px] bg-qgray-border"></div>
      <button
        className={`w-[93px] h-full text-sm font-600 ${type === 3 ? 'bg-qh3-blue text-white' : 'search-btn'}`}
        onClick={handleRedirect}
        type="button"
      >
        Tìm kiếm
      </button>
    </div>
  );
}
