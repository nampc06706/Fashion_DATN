import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import InputCom from '../../Helpers/InputCom';
import LayoutHomeFive from '../../Partials/LayoutHomeFive';
import Thumbnail from './Thumbnail';
import { useNavigate } from 'react-router-dom';

export default function Forgotpassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái đang gửi
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      toast.error("Email không được để trống.");
      return;
    } else if (!emailRegex.test(email)) {
      toast.error("Địa chỉ email không hợp lệ.");
      return;
    }

    setIsSubmitting(true); // Bắt đầu gửi OTP
    try {
      const response = await axios.post(`http://localhost:8080/api/forgot-password?email=${email}`);
      toast.success(response.data);
      navigate('/verify-otp', { state: { email } });
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi gửi mã OTP.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false); // Kết thúc quá trình gửi
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
                  <h1 className="text-[34px] font-bold leading-[74px] text-qblack">Quên mật khẩu</h1>
                  <div className="shape -mt-6">
                    <svg width="172" height="29" viewBox="0 0 172 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5.08742C17.6667 19.0972 30.5 31.1305 62.5 27.2693C110.617 21.4634 150 -10.09 171 5.08727" stroke="#FFBB38" />
                    </svg>
                  </div>
                </div>
                <div className="input-area">
                  <div className="input-item mb-10">
                    <InputCom
                      placeholder="Nhập email"
                      label="Email*"
                      name="email"
                      type="email"
                      value={email}
                      inputHandler={(e) => setEmail(e.target.value)}
                      style={{ width: '100%', padding: '2px 15px', border: '1px solid #a9a9a9' }}
                    />
                  </div>
                  <div className="signin-area mb-3.5">
                    <button
                      type="button"
                      className="black-btn text-sm text-white w-full h-[50px] font-semibold flex justify-center bg-purple items-center"
                      onClick={handleSubmit}
                      disabled={isSubmitting} // Vô hiệu hóa khi đang gửi
                    >
                      {isSubmitting ? "Đang gửi OTP..." : "Xác nhận"}
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
