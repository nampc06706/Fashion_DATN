package com.poly.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "address")
public class Address implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Integer id;

	@Column(name = "Province", nullable = false)
	private String province;

	@Column(name = "District", nullable = false)
	private String district;

	@Column(name = "Ward", nullable = false)
	private String ward;

	@Column(name = "Fullname")
	private String fullname;
	
	@Column(name = "Phone")
	private Integer phone;

	@Column(name = "isdefault")
	private boolean isdefault;

	@Column(name = "Note")
	private String note;

	@ManyToOne
	@JoinColumn(name = "AccountID", nullable = false) // Foreign key đến Account
	private Account account;
}
