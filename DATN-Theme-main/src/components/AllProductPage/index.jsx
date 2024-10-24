import { useState, useEffect } from "react";
import BreadcrumbCom from "../BreadcrumbCom";
import ProductCardStyleOne from "../Helpers/Cards/ProductCardStyleOne";
import DataIteration from "../Helpers/DataIteration";
import Layout from "../Partials/LayoutHomeFive";
import ProductsFilter from "./ProductsFilter";

export default function AllProductPage() {
  const [products, setProducts] = useState([]);
  const [filters, setFilter] = useState({
    // Các bộ lọc
  });

  const checkboxHandler = (e) => {
    const { name } = e.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
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
        console.log('Fetched Products:', data);
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Data is not an array:', data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);


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
                volume={volume}
                volumeHandler={(value) => setVolume(value)}
                storage={storage}
                filterstorage={filterStorage}
                className="mb-[30px]"
              />
              <div className="w-full hidden lg:block h-[295px]">
                <img
                  src={`/assets/images/ads-5.png`}
                  alt="Advertisement"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="products-sorting w-full bg-white md:h-[70px] flex md:flex-row flex-col md:space-y-0 space-y-5 md:justify-between md:items-center p-[30px] mb-[40px]">
                <div>
                  <p className="font-400 text-[13px]">
                    <span className="text-qgray">Hiển thị</span> 1–16 của {products.length} Kết quả
                  </p>
                </div>
                <div className="flex space-x-3 items-center">
                  <span className="font-400 text-[13px]">Sắp xếp theo:</span>
                  <div className="flex space-x-3 items-center border-b border-b-qgray">
                    <span className="font-400 text-[13px] text-qgray">Mặc định</span>
                    <span>
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M1 1L5 5L9 1" stroke="#9A9A9A" />
                      </svg>
                    </span>
                  </div>
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
                <DataIteration datas={products} startLength={0} endLength={products.length}>
                  {({ data, index }) => {
                    return (
                      <div key={data?.id || index}>
                        <ProductCardStyleOne data={data} />
                      </div>
                    );
                  }}
                </DataIteration>

              </div>

              <div className="w-full h-[164px] overflow-hidden mb-[40px]">
                <img
                  src={`/assets/images/ads-6.png`}
                  alt="Advertisement"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5 mb-[40px]">
                <DataIteration datas={products} startLength={0} endLength={products.length}>
                  {({ data }) => {
                    return (
                      <div key={data.id}>
                        <ProductCardStyleOne data={data} />
                      </div>
                    );
                  }}
                </DataIteration>


              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
