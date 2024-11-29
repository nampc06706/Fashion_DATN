package com.poly.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.poly.dto.OrderStatisticsDTO;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface OrderStatisticsRepository extends JpaRepository<OrderStatisticsDTO, Long> {

    // Thực hiện truy vấn SQL tuỳ chỉnh để lấy dữ liệu thống kê
    @Query(value = "SELECT \r\n"
    		+ "    od.id AS orderDetailsId, \r\n"
    		+ "    p.Name AS productName, \r\n"
    		+ "    p.Price AS productPrice, \r\n"
    		+ "    o.Date AS orderDate, \r\n"
    		+ "    SUM(od.Quantity) AS Quantity, \r\n"
    		+ "    SUM(od.Quantity * od.Price) AS Total\r\n"
    		+ "FROM \r\n"
    		+ "    orderdetails od \r\n"
    		+ "JOIN \r\n"
    		+ "    orders o ON od.OrderID = o.ID \r\n"
    		+ "JOIN \r\n"
    		+ "    products p ON od.id = p.ID \r\n"
    		+ "GROUP BY \r\n"
    		+ "    od.id, p.Name, p.Price, o.Date \r\n"
    		+ "ORDER BY \r\n"
    		+ "    Total DESC;\r\n"
    		+ "", nativeQuery = true)
    List<Object[]> getOrderStatistics();
}
