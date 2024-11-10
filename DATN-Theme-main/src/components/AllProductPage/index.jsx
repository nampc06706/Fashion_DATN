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
  const [allProducts, setAllProducts] = useState([]); // Lưu toàn bộ sản phẩm
  const [products, setProducts] = useState([]); // Dữ liệu hiển thị sau khi lọc
  const [filters, setFilter] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [sortOrder, setSortOrder] = useState("default");
  const [noProductsFound, setNoProductsFound] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Lấy toàn bộ danh sách sản phẩm từ API
  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/guest/products");
        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
          setAllProducts(data);
          setProducts(data);
          setNoProductsFound(false);
        } else {
          setNoProductsFound(true);
          toast.error("Không tìm thấy sản phẩm.");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Có lỗi xảy ra khi kết nối với máy chủ.");
      }
    };
    fetchInitialProducts();
  }, []);

  // Tìm kiếm sản phẩm theo từ khóa hoặc danh mục
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const keyword = searchParams.get("s");
        const category = searchParams.get("category");

        if (keyword || category) {
          const response = await axios.get("http://localhost:8080/api/guest/products/search", {
            params: { keyword, category },
          });
          const data = response.data;

          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
            setNoProductsFound(false);
          } else {
            // Nếu không có sản phẩm, cập nhật trạng thái và chỉ thông báo một lần
            if (!noProductsFound) {
              setNoProductsFound(true);
            }
            setProducts([]); // Đặt rỗng sản phẩm
          }
        } else {
          setProducts(allProducts); // Hiển thị toàn bộ sản phẩm nếu không có tìm kiếm
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Có lỗi xảy ra khi kết nối với máy chủ.");
      }
    };

    fetchProducts();
  }, [location.search, allProducts]); // Chỉ khi `noProductsFound` thay đổi

  // Xử lý khi chọn danh mục
  const onCategoryChange = async (categoryId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/guest/products/category/${categoryId}`);
      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);  // Cập nhật danh sách sản phẩm theo danh mục
        setNoProductsFound(false);
      } else {
        setProducts([]);  // Đặt rỗng nếu không tìm thấy sản phẩm
        setNoProductsFound(true);
      }
      setCurrentPage(1); // Reset trang về trang đầu tiên
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
      toast.error("Có lỗi xảy ra khi lấy sản phẩm theo danh mục.");
    }
  };

  // Cập nhật trạng thái checkbox cho danh mục, chỉ cho phép một danh mục được chọn
  const checkboxHandler = (e) => {
    const { name, checked } = e.target;

    if (checked) {
      // Nếu checkbox được chọn, lưu chỉ danh mục hiện tại
      setFilter({ [name]: true });
    } else {
      // Nếu checkbox bị bỏ chọn, xóa danh mục khỏi filters
      setFilter({});
    }
  };

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

  // Lọc theo khoảng giá
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
    const minPrice = volume[0];
    const maxPrice = volume[1];

    if (minPrice !== "" && maxPrice !== "") {
      fetchProductsByPriceRange(minPrice, maxPrice);
    }
  };

  const volumeHandler = (volume) => {
    handleSearchByPrice(volume);
  };

  const resetFilters = () => {
    setFilter({});
  };

  // Tính toán các sản phẩm cần hiển thị trên trang hiện tại
  // Tính toán các sản phẩm cần hiển thị trên trang hiện tại
const indexOfLastProduct = currentPage * productsPerPage;
const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);


  const totalPages = Math.ceil(products.length / productsPerPage);

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

              {noProductsFound && (
                <h1 className="text-center">Không tìm thấy sản phẩm phù hợp</h1>
              )}


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
                  Tiếp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
