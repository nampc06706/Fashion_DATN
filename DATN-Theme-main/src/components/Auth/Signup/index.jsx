import { useState } from "react";
import InputCom from "../../Helpers/InputCom";
import Thumbnail from "./Thumbnail";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LayoutHomeFive from "../../Partials/LayoutHomeFive";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường dữ liệu không được bỏ trống
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        toast.error(`Trường ${key.charAt(0).toUpperCase() + key.slice(1)} không được để trống.`);
        return;
      }
    }

    // Kiểm tra username không chứa khoảng trắng
    if (/\s/.test(formData.username)) {
      toast.error('Tên người dùng không được chứa khoảng trắng.');
      return;
    }

    // Kiểm tra username không chứa dấu và các ký tự đặc biệt
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      toast.error('Tên người dùng chỉ được chứa chữ cái không dấu, và dấu gạch dưới (_).');
      return;
    }

    // Kiểm tra mật khẩu phải có ít nhất 6 ký tự
    if (formData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    // Kiểm tra mật khẩu và xác nhận mật khẩu khớp nhau
    if (formData.password !== formData.passwordConfirm) {
      toast.error('Mật khẩu không khớp.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/signup', formData);
      toast.success('Đăng ký thành công!');
      navigate("/login");
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || error.response.data;

        // Kiểm tra thông báo lỗi từ server
        if (errorMessage === "Email already exists") {
          toast.error("Email đã tồn tại. Vui lòng sử dụng email khác.");
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error('Đăng ký thất bại. Vui lòng thử lại sau.');
      }
    }
  };



  return (
    <LayoutHomeFive childrenClasses="pt-0 pb-0">
      <div className="signup-page-wrapper w-full py-10">
        <div className="container-x mx-auto">
          <div className="lg:flex items-center relative">
            <div className="lg:w-[572px] w-full lg:h-[783px] bg-white flex flex-col justify-center sm:p-10 p-5 border border-[#E0E0E0]">
              <div className="w-full">
                <div className="title-area flex flex-col justify-center items-center relative text-center mb-7">
                  <h1 className="text-[34px] font-bold leading-[74px] text-qblack">
                    Tạo tài khoản
                  </h1>
                  <div className="shape -mt-6">
                    <svg
                      width="354"
                      height="30"
                      viewBox="0 0 354 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 28.8027C17.6508 20.3626 63.9476 8.17089 113.509 17.8802C166.729 28.3062 341.329 42.704 353 1"
                        stroke="#FFBB38"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <form className="input-area" onSubmit={handleSubmit}>
                  <div className="flex sm:flex-row flex-col space-y-5 sm:space-y-0 sm:space-x-5 mb-5">
                    <InputCom
                      placeholder="Nhập tên"
                      label="FullName*"
                      name="fullname"
                      type="text"
                      value={formData.fullname}
                      inputHandler={handleChange}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col space-y-5 sm:space-y-0 sm:space-x-5 mb-5">
                    <InputCom
                      placeholder="Nhập email"
                      label="Email*"
                      name="email"
                      type="email"
                      value={formData.email}
                      inputHandler={handleChange}
                    />
                    <InputCom
                      placeholder="Nhập số điện thoại"
                      label="Số điện thoại*"
                      name="phone"
                      type="text"
                      value={formData.phone}
                      inputHandler={handleChange}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col space-y-5 sm:space-y-0 sm:space-x-5 mb-5">
                    <InputCom
                      placeholder="Nhập tài khoản"
                      label="Tài khoản*"
                      name="username"
                      type="text"
                      value={formData.username}
                      inputHandler={handleChange}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col space-y-5 sm:space-y-0 sm:space-x-5 mb-5">
                    <InputCom
                      placeholder="Nhập mật khẩu"
                      label="Mật khẩu*"
                      name="password"
                      type="password"
                      value={formData.password}
                      inputHandler={handleChange}
                    />
                    <InputCom
                      placeholder="Nhập lại mật khẩu"
                      label="Xác nhận mật khẩu"
                      name="passwordConfirm"
                      type="password"
                      value={formData.passwordConfirm}
                      inputHandler={handleChange}
                    />
                  </div>
                  <div className="signin-area mb-3">
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="black-btn text-sm text-white w-full h-[50px] font-semibold flex justify-center bg-purple items-center"
                      >
                        <span>Tạo tài khoản</span>
                      </button>
                    </div>
                  </div>
                </form>
                <div className="signup-area flex justify-center">
                  <p className="text-base text-qgraytwo font-normal">
                    Bạn đã có tài khoản chưa?
                    <a href="/login" className="ml-2 text-qblack">
                      Đăng nhập
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 lg:flex hidden transform scale-60 xl:scale-100 xl:justify-center">
              <div
                className="absolute xl:-right-20 w-full xl:w-auto h-full"
              >
                <Thumbnail />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutHomeFive>
  );
}
