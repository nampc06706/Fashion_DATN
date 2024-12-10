import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Routers from "./Routers";  // Không bọc trong <Router> ở đây nữa
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Cuộn lên đầu trang mỗi khi đường dẫn thay đổi
    window.scrollTo(0, 0);

    // Thêm lớp CSS phù hợp dựa trên đường dẫn hiện tại
    if (location.pathname === "/home-five") {
      document.body.classList.add("home-five");
    } else {
      document.body.classList.add("home-one");
    }

    return () => {
      // Xoá lớp CSS được thêm vào khi component bị gỡ bỏ
      document.body.classList.remove("home-five");
      document.body.classList.add("home-one");
    };
  }, [location.pathname]);

  return (
    <>
      <Routers />
      <ToastContainer />
    </>
  );
}

export default App;
