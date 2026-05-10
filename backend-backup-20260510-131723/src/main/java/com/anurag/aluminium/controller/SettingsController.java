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
    }

    @GetMapping
    public ResponseEntity<SettingsResponse> getSettings() {
        Settings settings = settingsService.getSettings();
        return ResponseEntity.ok(new SettingsResponse(settings.getDefaultRate()));
    }

    @PutMapping
    public ResponseEntity<SettingsResponse> updateSettings(@RequestBody SettingsRequest request) {
        Settings settings = settingsService.updateSettings(request.getDefaultRate());
        return ResponseEntity.ok(new SettingsResponse(settings.getDefaultRate()));
    }
}