package com.poly.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingDTO {
    private Integer orderId;
    private Integer sizeId;
    
    @Min(1)
    @Max(5)
    private Integer stars;

    private String review;
}
