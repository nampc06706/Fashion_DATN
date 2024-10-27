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
  onCategoryChange // Thêm prop này để nhận thông báo về sự thay đổi danh mục
}) {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [volume, setVolume] = useState([100000, 1000000]); // Khởi tạo khoảng giá hợp lệ

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
  }, []); // Chỉ chạy một lần khi component được mount

  const handleCheckboxChange = (e) => {
    onCategoryChange(e); // Gọi hàm để lấy sản phẩm theo danh mục
  };



  if (error) {
    return <div>Đã xảy ra lỗi: {error.message}</div>;
  }

  return (
    <>
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
                      name={name} // Sử dụng name để kết nối với filters
                      handleChange={(e) => {
                        // Gọi hàm để cập nhật filters và lấy sản phẩm theo danh mục
                        handleCheckboxChange(e);
                        checkboxHandler(e);
                      }}
                      checked={filters[name] || false} // Đảm bảo checked là boolean
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
        </div>
        {/* Price Range Filter */}
        <div className="filter-subject-item pb-10 border-b border-qgray-border mt-10">
          <div className="subject-title mb-[30px]">
            <h1 className="text-black text-base font-500">Phạm vi giá</h1>
          </div>
          <div className="price-range mb-5">
            <Range
              draggableTrack
              step={1}
              max={1000000} // Maximum price
              min={100000}  // Minimum price
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
        </div>

        {/* Size Filter */}
        <div className="filter-subject-item pb-10 mt-10">
          <div className="subject-title mb-[30px]">
            <h1 className="text-black text-base font-500">Kích thước</h1>
          </div>
          <div className="filter-items">
            <ul>
              {[
                { id: 'sizeS', label: 'S', checked: filters.sizeS },
                { id: 'sizeM', label: 'M', checked: filters.sizeM },
                { id: 'sizeXL', label: 'XL', checked: filters.sizeXL },
                { id: 'sizeXXL', label: 'XXL', checked: filters.sizeXXL },
              ].map(({ id, label, checked }) => (
                <li key={id} className="item flex justify-between items-center mb-5">
                  <div className="flex space-x-[14px] items-center">
                    <Checkbox
                      id={id}
                      name={id}
                      handleChange={(e) => checkboxHandler(e)}
                      checked={checked}
                    />
                    <label htmlFor={id} className="text-xs font-black font-400 capitalize">
                      {label}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
