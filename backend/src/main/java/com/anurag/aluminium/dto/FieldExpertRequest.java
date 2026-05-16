package com.anurag.aluminium.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FieldExpertRequest {
    @NotBlank(message = "name is required")
    private String name;
    
    @NotBlank(message = "phone is required")
    private String phone;
    
    @Email(message = "email must be valid")
    private String email;
    
    private String address;
    
    @NotBlank(message = "username is required")
    private String username;
    
    @NotBlank(message = "password is required")
    private String password;
}
