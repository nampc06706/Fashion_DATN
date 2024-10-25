import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Đăng ký các thành phần
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatisticsPage = () => {

  const [sumOrder, setSumOrder] = useState(0);
  const [sumProduct, setSumProduct] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const statistics = {
    totalProducts: sumProduct,
    totalRevenue: 2500000,
    totalOrders: sumOrder,
  };

  const token = Cookies.get('token');
  let userInfo = null;

  if (token) {
    try {
      userInfo = jwtDecode(token);
    } catch (error) {
      console.error("Token decoding error:", error);
    }
  }

  useEffect(() => {
    const fetchOrderCount = async () => {
      if (!userInfo) {
        setError("Không tìm thấy thông tin người dùng.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/admin/statistical/count-order`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true,
        });
        setSumOrder(response.data); // Giả sử API trả về tổng số đơn hàng
      } catch (error) {
        console.error("Lỗi khi lấy tổng số đơn hàng:", error);
        setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/admin/statistical/count-product`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true,
        });
        setSumProduct(response.data); // Giả sử API trả về tổng số đơn hàng
      } catch (error) {
        console.error("Lỗi khi lấy Tổng số sản phẩm:", error);
        setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }

    };

    fetchOrderCount();
  }, [userInfo, token]);

  // Dữ liệu cho biểu đồ
  const chartData = {
    labels: [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
      'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
      'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ],
    datasets: [
      {
        label: 'Doanh thu (VND)',
        data: [
          400000, 500000, 300000, 600000,
          700000, 800000, 900000, 1000000,
          1100000, 1200000, 1300000, 1400000
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Tùy chỉnh cho biểu đồ
  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toLocaleString() + ' VND', // Định dạng y-axis
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Thống kê</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Tổng số sản phẩm */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold">Tổng số sản phẩm</h2>
          <p className="text-3xl font-bold text-blue-600">{statistics.totalProducts}</p>
        </div>

        {/* Card 2: Tổng doanh thu */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold">Tổng doanh thu</h2>
          <p className="text-3xl font-bold text-green-600">{statistics.totalRevenue.toLocaleString()} VND</p>
        </div>

        {/* Card 3: Tổng số đơn hàng */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold">Tổng số đơn hàng</h2>
          <p className="text-3xl font-bold text-red-600">{statistics.totalOrders}</p>
        </div>
      </div>

      {/* Biểu đồ doanh thu */}
      <div className="mt-10 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Biểu đồ doanh thu</h2>
        <div className="h-100"> {/* Thay đổi chiều cao tại đây */}
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
