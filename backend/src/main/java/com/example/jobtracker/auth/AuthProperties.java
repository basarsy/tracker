package com.example.jobtracker.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.auth")
public class AuthProperties {

    private String username;
    private String password;
    private String jwtSecret;
    private long jwtExpirationMs;
}
