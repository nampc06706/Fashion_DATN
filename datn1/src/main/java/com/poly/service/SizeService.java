package com.poly.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.poly.entity.Size;
import com.poly.repository.SizeRepository;

@Service
public class SizeService {

	@Autowired
	private SizeRepository sizeRepository;

	public List<Size> findAll() {
		return sizeRepository.findAll();
	}

	public Optional<Size> findById(Integer id) {
		return sizeRepository.findById(id);
	}

	public Size save(Size size) {
		return sizeRepository.save(size);
	}

	public void deleteById(Integer id) {
        sizeRepository.deleteById(id);
       
    }

	
	public List<Size> getSizesByProductId(Integer productId) {
        return sizeRepository.findByProductId(productId);
    }
	
    public Size getSizeById(Integer sizeId) {
        return sizeRepository.findById(sizeId).orElse(null);
    }

}
