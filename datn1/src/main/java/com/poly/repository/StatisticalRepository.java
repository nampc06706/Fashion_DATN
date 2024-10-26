package com.poly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.poly.dto.StatisticalDTO;

@Repository
public interface StatisticalRepository extends JpaRepository<StatisticalDTO, Integer> {
	@Query(value = "SELECT COUNT(o.id) AS SumOrder " 
			+ "FROM db1.orders o "
			+ "INNER JOIN db1.orderdetails d ON o.id = d.OrderID " 
			+ "WHERE o.Status = 1", nativeQuery = true)
	int countOrdersWithStatusOne();
	
	@Query(value = "SELECT count(p) FROM Products p")
	int getTotalProduct();
	
	@Query(value = "SELECT sum(price) as SumPrice\r\n"
			+ "FROM db1.orderdetails\r\n"
			+ "inner join orders on OrderID = orders.id\r\n"
			+ "where Status = 1;", nativeQuery = true)
	double sumTotalPrice();
	
	@Query(value = "SELECT orders.id,\r\n"
			+ "    MONTH(Date) AS Month,\r\n"
			+ "    YEAR(Date) AS Year,\r\n"
			+ "    SUM(Price * Quantity) AS Total\r\n"
			+ "FROM orderdetails\r\n"
			+ "INNER JOIN orders ON OrderID = orders.id\r\n"
			+ "WHERE Status = 1\r\n"
			+ "GROUP BY YEAR(Date), MONTH(Date),orders.id\r\n"
			+ "ORDER BY Year, Month;",nativeQuery = true)
	List<StatisticalDTO> fetchMonthlySalesData();	
}
