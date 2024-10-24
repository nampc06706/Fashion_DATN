package com.poly.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.poly.entity.Account;
import com.poly.repository.AccountRepository;

import jakarta.annotation.PostConstruct;

@Component
public class PasswordEncoderInitializer {

    private static final Logger logger = LoggerFactory.getLogger(PasswordEncoderInitializer.class);

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        try {
            for (Account account : accountRepository.findAll()) {
                if (account.getPassword() != null && !isPasswordEncoded(account.getPassword())) {
                    String encodedPassword = passwordEncoder.encode(account.getPassword());
                    logger.info("Encoding password for username: {}", account.getUsername());
                    account.setPassword(encodedPassword);
                    accountRepository.save(account);
                }
            }
        } catch (Exception e) {
            logger.error("Error occurred while initializing password encoder: ", e);
        }
    }

    private boolean isPasswordEncoded(String password) {
        return password.startsWith("$2a$") || password.startsWith("$2b$");
    }
}
