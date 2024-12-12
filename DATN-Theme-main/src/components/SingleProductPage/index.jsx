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
import LayoutHomeFive from "../Partials/LayoutHomeFive";
import ProductView from "./ProductView";
import Reviews from "./Reviews";
import SallerInfo from "./SallerInfo";
import { useParams } from 'react-router-dom';

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
  const { id: productId } = useParams();
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

  // Update state 'id' khi 'productId' thay đổi
  useEffect(() => {
    setId(productId);
  }, [productId]);

  // Fetch dữ liệu đánh giá khi 'id' thay đổi
  useEffect(() => {
    if (!id) return; // Nếu id không tồn tại thì không thực hiện fetch

    const fetchRatings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/user/ratings/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        console.log("Dữ liệu đánh giá từ API:", response.data);

        // Kiểm tra xem dữ liệu trả về có phải là mảng không
        if (Array.isArray(response.data)) {
          setComments(response.data); // Nếu là mảng, gán vào state
        } else {
          console.error("Dữ liệu trả về không phải là mảng, gán mảng rỗng");
          setComments([]); // Nếu không phải mảng, gán mảng rỗng
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đánh giá:", error);
        setComments([]); // Đảm bảo là mảng rỗng khi có lỗi
      } finally {
        setLoading(false);
      }
    };

    fetchRatings(); // Gọi hàm fetch khi 'id' thay đổi
  }, [id, token]); // Theo dõi id và token khi thay đổi




  // Sử dụng useParams để lấy productId từ URL
  const { id: idFromURL } = useParams();

  useEffect(() => {
    const newId = parseInt(idFromURL, 10);
    if (newId !== id) {
      setId(newId);
    }
  }, [idFromURL]); // Bỏ id ra khỏi dependency array để tránh render không cần thiết


  return (
    <>
      <LayoutHomeFive childrenClasses="pt-0 pb-0">
        <div className="single-product-wrapper w-full ">
          <div className="product-view-main-wrapper bg-white pt-[30px] w-full">
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
                  <div data-aos="fade-up" className="w-full tab-content-item bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                    <h6 className="text-2xl font-semibold text-gray-800 mb-4">
                      Hướng dẫn chọn kích cỡ thời trang công sở nam
                    </h6>
                    <p className="text-base text-gray-600 mb-6 leading-relaxed">
                      Để luôn tự tin và thoải mái khi mặc đồ công sở, việc chọn kích cỡ phù hợp cho từng loại trang phục là vô cùng quan trọng. Dưới đây là những gợi ý giúp bạn chọn đúng kích cỡ cho từng loại trang phục công sở phổ biến.
                    </p>
                    <div>
                      <h6 className="text-xl font-medium text-gray-800 mb-4">
                        Hướng dẫn chi tiết:
                      </h6>
                      <ul className="list-inside list-disc space-y-4">
                        <li className="text-gray-600 text-base leading-relaxed">
                          <strong>Sơ mi:</strong>
                          <br />- Đo vòng ngực ở phần lớn nhất của ngực để tìm kích cỡ sơ mi phù hợp. Nếu số đo nằm giữa hai kích cỡ, hãy chọn kích cỡ lớn hơn để có sự thoải mái.
                          <br />- Đo vòng cổ và chọn sơ mi có vòng cổ không quá rộng hoặc quá chật khi cài cúc trên cùng. Đảm bảo bạn có thể đặt hai ngón tay giữa cổ và cổ áo mà không bị chật.
                          <br />- Độ dài tay áo nên vừa đủ che phần cổ tay và không bị ngắn khi giơ tay.
                        </li>
                        <li className="text-gray-600 text-base leading-relaxed">
                          <strong>Quần âu:</strong>
                          <br />- Đo vòng eo ở phần nhỏ nhất của eo và chọn size quần với vòng eo phù hợp. Nếu bạn không chắc chắn, hãy chọn size lớn hơn và điều chỉnh bằng dây nịt.
                          <br />- Độ dài quần lý tưởng nên chạm đến mắt cá chân, với độ rộng vừa phải để khi ngồi không bị bó.
                          <br />- Đảm bảo phần hông và đùi của quần không quá chật hoặc rộng, tạo sự thoải mái khi di chuyển.
                        </li>
                        <li className="text-gray-600 text-base leading-relaxed">
                          <strong>Áo vest:</strong>
                          <br />- Đo vòng ngực và vòng eo để chọn áo vest có độ ôm sát vừa vặn. Phần vai áo vest phải khớp với vai bạn, không bị nhô ra hoặc ôm quá sát.
                          <br />- Khi cài nút áo vest, phần ngực và eo không nên bị bó quá chặt, nhưng cũng không nên rộng quá nhiều. Khoảng cách lý tưởng là bạn có thể dễ dàng đặt một nắm tay giữa ngực và áo.
                          <br />- Chiều dài áo vest nên phủ đủ phần thắt lưng và không quá dài xuống dưới mông.
                        </li>
                        <li className="text-gray-600 text-base leading-relaxed">
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
              </div>
            </div>
          </div>

          <div className="related-product w-full bg-white">
            <div className="container-x mx-auto">
              <div className="w-full py-[100px]">
                <h1 className="sm:text-3xl text-xl font-600 text-qblacktext leading-none mb-[30px]">
                  Sản phẩm liên quan
                </h1>
                <div
                  data-aos="fade-up"
                  className=""
                >
                  <DataIteration datas={data.products} startLength={0} endLength={1}>
                    {({ data }) => (
                      <div className="item" key={data.id}>
                        <ProductCardStyleOne
                          productId={id}  // Đảm bảo truyền đúng id
                          data={data}  // Nếu cần, truyền thêm data
                        />
                      </div>
                    )}
                  </DataIteration>
                </div>
              </div>
            </div>
          </div>


        </div>

      </LayoutHomeFive>
    </>
  );
}
