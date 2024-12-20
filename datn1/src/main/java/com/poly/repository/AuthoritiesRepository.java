package com.poly.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.poly.entity.Account;
import com.poly.entity.Authorities;

@Repository
public interface AuthoritiesRepository extends JpaRepository<Authorities, Integer> {
	Authorities findByAccount(Account account);
}
