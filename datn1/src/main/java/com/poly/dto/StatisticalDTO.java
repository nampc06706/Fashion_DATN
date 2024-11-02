package com.poly.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class StatisticalDTO {
	@Id
	private Integer id;
	double Total;
	int Month;
	int Year;
	int Day;
}
