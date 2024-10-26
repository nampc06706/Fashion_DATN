package com.poly.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.poly.entity.Account;
import com.poly.entity.Address;
import com.poly.entity.Authorities;
import com.poly.repository.AccountRepository;
import com.poly.repository.AddressRepository;
import com.poly.repository.AuthoritiesRepository;
import com.poly.repository.OrdersRepository;

@Service
public class AddressService {
	private static final Logger logger = LoggerFactory.getLogger(AddressService.class);

	@Autowired
	private AddressRepository addressRepository;

	@Autowired
	private AccountRepository accountRepository;

	@Autowired
	private AuthoritiesRepository authoritiesRepository;
	
	@Autowired
	private OrdersRepository ordersRepository;

	public List<Address> getAddressesByAccountId(Integer accountId) {
		// Kiểm tra xem tài khoản có tồn tại không
		Account account = accountRepository.findById(accountId).orElse(null);
		if (account == null) {
			logger.error("Tài khoản không tồn tại với ID: {}", accountId);
			throw new RuntimeException("Tài khoản không tồn tại");
		}

		// Lấy vai trò của tài khoản
		Authorities authority = authoritiesRepository.findByAccount(account);
		if (authority != null) {
			logger.info("Vai trò của tài khoản ID {}: {}", accountId, authority.getRole().getName());
		} else {
			logger.error("Không tìm thấy quyền cho tài khoản ID: {}", accountId);
			throw new AccessDeniedException("Tài khoản không có quyền truy cập địa chỉ");
		}

		// Lấy danh sách địa chỉ
		List<Address> addresses = addressRepository.findByAccountId(accountId);
		logger.info("Đã lấy {} địa chỉ cho tài khoản ID {}", addresses.size(), accountId);
		return addresses;
	}

	// Phương thức để thêm địa chỉ mới
	public Address addAddress(Integer accountId, Address newAddress) {
		try {
			// Kiểm tra tài khoản có tồn tại không
			Account account = accountRepository.findById(accountId).orElseThrow(() -> {
				logger.error("Tài khoản không tồn tại với ID: {}", accountId);
				return new RuntimeException("Tài khoản không tồn tại");
			});

			// Thiết lập account cho địa chỉ
			newAddress.setAccount(account);

			// Lưu địa chỉ mới vào cơ sở dữ liệu
			Address savedAddress = addressRepository.save(newAddress);
			logger.info("Đã thêm địa chỉ mới cho tài khoản ID {}", accountId);
			return savedAddress;

		} catch (DataAccessException e) {
			logger.error("Lỗi khi lưu địa chỉ vào cơ sở dữ liệu cho tài khoản ID {}: {}", accountId, e.getMessage());
			throw new RuntimeException("Lỗi hệ thống khi thêm địa chỉ mới, vui lòng thử lại sau.");
		}
	}

	public Address setDefaultAddress(Integer accountId, Integer addressId) {
		// Kiểm tra tài khoản có tồn tại không
		Account account = accountRepository.findById(accountId).orElseThrow(() -> {
			logger.error("Tài khoản không tồn tại với ID: {}", accountId);
			return new RuntimeException("Tài khoản không tồn tại");
		});

		// Kiểm tra địa chỉ có tồn tại và thuộc về tài khoản không
		Address address = addressRepository.findById(addressId).orElseThrow(() -> {
			logger.error("Địa chỉ không tồn tại với ID: {}", addressId);
			return new RuntimeException("Địa chỉ không tồn tại");
		});

		if (!address.getAccount().getId().equals(accountId)) {
			logger.error("Địa chỉ ID {} không thuộc về tài khoản ID {}", addressId, accountId);
			throw new AccessDeniedException("Không có quyền thay đổi địa chỉ này");
		}

		// Đặt tất cả địa chỉ của tài khoản này là không mặc định
		List<Address> addresses = addressRepository.findByAccountId(accountId);
		addresses.forEach(addr -> addr.setIsdefault(false));
		addressRepository.saveAll(addresses);

		// Đặt địa chỉ này là mặc định
		address.setIsdefault(true);
		Address updatedAddress = addressRepository.save(address);
		logger.info("Đã đặt địa chỉ ID {} làm mặc định cho tài khoản ID {}", addressId, accountId);

		return updatedAddress;
	}

