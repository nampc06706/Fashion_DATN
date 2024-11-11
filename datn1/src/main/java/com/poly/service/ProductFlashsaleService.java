package com.poly.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.poly.dto.CategoryDTO;
import com.poly.dto.ColorDTO;
import com.poly.dto.FlashsaleDTO;
import com.poly.dto.ProductDTO;
import com.poly.dto.ProductImageDTO;
import com.poly.dto.SizeDTO;
import com.poly.entity.Flashsale;
import com.poly.entity.ProductFlashsale;
import com.poly.entity.ProductFlashsaleId;
import com.poly.entity.Products;
import com.poly.repository.FlashRepository;
import com.poly.repository.ProductFlashsaleRepository;
import com.poly.repository.ProductsRepository;

@Service
public class ProductFlashsaleService {

	@Autowired
	private ProductFlashsaleRepository productFlashsaleRepository;
	@Autowired
	private FlashRepository flashsaleRepository;
	@Autowired
	private ProductsRepository productRepository;

	public List<ProductDTO> findAll() {
		return productFlashsaleRepository.findAll().stream()
				.filter(productFlashsale -> productFlashsale.getFlashsale() != null
						&& productFlashsale.getFlashsale().isIsactive())
				.map(this::convertToDto).collect(Collectors.toList());
	}

	// Lấy tất cả sản phẩm Flash Sale bao gồm cả isactive = 0 và 1
	public List<ProductDTO> findAllIncludingInactive() {
		return productFlashsaleRepository.findAll().stream().map(this::convertToDtoo).collect(Collectors.toList());
	}

	public ProductDTO save(ProductFlashsale productFlashsale) {
		ProductFlashsale savedProductFlashsale = productFlashsaleRepository.save(productFlashsale);
		return convertToDto(savedProductFlashsale);
	}

	public void deleteById(ProductFlashsaleId id) {
		productFlashsaleRepository.deleteById(id);
	}

	public ProductDTO convertToDto(ProductFlashsale productFlashsale) {
		if (productFlashsale == null) {
			return null;
		}

		ProductDTO productDTO = new ProductDTO();

		// Gán các thuộc tính từ ProductFlashsale
		productDTO.setId(productFlashsale.getProduct().getId());
		productDTO.setName(productFlashsale.getProduct().getName());

		// Tính toán giá sau khi giảm giá
		BigDecimal originalPrice = productFlashsale.getProduct().getPrice(); // Giá gốc
		BigDecimal discountPercent = productFlashsale.getDiscount(); // Phần trăm giảm giá

		if (originalPrice == null) {
			throw new IllegalArgumentException("Giá gốc không được null");
		}

		if (discountPercent == null || discountPercent.compareTo(BigDecimal.ZERO) < 0
				|| discountPercent.compareTo(BigDecimal.valueOf(100)) > 0) {
			throw new IllegalArgumentException("Phần trăm giảm giá phải từ 0 đến 100");
		}

		// Tính giá đã giảm
		BigDecimal discountAmount = originalPrice.multiply(discountPercent).divide(BigDecimal.valueOf(100)); // Tính
																												// tiền
																												// giảm
																												// giá
		BigDecimal discountedPrice = originalPrice.subtract(discountAmount).setScale(2, BigDecimal.ROUND_HALF_UP); // Giá
																													// đã
																													// giảm

		productDTO.setPrice(discountedPrice);
		productDTO.setOriginalPrice(originalPrice); // Gán giá gốc
		productDTO.setDiscount(discountPercent);
		productDTO.setDescription(productFlashsale.getProduct().getDescription());

		// Lấy hình ảnh đầu tiên (nếu có)
		if (productFlashsale.getProduct().getImages() != null && !productFlashsale.getProduct().getImages().isEmpty()) {
			productDTO.setFirstImage(productFlashsale.getProduct().getImages().get(0).getImage());
		}

		// Chuyển đổi danh sách hình ảnh thành ProductImageDTO
		if (productFlashsale.getProduct().getImages() != null) {
			List<ProductImageDTO> imageDTOs = productFlashsale.getProduct().getImages().stream()
					.map(image -> new ProductImageDTO(image.getImage())).collect(Collectors.toList());
			productDTO.setImages(imageDTOs);
		}

		// Chuyển đổi danh sách kích thước thành SizeDTO
		if (productFlashsale.getProduct().getSizes() != null) {
			List<SizeDTO> sizeDTOs = productFlashsale.getProduct().getSizes().stream()
					.map(size -> new SizeDTO(size.getId(), size.getProduct().getId(), size.getName(),
							size.getQuantityInStock(),
							new ColorDTO(size.getColor().getId(), size.getColor().getName())))
					.collect(Collectors.toList());
			productDTO.setSizes(sizeDTOs);
		}

		// Tạo CategoryDTO từ Category
		if (productFlashsale.getProduct().getCategory() != null) {
			productDTO.setCategory(new CategoryDTO(productFlashsale.getProduct().getCategory().getId(),
					productFlashsale.getProduct().getCategory().getName()));
		}

		// Thêm thông tin Flashsale vào ProductDTO chỉ khi flash sale đang hoạt động
		if (productFlashsale.getFlashsale() != null) {
			boolean isActive = productFlashsale.getFlashsale().isIsactive();
			System.out.println("Flashsale isActive: " + isActive); // Kiểm tra giá trị

			if (isActive) {
				FlashsaleDTO flashsaleDTO = new FlashsaleDTO();
				flashsaleDTO.setId(productFlashsale.getFlashsale().getId());
				flashsaleDTO.setName(productFlashsale.getFlashsale().getName());
				flashsaleDTO.setStartdate(productFlashsale.getFlashsale().getStartdate());
				flashsaleDTO.setEnddate(productFlashsale.getFlashsale().getEnddate());
				flashsaleDTO.setIsactive(isActive);

				productDTO.setFlashsale(flashsaleDTO);
			}
		}

		return productDTO;
	}

