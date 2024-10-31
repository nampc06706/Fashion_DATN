package com.poly.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {
	  private Integer id;
	    private String username;
	    private String fullname;
	    private String email;
	    private String phone;
	    private String image;
	    private boolean activated;
	    private String roleName;	    
}