	public Address updateAddress(Integer accountId, Integer addressId, Address updatedAddress) {
		// Kiểm tra tài khoản có tồn tại không
		Account account = accountRepository.findById(accountId).orElseThrow(() -> {
			logger.error("Tài khoản không tồn tại với ID: {}", accountId);
			return new RuntimeException("Tài khoản không tồn tại");
		});

		// Kiểm tra địa chỉ có tồn tại và thuộc về tài khoản không
		Address address = addressRepository.findById(addressId).orElseThrow(() -> {
			logger.error("Địa chỉ không tồn tại với ID: {}", addressId);
			return new RuntimeException("Địa chỉ không tồn tại");
		});

		if (!address.getAccount().getId().equals(accountId)) {
			logger.error("Địa chỉ ID {} không thuộc về tài khoản ID {}", addressId, accountId);
			throw new AccessDeniedException("Không có quyền cập nhật địa chỉ này");
		}

		// Cập nhật thông tin địa chỉ
		address.setProvince(updatedAddress.getProvince());
		address.setDistrict(updatedAddress.getDistrict());
		address.setWard(updatedAddress.getWard());
		address.setFullname(updatedAddress.getFullname());
		address.setPhone(updatedAddress.getPhone());
		address.setIsdefault(updatedAddress.isIsdefault());
		address.setNote(updatedAddress.getNote());

		// Lưu thay đổi
		Address savedAddress = addressRepository.save(address);
		logger.info("Đã cập nhật địa chỉ ID {} cho tài khoản ID {}", addressId, accountId);

		return savedAddress;
	}

	public void deleteAddress(Integer accountId, Integer addressId) {
		// Kiểm tra tài khoản có tồn tại không
		Account account = accountRepository.findById(accountId).orElseThrow(() -> {
			logger.error("Tài khoản không tồn tại với ID: {}", accountId);
			return new RuntimeException("Tài khoản không tồn tại");
		});

		// Kiểm tra địa chỉ có tồn tại và thuộc về tài khoản không
		Address address = addressRepository.findById(addressId).orElseThrow(() -> {
			logger.error("Địa chỉ không tồn tại với ID: {}", addressId);
			return new RuntimeException("Địa chỉ không tồn tại");
		});

		if (!address.getAccount().getId().equals(accountId)) {
			logger.error("Địa chỉ ID {} không thuộc về tài khoản ID {}", addressId, accountId);
			throw new AccessDeniedException("Không có quyền xóa địa chỉ này");
		}

		// Kiểm tra xem địa chỉ có liên kết với bất kỳ đơn hàng nào không
	    boolean hasOrders = ordersRepository.existsByAddressId(addressId);
	    if (hasOrders) {
	        logger.error("Địa chỉ ID {} đang liên kết với các đơn hàng và không thể xóa.", addressId);
	        throw new RuntimeException("Địa chỉ này đang liên kết với đơn hàng và không thể xóa");
	    }
	    
		// Log trước khi xóa
		logger.info("Đang xóa địa chỉ ID {} cho tài khoản ID {}", addressId, accountId);

		// Thực hiện xóa
		addressRepository.deleteById(addressId);

		// Kiểm tra sau khi xóa
		if (addressRepository.existsById(addressId)) {
			logger.error("Địa chỉ ID {} vẫn tồn tại sau khi xóa.", addressId);
		} else {
			logger.info("Địa chỉ ID {} đã bị xóa thành công.", addressId);
		}
	}
	
	// Phương thức để lấy địa chỉ mặc định theo accountId
    public Address getDefaultAddressByAccountId(Integer accountId) {
        // Kiểm tra xem tài khoản có tồn tại không
        Account account = accountRepository.findById(accountId).orElseThrow(() -> {
            logger.error("Tài khoản không tồn tại với ID: {}", accountId);
            return new RuntimeException("Tài khoản không tồn tại");
        });

        // Lấy địa chỉ mặc định của tài khoản
        Address defaultAddress = addressRepository.findByAccountIdAndIsdefaultTrue(accountId);
        if (defaultAddress == null) {
            logger.error("Không tìm thấy địa chỉ mặc định cho tài khoản ID: {}", accountId);
            throw new RuntimeException("Không tìm thấy địa chỉ mặc định");
        }

        logger.info("Đã lấy địa chỉ mặc định cho tài khoản ID {}", accountId);
        return defaultAddress;
    }

}
