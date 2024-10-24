package com.poly.controller;

import com.poly.entity.ShippingMethods;
import com.poly.service.ShippingMethodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guest/shipping-methods")
public class ShippingMethodsController {

    @Autowired
    private ShippingMethodsService shippingMethodsService;

    @GetMapping
    public ResponseEntity<List<ShippingMethods>> getAllShippingMethods() {
        List<ShippingMethods> methods = shippingMethodsService.findAll();
        return new ResponseEntity<>(methods, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShippingMethods> getShippingMethodById(@PathVariable Integer id) {
        ShippingMethods method = shippingMethodsService.findById(id);
        return method != null ? new ResponseEntity<>(method, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<ShippingMethods> createShippingMethod(@RequestBody ShippingMethods shippingMethod) {
        ShippingMethods createdMethod = shippingMethodsService.save(shippingMethod);
        return new ResponseEntity<>(createdMethod, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShippingMethods> updateShippingMethod(@PathVariable Integer id, @RequestBody ShippingMethods shippingMethod) {
        shippingMethod.setId(id);
        ShippingMethods updatedMethod = shippingMethodsService.save(shippingMethod);
        return new ResponseEntity<>(updatedMethod, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShippingMethod(@PathVariable Integer id) {
        shippingMethodsService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
