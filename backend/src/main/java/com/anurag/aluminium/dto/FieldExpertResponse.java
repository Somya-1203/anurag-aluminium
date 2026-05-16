package com.anurag.aluminium.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FieldExpertResponse {
    private String id;
    private String name;
    private String phone;
    private String email;
    private String address;
    
    @JsonProperty("is_active")
    private Boolean isActive;
    
    @JsonProperty("total_estimates")
    private Integer totalEstimates;
}
