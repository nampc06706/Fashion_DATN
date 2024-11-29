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
//			+ "INNER JOIN db1.orderdetails d ON o.id = d.OrderID " 
			+ "WHERE o.Status = 4", nativeQuery = true)
	int countOrdersWithStatusOne();
	
	@Query(value = "SELECT count(p) FROM Products p")
	int getTotalProduct();
	
	@Query(value = "SELECT \n" + //
				"    SUM(od.Price * od.Quantity) AS SumPrice\n" + //
				"FROM Orders o\n" + //
				"JOIN orderdetails od ON o.ID = od.orderid\n" + //
				"WHERE o.STATUS = 4;", nativeQuery = true)
	double sumTotalPrice();
	
	@Query(value = "SELECT \r\n"
			+ "    o.id,\r\n"
			+ "    YEAR(o.Date) AS Year, \r\n"
			+ "    MONTH(o.Date) AS Month, \r\n"
			+ "    DAY(o.Date) AS Day,\r\n"
			+ "    SUM(od.Price * od.Quantity) AS Total\r\n"
			+ "FROM Orders o\r\n"
			+ "JOIN orderdetails od ON o.ID = od.orderid\r\n"
			+ "WHERE STATUS = 4\r\n"
			+ "GROUP BY o.id, YEAR(o.Date), MONTH(o.Date), DAY(o.Date);\r\n"
			,nativeQuery = true)
	List<StatisticalDTO> fetchMonthlySalesData();	
}
