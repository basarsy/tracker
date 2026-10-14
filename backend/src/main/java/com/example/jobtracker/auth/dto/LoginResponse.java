package com.example.jobtracker.auth.dto;

public record LoginResponse(String token, String tokenType, long expiresInMs, String username) {
}
