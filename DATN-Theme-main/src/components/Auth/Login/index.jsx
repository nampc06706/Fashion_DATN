import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import InputCom from '../../Helpers/InputCom';
import LayoutHomeFive from '../../Partials/LayoutHomeFive';
import Thumbnail from './Thumbnail';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
  const [checked, setChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [dataGoogle, setDataGoogle] = useState(null);

  useEffect(() => {
    const takeData = async () => {
      if (dataGoogle) {
        try {
          const response = await axios.post("http://localhost:8080/api/guest/takeData", dataGoogle);
          console.log("Login successful", response.data);
          window.location.reload();
        } catch (error) {
          // console.error("Error:", error.response ? error.response.data : error.message);
          // toast.error(`Error: ${error.response ? error.response.data : 'Unknown error'}`);
        }

      }
    };
    takeData();
    
  }, [dataGoogle]);

  const rememberMe = () => setChecked(!checked);


  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const decodedToken = jwtDecode(token);

      const { name: username, email } = decodedToken;
      setDataGoogle({ username, email, fullname: username });

      // Gửi yêu cầu đến API để lấy thông tin đăng nhập
      const response = await axios.post('http://localhost:8080/api/guest/takeData', {
        fullname: username,
        username: username,
        email: email,
      });

      // Lấy token và role từ phản hồi của API
      const { token: userToken, role } = response.data;
      setUserInfo({ username, role });

      // Thiết lập cookie
      const cookieExpiry = 7; // Thời gian cookie tồn tại là 7 ngày
      Cookies.set('token', userToken, { expires: cookieExpiry, path: '/' });
      Cookies.set('role', role, { expires: cookieExpiry, path: '/' });

      // Chuyển hướng người dùng
      navigate('/');
    } catch (error) {
      console.error('Error saving account:', error);
      toast.error('Có lỗi xảy ra khi lưu tài khoản Google.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    Cookies.remove('user');
    Cookies.remove('token');
    Cookies.remove('cart')

    try {
      const loginResponse = await axios.post('http://localhost:8080/api/login', null, {
        params: { username, password },
        withCredentials: true,
      });

      const token = loginResponse.data.token;
      const decodedToken = jwtDecode(token);
      const cookieExpiry = checked ? 7 : 0.5;

      Cookies.set('token', token, { expires: cookieExpiry, path: '/' });

      const userInfo = JSON.stringify({
        username: decodedToken.sub,
        role: decodedToken.role,
        accountId: decodedToken.accountId,
      });

      Cookies.set('user', userInfo, { expires: cookieExpiry, path: '/' });

      toast.success('Đăng nhập thành công!', {
        position: 'top-right',
        autoClose: 500,
      });

      setUserInfo({
        username: decodedToken.sub,
        role: decodedToken.role,
        accountId: decodedToken.accountId,
      });
      window.location.reload();
      navigate('/');

    } catch (error) {
      const message = error.response?.data || 'Có lỗi xảy ra khi đăng nhập.';
      setError(message);
      toast.error(message, {
        position: 'top-right',
        autoClose: 500,
      });
    } finally {
      setLoading(false);
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Ngừng hành động mặc định của Enter
      handleLogin(e); // Truyền đối số e vào hàm handleLogin
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
                  <h1 className="text-[34px] font-bold leading-[74px] text-qblack">Đăng nhập</h1>
                  <div className="shape -mt-6">
                    <svg width="172" height="29" viewBox="0 0 172 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5.08742C17.6667 19.0972 30.5 31.1305 62.5 27.2693C110.617 21.4634 150 -10.09 171 5.08727" stroke="#FFBB38" />
                    </svg>
                  </div>
                </div>
                <div className="input-area">
                  <div className="input-item mb-5">
                    <InputCom
                      placeholder="Nhập tài khoản"
                      label="Tài khoản*"
                      name="username"
                      type="text"
                      value={username}
                      inputHandler={(e) => setUsername(e.target.value)}
                      onKeyDown={handleKeyDown} 
                    />
                  </div>
                  <div className="input-item mb-5">
                    <InputCom
                      placeholder="Nhập mật khẩu"
                      label="Mật khẩu*"
                      name="password"
                      type="password"
                      value={password}
                      inputHandler={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <div className="forgot-password-area flex justify-between items-center mb-7">
                    <div className="remember-checkbox flex items-center space-x-2.5">
                      <button
                        onClick={rememberMe}
                        type="button"
                        className="w-5 h-5 text-qblack flex justify-center items-center border border-light-gray"
                      >
                        {checked && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <span className="text-sm text-qgray">Ghi nhớ mật khẩu</span>
                    </div>
                    <div>
                      <a href="/forgot-password" className="text-sm text-qblack">Quên mật khẩu?</a>
                    </div>
                  </div>
                  <div className="signin-area mb-3.5">
                    <button
                      onClick={handleLogin}
                      type="button"
                      className="black-btn text-sm text-white w-full h-[50px] font-semibold flex justify-center bg-purple items-center">
                      {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                  </div>

                  <div className="line-or flex justify-center items-center my-5 relative">
                    <div className="line w-2/5 h-0.5 bg-light-gray"></div>
                    <span className="text-xs text-qblack mx-2">hoặc</span>
                    <div className="line w-2/5 h-0.5 bg-light-gray"></div>
                  </div>
                  <div className="login-google">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => {
                        console.log('Đăng nhập không thành công');
                        toast.error('Đăng nhập không thành công', { position: 'top-right', autoClose: 3000 });
                      }}
                      theme="outline"
                      size="large"
                    />

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
