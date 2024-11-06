import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SearchBox({ className, type }) {
  // viết call api ở đây rồi chuyển trang alll-product hieenrt thị dữ liệu lên
  const [searchText, setSearchText] = useState('');

  const navigate = useNavigate();


  const handleInputChange = (event) => {
    setSearchText(event.target.value); // Cập nhật giá trị state khi người dùng nhập
};

  const handleRedirect = (param) => {
      navigate('/all-products?s='+param); // Thay '/target-path' bằng đường dẫn mà bạn muốn điều hướng tới
      window.location.reload()
  };

  return (
    <div className={`w-full h-full flex items-center border border-qgray-border bg-white ${className || ""}`}>
      <div className="flex-1 bg-red-500 h-full">
        <form action="#" className="h-full" >
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
        onClick={() => handleRedirect(searchText)}
        type="button"
      >
        Tìm kiếm
      </button>
    </div>
  );
}

