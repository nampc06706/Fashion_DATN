import { useState } from 'react'; // Import useState để quản lý state
import { toast } from 'react-toastify';
import axios from 'axios';
import InputCom from '../../Helpers/InputCom'; // Đường dẫn tới InputCom
import LayoutHomeFive from '../../Partials/LayoutHomeFive';
import Thumbnail from './Thumbnail';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function Otp() {
  const location = useLocation(); // Lấy thông tin từ location
  const navigate = useNavigate(); // Khởi tạo hàm điều hướng
  const email = location.state?.email || ''; // Lấy email từ state
  const [otp, setOtp] = useState(""); // Khởi tạo state cho OTP

  const handleOtpSubmit = async () => {
    if (!otp) {
      toast.error("Mã OTP không được để trống.");
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8080/api/verify-otp?email=${email}&otp=${otp}`);
      toast.success(response.data); // Hiển thị thông báo thành công
      navigate('/new-password', { state: { email } }); // Truyền email qua state
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi xác thực mã OTP."; // Lấy thông báo lỗi cụ thể từ server
      toast.error(errorMessage);
    }
  };

  return (
    <LayoutHomeFive childrenClasses="pt-0 pb-0">
      <div className="login-page-wrapper w-full py-10">
        <div className="container-x mx-auto">
          <div className="lg:flex items-center relative">
            <div className="lg:w-[572px] w-full h-[783px] bg-white flex flex-col justify-center sm:p-10 p-5 border border-[#E0E0E0]">
              <div className="w-full">
                <div className="title-area flex flex-col justify-center items-center relative text-center mb-7">
                  <h1 className="text-[34px] font-bold leading-[74px] text-qblack">Xác thực mã OTP</h1>
                  <div className="shape -mt-6">
                    <svg width="172" height="29" viewBox="0 0 172 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5.08742C17.6667 19.0972 30.5 31.1305 62.5 27.2693C110.617 21.4634 150 -10.09 171 5.08727" stroke="#FFBB38" />
                    </svg>
                  </div>
                </div>
                <div className="input-area">
                  <div className="input-item mb-10">
                    <InputCom
                      placeholder="Nhập otp"
                      label="otp*"
                      name="otp"
                      type="text"
                      value={otp}
                      inputHandler={(e) => setOtp(e.target.value)} // Cập nhật state cho otp
                      style={{ width: '100%', padding: '7px 15px', border: '1px solid #a9a9a9' }}
                    />
                  </div>
                  <div className="signin-area mb-3.5">
                    <button
                      type="button"
                      className="black-btn text-sm text-white w-full h-[50px] font-semibold flex justify-center bg-purple items-center"
                      onClick={handleOtpSubmit} // Gọi hàm xác thực OTP
                    >
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <Thumbnail />
          </div>
        </div>
      </div>
    </LayoutHomeFive>
  );
}
