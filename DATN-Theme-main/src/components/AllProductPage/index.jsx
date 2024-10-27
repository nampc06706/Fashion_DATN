import { useState, useEffect } from "react";
import BreadcrumbCom from "../BreadcrumbCom";
import ProductCardStyleOne from "../Helpers/Cards/ProductCardStyleOne";
import DataIteration from "../Helpers/DataIteration";
import Layout from "../Partials/LayoutHomeFive";
import ProductsFilter from "./ProductsFilter";
import axios from 'axios';


export default function AllProductPage() {
  const [products, setProducts] = useState([]);
  const [filters, setFilter] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const productsPerPage = 12; // Số sản phẩm trên mỗi trang
  const [sortOrder, setSortOrder] = useState("default"); // Thêm trạng thái để lưu trữ sắp xếp

  const checkboxHandler = (e) => {
    const { name, checked } = e.target; // Lấy name và checked từ sự kiện
    setFilter((prevState) => ({
      ...prevState,
      [name]: checked, // Sử dụng checked thay vì đảo ngược trạng thái
    }));
  };


  const [volume, setVolume] = useState([200, 500]);
  const [storage, setStorage] = useState(null);
  const filterStorage = (value) => setStorage(value);
  const [filterToggle, setToggle] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/guest/products");
        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Hàm để xử lý sự kiện thay đổi sắp xếp
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Sắp xếp danh sách sản phẩm dựa trên trạng thái sắp xếp
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOrder) {
      case "priceAsc":
        return a.price - b.price; // Giá thấp đến cao
      case "priceDesc":
        return b.price - a.price; // Giá cao đến thấp
      default:
        return 0; // Sắp xếp mặc định
    }
  });


  // Hàm để xử lý thay đổi danh mục
  const onCategoryChange = async (e) => {
    const selectedCategory = e.target.name; // Lấy danh mục đã chọn
    // Logic lấy sản phẩm dựa trên danh mục
    try {
      const response = await axios.get(`http://localhost:8080/api/guest/products?category=${selectedCategory}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  // Tính toán các sản phẩm cần hiển thị trên trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage; // Chỉ số sản phẩm cuối cùng
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage; // Chỉ số sản phẩm đầu tiên
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct); // Sản phẩm hiển thị trên trang hiện tại

  // Tính toán tổng số trang
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  return (
    <Layout>
      <div className="products-page-wrapper w-full">
        <div className="container-x mx-auto">
          <BreadcrumbCom />
          <div className="w-full lg:flex lg:space-x-[30px]">
            <div className="lg:w-[270px]">
              <ProductsFilter
                filterToggle={filterToggle}
                filterToggleHandler={() => setToggle(!filterToggle)}
                filters={filters}
                checkboxHandler={checkboxHandler}
                onCategoryChange={onCategoryChange}
                volume={volume}
                volumeHandler={(value) => setVolume(value)}
                storage={storage}
                filterstorage={filterStorage}
                className="mb-[30px]"
              />

              <div className="w-full hidden lg:block h-[295px]">
                <img
                  src={`/assets/images/blog-details-2.jpg`}
                  alt="Advertisement"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="products-sorting w-full bg-white md:h-[70px] flex md:flex-row flex-col md:space-y-0 space-y-5 md:justify-between md:items-center p-[30px] mb-[40px]">
                <div>
                  <p className="font-400 text-[13px]">
                    <span className="text-qgray">Hiển thị</span> {indexOfFirstProduct + 1}–{Math.min(indexOfLastProduct, sortedProducts.length)} của {sortedProducts.length} Kết quả
                  </p>
                </div>
                <div className="flex space-x-3 items-center">
                  <span className="font-400 text-[13px]">Sắp xếp theo:</span>
                  <select
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="border-b border-b-qgray text-[13px] outline-none"
                  >
                    <option value="default">Mặc định</option>
                    <option value="priceAsc">Giá thấp đến cao</option>
                    <option value="priceDesc">Giá cao đến thấp</option>
                  </select>
                </div>
                <button
                  onClick={() => setToggle(!filterToggle)}
                  type="button"
                  className="w-10 lg:hidden h-10 rounded flex justify-center items-center border border-qyellow text-qyellow"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </button>
              </div>
              <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5 mb-[40px]">
                <DataIteration datas={currentProducts} startLength={0} endLength={currentProducts.length}>
                  {({ data, index }) => {
                    return (
                      <div key={data?.id || index}>
                        <ProductCardStyleOne data={data} />
                      </div>
                    );
                  }}
                </DataIteration>
              </div>

              <div className="flex justify-center mb-[40px]">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="bg-qyellow text-white px-4 py-2 rounded-l-md"
                >
                  Trước
                </button>
                <span className="px-4 py-2">{currentPage} / {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="bg-qyellow text-white px-4 py-2 rounded-r-md"
                >
                  Kế tiếp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
