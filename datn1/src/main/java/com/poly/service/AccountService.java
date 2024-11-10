package com.poly.service;

import java.io.File;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.poly.dto.AccountDTO;
import com.poly.dto.AccountUpdateDTO;
import com.poly.entity.Account;
import com.poly.entity.Authorities;
import com.poly.entity.Roles;
import com.poly.model.ChangePasswordModel;
import com.poly.repository.AccountRepository;
import com.poly.repository.AuthoritiesRepository;
import com.poly.repository.RolesRepository;
import com.poly.dto.Forgotpassword;

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
	    Optional<Account> existingAccountOptional = accountRepository.findByEmail(email);
	    if (existingAccountOptional.isPresent()) {
	        throw new RuntimeException("Email đã tồn tại");
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

	public Account findByUsername(String username) {
		return accountRepository.findByUsername(username); // Sử dụng phương thức này để tìm tài khoản
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
		Optional<Account> existingAccountOptional = accountRepository.findByEmail(email);
		if (existingAccountOptional.isPresent()) {
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
		Optional<Account> account = accountRepository.findByEmail(email);
		if (account == null) {
			throw new UsernameNotFoundException("Email not found");
		}
		return account.get();
	}

	public AccountDTO updateAccount2(Integer id, AccountUpdateDTO accountUpdateDTO) {
	    // Tìm kiếm tài khoản theo ID
	    Account account = accountRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

	    // Kiểm tra email trước khi cập nhật
	    if (accountUpdateDTO.getEmail() != null) {
	        Optional<Account> existingAccount = accountRepository.findByEmail(accountUpdateDTO.getEmail());
	        if (existingAccount.isPresent() && !existingAccount.get().getId().equals(id)) {
	            throw new RuntimeException("Email đã tồn tại!");
	        }
	    }

	    // Cập nhật các trường nếu không null
	    if (accountUpdateDTO.getFullname() != null) {
	        account.setFullname(accountUpdateDTO.getFullname());
	    }
	    if (accountUpdateDTO.getEmail() != null) {
	        account.setEmail(accountUpdateDTO.getEmail());
	    }
	    if (accountUpdateDTO.getPhone() != null) {
	        account.setPhone(accountUpdateDTO.getPhone());
	    }
	    if (accountUpdateDTO.getImage() != null) {
	        // Lưu hình ảnh và cập nhật đường dẫn
	        String imageName = saveImage(accountUpdateDTO.getImage());
	        account.setImage(imageName);
	    }

	    // Lưu tài khoản đã cập nhật
	    account = accountRepository.save(account);

	    // Trả về thông tin tài khoản sau khi cập nhật
	    String roleName = null;
	    if (account.getAuthority() != null && account.getAuthority().getRole() != null) {
	        roleName = account.getAuthority().getRole().getName();
	    }

	    // Kiểm tra tất cả các thuộc tính trước khi tạo AccountDTO
	    if (account.getUsername() == null || account.getFullname() == null || account.getEmail() == null
	            || account.getPhone() == null || account.getImage() == null) {
	        throw new RuntimeException("Thông tin tài khoản không hợp lệ!");
	    }

	    return new AccountDTO(account.getId(), account.getUsername(), account.getFullname(), account.getEmail(),
	            account.getPhone(), account.getImage(), account.isActivated(), roleName);
	}

	public String saveImage(MultipartFile imageFile) {
		// Tạo tên tệp mới dựa trên thời gian hiện tại và tên tệp gốc
		String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();

		String projectPath = System.getProperty("user.dir");

		// Đường dẫn tới thư mục mà bạn muốn lưu hình ảnh
		String uploadDirectory = projectPath + "\\DATN-Theme-main\\public\\assets\\images";
		String updatedPath = uploadDirectory.replace("\\datn1", "");
		File directory = new File(updatedPath);

		// Tạo thư mục nếu chưa tồn tại
		if (!directory.exists()) {
			directory.mkdirs();
		}

		// Tạo tệp đích nơi hình ảnh sẽ được lưu
		File destinationFile = new File(directory, fileName);

		try {
			// Lưu tệp hình ảnh vào thư mục đích
			imageFile.transferTo(destinationFile);
		} catch (IOException e) {
			throw new RuntimeException("Không thể lưu hình ảnh: " + destinationFile.getAbsolutePath(), e);
		}

		// Trả về tên tệp hoặc đường dẫn đã lưu
		return fileName;
	}

	// Phương thức tìm tài khoản theo email
	public Optional<Account> findByEmail(String email) {
		return accountRepository.findByEmail(email);
	}

	public AccountDTO updateAccount(Integer id, AccountUpdateDTO accountUpdateDTO) {
		// Tìm kiếm tài khoản theo ID
		Account account = accountRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Vai trò mặc định không tồn tại"));

		// Cập nhật các trường
		String imageName = null;
		if (accountUpdateDTO.getImage() != null) {
			imageName = saveImage(accountUpdateDTO.getImage());
		}

		account.setFullname(accountUpdateDTO.getFullname());
		account.setPhone(accountUpdateDTO.getPhone());
		account.setEmail(accountUpdateDTO.getEmail());
		account.setImage(imageName);
		account.setActivated(accountUpdateDTO.isActivated());

		// Cập nhật Role nếu có Role mới
		if (accountUpdateDTO.getRoleId() != null) {
			Roles newRole = rolesRepository.findById(accountUpdateDTO.getRoleId())
					.orElseThrow(
							() -> new RuntimeException("Không tìm thấy quyền với ID: " + accountUpdateDTO.getRoleId()));

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
				account.getEmail(), account.getPhone(), account.getImage(), account.isActivated(),
				account.getAuthority() != null ? account.getAuthority().getRole().getName() : null);
	}

	public List<AccountDTO> getAllAccounts() {
		return accountRepository.findAll().stream().map(account -> {
			Authorities authority = authoritiesRepository.findByAccount(account);
			String roleName = authority != null && authority.getRole() != null ? authority.getRole().getName() : null;
			return new AccountDTO(account.getId(), account.getUsername(), account.getFullname(), account.getEmail(),
					account.getPhone(), account.getImage(), account.isActivated(), roleName);
		}).collect(Collectors.toList());
	}

	// Lưu trữ mã OTP
	private static Map<String, Forgotpassword> otpStorage = new HashMap<>();

	public void saveOtpForEmail(String email, String otp) {
		email = email.trim().toLowerCase(); // Chuẩn hóa email
		System.out.println("Đang lưu OTP: " + otp + " cho email: " + email);
		otpStorage.put(email, new Forgotpassword(email, otp, LocalDateTime.now())); // Lưu mã OTP
		System.out.println("Nội dung otpStorage sau khi lưu: " + otpStorage);
	}

	public boolean verifyOtpAndAllowPasswordChange(String email, String otp) {
		email = email.trim().toLowerCase(); // Chuẩn hóa email
		System.out.println("Đang xác thực OTP cho email: " + email);
		System.out.println("Nội dung hiện tại của otpStorage: " + otpStorage);

		// Lấy đối tượng Forgotpassword tương ứng với email
		Forgotpassword forgotPassword = otpStorage.get(email);

		// Kiểm tra xem mã OTP đã tồn tại chưa
		if (forgotPassword == null) {
			System.out.println("Không tìm thấy mã OTP cho email: " + email);
			throw new RuntimeException("Không tìm thấy mã OTP cho email này.");
		}

		// Kiểm tra xem mã OTP đã hết hạn chưa
		if (LocalDateTime.now().isAfter(forgotPassword.getTimestamp().plusMinutes(5))) {
			System.out.println("Mã OTP đã hết hạn cho email: " + email);
			throw new RuntimeException("Mã OTP đã hết hạn.");
		}

		// Kiểm tra mã OTP
		if (forgotPassword.getOtp().equals(otp)) {
			System.out.println("Mã OTP khớp cho email: " + email);
			otpStorage.remove(email); // Xóa mã OTP sau khi xác thực thành công
			return true; // Xác thực thành công
		} else {
			System.out.println("Mã OTP không khớp cho email: " + email);
			throw new RuntimeException("Mã OTP không chính xác.");
		}
	}

	public Account updatePassword(String email, String newPassword) {
		Optional<Account> account = accountRepository.findByEmail(email);

		if (account == null) {
			throw new RuntimeException("Không tìm thấy tài khoản với email này.");
		}

		// Mã hóa mật khẩu mới và lưu vào tài khoản
		account.get().setPassword(passwordEncoder.encode(newPassword));
		return accountRepository.save(account.get());
	}

	public Account updatePasswordProfile(ChangePasswordModel changePasswordModel) {
		// Tìm kiếm tài khoản dựa trên email
		Account account = accountRepository.findByEmail(changePasswordModel.getEmail())
				.orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại."));

		// Kiểm tra mật khẩu hiện tại có khớp không
		if (!passwordEncoder.matches(changePasswordModel.getCurrentPassword(), account.getPassword())) {
			throw new RuntimeException("Mật khẩu hiện tại không chính xác.");
		}

		// Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp không
		if (!changePasswordModel.getNewPassword().equals(changePasswordModel.getConfirmPassword())) {
			throw new RuntimeException("Mật khẩu mới và xác nhận mật khẩu không khớp.");
		}

		// Cập nhật mật khẩu mới và mã hóa trước khi lưu
		account.setPassword(passwordEncoder.encode(changePasswordModel.getNewPassword()));
		return accountRepository.save(account);
	}

	public Account createAccount(AccountUpdateDTO account) {
		Account acc = new Account();
		String encode = passwordEncoder.encode(account.getUsername() + "@123");
		String image = null;
		if (account.getImage() != null) {
			image = saveImage(account.getImage());
		}

		acc.setUsername(account.getUsername());
		acc.setFullname(account.getFullname());
		acc.setEmail(account.getEmail());
		acc.setImage(image);
		acc.setPhone(account.getPhone());
		acc.setPassword(encode);
		acc.setActivated(true);
		Account save = accountRepository.save(acc);

		if (account.getRoleId() != null) {
			Roles newRole = rolesRepository.findById(account.getRoleId())
					.orElseThrow(() -> new RuntimeException("Không tìm thấy quyền với ID: " + account.getRoleId()));

			Authorities authority = new Authorities();

			authority.setAccount(save);
			authority.setRole(newRole);
			authoritiesRepository.save(authority);

		}

		return save;
	}

}
