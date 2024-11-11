package com.poly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.poly.entity.Flashsale;

@Repository
public interface FlashRepository extends JpaRepository<Flashsale, Integer> {

    // Lấy tất cả Flash Sale (kể cả hoạt động và không hoạt động)
    List<Flashsale> findAll();
}