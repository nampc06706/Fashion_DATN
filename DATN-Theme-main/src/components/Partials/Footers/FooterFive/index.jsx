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
                  src={`/assets/images/logo-8.png`}
                  alt="logo"
                />
              </a>
            </div>
            <div>
              
            </div>
          </div>
          <div className="lg:w-2/10 w-full mb-10 lg:mb-0">
            <div className="mb-5">
              <h6 className="text-[18] font-500 text-[white]">VỀ CHÚNG TÔI</h6>
            </div>
            <div>
              <ul className="flex flex-col space-y-5 ">
                
                <li>
                  <Link to="/contact">
                    <span className="text-white text-[15px] hover:text-[#9a9a9a] hover:underline">
                    Làm việc với chúng tôi
                    </span>
                  </Link>
                </li>
                
              </ul>
            </div>
          </div>
          <div className="lg:w-2/10 w-full mb-10 lg:mb-0 ">
            <div className="mb-5">
              <h6 className="text-[18] font-500 text-[white]">CỬA HÀNG</h6>
            </div>
            <div>
              <ul className="flex flex-col space-y-5 ">
                <li>
                  <Link to="/all-products">
                    <span className="text-white text-[15px] hover:text-[#9a9a9a] hover:underline">
                     Tất cả sản phẩm
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
          
        </div>
      </div>
    </footer>
  );
}
