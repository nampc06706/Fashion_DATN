package com.poly.service;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.poly.dto.CustomUserDetails;
import com.poly.entity.Account;
import com.poly.repository.AccountRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.info("Attempting to load user by username: " + username);
        
        Account account = accountRepository.findByUsername(username);
        if (account == null || account.getAuthority() == null) {
            logger.warn("User or authorities not found for username: " + username);
            throw new UsernameNotFoundException("User or authorities not found");
        }
        
        logger.info("User found: " + account.getUsername());
        return new CustomUserDetails(account);
    }


}
