package com.poly.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.poly.dto.StatisticalDTO;
import com.poly.service.StatisticalService;

@RestController
@RequestMapping("/api/admin/statistical")
public class StatisticalController {

	@Autowired
	private StatisticalService statisticalService;

	@GetMapping("/count-order")
	@PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Integer> countOrdersWithStatusOne() {
        int sumOrder = statisticalService.getSumOrderWithStatusOne();
        return ResponseEntity.ok(sumOrder);
    }
	
	@GetMapping("/count-product")
	@PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Integer> getTotalProduct() {
        int TotalProduct = statisticalService.getTotalProduct();
        return ResponseEntity.ok(TotalProduct);
    }
	
	@GetMapping("/sum-total-price")
	@PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Double> getTotalPrice() {
        double TotalPrice = statisticalService.getTotalPrice();
        return ResponseEntity.ok(TotalPrice);
    }
	
	@GetMapping("/fetch-monthly-sales")
	@PreAuthorize("hasAnyAuthority('ADMIN')")
	public ResponseEntity<List<StatisticalDTO>> fetchMonthlySalesData() {
	    List<StatisticalDTO> monthlySalesData = statisticalService.fetchMonthlySalesData();
	    return ResponseEntity.ok(monthlySalesData);
	}
}
