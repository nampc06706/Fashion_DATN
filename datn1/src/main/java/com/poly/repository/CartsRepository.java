package com.poly.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.poly.entity.Carts;

@Repository
public interface CartsRepository extends JpaRepository<Carts, Integer> {

	// Truy vấn sử dụng JPQL với JOIN FETCH để tải dữ liệu liên kết
	@Query("SELECT c FROM Carts c JOIN FETCH c.size s JOIN FETCH s.color WHERE c.account.id = :accountId")
	List<Carts> findByAccountId(@Param("accountId") Integer accountId);

	@Query("SELECT c FROM Carts c WHERE c.account.id = :accountId AND c.size.id = :sizeId AND c.size.color.id = :colorId")
	List<Carts> findByAccountIdAndSizeIdAndColorId(@Param("accountId") Integer accountId,
			@Param("sizeId") Integer sizeId, @Param("colorId") Integer colorId);

	// Truy vấn để tìm cart theo cartId và accountId
	@Query("SELECT c FROM Carts c WHERE c.id = :cartId AND c.account.id = :accountId")
	Optional<Carts> findByIdAndAccountId(@Param("cartId") Integer cartId, @Param("accountId") Integer accountId);

	// Thêm phương thức xóa dựa trên cartId và sizeId
	@Query("DELETE FROM Carts c WHERE c.id = :cartId AND c.size.id = :sizeId")
	void deleteByCartIdAndSizeId(@Param("cartId") Integer cartId, @Param("sizeId") Integer sizeId);
}