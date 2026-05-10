package com.anurag.aluminium.controller;

import com.anurag.aluminium.dto.LoginRequest;
import com.anurag.aluminium.dto.UserResponse;
import com.anurag.aluminium.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest request) {
        try {
            UserResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/init")
    public ResponseEntity<Map<String, String>> initializeData() {
        authService.initializeData();
        return ResponseEntity.ok(Map.of("message", "Initialization complete"));
    }
}