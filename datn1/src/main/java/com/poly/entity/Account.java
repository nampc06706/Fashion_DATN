package com.poly.entity;

import java.io.Serializable;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "account")
public class Account implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;


    @Column(name = "Username", nullable = false)
    private String username;

    @Column(name = "Fullname", nullable = false)
    private String fullname;

    @Column(name = "Email", nullable = false, unique = true)
    private String email;

    @Column(name = "Image")
    private String image;

    @Column(name = "Phone")
    private String phone;

    @Column(name = "Password", nullable = false)
    private String password;

    @Column(name = "Activated", nullable = false)
    private boolean activated = false;
    
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToOne(fetch = FetchType.EAGER, mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // Bỏ qua tuần tự hóa đối tượng Authorities để tránh vòng lặp
    private Authorities authority;

    @ToString.Exclude
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // Bỏ qua tuần tự hóa đối tượng Carts để tránh vòng lặp
    private Set<Carts> carts = new HashSet<>();
    
    @ToString.Exclude
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore 
    private List<Address> addresses;
    
    @Override
    public String toString() {
        return "Account{" +
               "id=" + id +
               ", username='" + username + '\'' +
               ", fullname='" + fullname + '\'' +
               ", email='" + email + '\'' +
               ", phone='" + phone + '\'' +
               ", image='" + image + '\'' +
               ", activated=" + activated +
               '}'; // Thêm các thuộc tính khác mà bạn muốn hiển thị
    }

}
