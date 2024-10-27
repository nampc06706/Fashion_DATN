import { Link } from "react-router-dom";
import Arrow from "../../../Helpers/icons/Arrow";
import Selectbox from "../../../Helpers/Selectbox";

export default function TopBar({ className }) {
  return (
    <>
      <div
        className={`w-full bg-white h-10 border-b border-qgray-border ${
          className || ""
        }`}
      >
        <div className="container-x mx-auto h-full">
          <div className="flex justify-between items-center h-full">
            <div className="topbar-nav">
              <ul className="flex space-x-6">
                <li>
                  <Link to="/profile">
                    <span className="text-xs leading-6 text-qblack font-500">
                    Tài khoản
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/profile#order">
                    <span className="text-xs leading-6 text-qblack font-500">
                    Theo dõi đơn hàng
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/faq">
                    <span className="text-xs leading-6 text-qblack font-500">
                      Hỗ trợ
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="topbar-dropdowns sm:block hidden">
              <div className="flex space-x-6">
                <div className="country-select flex space-x-1 items-center">
                  <div>
                    <img
                      src={`/assets/images/vietnam.webp`}
                      width="16"
                      height="16"
                      alt="vietnam logo"
                      className="overflow-hidden rounded-full"
                    />
                  </div>
                  <Selectbox
                    className="w-fit"
                    datas={["Việt Nam", "English"]}
                  />
                  <div>
                    <Arrow className="fill-current qblack" />
                  </div>
                </div>
                <div className="currency-select flex space-x-1 items-center">
                  <Selectbox className="w-fit" datas={["VND", "DOLLAR"]} />
                  <Arrow className="fill-current qblack" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
