import { useState, useEffect } from "react";
import CountDown from "../Helpers/CountDown";
import DataIteration from "../Helpers/DataIteration";
import LayoutHomeFive from "../Partials/LayoutHomeFive";
import ProductCardStyleThree2 from "../Helpers/Cards/ProductCardStyleThree2";

export default function FlashSale() {
  const [products, setProducts] = useState([]);
  const [flashSaleInfo, setFlashSaleInfo] = useState({
    name: "",
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/guest/product-flashsale");
        const data = await response.json();
        console.log(data);
        if (Array.isArray(data)) {
          setProducts(data);

          // Giả sử data[0] chứa thông tin flash sale
          if (data.length > 0 && data[0].flashsale) {
            const { name, startdate, enddate } = data[0].flashsale;

            // Chuyển đổi startdate và enddate thành đối tượng Date
            const startDate = new Date(startdate[0], startdate[1] - 1, startdate[2], startdate[3], startdate[4]);
            const endDate = new Date(enddate[0], enddate[1] - 1, enddate[2], enddate[3], enddate[4], enddate[5]);

            setFlashSaleInfo({
              name,
              startDate,
              endDate,
            });
          }
        } else {
          console.error("Data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Gọi hàm CountDown với endDate
  const { showDate, showHour, showMinute, showSecound } = CountDown(flashSaleInfo.endDate);


  return (
    <LayoutHomeFive>
      <div className="flashsale-wrapper w-full">
        <div className="container-x mx-auto">
          <div className="w-full">
            <div
              style={{
                background: `url(/assets/images/flash-sale-ads.png) no-repeat`,
                backgroundSize: "cover",
              }}
              data-aos="fade-right"
              className="flash-ad w-full h-[400px] flex sm:justify-end justify-center items-center mb-10"
            >
              <div className="sm:mr-[75px]">
                <h2 className="text-3xl text-yellow-300 font-bold mb-4 transition-transform duration-300 hover:scale-105">
                  {flashSaleInfo.name}
                </h2>
                <p className="text-lg text-gray-200 mb-2">
                  Bắt đầu: <span className="font-semibold">{flashSaleInfo.startDate ? new Date(flashSaleInfo.startDate).toLocaleString() : ''}</span>
                </p>
                <p className="text-lg text-gray-200 mb-2">
                  Kết thúc: <span className="font-semibold">{flashSaleInfo.endDate ? new Date(flashSaleInfo.endDate).toLocaleString() : ''}</span>
                </p>

                <div className="countdown-wrapper w-full flex sm:space-x-6 space-x-3 sm:justify-between justify-evenly">
                  <div className="countdown-item">
                    <div className="countdown-number sm:w-[100px] sm:h-[100px] w-[50px] h-[50px] rounded-full bg-white flex justify-center items-center">
                      <span className="font-700 sm:text-[30px] text-base text-[#EB5757]">
                        {showDate}
                      </span>
                    </div>
                    <p className="sm:text-[18px] text-xs font-500 text-center leading-8 text-white">Ngày</p>
                  </div>
                  <div className="countdown-item">
                    <div className="countdown-number sm:w-[100px] sm:h-[100px] w-[50px] h-[50px] rounded-full bg-white flex justify-center items-center">
                      <span className="font-700 sm:text-[30px] text-base text-[#2F80ED]">{showHour}</span>
                    </div>
                    <p className="sm:text-[18px] text-xs font-500 text-center leading-8 text-white">Giờ</p>
                  </div>
                  <div className="countdown-item">
                    <div className="countdown-number sm:w-[100px] sm:h-[100px] w-[50px] h-[50px] rounded-full bg-white flex justify-center items-center">
                      <span className="font-700 sm:text-[30px] text-base text-[#219653]">{showMinute}</span>
                    </div>
                    <p className="sm:text-[18px] text-xs font-500 text-center leading-8 text-white">Phút</p>
                  </div>
                  <div className="countdown-item">
                    <div className="countdown-number sm:w-[100px] sm:h-[100px] w-[50px] h-[50px] rounded-full bg-white flex justify-center items-center">
                      <span className="font-700 sm:text-[30px] text-base text-[#EF5DA8]">{showSecound}</span>
                    </div>
                    <p className="sm:text-[18px] text-xs font-500 text-center leading-8 text-white">Giây</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="products grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5">
              <DataIteration
                datas={products}
                startLength={0}
                endLength={products.length}
              >
                {({ data }) => (
                  <div key={data.id} className="item">
                    <ProductCardStyleThree2 datas={data} />
                  </div>
                )}
              </DataIteration>
            </div>
          </div>
        </div>
      </div>
    </LayoutHomeFive>
  );
}
