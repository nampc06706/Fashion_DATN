import BreadcrumbCom from "../BreadcrumbCom";
import LayoutHomeFive from "../Partials/LayoutHomeFive";
import ErrorThumb from "./ErrorThumb";

export default function FourZeroFour() {
  return (
    <LayoutHomeFive>
      <div className="cart-page-wrapper w-full">
        <div className="container-x mx-auto">
          <BreadcrumbCom paths={[{ name: "home", path: "/" }]} />
          <div className="empty-card-wrapper w-full">
            <div className="flex justify-center items-center w-full">
              <div>
                <div className="sm:mb-10 mb-0 transform sm:scale-100 scale-50">
                  <ErrorThumb />
                </div>
                <div data-aos="fade-up" className="empty-content w-full">
                  <h1 className="sm:text-xl text-base font-semibold text-center mb-5">
                  Lấy làm tiếc! Chúng tôi không thể tìm thấy trang đó!
                  </h1>
                  <a href="/">
                    <div className="flex justify-center w-full ">
                      <div className="w-[180px] h-[50px] ">
                        <span type="button" className="yellow-btn">
                        Quay lại cửa hàng
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutHomeFive>
  );
}
