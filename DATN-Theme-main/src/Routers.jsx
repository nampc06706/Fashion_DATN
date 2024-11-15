import { Route, Routes, Navigate } from "react-router-dom";
import About from "./components/About/index.jsx";
import AllProductPage from "./components/AllProductPage/index.jsx";
import Login from "./components/Auth/Login/index";
import Profile from "./components/Auth/Profile/index.jsx";
import Signup from "./components/Auth/Signup/index.jsx";
import BecomeSaller from "./components/BecomeSaller/index.jsx";
import Blogs from "./components/Blogs/index.jsx";
import Blog from "./components/Blogs/Blog.jsx/index.jsx";
import CardPage from "./components/CartPage/index.jsx";
import CheakoutPage from "./components/CheakoutPage/index.jsx";
import OrdersPage from "./components/OrdersPage/index.jsx";
import Contact from "./components/Contact/index.jsx";
import Faq from "./components/Faq/index.jsx";
import FlashSale from "./components/FlashSale/index.jsx";
import FourZeroFour from "./components/FourZeroFour/index.jsx";
import SallerPage from "./components/SallerPage/index.jsx";
import Sallers from "./components/Sellers/index.jsx";
import SingleProductPage from "./components/SingleProductPage/index.jsx";
import TermsCondition from "./components/TermsCondition/index";
import TrackingOrder from "./components/TrackingOrder/index.jsx";
import Wishlist from "./components/Wishlist/index.jsx";
import HomeFive from "./components/HomeFive/index.jsx";

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Sửa lại jwtDecode
import { useEffect, useState } from 'react';

import AdminDashboard from "./admin/adminDashboard/AdminDashboard.jsx";
import AdminLayout from "./admin/layout/AdminLayout.jsx";
import AdminProducts from "./admin/adminProducts/Products.jsx";
import AdminCategory from "./admin/adminCategory/Category.jsx";
import AdminOrders from "./admin/adminOrders/Orders.jsx";
import AdminOrderDetails from "./admin/adminOrderDetails/OrderDetails.jsx";
import AdminUsers from "./admin/adminUsers/Users.jsx";
import AdminSize from "./admin/adminSize/Size.jsx";
import AdminFlashSales from "./admin/adminFlashSales/flashsale.jsx";
import AdminColor from "./admin/adminColor/Color.jsx";
import Forgotpassword from "./components/Auth/Forgotpassword/index.jsx";
import Otp from "./components/Auth/Forgotpassword/otp.jsx";
import Newpassword from "./components/Auth/Forgotpassword/newpassword.jsx";
import Succes from "./components/CheakoutPage/succes.jsx";
import Failer from "./components/CheakoutPage/failer.jsx";

// Tạo một component cho các route admin với layout riêng
const AdminRoutes = () => (
  <AdminLayout>
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/products" element={<AdminProducts />} />
      <Route path="/category" element={<AdminCategory />} />
      <Route path="/orders" element={<AdminOrders />} />
      <Route path="/orderdetails" element={<AdminOrderDetails />} />
      <Route path="/users" element={<AdminUsers />} />
      <Route path="/size" element={<AdminSize />} />
      <Route path="/color" element={<AdminColor />} />
      <Route path="/flash-sales" element={<AdminFlashSales />} />
    </Routes>
  </AdminLayout>
);

export default function Routers() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  const [userInfo, setUserInfo] = useState(null);  // State để lưu thông tin user
  const [isTokenChecked, setIsTokenChecked] = useState(false);  // Cờ để kiểm tra token đã được kiểm tra

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserInfo(decodedToken);

        // Kiểm tra quyền
        const roles = Array.isArray(decodedToken.roles) ? decodedToken.roles : [decodedToken.roles];
        setIsAdmin(roles.includes("ADMIN"));
        setIsStaff(roles.includes("STAFF"));

        console.log("Decoded Token:", decodedToken);
        console.log("Roles:", roles);
      } catch (error) {
        console.error("Token decoding error:", error);
      }
    }
    setIsTokenChecked(true);
  }, []);


  // Kiểm tra xem token đã được kiểm tra chưa
  if (!isTokenChecked) {
    return <div>Loading...</div>;  // Hiển thị loading khi đang kiểm tra token
  }



  return (
    <Routes>
      <Route exact path="/" element={<HomeFive />} />
      <Route exact path="/wishlist" element={<Wishlist />} />
      <Route exact path="/flash-sale" element={<FlashSale />} />
      <Route exact path="/saller-page" element={<SallerPage />} />
      <Route exact path="/sallers" element={<Sallers />} />
      <Route exact path="/about" element={<About />} />
      <Route exact path="/blogs" element={<Blogs />} />
      <Route exact path="/blogs/blog" element={<Blog />} />
      <Route exact path="/tracking-order" element={<TrackingOrder />} />
      <Route exact path="/contact" element={<Contact />} />
      <Route exact path="/faq" element={<Faq />} />
      <Route exact path="/all-products" element={<AllProductPage />} />
      <Route exact path="/products/:id" element={<SingleProductPage />} />
      <Route exact path="/cart" element={<CardPage />} />

      <Route exact path="/become-saller" element={<BecomeSaller />} />
      <Route exact path="/terms-condition" element={<TermsCondition />} />
      <Route exact path="/forgot-password" element={<Forgotpassword />} />

      {/* Kiểm tra token trước khi cho phép vào các trang cần đăng nhập */}
      <Route
        exact
        path="/profile"
        element={userInfo ? <Profile /> : <Navigate to="/" />} />
      <Route
        exact
        path="/checkout"
        element={userInfo ? <CheakoutPage /> : <Navigate to="/" />}
      />
      <Route
        exact
        path="/checkout/succes"
        element={userInfo ? <Succes /> : <Navigate to="/" />}
      />
      <Route
        exact
        path="/checkout/payment-failed"
        element={userInfo ? <Failer /> : <Navigate to="/" />}
      />
      <Route
        exact
        path="/orders"
        element={userInfo ? <OrdersPage /> : <Navigate to="/" />}
      />

      <Route
        exact
        path="/verify-otp"
        element={userInfo ? <Navigate to="/" /> : <Otp />}
      />
      <Route
        exact
        path="/new-password"
        element={userInfo ? <Navigate to="/" /> : <Newpassword />}
      />

      <Route
        exact path="/signup"
        element={userInfo ? <Navigate to="/" /> : <Signup />}
      />
      <Route
        exact path="/login"
        element={userInfo ? <Navigate to="/" /> : <Login />} />


      <Route exact path="*" element={<FourZeroFour />} />

      {/* Kiểm tra quyền admin trước khi cho phép vào trang admin */}
      <Route path="/admin/*" element={(isAdmin || isStaff) ? <AdminRoutes /> : <Navigate to="/" />} />

    </Routes>
  );
}
