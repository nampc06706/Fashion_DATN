package com.poly.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.poly.config.JwtTokenProvider;
import com.poly.dto.AccountDTO;
import com.poly.dto.AccountUpdateDTO;
import com.poly.dto.ContactDTO;
import com.poly.dto.Forgotpassword;
import com.poly.entity.Account;
import com.poly.entity.Authorities;
import com.poly.model.ChangePasswordModel;
import com.poly.service.AccountService;
import com.poly.util.EmailUtil;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
	
	
	@Autowired
	private AccountService accountService;

	@Autowired
	private JwtTokenProvider jwtTokenProvider;

	@Autowired
	EmailUtil emailUil;
	
	private final EmailUtil emailUtil;
	
	public AuthController(EmailUtil emailUtil) {
		this.emailUtil = emailUtil;
	}

	@PostMapping("/guest/takeData")
	public ResponseEntity<?> layDuLieuGoogle(@RequestBody Account account) {
		// Kiểm tra thông tin tài khoản trước khi lưu
		if (account == null || account.getFullname() == null || account.getUsername() == null
				|| account.getEmail() == null) {
			return ResponseEntity.badRequest().body("Fullname, username, and email are required.");
		}

		try {
			// Kiểm tra xem tài khoản đã tồn tại hay chưa
			Optional<Account> existingAccountOptional = accountService.findByEmail(account.getEmail());
			if (existingAccountOptional.isPresent()) {
				Account existingAccount = existingAccountOptional.get();
				if (existingAccount.getAuthority() != null && existingAccount.getAuthority().getRole() != null) {
					String roles = existingAccount.getAuthority().getRole().getName();
					String token = jwtTokenProvider.generateToken(existingAccount.getUsername(), roles,
							existingAccount.getId(), existingAccount.getEmail());
					return ResponseEntity.ok(new JwtResponse(token, roles));
				} else {
					return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
							.body("Account role or authority is not properly set up.");
				}
			}

			// Tạo tài khoản mới nếu chưa tồn tại
			Account savedAccount = accountService.save(account.getFullname(), account.getUsername(),
					account.getEmail());

			// Tạo và trả về JWT token cho tài khoản mới
			String roles = savedAccount.getAuthority().getRole().getName();
			String token = jwtTokenProvider.generateToken(savedAccount.getUsername(), roles, savedAccount.getId(),
					savedAccount.getEmail());

			return ResponseEntity.ok(new JwtResponse(token, roles));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error saving account: " + e.getMessage());
		}
	}

	// Lưu trữ mã OTP
	private static Map<String, Forgotpassword> otpStorage = new HashMap<>();

	// Phương thức kiểm tra định dạng email
	private boolean isValidEmail(String email) {
		String emailRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
		return email.matches(emailRegex);
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<?> sendOtp(@RequestParam String email) {
		if (!isValidEmail(email)) {
			return ResponseEntity.badRequest().body("Địa chỉ email không hợp lệ.");
		}

		try {
			String otp = emailUil.sendOtpEmail(email, "Mã OTP của bạn");
			Forgotpassword forgotPassword = new Forgotpassword(email, otp, LocalDateTime.now());
			otpStorage.put(email, forgotPassword); // Lưu trữ mã OTP

			// Log để kiểm tra
			System.out.println("Đã gửi và lưu mã OTP cho email: " + email + ", OTP: " + otp);
			System.out.println("Nội dung otpStorage sau khi lưu: " + otpStorage); // Log nội dung của otpStorage
			return ResponseEntity.ok("Mã OTP đã được gửi đến email: " + email);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Có lỗi xảy ra khi gửi OTP: " + e.getMessage());
		}
	}

	@PostMapping("/verify-otp")
	public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {
		email = email.trim().toLowerCase(); // Chuẩn hóa email
		System.out.println("Email: " + email + ", OTP: " + otp); // Kiểm tra log
		// Kiểm tra xem email có null hay không
		if (email == null || email.isEmpty()) {
			return ResponseEntity.badRequest().body("Email không hợp lệ.");
		}
		System.out.println("Nội dung hiện tại của otpStorage: " + otpStorage);

		if (!otpStorage.containsKey(email)) {
			return ResponseEntity.badRequest().body("Không tìm thấy mã OTP cho email này.");
		}

		try {
			Forgotpassword forgotPassword = otpStorage.get(email);
			System.out.println("Mã OTP lưu trữ cho email " + email + ": " + forgotPassword.getOtp());

			// Kiểm tra xem mã OTP đã hết hạn chưa (5 phút)
			if (LocalDateTime.now().isAfter(forgotPassword.getTimestamp().plusMinutes(5))) {
				otpStorage.remove(email); // Xóa mã OTP hết hạn
				return ResponseEntity.badRequest().body("Mã OTP đã hết hạn.");
			}

			if (forgotPassword.getOtp().equals(otp)) {
				otpStorage.remove(email); // Xóa mã OTP sau khi xác thực thành công
				return ResponseEntity.ok("Mã OTP xác thực thành công. Bạn có thể tiếp tục đổi mật khẩu.");
			} else {
				return ResponseEntity.badRequest().body("Mã OTP không chính xác.");
			}
		} catch (RuntimeException e) {
			System.err.println("Lỗi khi xác thực OTP: " + e.getMessage());
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	// Endpoint cập nhật mật khẩu sau khi xác thực OTP thành công
	@PostMapping("/update-password")
	public ResponseEntity<?> updatePassword(@RequestParam String email, @RequestParam String newPassword) {
		try {
			accountService.updatePassword(email, newPassword);
			return ResponseEntity.ok("Cập nhật mật khẩu thành công.");
		} catch (RuntimeException ex) {
			return ResponseEntity.badRequest().body(ex.getMessage());
		}
	}

	@PostMapping("/update-password-profile")
	public ResponseEntity<?> updatePassword(@RequestBody ChangePasswordModel changePasswordModel) {
		try {
			Account updatedAccount = accountService.updatePasswordProfile(changePasswordModel);
			return ResponseEntity.ok("Cập nhật mật khẩu thành công.");
		} catch (RuntimeException ex) {
			return ResponseEntity.badRequest().body(ex.getMessage());
		}
	}

	

	@PostMapping("/send")
	public ResponseEntity<String> sendContactEmail(@RequestBody ContactDTO contactDTO) {
		try {
			// Gửi email liên hệ
			emailUtil.sendContactEmail(contactDTO);

			// Phản hồi lại khi gửi email thành công
			return ResponseEntity.ok("Thông tin liên hệ đã được gửi thành công. Chúng tôi sẽ sớm liên hệ với bạn.");
		} catch (Exception e) {
			// Xử lý lỗi nếu có sự cố khi gửi email
			e.printStackTrace();
			return ResponseEntity.status(500).body("Đã xảy ra lỗi khi gửi thông tin liên hệ. Vui lòng thử lại sau.");
		}
	}

	@PostMapping("/signup")
	public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
		try {
			// Đăng ký tài khoản mới
			Account newAccount = accountService.register(registerRequest.getFullname(), registerRequest.getUsername(),
					registerRequest.getPassword(), registerRequest.getEmail(), registerRequest.getPhone());
			return ResponseEntity.status(HttpStatus.CREATED).body(newAccount);
		} catch (RuntimeException e) {
			// Ghi log chi tiết để debug
			System.err.println("Error during registration: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {
		try {
			// Kiểm tra thông tin đăng nhập

			Account account = accountService.login(username, password);

			// Kiểm tra quyền hạn của tài khoản
			Authorities authority = account.getAuthority();
			if (authority != null && authority.getRole() != null) {
				String role = authority.getRole().getName();

				// Tạo và trả về JWT token
				String token = jwtTokenProvider.generateToken(account.getUsername(), role, account.getId(),
						account.getEmail());
				return ResponseEntity.ok(new JwtResponse(token, role));
			} else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Không có vai trò nào được chỉ định cho tài khoản này");
			}
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Không tìm thấy người dùng!");
		} catch (RuntimeException e) {
			// Ghi log chi tiết để debug
			// System.err.println("Error during login: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Tài khoản hoặc mật khẩu không đúng!");
		}
	}

	@GetMapping("/account/info")
	public ResponseEntity<?> getAccountInfo(@RequestHeader("Authorization") String authorizationHeader) {
		try {
			// Lấy token từ header và tách ra
			String token = authorizationHeader.substring(7); // Bỏ qua "Bearer " trong header
			String username = jwtTokenProvider.getUsernameFromToken(token);

			// Tìm tài khoản dựa trên username
			Account account = accountService.findByUsername(username);
			if (account == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found");
			}

			// Trả về thông tin tài khoản
			return ResponseEntity.ok(account);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token or account not found");
		}
	}

	// API cập nhật tài khoản user phía client
	@PutMapping("/user/{id}")
	public AccountDTO updateAccount(@PathVariable Integer id, @RequestParam(required = false) String fullname,
			@RequestParam(required = false) String email, @RequestParam(required = false) String phone,
			@RequestParam(required = false) MultipartFile image) {

		AccountUpdateDTO accountUpdateDTO = new AccountUpdateDTO();
		accountUpdateDTO.setFullname(fullname);
		accountUpdateDTO.setEmail(email);
		accountUpdateDTO.setPhone(phone);
		accountUpdateDTO.setImage(image); // Truyền MultipartFile vào DTO

		return accountService.updateAccount2(id, accountUpdateDTO);
	}

	public static class RegisterRequest {
		private String fullname;
		private String username;
		private String password;
		private String email;
		private String phone;

		// Getters and Setters
		public String getFullname() {
			return fullname;
		}

		public void setFullname(String fullname) {
			this.fullname = fullname;
		}

		public String getUsername() {
			return username;
		}

		public void setUsername(String username) {
			this.username = username;
		}

		public String getPassword() {
			return password;
		}

		public void setPassword(String password) {
			this.password = password;
		}

		public String getEmail() {
			return email;
		}

		public void setEmail(String email) {
			this.email = email;
		}

		public String getPhone() {
			return phone;
		}

		public void setPhone(String phone) {
			this.phone = phone;
		}
	}

	// Cập nhật JwtResponse để chứa thêm thông tin
	public static class JwtResponse {
		private String token;
		private String role; // Thêm vai trò

		public JwtResponse(String token, String role) {
			this.token = token;
			this.role = role;
		}

		public String getToken() {
			return token;
		}

		public String getRole() {
			return role; // Thêm getter cho vai trò
		}
	}
}
