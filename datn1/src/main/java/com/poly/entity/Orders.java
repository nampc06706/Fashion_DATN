package com.poly.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
public class Orders implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Integer id;

	@Column(name = "Date", nullable = false)
	private LocalDateTime date;

	@Column(name = "Note")
	private String note;
	
    
    @Column(name = "Status", nullable = false)
    private Integer status;

	@ManyToOne
	@JoinColumn(name = "AccountID", nullable = false)
	private Account account;

	@ManyToOne
	@JoinColumn(name = "AddressID", nullable = false)
	private Address address;

	@ManyToOne
	@JoinColumn(name = "PaymentID", nullable = false)
	private Payment payment;

	@ManyToOne
	@JoinColumn(name = "shipping_method_id", nullable = false)
	private ShippingMethods shippingMethod;


	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL,fetch = FetchType.EAGER)
	 @JsonManagedReference // Đánh dấu bên cha
    private List<OrderDetails> orderDetails;

    // Getter và Setter cho orderDetails
    public List<OrderDetails> getOrderDetails() {
        return orderDetails;
    }

    public void setOrderDetails(List<OrderDetails> orderDetails) {
        this.orderDetails = orderDetails;
    }
    
    public BigDecimal getShipmentFee() {
        return shippingMethod != null ? shippingMethod.getPrice() : BigDecimal.ZERO;
    }

}
