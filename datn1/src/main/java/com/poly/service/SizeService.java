package com.poly.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.poly.entity.Color;
import com.poly.entity.Products;
import com.poly.entity.Size;
import com.poly.repository.ProductsRepository;
import com.poly.repository.SizeRepository;

import jakarta.transaction.Transactional;

@Service
public class SizeService {

	@Autowired
	private SizeRepository sizeRepository;

	@Autowired
	private ColorService colorService;

	@Autowired
	private ProductsRepository productRepository;

	/**
	 * Thêm mới Size và tạo mới Color nếu chưa tồn tại.
	 */
	public Size addSize(Size size, String colorName, Integer productId) {
		// Tìm hoặc tạo mới Color
		Color color = colorService.findOrCreateColor(colorName);

		// Lấy thông tin sản phẩm
		Products product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại."));

		// Gán Color và Product cho Size
		size.setColor(color);
		size.setProduct(product);

		// Lưu Size vào cơ sở dữ liệu
		return sizeRepository.save(size);
	}

	/**
	 * Cập nhật thông tin Size.
	 */
	public Size updateSize(Size size, String colorName, Integer productId) {
		// Kiểm tra Size có tồn tại không
		Size existingSize = sizeRepository.findById(size.getId())
				.orElseThrow(() -> new RuntimeException("Không tìm thấy Size với ID: " + size.getId()));

		// Tìm hoặc tạo mới Color
		Color color = colorService.findOrCreateColor(colorName);

		// Lấy thông tin sản phẩm
		Products product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại."));

		// Cập nhật thông tin cho Size
		existingSize.setName(size.getName());
		existingSize.setQuantityInStock(size.getQuantityInStock());
		existingSize.setColor(color);
		existingSize.setProduct(product);

		// Lưu lại thông tin cập nhật
		return sizeRepository.save(existingSize);
	}

	@Transactional
	public void deleteSizeById(Integer sizeId) {
		// Kiểm tra sự tồn tại của kích thước
		Optional<Size> size = sizeRepository.findById(sizeId);
		if (size.isPresent()) {
			// Gọi phương thức xóa theo sizeId
			sizeRepository.deleteById(sizeId);
		} else {
			throw new RuntimeException("Kích thước không tồn tại.");
		}
	}

	public Size getSizeById(Integer sizeId) {
		return sizeRepository.findById(sizeId).orElse(null);
	}

}
