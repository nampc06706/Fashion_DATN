import { Link } from "react-router-dom";
import CountDown from "../Helpers/CountDown";
import { useState, useEffect } from "react";

export default function CampaignCountDown({ className, lastDate }) {
  const [products, setProducts] = useState([]);
  const [flashSaleInfo, setFlashSaleInfo] = useState({
    name: "",
    startDate: null,
    endDate: null,
  });
  const [flashSaleActive, setFlashSaleActive] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/guest/product-flashsale");
        const data = await response.json();
        //console.log(data);

        if (Array.isArray(data)) {
          setProducts(data);

          // Kiểm tra xem dữ liệu có chứa thông tin flashsale không
          if (data.length > 0 && data[0].flashsale) {
            const { name, startdate, enddate } = data[0].flashsale;

            // Chuyển đổi startdate và enddate thành đối tượng Date
            if (startdate && enddate) {
              const startDate = new Date(startdate[0], startdate[1] - 1, startdate[2], startdate[3], startdate[4]);
              const endDate = new Date(enddate[0], enddate[1] - 1, enddate[2], enddate[3], enddate[4], enddate[5]);

              setFlashSaleInfo({
                name,
                startDate,
                endDate,
              });

              // Kiểm tra xem flash sale có đang diễn ra không
              const currentDate = new Date();
              setFlashSaleActive(currentDate >= startDate && currentDate <= endDate);
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
    <div className={`w-full lg:h-[460px] ${className || ""}`}>
      <div className="container-x mx-auto h-full">
        <div className="items-center h-full">
          <div
            data-aos="fade-right"
            className="campaign-countdown h-full w-full mb-5 lg:mb-0"
            style={{
              background: `url(/assets/images/flashsale.png) no-repeat`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {flashSaleActive ? (
              <Link to="/flash-sale">
                <div className="w-full xl:p-12 p-5">
                  <div className="countdown-wrapper w-full flex space-x-[23px] mb-10">
                    {/* Countdown Items */}
                    <div className="countdown-item">
                      <div className="countdown-number sm:w-[120px] sm:h-[120px] w-[60px] h-[60px] rounded-full bg-white flex justify-center items-center shadow-lg transition-all hover:bg-red-600 hover:text-white">
                        <span className="font-700 sm:text-[36px] text-[16px] text-[#EB5757]">
                          {showDate}
                        </span>
                      </div>
                      <p className="sm:text-[18px] text-[14px] font-500 text-center leading-8 text-white">
                        Ngày
                      </p>
                    </div>
                    <div className="countdown-item">
                      <div className="countdown-number sm:w-[120px] sm:h-[120px] w-[60px] h-[60px] rounded-full bg-white flex justify-center items-center shadow-lg transition-all hover:bg-blue-600 hover:text-white">
                        <span className="font-700 sm:text-[36px] text-[16px] text-[#2F80ED]">
                          {showHour}
                        </span>
                      </div>
                      <p className="sm:text-[18px] text-[14px] font-500 text-center leading-8 text-white">
                        Giờ
                      </p>
                    </div>
                    <div className="countdown-item">
                      <div className="countdown-number sm:w-[120px] sm:h-[120px] w-[60px] h-[60px] rounded-full bg-white flex justify-center items-center shadow-lg transition-all hover:bg-green-600 hover:text-white">
                        <span className="font-700 sm:text-[36px] text-[16px] text-[#219653]">
                          {showMinute}
                        </span>
                      </div>
                      <p className="sm:text-[18px] text-[14px] font-500 text-center leading-8 text-white">
                        Phút
                      </p>
                    </div>
                    <div className="countdown-item">
                      <div className="countdown-number sm:w-[120px] sm:h-[120px] w-[60px] h-[60px] rounded-full bg-white flex justify-center items-center shadow-lg transition-all hover:bg-pink-600 hover:text-white">
                        <span className="font-700 sm:text-[36px] text-[16px] text-[#EF5DA8]">
                          {showSecound}
                        </span>
                      </div>
                      <p className="sm:text-[18px] text-[14px] font-500 text-center leading-8 text-white">
                        Giây
                      </p>
                    </div>
                  </div>
                  {/* <div className="countdown-title mb-4 text-center text-white">
                    <h1 className="text-[48px] font-medium tracking-tight mb-4">
                      ỐI! Giảm giá chớp nhoáng
                    </h1>
                    <p className="text-[20px] leading-8 max-w-lg mx-auto">
                      Bạn nhận được ưu đãi hơn 2k Sản phẩm tốt nhất trong Flash với một chiếc áo có hình dạng đặc biệt để bán.
                    </p>
                  </div> */}
                  <div className="w-[120px] h-10 border-b-4 border-white">
                    <div className="h-full inline-flex space-x-2 items-center justify-center">
                      <span className="text-lg font-semibold tracking-wide leading-7 text-white">
                        Mua ngay
                      </span>
                      <span>
                        <svg
                          width="7"
                          height="11"
                          viewBox="0 0 7 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="2.08984"
                            y="0.636719"
                            width="6.94219"
                            height="1.54271"
                            transform="rotate(45 2.08984 0.636719)"
                            fill="#fff"
                          />
                          <rect
                            x="7"
                            y="5.54492"
                            width="6.94219"
                            height="1.54271"
                            transform="rotate(135 7 5.54492)"
                            fill="#fff"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="text-center">
                <p className="text-xl text-red-600 font-bold">Hiện tại không có chương trình giảm giá chớp nhoáng!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  );
}
