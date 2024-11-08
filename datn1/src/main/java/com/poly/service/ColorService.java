package com.poly.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.poly.entity.Color;
import com.poly.repository.ColorRepository;

@Service
public class ColorService {

    @Autowired
    private ColorRepository colorRepository;

    /**
     * Tìm kiếm Color theo tên, nếu không tồn tại thì tạo mới.
     */
    public Color findOrCreateColor(String colorName) {
        Color color = colorRepository.findByName(colorName);
        if (color == null) {
            color = new Color();
            color.setName(colorName);
            color = colorRepository.save(color);
        }
        return color;
    }
}
