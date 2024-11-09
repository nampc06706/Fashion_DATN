import { useRef, useState, useEffect } from "react";
import InputCom from "../../../Helpers/InputCom";
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify'; // Import toast

export default function ProfileTab() {
  const [profileImg, setProfileImg] = useState(null);
  const [accountInfo, setAccountInfo] = useState({});
  const profileImgInput = useRef(null);

  const browseProfileImg = () => {
    profileImgInput.current.click();
  };

  const profileImgChangHandler = (e) => {
    if (e.target.value !== "") {
      const imgReader = new FileReader();
      imgReader.onload = (event) => {
        setProfileImg(event.target.result);
      };
      imgReader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      let accountId;

      try {
        const userInfo = jwtDecode(token);
        accountId = userInfo.accountId;

        if (!accountId) {
          console.error("accountId không có trong token");
          return;
        }
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
        return;
      }

      axios.get('http://localhost:8080/api/account/info', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          setAccountInfo(response.data);
          const imagePath = `/assets/images/${response.data.image}`;
          setProfileImg(imagePath || '/assets/images/edit-profileimg.jpg');
        })
        .catch(error => {
          console.error("Có lỗi xảy ra khi lấy thông tin tài khoản:", error);
        });
    }
  }, []);

  const handleUpdateProfile = () => {
    const token = Cookies.get("token");
    const accountId = accountInfo.id;
  
    const formData = new FormData();
    const imageFile = profileImgInput.current.files[0];
  
    if (imageFile) {
      formData.append('image', imageFile);
    }
  
    formData.append('fullname', accountInfo.fullname);
    formData.append('email', accountInfo.email);
    formData.append('phone', accountInfo.phone);
  
    axios.put(`http://localhost:8080/api/user/${accountId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log("Cập nhật thành công:", response.data);
        toast.success("Cập nhật thông tin thành công!"); // Thông báo thành công
      })
      .catch(error => {
        console.error("Có lỗi xảy ra khi cập nhật thông tin:", error);
  
        // Kiểm tra lỗi từ API (giả sử API trả về message "Email đã tồn tại")
        if (error.response && error.response.data && error.response.data.includes("Email đã tồn tại")) {
          toast.error("Email đã tồn tại, vui lòng sử dụng email khác!");
        } else {
          toast.error("Email đã tồn tại, vui lòng sử dụng email khác!"); // Thông báo lỗi chung
        }
      });
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="flex space-x-8">
        <div className="w-[570px] ">
          <div className="input-item flex space-x-2.5 mb-8">
            <div className="w-1/2 h-full">
              <InputCom
                label="Họ và tên*"
                name="fullname"
                placeholder="Demo Name"
                type="text"
                inputClasses="h-[50px]"
                value={accountInfo.fullname || ''}
                inputHandler={handleInputChange}
              />

            </div>
          </div>
          <div className="input-item flex space-x-2.5 mb-8">
            <div className="w-1/2 h-full">
              <InputCom
                name="email"
                label="Email*"
                placeholder="demoemail@gmail.com"
                type="email"
                inputClasses="h-[50px]"
                value={accountInfo.email || ''} // Hiển thị email
                inputHandler={handleInputChange}
              />
            </div>
            <div className="w-1/2 h-full">
              <InputCom
                label="Số điện thoại*"
                name="phone"
                placeholder="012 3  *******"
                type="text"
                inputClasses="h-[50px]"
                value={accountInfo.phone || ''} // Hiển thị số điện thoại
                inputHandler={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="update-logo w-full mb-9 flex flex-col items-center"> {/* Center all items */}
            <h1 className="text-xl tracking-wide font-bold text-qblack mb-2">
              Cập nhật hồ sơ
              <span className="ml-1">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 0C4.47457 0 0 4.47791 0 10C0 15.5221 4.47791 20 10 20C15.5221 20 20 15.5221 20 10C19.9967 4.48126 15.5221 0.00669344 10 0ZM10 16.67C9.53815 16.67 9.16667 16.2985 9.16667 15.8367C9.16667 15.3748 9.53815 15.0033 10 15.0033C10.4618 15.0033 10.8333 15.3748 10.8333 15.8367C10.8333 16.2952 10.4618 16.67 10 16.67ZM11.6098 10.425C11.1078 10.7396 10.8132 11.2952 10.8333 11.8842V12.5033C10.8333 12.9652 10.4618 13.3367 10 13.3367C9.53815 13.3367 9.16667 12.9652 9.16667 12.5033V11.8842C9.14324 10.6861 9.76907 9.56827 10.8032 8.96586C11.4357 8.61781 11.7704 7.90161 11.6366 7.19545C11.5027 6.52276 10.9772 5.99732 10.3046 5.8668C9.40094 5.69946 8.5308 6.29853 8.36346 7.20214C8.34673 7.30254 8.33668 7.40295 8.33668 7.50335C8.33668 7.96519 7.9652 8.33668 7.50335 8.33668C7.0415 8.33668 6.67002 7.96519 6.67002 7.50335C6.67002 5.66265 8.16265 4.17001 10.0067 4.17001C11.8474 4.17001 13.34 5.66265 13.34 7.50669C13.3333 8.71821 12.674 9.83601 11.6098 10.425Z"
                    fill="#374557"
                    fillOpacity="0.6"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-sm text-qgraytwo mb-5 text-center"> {/* Center the text */}
              Hồ sơ có kích thước tối thiểu
              <span className="ml-1 text-qblack">300x300</span>. Gif cũng có tác dụng.
              <span className="ml-1 text-qblack">Tối đa 5mb</span>.
            </p>
            <div className="flex justify-center"> {/* Center the image container */}
              <div className="relative">
                <div className="w-[198px] h-[198px] rounded-full overflow-hidden flex items-center justify-center">
                  <img
                    src={profileImg || '/assets/images/edit-profileimg.jpg'} // Hình ảnh mặc định nếu không có hình ảnh cá nhân
                    alt="Profile"
                    className="object-cover w-full h-full" // Giữ nguyên tỷ lệ và không giới hạn max
                    style={{ imageRendering: 'auto' }} // Cải thiện chất lượng hình ảnh
                  />
                </div>

                <input
                  ref={profileImgInput}
                  onChange={profileImgChangHandler}
                  type="file"
                  className="hidden"
                />
                <div
                  onClick={browseProfileImg}
                  className="w-[32px] h-[32px] absolute bottom-7 right-0 bg-qblack rounded-full cursor-pointer flex items-center justify-center"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.5147 0C7.39562 0 0 7.39562 0 16.5147C0 25.6337 7.39562 32.0283 16.5147 32.0283C25.6337 32.0283 32.0283 25.6337 32.0283 16.5147C32.0283 7.39562 24.6326 0 16.5147 0ZM23.0145 21.6823L19.2964 24.6109C18.9351 24.8975 18.3675 24.6798 18.3675 24.2344V21.0181L14.9735 21.0181C14.4256 21.0181 14 20.5917 14 20.0365L14 16.8292C14 16.2739 14.4256 15.8475 14.9735 15.8475L19.2964 15.8475L18.3675 13.7859C18.0256 13.2248 18.243 12.6572 18.6798 12.3153L24.6295 8.89568C25.0063 8.64984 25.6352 8.88563 25.843 9.42594L27.2393 13.1531C27.4471 13.6934 27.2286 14.261 26.7927 14.6222L23.0145 21.6823Z"
                      fill="white"
                    />
                  </svg>
                </div>

              </div>
            </div>
          </div>
          <div className="flex justify-end mt-10">
            <button
              onClick={handleUpdateProfile} // Gọi hàm cập nhật thông tin khi nhấn nút
              className="bg-qblack hover:bg-qgray rounded text-white py-2 px-5">
              Cập nhật
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
