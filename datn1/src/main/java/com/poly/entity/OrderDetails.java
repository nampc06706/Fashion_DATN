package com.poly.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orderdetails")
public class OrderDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER,optional = false)
    @JoinColumn(name = "Orderid", nullable = false)
    @JsonBackReference // Đánh dấu bên phụ thuộc
    private Orders order;

    @Column(name = "Price", nullable = false)
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "SizeID", nullable = false)
    private Size size;

    @Column(name = "Quantity", nullable = false)
    private Integer quantity;
    
    @Transient // Đánh dấu trường này không lưu vào DB
    private List<ProductImages> images; // Thêm danh sách hình ảnh vào OrderDetail

    // Phương thức tính toán tổng giá trị đơn hàng chi tiết
    public BigDecimal calculateTotal() {
        return price.multiply(new BigDecimal(quantity));
    }
}
