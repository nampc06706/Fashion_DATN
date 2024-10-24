package com.poly.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingDTO {
    private Integer id;
    private Integer stars;
    private String review;
    private String fullname;
    private LocalDateTime date;
}
