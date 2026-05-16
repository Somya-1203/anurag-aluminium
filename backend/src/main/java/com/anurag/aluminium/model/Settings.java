package com.anurag.aluminium.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "settings")
public class Settings {
    @Id
    private String id;
    
    private Double defaultRate = 100.0;
    private String companyName = "Anurag Aluminium & Glass House";
    private String companyAddress = "55, Sainath Colony, Alakhdham Nagar\nIndore Road, Ujjain";
    private String companyContactNumbers = "9827086001\n9131001671";
    private String companyOwners = "Sandeep Jain\nMehul Jain";
    private String companyLogoUrl = "";
}