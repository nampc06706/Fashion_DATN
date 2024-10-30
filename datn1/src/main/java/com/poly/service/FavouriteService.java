package com.poly.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.poly.dto.CartDTO;
import com.poly.dto.ColorDTO;
import com.poly.dto.FavouriteDTO;
import com.poly.dto.SizeDTO;
import com.poly.entity.Account;
import com.poly.entity.Favourite;
import com.poly.entity.Size;
import com.poly.repository.AccountRepository;
import com.poly.repository.FavouriteRepository;
import com.poly.repository.SizeRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;

@Service
public class FavouriteService {
	
	 private static final Logger logger = LoggerFactory.getLogger(FavouriteService.class);
	 
    @Autowired
    private FavouriteRepository favouriteRepository;

    @Autowired
    private SizeRepository sizeRepository;

    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private CartService cartService;

    // Phương thức lấy danh sách yêu thích
    public List<Favourite> getFavouritesByAccountId(Integer accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return favouriteRepository.findByaccountId(account);
    }
    
    @Transactional
    public Favourite addFavourite(FavouriteDTO favouriteDTO) {
        Size size = sizeRepository.findById(favouriteDTO.getSizeId())
                .orElseThrow(() -> new RuntimeException("Size not found"));

        Account account = accountRepository.findById(favouriteDTO.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Tìm kiếm Favourite đã tồn tại
        Optional<Favourite> existingFavourite = favouriteRepository.findBySizeIdAndAccountId(size, account);

        if (existingFavourite.isPresent()) {
            // Tăng số lượng nếu đã tồn tại
            Favourite favourite = existingFavourite.get();
            favourite.setQuantity(favourite.getQuantity() + favouriteDTO.getQuantity());
            return favouriteRepository.save(favourite);
        } else {
            // Tạo mới nếu không tồn tại
            Favourite favourite = new Favourite();
            favourite.setSizeId(size);
            favourite.setAccountId(account);
            favourite.setQuantity(favouriteDTO.getQuantity());
            return favouriteRepository.save(favourite);
        }
    }
    
    
    @Transactional
    public Favourite updateFavouriteQuantity(Integer favouriteId, int quantityChange) {
        Favourite favourite = favouriteRepository.findById(favouriteId)
                .orElseThrow(() -> new RuntimeException("Favourite not found"));

        int newQuantity = favourite.getQuantity() + quantityChange;
        if (newQuantity <= 0) {
            favouriteRepository.delete(favourite);
            return null; // Số lượng mới <= 0 nên xóa mục yêu thích
        } else {
            favourite.setQuantity(newQuantity);
            return favouriteRepository.save(favourite);
        }
    }
    
    @Transactional
    public void removeFavourite(Integer favouriteId) {
        Favourite favourite = favouriteRepository.findById(favouriteId)
                .orElseThrow(() -> new RuntimeException("Favourite not found"));
        favouriteRepository.delete(favourite);
    }


    @Transactional
    public void removeAllFavourites(Integer accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        List<Favourite> favourites = favouriteRepository.findByaccountId(account);
        favouriteRepository.deleteAll(favourites);
    }
    
    
    @Transactional
    public void addAllFavouritesToCart(Integer accountId, HttpServletRequest request, HttpServletResponse response) throws IOException {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        List<Favourite> favourites = favouriteRepository.findByaccountId(account);
        if (favourites.isEmpty()) {
            throw new RuntimeException("No favourites found for this account");
        }

        for (Favourite favourite : favourites) {
            logger.info("Processing favourite item with ID: {}", favourite.getId());
            
            // Tạo CartDTO cho từng sản phẩm yêu thích
            CartDTO cartDTO = new CartDTO();
            cartDTO.setAccountId(accountId);
            cartDTO.setQuantity(favourite.getQuantity());

            // Chuyển đổi Size sang SizeDTO
            SizeDTO sizeDTO = convertSizeToSizeDTO(favourite.getSizeId());
            cartDTO.setSize(sizeDTO);

            // Gọi saveCart
            cartService.saveCart(cartDTO, request, response);
            logger.info("Added favourite {} to cart successfully", favourite.getId());
        }
    }




	// Phương thức chuyển đổi Size sang SizeDTO 
    private SizeDTO convertSizeToSizeDTO(Size size) {
        SizeDTO sizeDTO = new SizeDTO();
        
        // Thiết lập các thuộc tính cho sizeDTO từ size
        sizeDTO.setId(size.getId());
        sizeDTO.setName(size.getName()); // Giả định có trường name trong Size
        sizeDTO.setQuantityInStock(size.getQuantityInStock()); // Giả định bạn có trường này

        // Kiểm tra và thiết lập màu sắc
        if (size.getColor() != null) {
            ColorDTO colorDTO = new ColorDTO(); // Giả định bạn có lớp ColorDTO
            colorDTO.setId(size.getColor().getId()); // Thiết lập ID cho màu sắc
            colorDTO.setName(size.getColor().getName()); //có trường name trong ColorDTO
            sizeDTO.setColor(colorDTO);
        } else {
            // Xử lý nếu màu sắc là null, bạn có thể thiết lập màu mặc định hoặc bỏ qua
            logger.warn("Size with ID {} does not have an associated color", size.getId());
            sizeDTO.setColor(null); // Hoặc có thể thiết lập màu sắc mặc định
        }
        
        return sizeDTO;
    }



}
