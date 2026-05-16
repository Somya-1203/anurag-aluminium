package com.anurag.aluminium.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "field_experts")
public class FieldExpert {
    @Id
    private String id;
    
    private String name;
    private String phone;
    private String email;
    private String address;
    
    @JsonProperty("user_id")
    private String userId; // Reference to User document
    
    @JsonProperty("is_active")
    private Boolean isActive = true;
    
    @JsonProperty("total_estimates")
    private Integer totalEstimates = 0;
    
    @CreatedDate
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;
}
