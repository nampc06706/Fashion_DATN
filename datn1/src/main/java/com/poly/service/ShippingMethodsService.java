package com.poly.service;

import com.poly.entity.ShippingMethods;
import com.poly.repository.ShippingMethodsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShippingMethodsService {

    @Autowired
    private ShippingMethodsRepository shippingMethodsRepository;

    public List<ShippingMethods> findAll() {
        return shippingMethodsRepository.findAll();
    }

    public ShippingMethods findById(Integer id) {
        return shippingMethodsRepository.findById(id).orElse(null);
    }

    public ShippingMethods save(ShippingMethods shippingMethod) {
        return shippingMethodsRepository.save(shippingMethod);
    }

    public void deleteById(Integer id) {
        shippingMethodsRepository.deleteById(id);
    }
}
