package com.example.auth.dto;

import com.example.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AuthResponse {

    private String message;
    private Long userId;
    private String name;
    private String email;
    private Role role;
    private String token;
}