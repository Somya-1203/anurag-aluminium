package com.anurag.aluminium.service;

import com.anurag.aluminium.dto.UserResponse;
import com.anurag.aluminium.model.User;
import com.anurag.aluminium.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<UserResponse> getUsers(String role) {
        List<User> users = userRepository.findAll();
        if (role != null && !role.isBlank()) {
            users = users.stream()
                    .filter(user -> user.getRole() != null && user.getRole().equalsIgnoreCase(role))
                    .collect(Collectors.toList());
        }
        return users.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toResponse(user);
    }

    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setName(request.getName());
        user.setCreatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    public UserResponse updateUser(String id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            if (!user.getUsername().equals(request.getUsername()) && userRepository.existsByUsername(request.getUsername())) {
                throw new RuntimeException("Username already exists");
            }
            user.setUsername(request.getUsername());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }

        if (request.getRole() != null && !request.getRole().isBlank()) {
            user.setRole(request.getRole());
        }

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getRole(), user.getName());
    }

    public static class CreateUserRequest {
        private String username;
        private String password;
        private String role;
        private String name;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    public static class UpdateUserRequest {
        private String username;
        private String password;
        private String role;
        private String name;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
