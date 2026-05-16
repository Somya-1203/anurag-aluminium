package com.anurag.aluminium.service;

import com.anurag.aluminium.dto.FieldExpertRequest;
import com.anurag.aluminium.dto.FieldExpertResponse;
import com.anurag.aluminium.dto.FieldExpertUpdateRequest;
import com.anurag.aluminium.model.FieldExpert;
import com.anurag.aluminium.model.User;
import com.anurag.aluminium.repository.FieldExpertRepository;
import com.anurag.aluminium.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FieldExpertService {
    private final FieldExpertRepository fieldExpertRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public FieldExpertResponse createFieldExpert(FieldExpertRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check if phone already exists
        if (fieldExpertRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new RuntimeException("Phone number already in use");
        }

        // Check if email already exists
        if (fieldExpertRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        // Create User account
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("field_expert");
        user.setName(request.getName());
        user.setCreatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);

        // Create FieldExpert profile
        FieldExpert fieldExpert = new FieldExpert();
        fieldExpert.setName(request.getName());
        fieldExpert.setPhone(request.getPhone());
        fieldExpert.setEmail(request.getEmail());
        fieldExpert.setAddress(request.getAddress());
        fieldExpert.setUserId(savedUser.getId());
        fieldExpert.setIsActive(true);
        fieldExpert.setTotalEstimates(0);
        fieldExpert.setCreatedAt(LocalDateTime.now());
        fieldExpert.setUpdatedAt(LocalDateTime.now());
        FieldExpert savedFieldExpert = fieldExpertRepository.save(fieldExpert);

        return mapToResponse(savedFieldExpert);
    }

    public FieldExpertResponse getFieldExpertById(String id) {
        FieldExpert fieldExpert = fieldExpertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Field Expert not found"));
        return mapToResponse(fieldExpert);
    }

    public FieldExpertResponse updateFieldExpert(String id, FieldExpertUpdateRequest request) {
        FieldExpert fieldExpert = fieldExpertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Field Expert not found"));

        // Check if phone is being changed and already exists
        if (request.getPhone() != null && !request.getPhone().equals(fieldExpert.getPhone())) {
            if (fieldExpertRepository.findByPhone(request.getPhone()).isPresent()) {
                throw new RuntimeException("Phone number already in use");
            }
            fieldExpert.setPhone(request.getPhone());
        }

        // Check if email is being changed and already exists
        if (request.getEmail() != null && !request.getEmail().equals(fieldExpert.getEmail())) {
            if (fieldExpertRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new RuntimeException("Email already in use");
            }
            fieldExpert.setEmail(request.getEmail());
        }

        if (request.getName() != null) {
            fieldExpert.setName(request.getName());
            // Update the associated user's name
            if (fieldExpert.getUserId() != null) {
                userRepository.findById(fieldExpert.getUserId()).ifPresent(user -> {
                    user.setName(request.getName());
                    userRepository.save(user);
                });
            }
        }

        if (request.getAddress() != null) {
            fieldExpert.setAddress(request.getAddress());
        }

        fieldExpert.setUpdatedAt(LocalDateTime.now());
        FieldExpert updatedFieldExpert = fieldExpertRepository.save(fieldExpert);
        return mapToResponse(updatedFieldExpert);
    }

    public void deleteFieldExpert(String id) {
        FieldExpert fieldExpert = fieldExpertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Field Expert not found"));

        // Delete associated user account
        if (fieldExpert.getUserId() != null) {
            userRepository.deleteById(fieldExpert.getUserId());
        }

        // Delete field expert profile
        fieldExpertRepository.deleteById(id);
    }

    public FieldExpertResponse deactivateFieldExpert(String id) {
        FieldExpert fieldExpert = fieldExpertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Field Expert not found"));
        fieldExpert.setIsActive(false);
        fieldExpert.setUpdatedAt(LocalDateTime.now());
        FieldExpert updatedFieldExpert = fieldExpertRepository.save(fieldExpert);
        return mapToResponse(updatedFieldExpert);
    }

    public FieldExpertResponse activateFieldExpert(String id) {
        FieldExpert fieldExpert = fieldExpertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Field Expert not found"));
        fieldExpert.setIsActive(true);
        fieldExpert.setUpdatedAt(LocalDateTime.now());
        FieldExpert updatedFieldExpert = fieldExpertRepository.save(fieldExpert);
        return mapToResponse(updatedFieldExpert);
    }

    public List<FieldExpertResponse> getAllFieldExperts() {
        return fieldExpertRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<FieldExpertResponse> getActiveFieldExperts() {
        return fieldExpertRepository.findByIsActive(true).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<FieldExpertResponse> searchFieldExperts(String query) {
        return fieldExpertRepository.findByNameContainingIgnoreCase(query).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void incrementEstimateCount(String fieldExpertName) {
        fieldExpertRepository.findByName(fieldExpertName).ifPresent(fieldExpert -> {
            fieldExpert.setTotalEstimates((fieldExpert.getTotalEstimates() != null ? fieldExpert.getTotalEstimates() : 0) + 1);
            fieldExpertRepository.save(fieldExpert);
        });
    }

    private FieldExpertResponse mapToResponse(FieldExpert fieldExpert) {
        return new FieldExpertResponse(
                fieldExpert.getId(),
                fieldExpert.getName(),
                fieldExpert.getPhone(),
                fieldExpert.getEmail(),
                fieldExpert.getAddress(),
                fieldExpert.getIsActive(),
                fieldExpert.getTotalEstimates()
        );
    }
}
