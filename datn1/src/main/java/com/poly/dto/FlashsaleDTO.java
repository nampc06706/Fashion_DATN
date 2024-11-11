package com.poly.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlashsaleDTO {
    private Integer id;
    private String name;
    private LocalDateTime startdate;
    private LocalDateTime enddate;
    private boolean isactive;
}
