package com.poly.service;


import org.springframework.stereotype.Service;

import com.poly.entity.Roles;
import com.poly.repository.RolesRepository;

@Service
public class RoleService {

    private final RolesRepository roleRepository;

    public RoleService(RolesRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public Roles getRoleByName(String name) {
        return roleRepository.findByName(name);
    }

    public Roles createRole(Roles role) {
        return roleRepository.save(role);
    }
}