	// Hàm chuyển đổi từ ProductFlashsale sang ProductDTO
	private ProductDTO convertToDtoo(ProductFlashsale productFlashsale) {
		if (productFlashsale == null) {
			return null;
		}

		ProductDTO productDTO = new ProductDTO();

		// Gán các thuộc tính từ ProductFlashsale
		productDTO.setId(productFlashsale.getProduct().getId());
		productDTO.setName(productFlashsale.getProduct().getName());

		// Tính toán giá sau khi giảm giá
		BigDecimal originalPrice = productFlashsale.getProduct().getPrice();
		BigDecimal discountPercent = productFlashsale.getDiscount();

		BigDecimal discountAmount = originalPrice.multiply(discountPercent).divide(BigDecimal.valueOf(100));
		BigDecimal discountedPrice = originalPrice.subtract(discountAmount).setScale(2, BigDecimal.ROUND_HALF_UP);

		productDTO.setPrice(discountedPrice);
		productDTO.setOriginalPrice(originalPrice);
		productDTO.setDiscount(discountPercent);
		productDTO.setDescription(productFlashsale.getProduct().getDescription());

		// Lấy hình ảnh đầu tiên (nếu có)
		if (productFlashsale.getProduct().getImages() != null && !productFlashsale.getProduct().getImages().isEmpty()) {
			productDTO.setFirstImage(productFlashsale.getProduct().getImages().get(0).getImage());
		}

		// Chuyển đổi hình ảnh
		if (productFlashsale.getProduct().getImages() != null) {
			List<ProductImageDTO> imageDTOs = productFlashsale.getProduct().getImages().stream()
					.map(image -> new ProductImageDTO(image.getImage())).collect(Collectors.toList());
			productDTO.setImages(imageDTOs);
		}

		// Chuyển đổi kích thước
		if (productFlashsale.getProduct().getSizes() != null) {
			List<SizeDTO> sizeDTOs = productFlashsale.getProduct().getSizes().stream()
					.map(size -> new SizeDTO(size.getId(), size.getProduct().getId(), size.getName(),
							size.getQuantityInStock(),
							new ColorDTO(size.getColor().getId(), size.getColor().getName())))
					.collect(Collectors.toList());
			productDTO.setSizes(sizeDTOs);
		}

		// Chuyển đổi danh mục
		if (productFlashsale.getProduct().getCategory() != null) {
			productDTO.setCategory(new CategoryDTO(productFlashsale.getProduct().getCategory().getId(),
					productFlashsale.getProduct().getCategory().getName()));
		}

		// Thêm thông tin Flash Sale
		if (productFlashsale.getFlashsale() != null) {
			FlashsaleDTO flashsaleDTO = new FlashsaleDTO();
			flashsaleDTO.setId(productFlashsale.getFlashsale().getId());
			flashsaleDTO.setName(productFlashsale.getFlashsale().getName());
			flashsaleDTO.setStartdate(productFlashsale.getFlashsale().getStartdate());
			flashsaleDTO.setEnddate(productFlashsale.getFlashsale().getEnddate());
			flashsaleDTO.setIsactive(productFlashsale.getFlashsale().isIsactive());

			productDTO.setFlashsale(flashsaleDTO);
		}

		return productDTO;
	}

	public ProductFlashsale addProductFlashsale(Integer productId, Integer flashsaleId, BigDecimal discount) {
		// Kiểm tra giá trị giảm giá hợp lệ
		if (discount == null || discount.compareTo(BigDecimal.ZERO) < 0
				|| discount.compareTo(BigDecimal.valueOf(100)) > 0) {
			throw new IllegalArgumentException("Phần trăm giảm giá phải từ 0 đến 100");
		}

		// Lấy đối tượng Product và Flashsale từ cơ sở dữ liệu
		Products product = productRepository.findById(productId)
				.orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại"));
		Flashsale flashsale = flashsaleRepository.findById(flashsaleId)
				.orElseThrow(() -> new IllegalArgumentException("Flashsale không tồn tại"));

		// Tạo ID cho ProductFlashsale
		ProductFlashsaleId id = new ProductFlashsaleId(productId, flashsaleId);

		// Kiểm tra nếu ProductFlashsale đã tồn tại
		if (productFlashsaleRepository.existsById(id)) {
			throw new IllegalArgumentException("ProductFlashsale đã tồn tại.");
		}

		// Tạo đối tượng ProductFlashsale mới
		ProductFlashsale productFlashsale = new ProductFlashsale();
		productFlashsale.setId(id);
		productFlashsale.setDiscount(discount);
		productFlashsale.setProduct(product); // Thiết lập mối quan hệ với Product
		productFlashsale.setFlashsale(flashsale); // Thiết lập mối quan hệ với Flashsale

		// Lưu vào cơ sở dữ liệu
		return productFlashsaleRepository.save(productFlashsale);
	}

	public void deleteProductFlashsale(Integer productId, Integer flashsaleId) {
		ProductFlashsaleId id = new ProductFlashsaleId(productId, flashsaleId);

		// Kiểm tra xem ProductFlashsale có tồn tại không
		if (!productFlashsaleRepository.existsById(id)) {
			throw new IllegalArgumentException("Không tìm thấy ProductFlashsale với id đã cho.");
		}

		// Xóa ProductFlashsale
		productFlashsaleRepository.deleteById(id);
	}

}
