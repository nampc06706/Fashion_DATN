package com.poly.repository;

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
	
}
