import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';

const OrderTable = ({ orders, token, fetchOrderDetails }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState('');
  const data = useMemo(() => orders, [orders]);

  const columns = useMemo(
    () => [
      { Header: 'Mã đơn hàng', accessor: 'id' },
      { Header: 'Tên khách hàng', accessor: 'account.fullname' },
      {
        Header: 'Ngày đặt',
        accessor: (row) => new Date(row.date[0], row.date[1] - 1, row.date[2]).toLocaleDateString(),
        id: 'orderDate'
      },
      {
        Header: 'Phí giao hàng (VND)',
        accessor: (row) => parseFloat(row.shippingMethod.price).toLocaleString(),
        id: 'shippingPrice'
      },
      {
        Header: 'Trạng thái',
        accessor: (row) => {
          switch (row.status) {
            case "5":
              return "Chờ xác nhận";
            case "4":
              return "Đã xác nhận";
            case "3":
              return "Đang vận chuyển";
            case "2":
              return "Đang giao";
            case "1":
              return "Hoàn thành";
            case "0":
              return "Hủy";
            default:
              return "Không xác định"; // Nếu trạng thái không thuộc bất kỳ giá trị nào ở trên
          }
        },
        id: 'status'
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 15 },
    },
    useSortBy,
    usePagination
  );

  const handleRowClick = (order) => {
    setSelectedOrder(order); // Đặt đơn hàng được chọn
  };

  const handleUpdateStatus = async (orderId, status) => {

    try {
      const response = await axios.put(`http://localhost:8080/api/admin/orders?orderId=${orderId}&status=${status}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`, // Thay `token` bằng token xác thực thực tế
          'Content-Type': 'application/json'
        },
      });

      if (response.status === 200) {
        fetchOrderDetails();
        handleCancelForm();
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    }
  };

  const handleCancelForm = () => {
    setSelectedOrder(null); // Đặt lại selectedOrder để đóng form
  };

  return (
    <div className="container-fluid">
      <div className="w-100 p-4">
        <table {...getTableProps()} className="min-w-full bg-white border border-gray-300">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} className="text-center bg-gray-100">
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="py-2 px-4 border-b"
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? '🔽'
                          : '🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="py-2 px-4 border-b">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="pagination mt-4">
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Trang trước
          </button>{' '}
          <span>
            Trang <strong>{pageIndex + 1}</strong> của <strong>{pageOptions.length}</strong>
          </span>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            Trang sau
          </button>
        </div>
      </div>

      {/* Hiển thị chi tiết đơn hàng khi có selectedOrder */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh] border border-gray-200 relative">

            {/* Nút X ở góc trái trên */}
            <button
              type="button"
              onClick={handleCancelForm}  // Đóng modal
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800">Chi tiết đơn hàng</h2>

            <div className="space-y-4 text-gray-700 mb-6">
              <p><strong>Mã đơn hàng:</strong> {selectedOrder.id}</p>
              <p><strong>Tên khách hàng:</strong> {selectedOrder.account.fullname}</p>
              <p><strong>Ngày đặt:</strong> {new Date(selectedOrder.date[0], selectedOrder.date[1] - 1, selectedOrder.date[2]).toLocaleDateString()}</p>
              <p><strong>Địa chỉ giao hàng:</strong> {selectedOrder.address.note + " " + selectedOrder.address.ward + " " + selectedOrder.address.district + " " + selectedOrder.address.province}</p>
              <p><strong>Phí giao hàng:</strong> {parseFloat(selectedOrder.shippingMethod.price).toLocaleString()} VND</p>
              <p><strong>Trạng thái:</strong> {selectedOrder.status === "1" ? "Đang xử lý" : "Hoàn thành"}</p>
            </div>

            <h3 className="text-lg font-semibold mb-4">Sản phẩm trong đơn hàng</h3>
            <div className="space-y-3 border-t border-gray-300 pt-4">
              {selectedOrder.orderDetails.map((product, index) => (
                <div key={index} className="flex justify-between items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p><strong>Tên sản phẩm:</strong> {product.size.product.name}</p>
                    <p><strong>Số lượng:</strong> {product.quantity}</p>
                    <p><strong>Giá:</strong> {parseFloat(product.price).toLocaleString()} VND</p>
                  </div>
                  <div className="text-right">
                    <p><strong>Tổng cộng:</strong> {(product.quantity * product.price).toLocaleString()} VND</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tính tổng tiền đơn hàng */}
            <div className="border-t border-gray-300 pt-4 mt-4 text-gray-800">
              <p className="text-xl font-semibold flex justify-between">
                <span>Tổng tiền:</span>
                <span>{(selectedOrder.orderDetails.reduce((acc, product) => acc + product.quantity * product.price, 0)
                  + parseFloat(selectedOrder.shippingMethod.price)).toLocaleString()} VND
                </span>
              </p>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedOrder.id, "4")}  // Đã xác nhận
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Xác nhận
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedOrder.id, "0")}  // Hủy
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Hủy đơn
              </button>
            </div>

          </div>
        </div>

      )}
    </div>
  );
};

export default OrderTable;
