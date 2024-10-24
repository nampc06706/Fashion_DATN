import { Link } from "react-router-dom";
import Facebook from "../../../Helpers/icons/Facebook";
import Instagram from "../../../Helpers/icons/Instagram";
import Youtube from "../../../Helpers/icons/Youtube";

export default function FooterFour() {
  return (
    <footer
      className="footer-section-wrapper"
      style={{
        backgroundImage: `url(/assets/images/footer-four.png)`,
      }}
    >
      <div className="container-x block mx-auto pt-[83px]">
        <div className="lg:flex justify-between mb-[95px]">
          <div className="lg:w-4/10 w-full mb-10 lg:mb-0">
            {/* logo area */}
            <div className="mb-14">
              <a href="/">
                <img
                  width="152"
                  height="36"
                  src={`/assets/images/logo-5.svg`}
                  alt="logo"
                />
              </a>
            </div>
            <div>
              <ul className="flex flex-col space-y-5 ">
                <li>
                  <Link to="/">
                    <span className="text-white text-[15px] hover:text-[#9a9a9a] hover:underline">
                    Theo dõi đơn hàng
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <span className="text-white text-[15px] hover:text-[#9a9a9a] hover:underline">
                    Giao hàng & Trả hàng
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <span className="text-white text-[15px] hover:text-[#9a9a9a] hover:underline">
                    Bảo hành
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:w-2/10 w-full mb-10 lg:mb-0">
            <div className="mb-5">
              <h6 className="text-[18] font-500 text-[#2F2F2F]">Về chúng tôi</h6>
            </div>
            <div>
              <ul className="flex flex-col space-y-5 ">
                
                <li>
                  <Link to="/">
                    <span className="text-white text-[15px] hover:text-[#9a9a9a] hover:underline">
                    Làm việc với chúng tôi
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <span className="text-white text-[15px] hover:text-[#9a9a9a] hover:underline">
                    Tin tức doanh nghiệp
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <span className="text-white text-[15px] hover:text-[#9a9a9a] hover:underline">
                    Nhà đầu tư
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:w-2/10 w-full mb-10 lg:mb-0 ">
            <div className="mb-5">
              <h6 className="text-[18] font-500 text-[#2F2F2F]">Cửa hàng trực tuyến</h6>
            </div>
            <div>
              <ul className="flex flex-col space-y-5 ">
                <li>
                  <Link to="/">
                    <span className="text-white text-[15px] hover:text-[#9a9a9a] hover:underline">
                      Áo
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <span className="text-white text-[15px] hover:text-[#9a9a9a] hover:underline">
                    Quần
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <span className="text-white text-[15px] hover:text-[#9a9a9a] hover:underline">
                      Giày
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <span className="text-white text-[15px] hover:text-[#9a9a9a] hover:underline">
                      Phụ kiện
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:w-2/10 w-full mb-10 lg:mb-0">
            <div className="mb-5">
              <h6 className="text-[18] font-500 text-[#2F2F2F]">
              Liên kết hữu ích
              </h6>
            </div>
            <div>
              <ul className="flex flex-col space-y-5 ">
                <li>
                  <Link to="/">
                    <span className="text-white text-[15px] hover:text-[#9a9a9a] hover:underline">
                    Thanh toán an toàn
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <span className="text-white text-[15px] hover:text-[#9a9a9a] hover:underline">
                    Chính sách bảo mật
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <span className="text-white text-[15px] hover:text-[#9a9a9a] hover:underline">
                    Điều khoản sử dụng
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <span className="text-white text-[15px] hover:text-[#9a9a9a] hover:underline">
                    Sản phẩm đã lưu trữ
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bottom-bar border-t border-qgray-border lg:h-[82px] lg:flex justify-between items-center">
          <div className="flex lg:space-x-5 justify-between items-center mb-3">
            <div className="flex space-x-5 items-center">
              <a href="#">
                <Instagram className="fill-current text-white hover:text-[#9a9a9a]" />
              </a>
              <a href="#">
                <Facebook className="fill-current text-white hover:text-[#9a9a9a]" />
              </a>
              <a href="#">
                <Youtube className="fill-current text-white hover:text-[#9a9a9a]" />
              </a>
            </div>
            <span className="sm:text-base text-[10px] text-white font-300">
              ©2024
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="font-500 text-qh5-bwhite mx-1"
              >
              
              </a>
              All rights reserved
            </span>
          </div>
          <div className="">
            <a href="#">
              <img
                width="318"
                height="28"
                src={`/assets/images/payment-getways.png`}
                alt="payment-getways"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
