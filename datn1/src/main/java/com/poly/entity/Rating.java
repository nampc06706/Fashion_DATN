package com.poly.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "rating")
public class Rating implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "Orderid", nullable = false)
    private Orders orders;

    @ManyToOne
    @JoinColumn(name = "SizeID", nullable = false)
    private Size size;

    @Min(1)
    @Max(5)
    @Column(name = "Stars", nullable = false)
    private Integer stars;

    @Column(name = "Review")
    private String review;

    @Column(name = "Date", nullable = false)
    private LocalDateTime date;
}
