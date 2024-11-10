import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Arrow from "../../../Helpers/icons/Arrow";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
export default function Navbar({ className }) {
  const [categoryToggle, setToggle] = useState(false);
  const [elementsSize, setSize] = useState("0px");
  // const getItems = document.querySelectorAll(`.categories-list li`).length;
  // if (categoryToggle && getItems > 0) {
  //   setSize(`${40 * getItems}px`);
  // }
  const [categories, setCategories] = useState([]);  // Thêm trạng thái lưu danh mục sản phẩm
  const [user, setUser] = useState(null);  // Khởi tạo trạng thái người dùng
  const [error, setError] = useState(null); // Trạng thái lỗi nếu có
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const navigate = useNavigate();

  const handler = () => {
    setToggle(!categoryToggle);
  };


  useEffect(() => {
    if (categoryToggle) {
      const getItems = document.querySelectorAll(`.categories-list li`).length;
      if (categoryToggle && getItems > 0) {
        setSize(`${42 * getItems}px`);
      }
    } else {
      setSize(`0px`);
    }
  }, [categoryToggle]);

console.log(categories);
  // useEffect để gọi API và tải danh mục sản phẩm
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/guest/products/categories');
        setCategories(response.data); // Lưu dữ liệu từ API vào state
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Could not load categories');
      }
    };

    loadCategories();
  }, []);




  useEffect(() => {
    const loadData = async () => {
      try {
        const token = Cookies.get('token');
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            // Kiểm tra cấu trúc của token
            if (decodedToken && decodedToken.sub && decodedToken.roles) {
              setUser({
                username: decodedToken.sub,
                role: decodedToken.roles === "ADMIN" ? "ADMIN" : decodedToken.roles === "STAFF" ? "STAFF" : null
              });
            } else {
              console.error('Invalid token structure or missing roles:', decodedToken);
              setUser(null);
            }
          } catch (decodeError) {
            console.error('Error decoding token:', decodeError);
            setUser(null);
          }
        } else {
          //console.log('No token found in cookie.');
          setUser(null);
        }
      } catch (error) {
        console.error('Error during fetching or processing token:', error);
        setError('Error during decoding or parsing');
        setUser(null); // Đặt `null` nếu có lỗi xảy ra
      } finally {
        setLoading(false); // Đảm bảo cập nhật trạng thái loading
      }
    };

    loadData();
  }, []);


  return (
    <div
      className={`nav-widget-wrapper w-full bg-qh5-bwhite h-[60px] relative z-30  ${className || ""
        }`}
    >
      <div className="container-x mx-auto h-full">
        <div className="w-full h-full relative">
          <div className="w-full h-full flex justify-between items-center">
            <div className="category-and-nav flex xl:space-x-7 space-x-3 items-center">
              <div className="category w-[270px] h-[53px] bg-white px-5 rounded-t-md mt-[6px] relative">
                <button
                  onClick={handler}
                  type="button"
                  className="w-full h-full flex justify-between items-center"
                >
                  <div className="flex space-x-3 items-center">
                    <span className="text-qblack">
                      <svg
                        className="fill-current"
                        width="14"
                        height="9"
                        viewBox="0 0 14 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="14" height="1" />
                        <rect y="8" width="14" height="1" />
                        <rect y="4" width="10" height="1" />
                      </svg>
                    </span>
                    <span className="text-sm font-600 text-qblacktext">
                      Tất cả danh mục
                    </span>
                  </div>
                  <div>
                    <Arrow
                      width="5.78538"
                      height="1.28564"
                      className="fill-current text-qblacktext"
                    />
                  </div>
                </button>
                {categoryToggle && (
                  <div
                    className="fixed top-0 left-0 w-full h-full -z-10"
                    onClick={handler}
                  ></div>
                )}
                <div
                  className="category-dropdown w-full absolute left-0 top-[53px] overflow-hidden"
                  style={{ height: `${elementsSize} ` }}
                >
                  <ul className="categories-list">
                    {categories.map((category) => (
                      <li key={category.id} className="category-item">
                        <div
                          onClick={() => {
                            navigate(`/all-products?category=${category.name}`);
                          }}
                          className="flex justify-between items-center px-5 h-10 bg-white hover:bg-qh2-green transition-all duration-300 ease-in-out cursor-pointer text-qblack hover:text-white"
                        >
                          <div className="flex items-center space-x-6">
                            <span className="text-xs font-400">{category.name}</span>
                          </div>
                          <div>
                            <span>
                              <svg
                                className="fill-current"
                                width="6"
                                height="9"
                                viewBox="0 0 6 9"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="1.49805"
                                  y="0.818359"
                                  width="5.78538"
                                  height="1.28564"
                                  transform="rotate(45 1.49805 0.818359)"
                                  fill="currentColor"
                                />
                                <rect
                                  x="5.58984"
                                  y="4.90918"
                                  width="5.78538"
                                  height="1.28564"
                                  transform="rotate(135 5.58984 4.90918)"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="nav">
                <ul className="nav-wrapper flex xl:space-x-10 space-x-5">
                  <li className="relative">
                    <Link to="/">
                      <span className="flex items-center text-sm text-qblack font-600 cursor-pointer ">
                        <span>Trang Chủ</span>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <span className="flex items-center text-sm text-qblack font-600 cursor-pointer ">
                      <span>Cửa Hàng</span>
                      <span className="ml-1.5 ">
                        <Arrow className="fill-current" />
                      </span>
                    </span>
                    <div className="sub-menu w-full absolute left-0 top-[60px]">
                      <div
                        className="mega-menu-wrapper w-full bg-white p-[30px] flex justify-between items-center "
                        style={{
                          minHeight: "295px",
                          boxShadow: "0px 15px 50px 0px rgba(0, 0, 0, 0.14)",
                        }}
                      >
                        <div className="categories-wrapper flex-1 h-full flex justify-around -ml-[70px]">
                          <div>
                            <div className="category">
                              <h1 className="text-[13px] font-700 text-qblack uppercase mb-[13px]">
                                Danh sách cửa hàng
                              </h1>
                            </div>
                            <div className="category-items">
                              <ul className="flex flex-col space-y-2">
                                <li>
                                  <a href="#">
                                    <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qyellow hover:text-qyellow">
                                      Thanh bên cửa hàng
                                    </span>
                                  </a>
                                </li>

                              </ul>
                            </div>
                          </div>
                          <div>
                            <div className="category">
                              <h1 className="text-[13px] font-700 text-qblack uppercase mb-[13px]">
                                Bố cục sản phẩm
                              </h1>
                            </div>
                            <div className="category-items">
                              <ul className="flex flex-col space-y-2">
                                <li>
                                  <a href="#">
                                    <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qyellow hover:text-qyellow">
                                      Hình ảnh ngang
                                    </span>
                                  </a>
                                </li>
                                <li>
                                  <a href="#">
                                    <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qyellow hover:text-qyellow">
                                      Hình ảnh dọc
                                    </span>
                                  </a>
                                </li>
                                <li>
                                  <a href="#">
                                    <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qyellow hover:text-qyellow">
                                      Bộ sưu tập hình ảnh
                                    </span>
                                  </a>
                                </li>
                                <li>
                                  <a href="#">
                                    <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qyellow hover:text-qyellow">
                                      Tóm tắt nổi bật
                                    </span>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>

                          <div>
                            <div className="category">
                              <h1 className="text-[13px] font-700 text-qblack uppercase mb-[13px]">
                                Danh mục phổ biến
                              </h1>
                            </div>
                            <div className="category-items">
                              <ul className="flex flex-col space-y-2">
                                <li>
                                  <a href="#">
                                    <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qyellow hover:text-qyellow">
                                      Áo Sơ Mi Công Sở
                                    </span>
                                  </a>
                                </li>
                                <li>
                                  <a href="#">
                                    <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qyellow hover:text-qyellow">
                                      Áo Thun Công Sở
                                    </span>
                                  </a>
                                </li>
                                <li>
                                  <a href="#">
                                    <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qyellow hover:text-qyellow">
                                      Quần Tây Công Sở
                                    </span>
                                  </a>
                                </li>
                                <li>
                                  <a href="#">
                                    <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qyellow hover:text-qyellow">
                                      Quần áo thời trang
                                    </span>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>

                        </div>
                        <div className="thumbnil w-[348px] h-full">
                          <div className="w-full h-[235px]">
                            <img
                              width=""
                              src={`/assets/images/banner-4.png`}
                              alt=""
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="relative">
                    <span className="flex items-center text-sm text-qblack font-600 cursor-pointer ">
                      <span>Trang</span>
                      <span className="ml-1.5 ">
                        <Arrow className="fill-current" />
                      </span>
                    </span>
                    <div className="sub-menu w-[220px] absolute left-0 top-[60px]">
                      <div
                        className="w-full bg-white flex justify-between items-center "
                        style={{
                          boxShadow: "0px 15px 50px 0px rgba(0, 0, 0, 0.14)",
                        }}
                      >
                        <div className="categories-wrapper w-full h-full p-5">
                          <div>
                            <div className="category-items">
                              <ul className="flex flex-col space-y-2">
                                <li>
                                  <a href="/privacy-policy">
                                    <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qyellow hover:text-qyellow">
                                      Chính sách bảo mật
                                    </span>
                                  </a>
                                </li>
                                <li>
                                  <a href="/terms-condition">
                                    <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qyellow hover:text-qyellow">
                                      Điều khoản và Điều kiện
                                    </span>
                                  </a>
                                </li>
                                <li>
                                  <a href="/faq">
                                    <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qyellow hover:text-qyellow">
                                      FAQ
                                    </span>
                                  </a>
                                </li>
                                <li>
                                  <a href="#">
                                    <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qyellow hover:text-qyellow">
                                      Biểu tượng danh mục cửa hàng
                                    </span>
                                  </a>
                                </li>
                                <li>
                                  <a href="#">
                                    <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qyellow hover:text-qyellow">
                                      Xem danh sách cửa hàng
                                    </span>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link to="/about">
                      <span className="flex items-center text-sm text-qblack font-600 cursor-pointer ">
                        <span>Về Chúng tôi</span>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact">
                      <span className="flex items-center text-sm text-qblack font-600 cursor-pointer ">
                        <span>Liên Hệ</span>
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="become-seller-btn  w-[161px] h-[40px]">
                <div className="become-seller-btn w-[161px] h-[40px]">
                  {user && user.role && (  // Kiểm tra nếu user tồn tại và là admin
                    <Link to="/admin">
                      <div className="black-btn flex justify-center items-center cursor-pointer h-full">
                        <div className="flex space-x-2 items-center">
                          <span className="text-sm font-600">Quản Lý Bán Hàng</span>
                          <span>
                            <svg
                              width="6"
                              height="10"
                              viewBox="0 0 6 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="1.08984"
                                width="6.94106"
                                height="1.54246"
                                transform="rotate(45 1.08984 0)"
                              />
                              <rect
                                x="6"
                                y="4.9082"
                                width="6.94106"
                                height="1.54246"
                                transform="rotate(135 6 4.9082)"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
