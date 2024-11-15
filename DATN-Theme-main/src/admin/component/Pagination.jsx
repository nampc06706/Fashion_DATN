import React from 'react';
import ReactPaginate from 'react-paginate';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import './Pagination.css'; // Thêm một file CSS riêng

const Pagination = ({ totalItems, itemsPerPage, paginate, currentPage }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageClick = (data) => {
        paginate(data.selected + 1);  // react-paginate sử dụng index bắt đầu từ 0, trong khi bạn cần bắt đầu từ 1
    };

    return (
        <div className="pagination-container">
            <ReactPaginate
                previousLabel={<> <AiOutlineLeft /> <span>Trước</span> </>} // Kết hợp chữ "Trước" và icon mũi tên trái
                nextLabel={<><span>Kế tiếp</span> <AiOutlineRight /></>}      // Icon mũi tên phải
                breakLabel="..."                    // Hiển thị dấu "..."
                pageCount={totalPages}              // Tổng số trang
                marginPagesDisplayed={2}            // Hiển thị 2 trang đầu và cuối
                pageRangeDisplayed={3}              // Hiển thị 3 trang lân cận quanh trang hiện tại
                onPageChange={handlePageClick}      // Hàm xử lý khi người dùng nhấn trang
                containerClassName="pagination"     // Class cho container phân trang
                activeClassName="active"   // Lớp cho trang hiện tại
                pageClassName="page-item"  // Lớp cho mỗi trang
                pageLinkClassName="page-link" // Lớp cho liên kết trang
                previousClassName="previous"   // Lớp cho nút "Trang trước"
                previousLinkClassName="previous-link"   // Lớp cho liên kết nút "Trang trước"
                nextClassName="next"       // Lớp cho nút "Trang sau"
                nextLinkClassName="next-link"       // Lớp cho liên kết nút "Trang sau"
                disabledClassName="disabled" // Lớp khi nút bị vô hiệu hóa
            />
        </div>
    );
};

export default Pagination;
