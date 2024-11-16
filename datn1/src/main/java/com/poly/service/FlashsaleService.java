package com.poly.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.poly.dto.FlashsaleDTO;
import com.poly.entity.Flashsale;
import com.poly.repository.FlashRepository;

@Service
public class FlashsaleService {

	@Autowired
	private FlashRepository flashRepository;

	// Lấy tất cả Flash Sale (kể cả hoạt động và không hoạt động)
	public List<FlashsaleDTO> findAllFlashsales() {
		return flashRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
	}

	public FlashsaleDTO toggleIsActive(Integer id) {
	    Flashsale flashsale = flashRepository.findById(id)
	        .orElseThrow(() -> new RuntimeException("Không tìm thấy Flashsale với id: " + id));

	    if (flashsale.isIsactive()) {
	        flashsale.setIsactive(false);
	    } else {
	        // Tắt tất cả Flash Sale khác
	        flashRepository.deactivateAllFlashsales();

	        // Bật trạng thái isactive cho Flash Sale được chọn
	        flashsale.setIsactive(true);
	    }

	    Flashsale updatedFlashsale = flashRepository.save(flashsale);
	    return convertToDto(updatedFlashsale);
	}


	private FlashsaleDTO convertToDto(Flashsale flashsale) {
		if (flashsale == null) {
			return null;
		}
		return new FlashsaleDTO(flashsale.getId(), flashsale.getName(), flashsale.getStartdate(),
				flashsale.getEnddate(), flashsale.isIsactive() // Sử dụng isIsactive() cho trường boolean
		);
	}
	
	// Phương thức thêm Flash Sale
    public Flashsale addFlashsale(Flashsale flashsale) {
        return flashRepository.save(flashsale);
    }

    
    public FlashsaleDTO updateFlashsaleInfo(Integer id, FlashsaleDTO flashsaleDTO) {
        Flashsale flashsale = flashRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy Flashsale với id: " + id));

        // Cập nhật thông tin mà không thay đổi isactive
        flashsale.setName(flashsaleDTO.getName());
        flashsale.setStartdate(flashsaleDTO.getStartdate());
        flashsale.setEnddate(flashsaleDTO.getEnddate());

        // Lưu thay đổi
        Flashsale updatedFlashsale = flashRepository.save(flashsale);
        return convertToDto(updatedFlashsale);
    }

    
}
