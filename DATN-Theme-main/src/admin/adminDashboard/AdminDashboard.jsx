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
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Pagination from "../component/Pagination";

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

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [tableData, setTableData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [filteredDataProduct, setFilteredDataProduct] = useState(tableData);

  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 10; // Số mục hiển thị trên mỗi trang

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDataProduct.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const exportToExcel = () => {
    // Chuyển đổi timestamp thành đối tượng Date và định dạng lại theo nhu cầu
    const formattedItems = currentItems.map(item => {
      // Giả sử 'ngay' là trường chứa timestamp, bạn có thể thay đổi theo tên trường của bạn
      return {
        ...item,
        orderDate: new Date(parseInt(item.orderDate)).toLocaleDateString("vi-VN") // Định dạng ngày theo kiểu Việt Nam
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Thống kê sản phẩm");

    // Tạo file Excel
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    // Tải file xuống
    saveAs(data, "ThongKeSanPham.xlsx");
  };


  const parseDateToTimestamp = (dateString) => {
    const [day, month, year] = dateString.split('/'); // Tách chuỗi theo định dạng dd/MM/yyyy
    return new Date(`${year}-${month}-${day}`).getTime(); // Chuyển sang timestamp
  };

  const filterDataByDate = () => {
    if (startDate && endDate) {
      const startTimestamp = parseDateToTimestamp(startDate);
      const endTimestamp = parseDateToTimestamp(endDate);
  
      const filtered = tableData
        .filter((item) => {
          const itemTimestamp = item.orderDate; // Giả sử orderDate là timestamp
          return itemTimestamp >= startTimestamp && itemTimestamp <= endTimestamp;
        })
        .sort((a, b) => b.quantitySold - a.quantitySold); // Sắp xếp theo số lượng bán giảm dần
  
      setFilteredDataProduct(filtered);
    } else {
      // Nếu không chọn ngày, hiển thị toàn bộ và sắp xếp theo số lượng bán
      const sortedData = [...tableData].sort((a, b) => b.quantitySold - a.quantitySold);
      setFilteredDataProduct(sortedData);
    }
  };
  

  
  // Gọi filterDataByDate khi startDate hoặc endDate thay đổi
  useEffect(() => {
    filterDataByDate();
  }, [startDate, endDate, tableData]);

  const uniqueYears = Array.from(new Set(monthlySales.map(item => parseInt(item.year, 10))));

  const statistics = {
    totalProducts: sumProduct,
    totalRevenue: sumTotalPrice,
    totalOrders: sumOrder,
  };

  const token = Cookies.get('token');
  let userInfo = null;
  let role = null;

  if (token) {
    try {
      userInfo = jwtDecode(token);
      role = userInfo.roles;
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
        const orderResponse = await axios.get(`http://localhost:8080/api/staff/statistical/count-order`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        setSumOrder(orderResponse.data);

        // Gọi API để lấy số sản phẩm
        const productResponse = await axios.get(`http://localhost:8080/api/staff/statistical/count-product`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        setSumProduct(productResponse.data);

        // Gọi API để lấy doanh thu hàng tháng
        const monthlySaleResponse = await axios.get(`http://localhost:8080/api/staff/statistical/fetch-monthly-sales`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        const months = Array.from(new Set(monthlySales.map(item => parseInt(item.month, 10))));
        setMonthlySales(monthlySaleResponse.data);
        setAvailableMonths(months);

        // Gọi API để lấy tổng doanh thu
        const priceResponse = await axios.get(`http://localhost:8080/api/staff/statistical/sum-total-price`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        setSumTotalPrice(priceResponse.data);

        const orderDetailsResponse = await axios.get(`http://localhost:8080/api/staff/statistical/order-statistics`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        setTableData(orderDetailsResponse.data);
        setFilteredDataProduct(orderDetailsResponse.data);
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

      <div className={`grid grid-cols-3 md:grid-cols-${role === 'STAFF' ? 2 : 3} gap-6`}>
        {/* Card 1: Tổng số sản phẩm */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold">Tổng số sản phẩm</h2>
          <p className="text-3xl font-bold text-blue-600">{statistics.totalProducts}</p>
        </div>

        {/* Card 2: Tổng doanh thu */}
        {role !== 'STAFF' && (
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold">Tổng doanh thu</h2>
            <p className="text-3xl font-bold text-green-600">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(statistics.totalRevenue)}
            </p>
          </div>
        )}

        {/* Card 3: Tổng số đơn hàng */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold">Tổng số đơn hàng hoàn thành</h2>
          <p className="text-3xl font-bold text-red-600">{statistics.totalOrders}</p>
        </div>
      </div>

      <Tabs>
        <TabList className="mt-10 grid grid-cols-3 md:grid-cols-3 gap-6">
          <Tab className="bg-white p-6 flex flex-col items-center justify-center font-semibold">Thống kê sản phẩm đã bán</Tab>
          <Tab className="bg-white p-6 flex flex-col items-center justify-center font-semibold">Biểu đồ doanh thu theo năm</Tab>
          <Tab className="bg-white p-6 flex flex-col items-center justify-center font-semibold">Biểu đồ doanh thu theo tháng</Tab>
        </TabList>
        {/* Tab 1: Thống kê chi tiết sản phẩm */}
        <TabPanel>
          <div className="mt-10 bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="font-semibold flex-grow text-center">
                Thống kê sản phẩm bán ra
              </h1>
            </div>

            {/* Bộ lọc thời gian */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-4">
                <div className="flex space-x-2">
                  <label className="flex items-center text-gray-700">
                    <span className="mr-2">Từ ngày:</span>
                    <input
                      type="date"
                      className="border border-gray-300 rounded px-3 py-2"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </label>
                  <label className="flex items-center text-gray-700">
                    <span className="mr-2">Đến ngày:</span>
                    <input
                      type="date"
                      className="border border-gray-300 rounded px-3 py-2"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </label>
                </div>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                >
                  Đặt lại
                </button>

              </div>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={exportToExcel}
              >
                Xuất Excel
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2 text-left">#ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Tên sản phẩm</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Giá sản phẩm</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Số lượng bán</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Ngày</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Tổng tiền (VND)</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2 text-center">{item.orderDetailsId}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.productName}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.productPrice)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {new Date(parseInt(item.orderDate)).toLocaleDateString('en-US')}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Pagination
                totalItems={filteredDataProduct.length}
                itemsPerPage={itemsPerPage}
                paginate={paginate}
                currentPage={currentPage}
              />

            </div>
          </div>
        </TabPanel>

        {/* Tab 2: Biểu đồ doanh thu năm*/}
        <TabPanel>
          <div className="mt-10 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Biểu đồ doanh thu theo tháng</h2>
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
              {[2023, 2024, 2025].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
          </div>
        </TabPanel>
        {/* Tab 2: Biểu đồ doanh thu tháng*/}
        <TabPanel>
          <div className="mt-10 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Biểu đồ doanh thu theo ngày</h2>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>Tháng {month}</option>
              ))}
            </select>
            <Bar data={dailyChartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
          </div>
        </TabPanel>
      </Tabs>
    </div >
  );
};

export default StatisticsPage;



