package com.poly.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.poly.dto.OrderStatisticsDTO;
import com.poly.dto.StatisticalDTO;
import com.poly.repository.OrderStatisticsRepository;
import com.poly.repository.StatisticalRepository;

@Service
public class StatisticalService {
	@Autowired
	private StatisticalRepository StatisticalRepository;
	
	@Autowired
	private OrderStatisticsRepository orderStatisticsRepository;

	public int getSumOrderWithStatusOne() {
		return StatisticalRepository.countOrdersWithStatusOne();
	}

	public int getTotalProduct() {
		return StatisticalRepository.getTotalProduct();
	}

	public double getTotalPrice() {
		return StatisticalRepository.sumTotalPrice();
	}

	public List<StatisticalDTO> fetchMonthlySalesData() {
		return StatisticalRepository.fetchMonthlySalesData();
	}
	
	public List<OrderStatisticsDTO> getOrderStatistics() {
	    // Gọi repository để lấy dữ liệu thô từ truy vấn
	    List<Object[]> result = orderStatisticsRepository.getOrderStatistics();

	    List<OrderStatisticsDTO> statistics = new ArrayList<>();
	    for (Object[] row : result) {
	        Long orderDetailsId = ((Number) row[0]).longValue();
	        String productName = (String) row[1];
	        Double productPrice = ((Number) row[2]).doubleValue();

	        // Kiểm tra kiểu dữ liệu của row[3] trước khi ép kiểu
	        java.sql.Date orderDate = null;
	        if (row[3] instanceof java.sql.Timestamp) {
	            Timestamp timestamp = (Timestamp) row[3];
	            orderDate = new java.sql.Date(timestamp.getTime());  // Chuyển đổi từ Timestamp sang Date
	        } else if (row[3] instanceof java.sql.Date) {
	            orderDate = (java.sql.Date) row[3];
	        }

	        Long quantity = ((Number) row[4]).longValue();
	        Double total = ((Number) row[5]).doubleValue();

	        statistics.add(new OrderStatisticsDTO(orderDetailsId, productName, productPrice, orderDate, quantity, total));
	    }

	    return statistics;
	}


}
