package com.poly.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.poly.entity.Color;

@Repository
public interface ColorRepository extends JpaRepository<Color, Integer> {
	Color findByName(String name);
}
