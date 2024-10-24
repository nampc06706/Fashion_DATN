package com.poly.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.poly.dto.CategoryDTO;
import com.poly.dto.ColorDTO;
import com.poly.dto.ProductDTO;
import com.poly.dto.ProductImageDTO;
import com.poly.dto.SimpleProductDTO;
import com.poly.dto.SizeDTO;
import com.poly.entity.Category;
import com.poly.entity.Color;
import com.poly.entity.ProductImages;
import com.poly.entity.Products;
import com.poly.entity.Size;
import com.poly.repository.CategoryRepository;
import com.poly.repository.ColorRepository;
import com.poly.repository.ProductImagesRepository;
import com.poly.repository.ProductsRepository;
import com.poly.repository.SizeRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProductsService {

	@Autowired
	private ProductsRepository productsRepository;

	@Autowired
	private ProductImagesRepository productImageRepository;

	@Autowired
	private SizeRepository sizeRepository;

	@Autowired
	private CategoryRepository categoryRepository;

	@Autowired
	private ColorRepository colorRepository;

	//
	public List<ProductDTO> getAllProductsd() {
	    // Lấy tất cả các sản phẩm từ repository
	    List<Products> products = productsRepository.findAll();

	    // Duyệt qua danh sách sản phẩm và chuyển đổi sang ProductDTO
	    return products.stream().map(product -> {
	        // Truy vấn hình ảnh
	        List<ProductImageDTO> imageDTOs = productImageRepository.findByProductId(product.getId()).stream()
	                .map(img -> new ProductImageDTO(img.getImage())).collect(Collectors.toList());

	        // Truy vấn kích thước và màu sắc
	        List<SizeDTO> sizeDTOs = sizeRepository.findByProductId(product.getId()).stream()
	                .map(size -> new SizeDTO(size.getId(), size.getProduct().getId(), size.getName(),
	                        size.getQuantityInStock(),
	                        size.getColor() != null ? new ColorDTO(size.getColor().getId(), size.getColor().getName()) : null))
	                .collect(Collectors.toList());

	        // Truy vấn danh mục
	        CategoryDTO categoryDTO = product.getCategory() != null
	                ? new CategoryDTO(product.getCategory().getId(), product.getCategory().getName())
	                : null;

	        // Tạo ProductDTO cho sản phẩm
	        return new ProductDTO(product.getId(), product.getName(), product.getPrice(), product.getDescription(),
	                imageDTOs.isEmpty() ? null : imageDTOs.get(0).getImage(), imageDTOs, sizeDTOs, categoryDTO);
	    }).collect(Collectors.toList());
	}

	
	
	// Phương thức để lấy chi tiết sản phẩm
	public ProductDTO getProductDetails(Integer id) {
		Products product = productsRepository.findById(id).orElse(null);

		if (product == null) {
			return null; // hoặc throw exception
		}

		// Truy vấn hình ảnh
		List<ProductImageDTO> imageDTOs = productImageRepository.findByProductId(id).stream()
				.map(img -> new ProductImageDTO(img.getImage())).collect(Collectors.toList());

		// Truy vấn kích thước và màu sắc
		List<SizeDTO> sizeDTOs = sizeRepository.findByProductId(id).stream().map(size -> new SizeDTO(size.getId(),
				size.getProduct().getId(), size.getName(), size.getQuantityInStock(),
				size.getColor() != null ? new ColorDTO(size.getColor().getId(), size.getColor().getName()) : null))
				.collect(Collectors.toList());

		// Truy vấn danh mục
		CategoryDTO categoryDTO = product.getCategory() != null
				? new CategoryDTO(product.getCategory().getId(), product.getCategory().getName())
				: null;

		// Tạo ProductDTO
		return new ProductDTO(product.getId(), product.getName(), product.getPrice(), product.getDescription(),
				imageDTOs.isEmpty() ? null : imageDTOs.get(0).getImage(), imageDTOs, sizeDTOs, categoryDTO);
	}
	

	// Phương thức để lấy kích thước của sản phẩm
	public List<SizeDTO> getSizesByProductId(Integer productId) {
		return sizeRepository.findByProductId(productId).stream().map(size -> new SizeDTO(size.getId(),
				size.getProduct().getId(), size.getName(), size.getQuantityInStock(),
				size.getColor() != null ? new ColorDTO(size.getColor().getId(), size.getColor().getName()) : null))
				.collect(Collectors.toList());
	}

	// Lấy tất cả sản phẩm
	public List<SimpleProductDTO> getAllProducts() {
		List<Products> products = productsRepository.findAll();
		List<SimpleProductDTO> productDTOList = new ArrayList<>();

		for (Products product : products) {
			// Lấy hình đầu tiên, nếu không có thì để null
			String firstImage = product.getImages().isEmpty() ? null : product.getImages().get(0).getImage();

			// Tạo đối tượng SimpleProductDTO với tên, giá và hình đầu tiên
			SimpleProductDTO productDTO = new SimpleProductDTO(product.getId(), product.getName(), product.getPrice(),
					firstImage);

			productDTOList.add(productDTO);
		}

		return productDTOList;
	}

	// Lấy 12 sản phẩm mới nhất
	public List<ProductDTO> getLatestProducts() {
		List<Products> products = productsRepository.findTop12ByOrderByCreateDateDesc();
		List<ProductDTO> productDTOList = new ArrayList<>();

		for (Products product : products) {
			String firstImage = product.getImages().isEmpty() ? null : product.getImages().get(0).getImage();
			ProductDTO productDTO = new ProductDTO(product.getId(), product.getName(), product.getPrice(),
					product.getDescription(), firstImage,
					product.getImages().stream().map(img -> new ProductImageDTO(img.getImage()))
							.collect(Collectors.toList()),
					sizeRepository.findByProductId(product.getId()).stream().map(size -> new SizeDTO(size.getId(),
							size.getProduct().getId(), size.getName(), size.getQuantityInStock(),
							size.getColor() != null ? new ColorDTO(size.getColor().getId(), size.getColor().getName())
									: null))
							.collect(Collectors.toList()),
					new CategoryDTO(product.getCategory().getId(), product.getCategory().getName()));
			productDTOList.add(productDTO);
		}

		return productDTOList;
	}

	// Lấy 12 sản phẩm cũ nhất và áp dụng giảm giá
	public List<ProductDTO> getDiscountedOldestProducts(BigDecimal discountPercentage) {
		List<Products> products = productsRepository.findTop12ByOrderByCreateDateAsc();
		List<ProductDTO> productDTOList = new ArrayList<>();

		for (Products product : products) {
			BigDecimal discountAmount = product.getPrice().multiply(discountPercentage).divide(BigDecimal.valueOf(100));
			BigDecimal discountedPrice = product.getPrice().subtract(discountAmount);
			String firstImage = product.getImages().isEmpty() ? null : product.getImages().get(0).getImage();

			ProductDTO productDTO = new ProductDTO(product.getId(), product.getName(), discountedPrice,
					product.getDescription(), firstImage,
					product.getImages().stream().map(img -> new ProductImageDTO(img.getImage()))
							.collect(Collectors.toList()),
					sizeRepository.findByProductId(product.getId()).stream().map(size -> new SizeDTO(size.getId(),
							size.getProduct().getId(), size.getName(), size.getQuantityInStock(),
							size.getColor() != null ? new ColorDTO(size.getColor().getId(), size.getColor().getName())
									: null))
							.collect(Collectors.toList()),
					new CategoryDTO(product.getCategory().getId(), product.getCategory().getName()));
			productDTOList.add(productDTO);
		}

		return productDTOList;
	}

	public Products getProductById(Integer productId) {
		return productsRepository.findById(productId).orElse(null);
	}

	//////////////////////////////////////////////////////////
	/// PRODUCT ADMIN
	public Products addProduct(ProductDTO productDTO) {
	    Products product = new Products();
	    product.setName(productDTO.getName());
	    product.setPrice(productDTO.getPrice());
	    product.setDescription(productDTO.getDescription());
	    product.setCreateDate(LocalDateTime.now());

	    // Lấy danh mục từ categoryId
	    Category category = categoryRepository.findById(productDTO.getCategory().getId())
	            .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));
	    product.setCategory(category);

	    // Thêm hình ảnh
	    List<ProductImages> images = productDTO.getImages().stream().map(img -> {
	        ProductImages image = new ProductImages();
	        image.setImage(img.getImage());
	        image.setProduct(product);
	        return image;
	    }).collect(Collectors.toList());
	    product.setImages(images);

	    // Thêm kích thước và màu sắc
	    List<Size> sizes = productDTO.getSizes().stream().map(sizeDTO -> {
	        Size size = new Size();
	        size.setName(sizeDTO.getName());
	        size.setQuantityInStock(sizeDTO.getQuantityInStock());

	        // Tạo mới màu sắc từ ColorDTO và lưu vào cơ sở dữ liệu
	        Color color = new Color();
	        color.setName(sizeDTO.getColor().getName());
	        colorRepository.save(color);  // Lưu màu mới vào cơ sở dữ liệu
	        size.setColor(color);

	        size.setProduct(product);
	        return size;
	    }).collect(Collectors.toList());
	    product.setSizes(sizes);

	    // Lưu sản phẩm
	    return productsRepository.save(product);
	}


	/// update sản phẩm
	// Phương thức cập nhật sản phẩm
	public ProductDTO updateProduct(Integer productId, ProductDTO productDTO) throws Exception {
	    // Tìm sản phẩm theo ID
	    Optional<Products> optionalProduct = productsRepository.findById(productId);

	    if (!optionalProduct.isPresent()) {
	        throw new Exception("Không tìm thấy sản phẩm");
	    }

	    Products product = optionalProduct.get();
	    product.setName(productDTO.getName());
	    product.setPrice(productDTO.getPrice());
	    product.setDescription(productDTO.getDescription());
	    product.setCreateDate(LocalDateTime.now());

	    // Cập nhật danh mục
	    Category category = categoryRepository.findById(productDTO.getCategory().getId())
	            .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));
	    product.setCategory(category);

	    // Xóa các hình ảnh cũ và thêm hình ảnh mới
	    productImageRepository.deleteByProduct(product);
	    List<ProductImages> updatedImages = productDTO.getImages().stream().map(img -> {
	        ProductImages image = new ProductImages();
	        image.setImage(img.getImage());
	        image.setProduct(product);
	        return image;
	    }).collect(Collectors.toList());
	    product.setImages(updatedImages);

	    // Xóa các kích thước cũ
	    sizeRepository.deleteByProduct(product);

	    // Lưu kích thước và màu sắc mới
	    List<Size> updatedSizes = new ArrayList<>();
	    for (SizeDTO sizeDTO : productDTO.getSizes()) {
	        Size size = new Size();
	        size.setName(sizeDTO.getName());
	        size.setQuantityInStock(sizeDTO.getQuantityInStock());

	        // Cập nhật hoặc tạo mới màu sắc
	        Color color = colorRepository.findById(sizeDTO.getColor().getId())
	                .orElseGet(() -> {
	                    Color newColor = new Color();
	                    newColor.setName(sizeDTO.getColor().getName());
	                    return colorRepository.save(newColor);
	                });
	        size.setColor(color);

	        size.setProduct(product);
	        updatedSizes.add(size);
	    }
	    product.setSizes(updatedSizes);

	    // Lưu sản phẩm sau khi cập nhật
	    productsRepository.save(product);

	    // Trả về DTO sau khi cập nhật
	    return productDTO;
	}
	public void deleteProduct(Integer productId) throws Exception {
	    // Tìm sản phẩm theo ID
	    Optional<Products> optionalProduct = productsRepository.findById(productId);

	    if (!optionalProduct.isPresent()) {
	        throw new Exception("Không tìm thấy sản phẩm để xóa");
	    }

	    Products product = optionalProduct.get();

	    // Tìm và xóa tất cả kích thước và màu sắc liên quan đến sản phẩm
	    List<Size> sizes = sizeRepository.findByProduct(product);
	    for (Size size : sizes) {
	        Color color = size.getColor();

	        // Xóa kích thước
	        sizeRepository.delete(size);

	        // Xóa màu sắc ngay lập tức mà không cần kiểm tra liên kết
	        colorRepository.delete(color);
	    }

	    // Xóa sản phẩm
	    productsRepository.deleteById(productId);
	}



}
