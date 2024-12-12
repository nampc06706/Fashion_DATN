import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import {
  FaCogs,
  FaTachometerAlt
} from 'react-icons/fa';
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
    <div className={`w-full bg-white h-[70px] relative z-30 ${className || ""}`}>
      <div className="container-x mx-auto h-full">
        <div className="w-full h-full flex justify-between items-center px-6">
          {/* Danh mục */}
          <div className="relative">
            <button
              onClick={handler}
              type="button"
              className="flex items-center space-x-3 bg-gray-100 hover:bg-gray-200 rounded-lg p-3 transition-all duration-300"
            >
              <span className="text-black text-sm font-semibold">Tất cả danh mục</span>
              <svg
                className="w-4 h-4 text-gray-600"
                viewBox="0 0 14 9"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="14" height="1" />
                <rect y="8" width="14" height="1" />
                <rect y="4" width="10" height="1" />
              </svg>
            </button>

            {categoryToggle && (
              <div
                className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-20"
                onClick={handler}
              ></div>
            )}

            <div
              className="category-dropdown absolute left-0 top-[60px] bg-white shadow-md w-full rounded-b-lg overflow-y-auto z-30"
              style={{
                height: `${elementsSize}`,
                maxHeight: '400px', // Giới hạn chiều cao tối đa để tránh che khuất
              }}
            >
              <ul className="categories-list">
                {categories.map((category) => (
                  <li key={category.id} className="category-item">
                    <div
                      onClick={() => {
                        navigate(`/all-products?category=${category.name}`);
                      }}
                      className="flex justify-between items-center p-4 text-black hover:bg-blue-100 transition-all duration-300 cursor-pointer"
                    >
                      <span className="text-sm font-medium">{category.name}</span>
                      <svg
                        className="w-3 h-3 text-gray-600"
                        viewBox="0 0 6 9"
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
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>


          {/* Navigation */}
          <div className="flex space-x-6">
            <Link to="/" className="text-black text-sm font-medium hover:text-blue-600 transition-all duration-300">
              Trang Chủ
            </Link>
            <Link to="/all-products" className="text-black text-sm font-medium hover:text-blue-600 transition-all duration-300">
              Sản Phẩm
            </Link>
            <Link to="/about" className="text-black text-sm font-medium hover:text-blue-600 transition-all duration-300">
              Về Chúng tôi
            </Link>
            <Link to="/contact" className="text-black text-sm font-medium hover:text-blue-600 transition-all duration-300">
              Liên Hệ
            </Link>
          </div>

          {/* Quản lý bán hàng */}
          <div className="flex items-center">
            {user && user.role && (
              <Link to="/admin">
                <button className="flex items-center bg-gray-800 text-white text-sm font-semibold py-3 px-6  shadow-md hover:bg-gray-900 hover:shadow-xl transition-all duration-300 ease-in-out">
                  <FaCogs className="mr-2 w-4 h-4" /> {/* Biểu tượng cài đặt, phù hợp với quản lý admin */}
                  <span>Quản Lý Admin</span>
                </button>
              </Link>
            )}
          </div>



        </div>
      </div>
    </div>

  );
}
