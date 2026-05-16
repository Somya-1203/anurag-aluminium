package com.anurag.aluminium.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    
    @JsonProperty("admin_id")
    private String adminId; // Who should receive the notification
    
    private String type; // "estimate_created", "estimate_updated", etc.
    
    private String title;
    private String message;
    
    @JsonProperty("estimate_id")
    private String estimateId; // Reference to estimate
    
    @JsonProperty("field_expert_name")
    private String fieldExpertName;
    
    @JsonProperty("customer_name")
    private String customerName;
    
    @JsonProperty("is_read")
    private Boolean isRead = false;
    
    @CreatedDate
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}
