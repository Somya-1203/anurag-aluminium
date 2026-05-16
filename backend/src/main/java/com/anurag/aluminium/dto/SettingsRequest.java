package com.anurag.aluminium.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SettingsRequest {
    @JsonProperty("default_rate")
    private Double defaultRate;

    @JsonProperty("company_name")
    private String companyName;

    @JsonProperty("company_address")
    private String companyAddress;

    @JsonProperty("company_contact_numbers")
    private String companyContactNumbers;

    @JsonProperty("company_owners")
    private String companyOwners;

    @JsonProperty("company_logo_url")
    private String companyLogoUrl;
}