package com.poly.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.poly.entity.Account;
import com.poly.entity.Favourite;
import com.poly.entity.Size;

@Repository
public interface FavouriteRepository extends JpaRepository<Favourite, Integer> {
	List<Favourite> findByaccountId(Account account); // Sử dụng Account thay vì Integer
	Optional<Favourite> findBySizeIdAndAccountId(Size sizeId, Account accountId);

}
