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
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Đăng ký các thành phần
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, Title, Tooltip, Legend);

const StatisticsPage = () => {

  const [sumOrder, setSumOrder] = useState(0);
  const [sumProduct, setSumProduct] = useState(0);
  const [sumTotalPrice, setSumTotalPrice] = useState(0);
  const [monthlySales, setMonthlySales] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const uniqueYears = Array.from(new Set(monthlySales.map(item => parseInt(item.year, 10))));

  const statistics = {
    totalProducts: sumProduct,
    totalRevenue: sumTotalPrice,
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

      setLoading(true); // Bắt đầu loading
      try {
        // Gọi API để lấy số đơn hàng
        const orderResponse = await axios.get(`http://localhost:8080/api/admin/statistical/count-order`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        setSumOrder(orderResponse.data);

        // Gọi API để lấy số sản phẩm
        const productResponse = await axios.get(`http://localhost:8080/api/admin/statistical/count-product`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        setSumProduct(productResponse.data);

        // Gọi API để lấy tổng doanh thu
        const priceResponse = await axios.get(`http://localhost:8080/api/admin/statistical/sum-total-price`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        setSumTotalPrice(priceResponse.data);

        // Gọi API để lấy doanh thu hàng tháng
        const monthlySaleResponse = await axios.get(`http://localhost:8080/api/admin/statistical/fetch-monthly-sales`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        const months = Array.from(new Set(monthlySales.map(item => parseInt(item.month, 10))));
        setMonthlySales(monthlySaleResponse.data);
        setAvailableMonths(months);
        console.log();
        
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê:", error);
        setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchOrderCount();
  }, [token]);

  // Giả sử monthlySales chứa dữ liệu doanh thu của nhiều năm
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  // Lọc dữ liệu theo năm đã chọn
  const filteredData = monthlySales.filter(item => parseInt(item.year, 10) === selectedYear && parseInt(item.month, 10) === selectedMonth);

  // Cấu trúc doanh thu từng ngày
  const revenueByDay = new Array(31).fill(0);
  filteredData.forEach(item => {
    const dayIndex = parseInt(item.day) - 1;
    revenueByDay[dayIndex] = parseFloat(item.total);
  });

  // Khởi tạo mảng doanh thu cho 12 tháng
  const revenueByMonth = new Array(12).fill(0);


  // Điền doanh thu vào từng tháng từ dữ liệu đã lọc
  filteredData.forEach(item => {
    const monthIndex = parseInt(item.month) - 1;
    revenueByMonth[monthIndex] = parseFloat(item.total);
  });

  // Cập nhật chartData theo tháng
  const chartData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    datasets: [
      {
        label: `Doanh thu (VND) - ${selectedYear}`,
        data: new Array(12).fill(0).map((_, i) => {
          return monthlySales.filter(s => parseInt(s.year, 10) === selectedYear && parseInt(s.month, 10) === i + 1)
            .reduce((total, s) => total + parseFloat(s.total), 0);
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const dailyChartData = {
    labels: Array.from({ length: 31 }, (_, i) => `Ngày ${i + 1}`),
    datasets: [
      {
        label: `Doanh thu theo ngày (VND) - ${selectedMonth}/${selectedYear}`,
        data: revenueByDay,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
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
          callback: (value) => value.toLocaleString() + ' VND',
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
          <p className="text-3xl font-bold text-green-600">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(statistics.totalRevenue)}
          </p>
        </div>

        {/* Card 3: Tổng số đơn hàng */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold">Tổng số đơn hàng</h2>
          <p className="text-3xl font-bold text-red-600">{statistics.totalOrders}</p>
        </div>
      </div>

      {/* Biểu đồ doanh thu */}
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Thống kê</h1>

        {/* Biểu đồ tổng quan doanh thu theo tháng */}
        <div className="mt-10 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Biểu đồ doanh thu theo tháng</h2>
          <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
            {uniqueYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true, ticks: { callback: (value) => value.toLocaleString() + ' VND' } } } }} />
        </div>

        {/* Biểu đồ doanh thu theo ngày */}
        <div className="mt-10 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Biểu đồ doanh thu theo ngày</h2>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month}>Tháng {month}</option>
            ))}
          </select>
          <Bar data={dailyChartData} options={{ responsive: true, scales: { y: { beginAtZero: true, ticks: { callback: (value) => value.toLocaleString() + ' VND' } } } }} />
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;



