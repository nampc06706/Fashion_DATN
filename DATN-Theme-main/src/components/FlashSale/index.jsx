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
  const [isExpired, setIsExpired] = useState(false); // Trạng thái kiểm tra hết hạn

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/guest/product-flashsale");
        const data = await response.json();
        console.log(data); // Log toàn bộ dữ liệu từ API để kiểm tra

        if (Array.isArray(data)) {
          setProducts(data);

          // Giả sử data[0] chứa thông tin flash sale
          if (data.length > 0 && data[0].flashsale) {
            const { name, startdate, enddate } = data[0].flashsale;

            // console.log("startdate:", startdate); // Log startdate
            // console.log("enddate:", enddate); // Log enddate

            // Chuyển đổi startdate và enddate từ chuỗi 'YYYY-MM-DD HH:mm:ss' thành Date
            const startDateStr = `${startdate[0]}-${(startdate[1] < 10 ? '0' : '') + startdate[1]}-${(startdate[2] < 10 ? '0' : '') + startdate[2]}T${(startdate[3] < 10 ? '0' : '') + startdate[3]}:${(startdate[4] < 10 ? '0' : '') + startdate[4]}:00`;
            const endDateStr = `${enddate[0]}-${(enddate[1] < 10 ? '0' : '') + enddate[1]}-${(enddate[2] < 10 ? '0' : '') + enddate[2]}T${(enddate[3] < 10 ? '0' : '') + enddate[3]}:${(enddate[4] < 10 ? '0' : '') + enddate[4]}:00`;

            // Tạo đối tượng Date từ chuỗi đã chuyển đổi
            const startDate = new Date(startDateStr);
            const endDate = new Date(endDateStr);

            // console.log("Ngày bắt đầu flash sale:", startDate);
            // console.log("Ngày kết thúc flash sale:", endDate);

            setFlashSaleInfo({
              name,
              startDate,
              endDate,
            });

            // Kiểm tra xem flash sale đã hết hạn chưa
            const currentDate = new Date();
            if (endDate && currentDate > endDate) {
              setIsExpired(true); // Đánh dấu hết hạn
            }
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

                {isExpired ? (
                  <p className="text-lg text-red-500 font-semibold">Flash Sale đã kết thúc!</p>
                ) : (
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
                )}
              </div>
            </div>
            {/* Hiển thị sản phẩm chỉ khi Flash Sale chưa kết thúc */}
            {!isExpired && (
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
            )}
          </div>
        </div>
      </div>
    </LayoutHomeFive>
  );
}
