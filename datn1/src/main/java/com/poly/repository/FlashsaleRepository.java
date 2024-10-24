package com.poly.repository;

import com.poly.entity.Flashsale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlashsaleRepository extends JpaRepository<Flashsale, Integer> {
}
