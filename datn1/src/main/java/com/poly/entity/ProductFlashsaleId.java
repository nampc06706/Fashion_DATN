package com.poly.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class ProductFlashsaleId implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer productId;
    private Integer flashsaleId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductFlashsaleId that = (ProductFlashsaleId) o;
        return Objects.equals(productId, that.productId) &&
               Objects.equals(flashsaleId, that.flashsaleId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(productId, flashsaleId);
    }
}
