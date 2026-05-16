package com.anurag.aluminium.dto;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FieldExpertUpdateRequest {
    private String name;
    private String phone;
    
    @Email(message = "email must be valid")
    private String email;
    
    private String address;
}
