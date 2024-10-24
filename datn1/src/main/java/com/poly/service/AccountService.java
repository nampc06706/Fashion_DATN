package com.poly.service;

import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.poly.dto.AccountDTO;
import com.poly.dto.AccountUpdateDTO;
import com.poly.entity.Account;
import com.poly.entity.Authorities;
import com.poly.entity.Roles;
import com.poly.repository.AccountRepository;
import com.poly.repository.AuthoritiesRepository;
import com.poly.repository.RolesRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class AccountService {

	@Autowired
	private AccountRepository accountRepository;

	@Autowired
	private AuthoritiesRepository authoritiesRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private RolesRepository rolesRepository;


	public Account login(String username, String password) {
		Account account = accountRepository.findByUsername(username);
		if (account == null) {
			throw new UsernameNotFoundException("Tên đăng nhập không tồn tại");
		}

		// Kiểm tra quyền của tài khoản
		Authorities authority = authoritiesRepository.findByAccount(account);
		if (authority == null) {
			System.err.println("No roles found for account: " + username);
		} else {
			System.out.println("Role: " + authority.getRole().getName());
		}

		// Kiểm tra mật khẩu
		if (passwordEncoder.matches(password, account.getPassword())) {
			return account;
		} else {
			throw new RuntimeException("Mật khẩu không đúng");
		}
	}

	public Account register(String fullname, String username, String password, String email, String phone) {
		// Kiểm tra xem tên đăng nhập đã tồn tại chưa
		if (accountRepository.findByUsername(username) != null) {
			throw new RuntimeException("Tên đăng nhập đã tồn tại");
		}

		// Kiểm tra xem email đã tồn tại chưa
		if (accountRepository.findByEmail(email) != null) {
			throw new RuntimeException("Email đã tồn tại");
		}

		// Kiểm tra xem số điện thoại đã tồn tại chưa
		if (accountRepository.findByPhone(phone) != null) {
			throw new RuntimeException("Số điện thoại đã tồn tại");
		}

		// Tạo đối tượng tài khoản mới
		Account newAccount = new Account();
		newAccount.setFullname(fullname);
		newAccount.setUsername(username);
		newAccount.setPassword(passwordEncoder.encode(password));
		newAccount.setEmail(email);
		newAccount.setPhone(phone);
		newAccount.setActivated(true); // Hoặc false, tùy thuộc vào yêu cầu

		// Tạo vai trò mặc định và gán cho tài khoản
		Roles defaultRole = rolesRepository.findById(3)
				.orElseThrow(() -> new RuntimeException("Vai trò mặc định không tồn tại"));

		Authorities authority = new Authorities();
		authority.setAccount(newAccount);
		authority.setRole(defaultRole);

		// Gán quyền cho tài khoản
		newAccount.setAuthority(authority);

		// Lưu tài khoản mới vào cơ sở dữ liệu
		Account savedAccount = accountRepository.save(newAccount);

		return savedAccount;
	}

	public Account getAccountById(Integer accountId) {
		return accountRepository.findById(accountId).orElse(null);
	}

	public Account save(String fullname, String username, String email) {
	    Logger logger = Logger.getLogger(AccountService.class.getName()); // Tạo Logger
	    logger.info("Bắt đầu tạo tài khoản mới...");

	    // Kiểm tra đầu vào
	    if (fullname == null || username == null || email == null) {
	        logger.severe("Thiếu thông tin fullname, username hoặc email.");
	        throw new IllegalArgumentException("Fullname, username, và email là bắt buộc.");
	    }

	    // Kiểm tra xem email đã tồn tại chưa
	    if (accountRepository.findByEmail(email) != null) {
	        logger.warning("Email đã tồn tại: " + email);
	        throw new RuntimeException("Email đã tồn tại");
	    }

	    // Tạo đối tượng tài khoản mới
	    Account newAccount = new Account();
	    newAccount.setFullname(fullname);
	    newAccount.setUsername(username);
	    newAccount.setEmail(email);
	    newAccount.setActivated(true);
	    
	    logger.info("Tài khoản mới được tạo với username: " + username);

	    // Tạo vai trò mặc định và gán cho tài khoản
	    try {
	        Roles defaultRole = rolesRepository.findById(3)
	                .orElseThrow(() -> new RuntimeException("Vai trò mặc định không tồn tại"));
	        
	        Authorities authority = new Authorities();
	        authority.setAccount(newAccount);
	        authority.setRole(defaultRole);

	        logger.info("Vai trò mặc định đã được gán cho tài khoản.");
	        
	     // Gán quyền cho tài khoản
			newAccount.setAuthority(authority);

	    } catch (Exception e) {
	        logger.severe("Lỗi khi gán vai trò mặc định: " + e.getMessage());
	        throw e; // Đảm bảo lỗi được truyền đi nếu có vấn đề
	    }

	    // Lưu tài khoản mới vào cơ sở dữ liệu
	    Account savedAccount = accountRepository.save(newAccount);
	    logger.info("Tài khoản đã được lưu thành công với ID: " + savedAccount.getId());

	    return savedAccount;
	}



	public Account loginByEmail(String email, String password) {
	    Account account = accountRepository.findByEmail(email);
	    if (account == null) {
	        throw new UsernameNotFoundException("Email not found");
	    }
	    return account;
	}



	// Phương thức tìm tài khoản theo email
	public Account findByEmail(String email) {
		return accountRepository.findByEmail(email);
	}
    public AccountDTO updateAccount(Integer id, AccountUpdateDTO accountUpdateDTO) {
        // Tìm kiếm tài khoản theo ID
        Account account = accountRepository.findById(id)
        		  .orElseThrow(() -> new RuntimeException("Vai trò mặc định không tồn tại"));

        // Cập nhật các trường
        account.setFullname(accountUpdateDTO.getFullname());
        account.setEmail(accountUpdateDTO.getEmail());
        account.setPhone(accountUpdateDTO.getPhone());
        account.setActivated(accountUpdateDTO.isActivated());

        // Cập nhật Role nếu có Role mới
        if (accountUpdateDTO.getRoleId() != null) {
            Roles newRole = rolesRepository.findById(accountUpdateDTO.getRoleId())
            		.orElseThrow(() -> new RuntimeException("Không tìm thấy quyền với ID: " + accountUpdateDTO.getRoleId()));
                  

            Authorities authority = authoritiesRepository.findByAccount(account);
            if (authority == null) {
                // Tạo mới Authority nếu chưa có
                authority = new Authorities();
                authority.setAccount(account);
            }
            authority.setRole(newRole);
            authoritiesRepository.save(authority);
        }

        // Lưu tài khoản đã cập nhật
        account = accountRepository.save(account);

        // Trả về thông tin tài khoản sau khi cập nhật
        return new AccountDTO(account.getId(), account.getUsername(), account.getFullname(),
                account.getEmail(), account.getPhone(), account.isActivated(),
                account.getAuthority() != null ? account.getAuthority().getRole().getName() : null);
    }
    public List<AccountDTO> getAllAccounts() {
        return accountRepository.findAll().stream().map(account -> {
            Authorities authority = authoritiesRepository.findByAccount(account);
            String roleName = authority != null && authority.getRole() != null ? authority.getRole().getName() : null;
            return new AccountDTO(account.getId(), account.getUsername(), account.getFullname(), account.getEmail(),
                                  account.getPhone(), account.isActivated(), roleName);
        }).collect(Collectors.toList());
    }

}
