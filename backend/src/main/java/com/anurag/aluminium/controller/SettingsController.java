package com.anurag.aluminium.controller;

import com.anurag.aluminium.dto.SettingsRequest;
import com.anurag.aluminium.model.Settings;
import com.anurag.aluminium.service.SettingsService;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {
    private final SettingsService settingsService;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class SettingsResponse {
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

    @GetMapping
    public ResponseEntity<SettingsResponse> getSettings() {
        Settings settings = settingsService.getSettings();
        return ResponseEntity.ok(new SettingsResponse(
                settings.getDefaultRate(),
                settings.getCompanyName(),
                settings.getCompanyAddress(),
                settings.getCompanyContactNumbers(),
                settings.getCompanyOwners(),
                settings.getCompanyLogoUrl()
        ));
    }

    @PutMapping
    public ResponseEntity<SettingsResponse> updateSettings(@RequestBody SettingsRequest request) {
        Settings settings = settingsService.updateSettings(
                request.getDefaultRate(),
                request.getCompanyName(),
                request.getCompanyAddress(),
                request.getCompanyContactNumbers(),
                request.getCompanyOwners(),
                request.getCompanyLogoUrl()
        );
        return ResponseEntity.ok(new SettingsResponse(
                settings.getDefaultRate(),
                settings.getCompanyName(),
                settings.getCompanyAddress(),
                settings.getCompanyContactNumbers(),
                settings.getCompanyOwners(),
                settings.getCompanyLogoUrl()
        ));
    }
}