import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import BreadcrumbCom from "../BreadcrumbCom";
import ProductCardStyleOneAllProducts from "../Helpers/Cards/ProductCardStyleOneAllProducts";
import DataIteration from "../Helpers/DataIteration";
import Layout from "../Partials/LayoutHomeFive";
import ProductsFilter from "./ProductsFilter";
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AllProductPage() {
  const [products, setProducts] = useState([]);
  const [filters, setFilter] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const productsPerPage = 12; // Số sản phẩm trên mỗi trang
  const [sortOrder, setSortOrder] = useState("default"); // Thêm trạng thái để lưu trữ sắp xếp
  const [noProductsFound, setNoProductsFound] = useState(false); // Thêm trạng thái không tìm thấy sản phẩm

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const param = searchParams.get('s');

  useEffect(() => {
    fetchProducts();
  }, [param]);


  const fetchProducts = async () => {
    try {
      const response = param
        ? await axios.get("http://localhost:8080/api/guest/products/search", {
          params: { keyword: param, category: null }
        })
        : await axios.get("http://localhost:8080/api/guest/products");

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
        setNoProductsFound(false);
      } else {
        setNoProductsFound(true);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Có lỗi xảy ra khi kết nối với máy chủ.");
    }
  };


  // Hiển thị thông báo chỉ khi không có sản phẩm
  useEffect(() => {
    if (noProductsFound) {
      toast.error("Không tìm thấy sản phẩm.");
    }
  }, [noProductsFound]);

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

  //tìm sản phẩm theo danh mục
  const onCategoryChange = async (categoryId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/guest/products/category/${categoryId}`);
      setProducts(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const fetchProductsByPriceRange = async (minPrice, maxPrice) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/guest/products/price-range`, {
        params: { minPrice, maxPrice }
      });
      setProducts(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Lỗi khi lọc sản phẩm theo giá:", error);
    }
  };

  const handleSearchByPrice = (volume) => {
    const minPrice = volume[0]; // minPrice từ volume[0]
    const maxPrice = volume[1]; // maxPrice từ volume[1]

    if (minPrice !== "" && maxPrice !== "") {
      fetchProductsByPriceRange(minPrice, maxPrice);
    } else {
      fetchProducts(); // Gọi lại fetchProducts khi không có khoảng giá
    }
  };
  const volumeHandler = (volume) => {
    // Gọi hàm handleSearchByPrice với phạm vi giá
    handleSearchByPrice(volume);
  };
  

  const checkboxHandler = (e) => {
    const { name, checked } = e.target;

    // Cập nhật filters, chỉ giữ checkbox hiện tại là true, tất cả checkbox khác là false
    setFilter({
      [name]: checked, // Đặt trạng thái của checkbox hiện tại
    });
  };
  const resetFilters = () => {
    // Đặt lại tất cả các bộ lọc về giá trị mặc định
    setFilter({}); // Giả sử setFilter là state setter để cập nhật các bộ lọc
    
    // Nếu cần, bạn có thể gọi lại API hoặc cập nhật lại sản phẩm mặc định khi reset
    fetchProducts(); // Lấy lại tất cả sản phẩm khi bộ lọc bị reset
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
                filters={filters}
                setFilter={setFilter}
                className="mb-[30px]"
                onCategoryChange={onCategoryChange}
                handleSearchByPrice={handleSearchByPrice}
                checkboxHandler={checkboxHandler}
                volumeHandler={volumeHandler} 
                resetFilters={resetFilters}
              />
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
              </div>
              <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5 mb-[40px]">
                <DataIteration datas={currentProducts} startLength={0} endLength={currentProducts.length}>
                  {({ data, index }) => (
                    <div key={data?.id || index}>
                      <ProductCardStyleOneAllProducts data={data} />
                    </div>
                  )}
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
