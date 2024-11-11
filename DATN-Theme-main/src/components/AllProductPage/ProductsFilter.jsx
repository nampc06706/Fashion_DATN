import { Range } from "react-range";
import Checkbox from "../Helpers/Checkbox";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProductsFilter({
  filters,
  checkboxHandler,
  volumeHandler,
  className,
  filterToggle,
  onCategoryChange,
  handleSearchByPrice,
  resetFilters // Sử dụng resetFilters từ component cha
}) {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [volume, setVolume] = useState([100000, 1000000]);

  useEffect(() => {
    handleSearchByPrice(volume);
  }, [volume]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/guest/products/categories');
        setCategories(response.data);
      } catch (err) {
        setError(err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    onCategoryChange(categoryId);
  };

  // Hàm reset bộ lọc
  const handleResetFilters = () => {
    resetFilters(); // Gọi hàm reset từ component cha để reset các filters
    setVolume([100000, 1000000]); // Reset phạm vi giá về giá trị mặc định
    handleSearchByPrice([100000, 1000000]); // Gọi lại hàm tìm kiếm với phạm vi giá mặc định
  };

  if (error) {
    return <div>Đã xảy ra lỗi: {error.message}</div>;
  }

  return (
    <div
      className={`filter-widget w-full fixed lg:relative left-0 top-0 h-screen z-10 lg:h-auto overflow-y-scroll lg:overflow-y-auto bg-white px-[30px] pt-[40px] ${className || ""} ${filterToggle ? "block" : "hidden lg:block"}`}
    >
      {/* Lọc theo danh mục */}
      <div className="filter-subject-item pb-10 border-b border-qgray-border">
        <div className="subject-title mb-[30px]">
          <h1 className="text-black text-base font-500">Tìm sản phẩm theo danh mục</h1>
        </div>
        <div className="filter-items">
          <ul>
            {categories.map(({ id, name }) => (
              <li key={id} className="item flex justify-between items-center mb-5">
                <div className="flex space-x-[14px] items-center">
                  <Checkbox
                    id={id}
                    name={name}
                    checked={!!filters[name]}
                    handleChange={(e) => {
                      handleCategoryClick(id);
                      checkboxHandler(e);
                    }}
                  />
                  <label htmlFor={id} className="text-xs font-black font-400 capitalize">
                    {name}
                  </label>
                </div>
                <span className="cursor-pointer">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect y="4" width="10" height="2" fill="#C4C4C4" />
                    <rect x="6" width="10" height="2" transform="rotate(90 6 0)" fill="#C4C4C4" />
                  </svg>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <button
          className="reset-button mt-4 px-4 py-2 bg-gray-200 text-sm text-black rounded hover:bg-gray-300"
          onClick={handleResetFilters} // Gọi hàm handleResetFilters khi nhấn nút Reset
        >
          Đặt Lại Bộ Lọc
        </button>
      </div>

      {/* Phạm vi giá */}
      <div className="filter-subject-item pb-10 border-b border-qgray-border mt-10">
        <div className="subject-title mb-[30px]">
          <h1 className="text-black text-base font-500">Phạm vi giá</h1>
        </div>
        <div className="price-range mb-5">
          <Range
            draggableTrack
            step={1}
            max={1000000}
            min={100000}
            values={volume}
            onChange={(values) => {
              setVolume(values);
              volumeHandler(values);
            }}
            renderTrack={({ props, children }) => (
              <div {...props} className="h-1 w-full bg-qgray-border rounded-md">
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div {...props} className="h-4 w-4 bg-qyellow rounded-full" />
            )}
          />
        </div>
        <p className="text-xs text-qblack font-400">
          Giá: Từ {volume[0]} Đến {volume[1]}
        </p>
        <button
          className="reset-button mt-4 px-4 py-2 bg-gray-200 text-sm text-black rounded hover:bg-gray-300"
          onClick={handleResetFilters} // Gọi lại hàm handleResetFilters khi nhấn nút Reset phạm vi giá
        >
          Đặt Lại Phạm Vi Giá
        </button>
      </div>

    </div>
  );
}
