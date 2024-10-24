package com.poly.service;

import com.poly.entity.Authorities;
import com.poly.repository.AuthoritiesRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthorityService {

    private final AuthoritiesRepository authorityRepository;

    public AuthorityService(AuthoritiesRepository authorityRepository) {
        this.authorityRepository = authorityRepository;
    }

    public Authorities createAuthority(Authorities authority) {
        return authorityRepository.save(authority);
    }
}