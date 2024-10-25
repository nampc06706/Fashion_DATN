package com.poly.service;



import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.poly.repository.StatisticalRepository;


@Service
public class StatisticalService {
	private static final Logger logger = LoggerFactory.getLogger(StatisticalService.class);
	@Autowired
	private StatisticalRepository StatisticalRepository;

	public int getSumOrderWithStatusOne() {
        return StatisticalRepository.countOrdersWithStatusOne();
    }
	
	public Integer getTotalProduct() {
        return StatisticalRepository.getTotalProduct();
    }

}
