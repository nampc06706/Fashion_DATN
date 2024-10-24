package com.poly.dto;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.poly.entity.Account;
import com.poly.entity.Roles;
public class CustomUserDetails implements UserDetails {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Account account;

    public CustomUserDetails(Account account) {
        this.account = account;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Kiểm tra trường hợp null
        if (account.getAuthority() == null || account.getAuthority().getRole() == null) {
            return Collections.emptyList();  // Trả về danh sách rỗng nếu không có vai trò nào
        }

        // Nếu Role là một đối tượng đơn lẻ, không cần stream
        Roles role = account.getAuthority().getRole();
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.getName()));
    }



    @Override
    public String getPassword() {
        return account.getPassword();
    }

    @Override
    public String getUsername() {
        return account.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return account.isActivated();
    }
}
