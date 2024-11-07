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
          setNoProductsFound(false); // Reset khi có sản phẩm
        } else {
          setNoProductsFound(true); // Đánh dấu không có sản phẩm
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Có lỗi xảy ra khi kết nối với máy chủ.");
      }
    };

    fetchProducts();
  }, [param]);

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
