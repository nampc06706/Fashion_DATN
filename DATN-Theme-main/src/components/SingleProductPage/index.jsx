import { useRef, useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Sửa lại jwtDecode
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import data from "../../data/products.json";
import BreadcrumbCom from "../BreadcrumbCom";
import ProductCardStyleOne from "../Helpers/Cards/ProductCardStyleOne";
import DataIteration from "../Helpers/DataIteration";
import InputCom from "../Helpers/InputCom";
import LayoutHomeFive from "../Partials/LayoutHomeFive";
import ProductView from "./ProductView";
import Reviews from "./Reviews";
import SallerInfo from "./SallerInfo";

export default function SingleProductPage() {
  const [tab, setTab] = useState("des");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [reviewLoading, setLoading] = useState(false);
  const reviewElement = useRef(null);
  const [report, setReport] = useState(false);
  const [comments, setComments] = useState([]); // Khởi tạo comments là mảng rỗng
  const [id, setId] = useState(null); // Sửa thành setId để nhất quán về tên

  const token = Cookies.get('token');
  let userInfo = null;

  if (token) {
    try {
      userInfo = jwtDecode(token);
    } catch (error) {
      console.error("Token decoding error:", error);
    }
  }

  useEffect(() => {
    const fetchRatings = async () => {
      if (!userInfo) {
        toast.error("Không tìm thấy thông tin người dùng."); // Hiển thị thông báo lỗi
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/user/ratings`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        console.log(response.data);
        setComments(response.data); // Gán dữ liệu đánh giá từ API vào state
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đánh giá:", error);
        if (error.response) {
          if (error.response.status === 403) {
            toast.error("Bạn không có quyền truy cập vào tài nguyên này.");
          } else {
            toast.error("Có lỗi xảy ra khi tải dữ liệu đánh giá.");
          }
        } else {
          toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRatings(); // Gọi hàm fetch khi `userInfo` hoặc `token` thay đổi
  }, [userInfo?.accountId, token]);

  // Function to set productId based on URL or other logic
  useEffect(() => {
    // Example logic to get productId (replace with actual logic)
    const idFromURL = 1; // Static ID example, replace with dynamic logic
    setId(idFromURL);
  }, []);


  return (
    <>
      <LayoutHomeFive childrenClasses="pt-0 pb-0">
        <div className="single-product-wrapper w-full ">
          <div className="product-view-main-wrapper bg-white pt-[30px] w-full">
            <div className="breadcrumb-wrapper w-full ">
              <div className="container-x mx-auto">
                <BreadcrumbCom
                  paths={[
                    { name: "Trang chủ", path: "/" },
                    { name: "Chi tiết sản phẩm", path: "/product-details" },
                  ]}
                />
              </div>
            </div>
            <div className="w-full bg-white pb-[60px]">
              <div className="container-x mx-auto">
                <ProductView id={id} reportHandler={() => setReport(!report)} />
              </div>
            </div>
          </div>

          <div
            className="product-des-wrapper w-full relative pb-[60px]"
            ref={reviewElement}
          >
            <div className="tab-buttons w-full mb-10 mt-5 sm:mt-0">
              <div className="container-x mx-auto">
                <ul className="flex space-x-12 ">
                  <li>
                    <span
                      onClick={() => setTab("des")}
                      className={`py-[15px] sm:text-[15px] text-sm sm:block border-b font-medium cursor-pointer ${tab === "des"
                        ? "border-qyellow text-qblack "
                        : "border-transparent text-qgray"
                        }`}
                    >
                      Cách chọn kích cỡ
                    </span>
                  </li>
                  <li>
                    <span
                      onClick={() => setTab("review")}
                      className={`py-[15px] sm:text-[15px] text-sm sm:block border-b font-medium cursor-pointer ${tab === "review"
                        ? "border-qyellow text-qblack "
                        : "border-transparent text-qgray"
                        }`}
                    >
                      Đánh giá
                    </span>
                  </li>

                </ul>
              </div>
              <div className="w-full h-[1px] bg-[#E8E8E8] absolute left-0 sm:top-[50px] top-[36px] -z-10"></div>
            </div>
            <div className="tab-contents w-full min-h-[400px] ">
              <div className="container-x mx-auto">
                {tab === "des" && (
                  <div data-aos="fade-up" className="w-full tab-content-item">
                    <h6 className="text-[18px] font-medium text-qblack mb-2">
                      Hướng dẫn chọn kích cỡ thời trang công sở nam
                    </h6>
                    <p className="text-[15px] text-qgray text-normal mb-10">
                      Để luôn tự tin và thoải mái khi mặc đồ công sở, việc chọn kích cỡ phù hợp cho từng loại trang phục là vô cùng quan trọng. Dưới đây là những gợi ý giúp bạn chọn đúng kích cỡ cho từng loại trang phục công sở phổ biến.
                    </p>
                    <div>
                      <h6 className="text-[18px] text-medium mb-4">
                        Hướng dẫn chi tiết:
                      </h6>
                      <ul className="list-disc ml-[15px]">
                        <li className="font-normal text-qgray leading-9">
                          <strong>Sơ mi:</strong>
                          <br />- Đo vòng ngực ở phần lớn nhất của ngực để tìm kích cỡ sơ mi phù hợp. Nếu số đo nằm giữa hai kích cỡ, hãy chọn kích cỡ lớn hơn để có sự thoải mái.
                          <br />- Đo vòng cổ và chọn sơ mi có vòng cổ không quá rộng hoặc quá chật khi cài cúc trên cùng. Đảm bảo bạn có thể đặt hai ngón tay giữa cổ và cổ áo mà không bị chật.
                          <br />- Độ dài tay áo nên vừa đủ che phần cổ tay và không bị ngắn khi giơ tay.
                        </li>
                        <li className="font-normal text-qgray leading-9">
                          <strong>Quần âu:</strong>
                          <br />- Đo vòng eo ở phần nhỏ nhất của eo và chọn size quần với vòng eo phù hợp. Nếu bạn không chắc chắn, hãy chọn size lớn hơn và điều chỉnh bằng dây nịt.
                          <br />- Độ dài quần lý tưởng nên chạm đến mắt cá chân, với độ rộng vừa phải để khi ngồi không bị bó.
                          <br />- Đảm bảo phần hông và đùi của quần không quá chật hoặc rộng, tạo sự thoải mái khi di chuyển.
                        </li>
                        <li className="font-normal text-qgray leading-9">
                          <strong>Áo vest:</strong>
                          <br />- Đo vòng ngực và vòng eo để chọn áo vest có độ ôm sát vừa vặn. Phần vai áo vest phải khớp với vai bạn, không bị nhô ra hoặc ôm quá sát.
                          <br />- Khi cài nút áo vest, phần ngực và eo không nên bị bó quá chặt, nhưng cũng không nên rộng quá nhiều. Khoảng cách lý tưởng là bạn có thể dễ dàng đặt một nắm tay giữa ngực và áo.
                          <br />- Chiều dài áo vest nên phủ đủ phần thắt lưng và không quá dài xuống dưới mông.
                        </li>
                        <li className="font-normal text-qgray leading-9">
                          <strong>Giày công sở:</strong>
                          <br />- Đo chiều dài và chiều rộng bàn chân để chọn kích cỡ giày đúng chuẩn. Giày không nên quá chật để tránh gây khó chịu khi đi lại cả ngày dài.
                          <br />- Để đảm bảo giày vừa vặn, hãy thử giày vào buổi chiều hoặc tối khi bàn chân hơi nở ra, điều này giúp bạn chọn được size thoải mái nhất.
                          <br />- Kiểm tra độ rộng của giày, đảm bảo rằng không có áp lực quá mức lên các ngón chân và bạn có thể cử động ngón chân một cách tự nhiên.
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {tab === "review" && (
                  <div data-aos="fade-up" className="w-full tab-content-item">
                    <h6 className="text-[18px] font-medium text-qblack mb-2">
                      Đánh giá
                    </h6>
                    {/* review-comments */}
                    <div className="w-full">
                      <Reviews
                        reviewLoading={reviewLoading}
                        comments={comments
                          .map((comment) => ({
                            id: comment.id,
                            stars: comment.stars,
                            review: comment.review,
                            fullname: comment.fullname,
                            date: comment.date.join("-"), // Chuyển đổi mảng date thành chuỗi
                          }))
                          .slice(0, 20)} // Chỉ lấy 2 comment đầu tiên
                        name={name}
                        nameHandler={(e) => setName(e.target.value)}
                        email={email}
                        emailHandler={(e) => setEmail(e.target.value)}
                        phone={phone}
                        phoneHandler={(e) => setPhone(e.target.value)}
                        message={message}
                        messageHandler={(e) => setMessage(e.target.value)}
                        rating={rating}
                        ratingHandler={setRating}
                        hoverRating={hover}
                        hoverHandler={setHover}
                      />
                    </div>
                  </div>
                )}
                {tab === "info" && (
                  <div data-aos="fade-up" className="w-full tab-content-item">
                    <SallerInfo products={data.products.slice(0, 8)} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="related-product w-full bg-white">
            <div className="container-x mx-auto">
              <div className="w-full py-[60px]">
                <h1 className="sm:text-3xl text-xl font-600 text-qblacktext leading-none mb-[30px]">
                  Sản phẩm liên quan
                </h1>
                <div
                  data-aos="fade-up"
                  className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5"
                >
                  <DataIteration datas={data.products} startLength={5} endLength={9}>
                    {({ datas }) => (
                      <>
                        {datas && datas.length > 0 ? (
                          datas.map((item, index) => (
                            <div key={item.id || index} className="item">
                              <ProductCardStyleOne datas={item} />
                            </div>
                          ))
                        ) : (
                          <p>No products available</p> // Hiển thị thông báo nếu không có sản phẩm
                        )}
                      </>
                    )}
                  </DataIteration>
                </div>
              </div>
            </div>
          </div>
        </div>
        {report && (
          <div className="w-full h-full flex fixed left-0 top-0 justify-center z-50 items-center">
            <div
              onClick={() => setReport(!report)}
              className="w-full h-full fixed left-0 right-0 bg-black  bg-opacity-25"
            ></div>
            <div
              data-aos="fade-up"
              className="sm:w-[548px] sm:h-[509px] w-full h-full bg-white relative py-[40px] px-[38px]"
              style={{ zIndex: "999" }}
            >
              <div className="title-bar flex items-center justify-between mb-3">
                <h6 className="text-2xl font-medium">Report Products</h6>
                <span
                  className="cursor-pointer"
                  onClick={() => setReport(!report)}
                >
                  <svg
                    width="54"
                    height="54"
                    viewBox="0 0 54 54"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M26.9399 54.0001C12.0678 53.9832 -0.0210736 41.827 2.75822e-05 26.9125C0.0211287 12.0507 12.1965 -0.0315946 27.115 6.20658e-05C41.9703 0.0317188 54.0401 12.2153 54 27.1404C53.9599 41.9452 41.7972 54.0191 26.9399 54.0001ZM18.8476 16.4088C17.6765 16.4404 16.9844 16.871 16.6151 17.7194C16.1952 18.6881 16.3893 19.5745 17.1363 20.3258C19.0966 22.2906 21.0252 24.2913 23.0425 26.197C23.7599 26.8745 23.6397 27.2206 23.0045 27.8305C21.078 29.6793 19.2148 31.5956 17.3241 33.4802C16.9211 33.8812 16.5581 34.3012 16.4505 34.8857C16.269 35.884 16.6953 36.8337 17.5456 37.3106C18.4382 37.8129 19.5038 37.6631 20.3394 36.8421C22.3673 34.8435 24.3866 32.8365 26.3723 30.7999C26.8513 30.3082 27.1298 30.2871 27.6193 30.7915C29.529 32.7584 31.4851 34.6789 33.4201 36.6184C33.8463 37.0447 34.2831 37.4436 34.9098 37.5491C35.9184 37.7201 36.849 37.2895 37.3196 36.4264C37.7964 35.5548 37.6677 34.508 36.8912 33.7144C34.9731 31.756 33.0677 29.7806 31.0631 27.9149C30.238 27.1467 30.3688 26.7479 31.1031 26.0535C32.9896 24.266 34.8022 22.3982 36.6338 20.5516C37.7922 19.3845 37.8914 17.9832 36.9081 17.0293C35.9501 16.1007 34.5975 16.2146 33.4623 17.3416C31.5188 19.2748 29.5649 21.1995 27.6594 23.1664C27.1446 23.6983 26.8492 23.6962 26.3343 23.1664C24.4267 21.1974 22.4664 19.2811 20.5336 17.3374C19.9997 16.7971 19.4258 16.3666 18.8476 16.4088Z"
                      fill="#F34336"
                    />
                  </svg>
                </span>
              </div>

              <div className="inputs w-full">
                <div className="w-full mb-5">
                  <InputCom
                    label="Enter Report Ttile*"
                    placeholder="Reports Headline here"
                    type="email"
                    name="name"
                    inputClasses="h-[50px]"
                    labelClasses="text-[13px] font-600 leading-[24px] text-qblack"
                  />
                </div>
                <div className="w-full mb-[40px]">
                  <h6 className="input-label  capitalize text-[13px] font-600 leading-[24px] text-qblack block mb-2 ">
                    Enter Report Note*
                  </h6>
                  <textarea
                    name=""
                    id=""
                    cols="30"
                    rows="6"
                    className="w-full focus:ring-0 focus:outline-none py-3 px-4 border border-qgray-border  placeholder:text-sm text-sm"
                    placeholder="Type Here"
                  ></textarea>
                </div>

                <button type="button" className="w-full h-[50px] black-btn">
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        )}
      </LayoutHomeFive>
    </>
  );
}
