package com.poly.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import com.poly.dto.CategoryDTO;
import com.poly.dto.ColorDTO;
import com.poly.dto.ProductDTO;
import com.poly.dto.ProductImageDTO;
import com.poly.dto.SimpleProductDTO;
import com.poly.dto.SizeDTO;
import com.poly.entity.Category;
import com.poly.entity.Color;
import com.poly.entity.ProductFlashsale;
import com.poly.entity.ProductImages;
import com.poly.entity.Products;
import com.poly.entity.Size;
import com.poly.repository.CategoryRepository;
import com.poly.repository.ColorRepository;
import com.poly.repository.FlashsaleRepository;
import com.poly.repository.ProductImagesRepository;
import com.poly.repository.ProductsRepository;
import com.poly.repository.SizeRepository;

import jakarta.persistence.EntityNotFoundException;
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

	@Autowired
	private FlashsaleRepository flashsaleRepository;

	public List<ProductDTO> getAllProductsd() {
		// Lấy tất cả các sản phẩm từ repository
		List<Products> products = productsRepository.findAll();

		// Lấy danh sách flash sale hiện tại
		List<ProductFlashsale> currentFlashSales = flashsaleRepository.findCurrentFlashSales();
		Map<Integer, BigDecimal> flashSaleMap = currentFlashSales.stream()
				.collect(Collectors.toMap(pf -> pf.getProduct().getId(), ProductFlashsale::getDiscount));

		// Duyệt qua danh sách sản phẩm và chuyển đổi sang ProductDTO
		return products.stream().map(product -> {
			// Tính giá mới nếu sản phẩm có trong flash sale
			BigDecimal price = product.getPrice();
			if (flashSaleMap.containsKey(product.getId())) {
				BigDecimal discount = flashSaleMap.get(product.getId());
				price = price.subtract(price.multiply(discount.divide(BigDecimal.valueOf(100))));
			}

			// Truy vấn hình ảnh
			List<ProductImageDTO> imageDTOs = productImageRepository.findByProductId(product.getId()).stream()
					.map(img -> new ProductImageDTO(img.getId(), img.getImage())) // Thêm id vào constructor
					.collect(Collectors.toList());

			// Truy vấn kích thước và màu sắc
			List<SizeDTO> sizeDTOs = sizeRepository.findByProductId(product.getId()).stream().map(size -> new SizeDTO(
					size.getId(), size.getProduct().getId(), size.getName(), size.getQuantityInStock(),
					size.getColor() != null ? new ColorDTO(size.getColor().getId(), size.getColor().getName()) : null))
					.collect(Collectors.toList());

			// Truy vấn danh mục
			CategoryDTO categoryDTO = product.getCategory() != null
					? new CategoryDTO(product.getCategory().getId(), product.getCategory().getName())
					: null;

			// Tạo ProductDTO cho sản phẩm với giá đã được tính toán
			return new ProductDTO(product.getId(), product.getName(), price, product.getDescription(),
					imageDTOs.isEmpty() ? null : imageDTOs.get(0).getImage(), imageDTOs,
					sizeDTOs, categoryDTO);
		}).collect(Collectors.toList());
	}

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

		// Lấy danh sách flash sale hiện tại
		List<ProductFlashsale> currentFlashSales = flashsaleRepository.findCurrentFlashSales();

		// Tạo bản đồ ánh xạ productId với discount
		Map<Integer, BigDecimal> flashSaleMap = currentFlashSales.stream()
				.collect(Collectors.toMap(pf -> pf.getProduct().getId(), ProductFlashsale::getDiscount));

		// Lưu giá ban đầu
		BigDecimal originalPrice = product.getPrice();
		BigDecimal discountedPrice = originalPrice; // Giá sau khi giảm giá
		BigDecimal discount = BigDecimal.ZERO; // Mức giảm giá

		// Kiểm tra nếu sản phẩm có trong flash sale
		if (flashSaleMap.containsKey(product.getId())) {
			discount = flashSaleMap.get(product.getId());
			discountedPrice = originalPrice.subtract(originalPrice.multiply(discount).divide(BigDecimal.valueOf(100))); // Điều
																														// chỉnh
																														// giá
																														// theo
																														// discount
		}

		// Tạo ProductDTO và trả về cả giá cũ, giá mới, và discount
		return new ProductDTO(product.getId(), product.getName(), discountedPrice, originalPrice,
				product.getDescription(), imageDTOs.isEmpty() ? null : imageDTOs.get(0).getImage(), imageDTOs, sizeDTOs,
				categoryDTO, discount);
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

		// Lấy danh sách flash sale hiện tại
		List<ProductFlashsale> currentFlashSales = flashsaleRepository.findCurrentFlashSales();

		// Tạo bản đồ ánh xạ productId với discount
		Map<Integer, BigDecimal> flashSaleMap = currentFlashSales.stream()
				.collect(Collectors.toMap(pf -> pf.getProduct().getId(), ProductFlashsale::getDiscount));

		for (Products product : products) {
			// Kiểm tra nếu sản phẩm có trong flash sale, nếu có thì bỏ qua
			if (flashSaleMap.containsKey(product.getId())) {
				continue; // Bỏ qua sản phẩm nằm trong flash sale
			}

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
			image.setImage(img.getFileName());
			image.setProduct(product);
			try {
				saveImages(img.getImage(), img.getFileName());
			} catch (IOException e) {
				e.printStackTrace();
			}
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
			colorRepository.save(color); // Lưu màu mới vào cơ sở dữ liệu
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

		
		List<ProductImages> updatedImages = productDTO.getImages().stream().map(img -> {
			ProductImages image = new ProductImages();
			try {
				// Kiểm tra xem img.getImage() có phải là Base64 không
				if (img.getImage() != null && img.getImage().startsWith("data:image/")) {
					// Lưu hình ảnh nếu là Base64
					saveImages(img.getImage(), img.getFileName());
					image.setImage(img.getFileName()); // Gán tên tệp hình ảnh đã lưu
					image.setProduct(product); // Gán sản phẩm liên quan
				} else {
					// Nếu không phải Base64, bạn có thể bỏ qua hoặc xử lý khác
					return null; // Trả về null nếu không phải Base64
				}
			} catch (IOException e) {
				e.printStackTrace();
				return null; // Nếu có lỗi, trả về null
			}
			return image; // Trả về đối tượng image hợp lệ
		}).filter(Objects::nonNull) // Lọc bỏ các đối tượng null
				.collect(Collectors.toList());

		if (updatedImages != null && !updatedImages.isEmpty()) {
			product.setImages(updatedImages); // Cập nhật danh sách hình ảnh cho sản phẩm
		}

		// Xóa các kích thước cũ
		sizeRepository.deleteByProduct(product);

		// Lưu kích thước và màu sắc mới
		List<Size> updatedSizes = new ArrayList<>();
		for (SizeDTO sizeDTO : productDTO.getSizes()) {
			Size size = new Size();
			size.setName(sizeDTO.getName());
			size.setQuantityInStock(sizeDTO.getQuantityInStock());

			// Cập nhật hoặc tạo mới màu sắc
			Color color = colorRepository.findById(sizeDTO.getColor().getId()).orElseGet(() -> {
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

	// Thêm phương thức để lấy tất cả danh mục
	public List<CategoryDTO> getAllCategories() {
		// Lấy tất cả các danh mục từ repository
		List<Category> categories = categoryRepository.findAll();

		// Chuyển đổi sang CategoryDTO
		return categories.stream().map(category -> new CategoryDTO(category.getId(), category.getName()))
				.collect(Collectors.toList());
	}

	public List<ProductDTO> searchProducts(String keyword, String category) {
		// Ghi log tham số
		System.out.println("Searching products with keyword: " + keyword + " and category: " + category);

		List<Products> products;

		// Tìm sản phẩm theo keyword và category
		if (keyword != null && category != null) {
			products = productsRepository.findByKeywordAndCategory(keyword, category);
		}
		// Tìm sản phẩm chỉ theo keyword
		else if (keyword != null) {
			products = productsRepository.findByKeyword(keyword);
		}
		// Tìm sản phẩm chỉ theo category
		else if (category != null) {
			products = productsRepository.findByCategory(category);
		}
		// Nếu cả hai đều null, trả về danh sách rỗng
		else {
			products = Collections.emptyList();
		}

		System.out.println("Number of products found: " + products.size());

		// Chuyển đổi danh sách sản phẩm sang danh sách ProductDTO
		return products.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	// Phương thức chuyển đổi sản phẩm sang ProductDTO
	private ProductDTO convertToDTO(Products product) {
		// Lấy danh sách hình ảnh của sản phẩm
		List<ProductImageDTO> imageDTOs = productImageRepository.findByProductId(product.getId()).stream()
				.map(img -> new ProductImageDTO(img.getImage())).collect(Collectors.toList());

		// Lấy danh sách kích thước của sản phẩm
		List<SizeDTO> sizeDTOs = sizeRepository.findByProductId(product.getId()).stream().map(size -> new SizeDTO(
				size.getId(), size.getProduct().getId(), size.getName(), size.getQuantityInStock(),
				size.getColor() != null ? new ColorDTO(size.getColor().getId(), size.getColor().getName()) : null))
				.collect(Collectors.toList());

		// Chuyển đổi category của sản phẩm
		CategoryDTO categoryDTO = product.getCategory() != null
				? new CategoryDTO(product.getCategory().getId(), product.getCategory().getName())
				: null;

		// Trả về ProductDTO
		return new ProductDTO(product.getId(), product.getName(), product.getPrice(), product.getDescription(),
				imageDTOs.isEmpty() ? null : imageDTOs.get(0).getImage(), imageDTOs, sizeDTOs, categoryDTO);
	}

	// hiển thị sản phẩm liên quan theo danh mục
	public List<ProductDTO> getRelatedProductsByCategory(Integer productId) {
		// Lấy sản phẩm hiện tại
		Optional<Products> currentProductOpt = productsRepository.findById(productId);

		// Trả về danh sách rỗng nếu không tìm thấy sản phẩm hiện tại
		if (currentProductOpt.isEmpty()) {
			return new ArrayList<>(); // Nếu không tìm thấy sản phẩm
		}

		Products currentProduct = currentProductOpt.get();

		// Kiểm tra xem sản phẩm có danh mục không
		if (currentProduct.getCategory() == null) {
			return new ArrayList<>(); // Trả về danh sách trống nếu sản phẩm không có danh mục
		}

		Integer categoryId = currentProduct.getCategory().getId();
		System.out.println("Category ID của sản phẩm hiện tại: " + categoryId);

		// Lấy tất cả sản phẩm theo categoryId và loại bỏ sản phẩm hiện tại dựa trên
		// productId
		List<Products> relatedProducts = productsRepository.findByCategoryId(categoryId).stream()
				.filter(product -> !product.getId().equals(productId)) // Loại bỏ sản phẩm hiện tại
				.collect(Collectors.toList());

		// Log số lượng sản phẩm sau khi lọc
		System.out.println("Số lượng sản phẩm liên quan sau khi lọc: " + relatedProducts.size());

		// Chuyển đổi danh sách sản phẩm thành danh sách DTO
		return relatedProducts.stream().map(product -> {
			List<ProductImageDTO> imageDTOs = productImageRepository.findByProductId(product.getId()).stream()
					.map(img -> new ProductImageDTO(img.getImage())).collect(Collectors.toList());

			List<SizeDTO> sizeDTOs = sizeRepository.findByProductId(product.getId()).stream().map(size -> new SizeDTO(
					size.getId(), size.getProduct().getId(), size.getName(), size.getQuantityInStock(),
					size.getColor() != null ? new ColorDTO(size.getColor().getId(), size.getColor().getName()) : null))
					.collect(Collectors.toList());

			CategoryDTO categoryDTO = product.getCategory() != null
					? new CategoryDTO(product.getCategory().getId(), product.getCategory().getName())
					: null;

			return new ProductDTO(product.getId(), product.getName(), product.getPrice(), product.getDescription(),
					imageDTOs.isEmpty() ? null : imageDTOs.get(0).getImage(), imageDTOs, sizeDTOs, categoryDTO);
		}).collect(Collectors.toList());
	}

	// Lấy tất cả sản phẩm theo loại sản phẩm
	public List<SimpleProductDTO> getProductsByCategory(Integer categoryId) {
		// Lấy danh sách sản phẩm theo categoryId từ repository
		List<Products> products = productsRepository.findByCategoryId(categoryId);
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

	// hiện sản phẩm theo giá từ dến
	public List<SimpleProductDTO> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
		List<Products> products = productsRepository.findByPriceBetween(minPrice, maxPrice);
		List<SimpleProductDTO> productDTOList = new ArrayList<>();

		for (Products product : products) {
			String firstImage = product.getImages().isEmpty() ? null : product.getImages().get(0).getImage();
			SimpleProductDTO productDTO = new SimpleProductDTO(product.getId(), product.getName(), product.getPrice(),
					firstImage);
			productDTOList.add(productDTO);
		}

		return productDTOList;
	}

	public void saveImages(String base64Image, String fileName) throws IOException {
		// Nếu chuỗi Base64 có tiền tố, loại bỏ nó
		if (base64Image.contains(",")) {
			base64Image = base64Image.split(",")[1];
		}

		// Giải mã chuỗi Base64 thành mảng byte
		byte[] imageBytes = Base64.getDecoder().decode(base64Image);

		// Đường dẫn tới thư mục mà bạn muốn lưu hình ảnh
		String projectPath = System.getProperty("user.dir");
		String uploadDirectory = projectPath + "\\DATN-Theme-main\\public\\assets\\images";
		String updatedPath = uploadDirectory.replace("\\datn1", "");

		// Tạo thư mục nếu chưa tồn tại
		File directory = new File(updatedPath);
		if (!directory.exists()) {
			directory.mkdirs();
		}

		// Đường dẫn đầy đủ đến tệp cần lưu
		String filePath = updatedPath + "\\" + fileName;

		// Tạo file và lưu mảng byte vào tệp
		try (FileOutputStream fos = new FileOutputStream(filePath)) {
			fos.write(imageBytes);
			fos.flush();
			System.out.println("Image saved: " + fileName);
		}
	}

	public void deleteImage(Integer imageId) { 
		if (productImageRepository.existsById(imageId)) {
		    productImageRepository.deleteImageById(imageId);
		    System.out.println("Deleted image with ID: " + imageId);
		} else {
		    System.out.println("Image with ID " + imageId + " does not exist.");
		}

	}

}
