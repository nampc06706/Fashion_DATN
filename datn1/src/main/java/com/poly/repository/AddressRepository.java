package com.poly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.poly.entity.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
	// Tìm địa chỉ theo accountId
    List<Address> findByAccountId(Integer accountId);
    
    @Modifying
    @Query("DELETE FROM Address a WHERE a.id = :id")
    void deleteById(@Param("id") Integer id);
    
    Address findByAccountIdAndIsdefaultTrue(Integer accountId);



}
