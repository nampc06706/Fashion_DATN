package com.poly.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.poly.dto.FavouriteDTO;
import com.poly.entity.Account;
import com.poly.entity.Favourite;
import com.poly.entity.Size;
import com.poly.repository.AccountRepository;
import com.poly.repository.FavouriteRepository;
import com.poly.repository.SizeRepository;

import jakarta.transaction.Transactional;

@Service
public class FavouriteService {
    @Autowired
    private FavouriteRepository favouriteRepository;

    @Autowired
    private SizeRepository sizeRepository;

    @Autowired
    private AccountRepository accountRepository;

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




}
