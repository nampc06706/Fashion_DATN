package com.poly.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.poly.dto.CategoryDTO;
import com.poly.dto.ColorDTO;
import com.poly.dto.ProductDTO;
import com.poly.dto.ProductImageDTO;
import com.poly.dto.SizeDTO;
import com.poly.entity.ProductFlashsale;
import com.poly.entity.ProductFlashsaleId;
import com.poly.repository.ProductFlashsaleRepository;

@Service
public class ProductFlashsaleService {

    @Autowired
    private ProductFlashsaleRepository productFlashsaleRepository;

    public List<ProductDTO> findAll() {
        return productFlashsaleRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ProductDTO save(ProductFlashsale productFlashsale) {
        ProductFlashsale savedProductFlashsale = productFlashsaleRepository.save(productFlashsale);
        return convertToDto(savedProductFlashsale);
    }

    public void deleteById(ProductFlashsaleId id) {
        productFlashsaleRepository.deleteById(id);
    }

    private ProductDTO convertToDto(ProductFlashsale productFlashsale) {
        if (productFlashsale == null) {
            return null;
        }

        ProductDTO productDTO = new ProductDTO();
        productDTO.setId(productFlashsale.getProduct().getId());
        productDTO.setName(productFlashsale.getProduct().getName());
     // Tính toán giá sau khi giảm giá
        BigDecimal originalPrice = productFlashsale.getProduct().getPrice(); // Giá gốc
        BigDecimal discountPercent = productFlashsale.getDiscount(); // Phần trăm giảm giá
        BigDecimal hundred = BigDecimal.valueOf(100); // 100 để sử dụng trong phép chia

        // Tính giá đã giảm
        BigDecimal discountAmount = originalPrice.multiply(discountPercent).divide(hundred); // Tính tiền giảm giá
        BigDecimal discountedPrice = originalPrice.subtract(discountAmount); // Giá đã giảm

        productDTO.setPrice(discountedPrice); // Đặt giá đã giảm vào ProductDTO
        
        productDTO.setDescription(productFlashsale.getProduct().getDescription());
        
        // Lấy hình ảnh đầu tiên (nếu có)
        if (!productFlashsale.getProduct().getImages().isEmpty()) {
            productDTO.setFirstImage(productFlashsale.getProduct().getImages().get(0).getImage()); // Sử dụng phương thức getImage() từ ProductImages
        }

        // Chuyển đổi danh sách hình ảnh thành ProductImageDTO
        List<ProductImageDTO> imageDTOs = productFlashsale.getProduct().getImages().stream()
            .map(image -> new ProductImageDTO(image.getImage())) // Sử dụng phương thức getImage() từ ProductImages
            .collect(Collectors.toList());
        productDTO.setImages(imageDTOs);

     // Chuyển đổi danh sách kích thước thành SizeDTO
        List<SizeDTO> sizeDTOs = productFlashsale.getProduct().getSizes().stream()
            .map(size -> new SizeDTO(size.getId(), // ID của kích thước
                                      size.getProduct().getId(), // ID của sản phẩm mà kích thước này thuộc về
                                      size.getName(), // Tên của kích thước
                                      size.getQuantityInStock(), // Số lượng còn trong kho
                                      new ColorDTO(size.getColor().getId(), size.getColor().getName())) // Chuyển đổi màu sắc
            )
            .collect(Collectors.toList());
        productDTO.setSizes(sizeDTOs);


        // Tạo CategoryDTO từ Category
        productDTO.setCategory(new CategoryDTO(productFlashsale.getProduct().getCategory().getId(),
                                                productFlashsale.getProduct().getCategory().getName()));

        return productDTO;
    }

}
