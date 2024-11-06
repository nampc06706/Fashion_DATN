import BreadcrumbCom from "../BreadcrumbCom";
import LayoutHomeFive from "../Partials/LayoutHomeFive";
import { FaTimesCircle } from "react-icons/fa"; // Đổi biểu tượng thành FaTimesCircle để hiển thị lỗi
import { useLocation } from 'react-router-dom';

export default function Failer() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  
  // Lấy thông tin từ query parameters
  const orderID = query.get('orderID');
  const amount = query.get('amount');
  const paymentMethod = query.get('paymentMethod');

  return (
    <LayoutHomeFive>
      <div className="cart-page-wrapper w-full bg-gray-100 py-10">
        <div className="container-x mx-auto">
          <BreadcrumbCom paths={[{ name: "Trang chủ", path: "/" }]} />
          <div className="empty-card-wrapper w-full mt-5">
            <div className="flex justify-center items-center w-full">
              <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <div data-aos="fade-up" className="empty-content w-full text-center">
                  <FaTimesCircle className="text-red-600 mx-auto mb-4" size={50} />
                  <h1 className="text-2xl font-bold text-red-600 mb-2">
                    Thanh toán hóa đơn thất bại!
                  </h1>
                  <p className="text-gray-600 mb-6">
                    Vui lòng thử lại thanh toán.
                  </p>
                  <div className="mb-4 border-t border-gray-200 pt-4">
                    <h2 className="text-lg font-semibold">Chi tiết đơn hàng</h2>
                    <p className="text-gray-700">Mã đơn hàng: #{orderID}</p>
                    <p className="text-gray-700">Tổng tiền: {amount} VND</p>
                    <p className="text-gray-700">Phương thức thanh toán: {paymentMethod}</p>
                  </div>
                  <a href="/profile#order">
                    <div className="flex justify-center w-full">
                      <div className="w-[180px] h-[50px]">
                        <span
                          type="button"
                          className="yellow-btn transition duration-300 hover:bg-yellow-600"
                        >
                          Thử lại thanh toán
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
