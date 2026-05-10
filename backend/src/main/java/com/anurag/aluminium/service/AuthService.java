package com.anurag.aluminium.service;

import com.anurag.aluminium.dto.LoginRequest;
import com.anurag.aluminium.dto.UserResponse;
import com.anurag.aluminium.model.*;
import com.anurag.aluminium.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final WindowTypeRepository windowTypeRepository;
    private final SettingsRepository settingsRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return new UserResponse(user.getId(), user.getUsername(), user.getRole(), user.getName());
    }

    public void initializeData() {
        // Create admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("admin");
            admin.setName("Admin User");
            admin.setCreatedAt(LocalDateTime.now());
            userRepository.save(admin);
        }

        // Create field expert user if not exists
        if (!userRepository.existsByUsername("expert")) {
            User expert = new User();
            expert.setUsername("expert");
            expert.setPassword(passwordEncoder.encode("expert123"));
            expert.setRole("field_expert");
            expert.setName("Field Expert");
            expert.setCreatedAt(LocalDateTime.now());
            userRepository.save(expert);
        }

        // Initialize window types
        List<String> defaultWindowTypes = Arrays.asList(
                "Three track sliding window",
                "Two track sliding window",
                "Three track domal system window",
                "Two track domal system window",
                "Partition fixed",
                "Partition with doors",
                "Ventilation only net",
                "Ventilation net + glass"
        );

        for (String typeName : defaultWindowTypes) {
            if (!windowTypeRepository.existsByName(typeName)) {
                WindowType type = new WindowType();
                type.setName(typeName);
                type.setCreatedAt(LocalDateTime.now());
                windowTypeRepository.save(type);
            }
        }

        // Initialize settings
        if (settingsRepository.count() == 0) {
            Settings settings = new Settings();
            settings.setDefaultRate(100.0);
            settingsRepository.save(settings);
        }
    }
}