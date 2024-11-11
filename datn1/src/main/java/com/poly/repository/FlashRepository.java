package com.poly.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.poly.entity.Flashsale;

import jakarta.transaction.Transactional;

@Repository
public interface FlashRepository extends JpaRepository<Flashsale, Integer> {

	// Lấy tất cả Flash Sale (kể cả hoạt động và không hoạt động)
	List<Flashsale> findAll();

	// Tắt tất cả Flash Sale khác (isactive = false)
	@Modifying
	@Transactional
	@Query("UPDATE Flashsale f SET f.isactive = false WHERE f.isactive = true")
	void deactivateAllFlashsales();
	
	 // Phương thức findById đã được JpaRepository cung cấp tự động
    Optional<Flashsale> findById(Flashsale id);
}