package com.poly.service;

import com.poly.entity.Flashsale;
import com.poly.repository.FlashsaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FlashsaleService {

    @Autowired
    private FlashsaleRepository flashsaleRepository;

    public List<Flashsale> findAll() {
        return flashsaleRepository.findAll();
    }

    public Optional<Flashsale> findById(Integer id) {
        return flashsaleRepository.findById(id);
    }

    public Flashsale save(Flashsale flashsale) {
        return flashsaleRepository.save(flashsale);
    }

    public void deleteById(Integer id) {
        flashsaleRepository.deleteById(id);
    }
}
