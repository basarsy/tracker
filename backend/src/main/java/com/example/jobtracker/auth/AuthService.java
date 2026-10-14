package com.example.jobtracker.auth;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.jobtracker.auth.dto.LoginRequest;
import com.example.jobtracker.auth.dto.LoginResponse;

@Service
public class AuthService {

    private final AuthProperties properties;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final String passwordHash;

    public AuthService(AuthProperties properties, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.properties = properties;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        String configured = properties.getPassword();
        this.passwordHash = looksHashed(configured) ? configured : passwordEncoder.encode(configured);
    }

    public LoginResponse login(LoginRequest request) {
        boolean usernameOk = properties.getUsername().equals(request.username());
        boolean passwordOk = passwordEncoder.matches(request.password(), passwordHash);
        if (!usernameOk || !passwordOk) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        String token = jwtService.createToken(request.username());
        return new LoginResponse(token, "Bearer", jwtService.expirationMs(), request.username());
    }

    public String expectedUsername() {
        return properties.getUsername();
    }

    private boolean looksHashed(String value) {
        return value != null && (value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$"));
    }
}
