package com.auth.backend.service;

import com.auth.backend.dto.*;
import com.auth.backend.entity.User;
import com.auth.backend.repository.UserRepository;
import com.auth.backend.security.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    
    @Transactional
    public MessageResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .isActive(true)
                .build();
        
        userRepository.save(user);
        
        return new MessageResponse("User registered successfully");
    }
    
    @Transactional
    public AuthResponse authenticateUser(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));
        
        if (!user.getIsActive()) {
            throw new RuntimeException("Account is inactive");
        }
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        String token = tokenProvider.generateToken(user.getUsername());
        
        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }
    
    public UserResponse getUserProfile(String token) {
        String username = tokenProvider.getUsernameFromToken(token);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return UserResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .createAt(user.getCreateAt())
                .lastLogin(user.getLastLogin())
                .build();
    }
}