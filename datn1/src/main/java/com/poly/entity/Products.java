package com.poly.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Products implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "Name", nullable = false)
    private String name;
    
    @Column(name = "Price", nullable = false)
    private BigDecimal price;

    @Column(name = "Description")
    private String description;

    @Column(name = "create_date") 
    private LocalDateTime createDate;
    
    @ManyToOne
    @JoinColumn(name = "CategoryID", nullable = false)
    @NotNull
    private Category category;
    
    @ToString.Exclude
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL , fetch = FetchType.EAGER)
    @JsonIgnore
    private List<ProductImages> images;
    
    @ToString.Exclude
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Size> sizes;
    
    @Override
    public String toString() {
        return "Products{" +
               "id=" + id +
               ", name='" + name + '\'' +
               ", price=" + price +
               ", description='" + description + '\'' +
               ", createDate=" + createDate +
               ", category=" + (category != null ? category.getId() : null) + // Chỉ in ra ID của category để tránh lazy loading
               '}';
    }


}
