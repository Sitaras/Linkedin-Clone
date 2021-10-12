package com.example.demo.service;

import com.example.demo.dto.AuthenticationResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RefreshTokenRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.exception.GeneralError;
import com.example.demo.model.User;
import com.example.demo.repo.UserRepo;
import com.example.demo.security.JwtProvider;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
@AllArgsConstructor
@Transactional
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepo userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final RefreshTokenService refreshTokenService;

    public void signup(RegisterRequest registerRequest) {
        User user = new User();
        Optional<User> sameUserNameUser = userRepository.findByUsername(registerRequest.getUsername());
        if(sameUserNameUser.isPresent()){
            throw new GeneralError("User Name Already Exists");
        }
        user.setUsername(registerRequest.getUsername());
        if(!registerRequest.getPassword().equals(registerRequest.getPasswordValid())){
            throw new GeneralError("The two passwords don't match.");
        }
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        User sameEmailUser = userRepository.findByEmail(registerRequest.getEmail());
        if(sameEmailUser!=null){
            throw new GeneralError("Email already in use.");
        }

        user.setEmail(registerRequest.getEmail());
        user.setImageUrl(registerRequest.getImageUrl());
        user.setPhone(registerRequest.getPhone());
        user.setCreated(Instant.now());
        user.setEnabled(true);
        user.setAdmin(false);
        user.setPublicEducation(false);
        user.setPublicWorkingExperience(false);
        user.setPublicSkills(false);

        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) SecurityContextHolder.
                getContext().getAuthentication().getPrincipal();
        return userRepository.findByUsername(principal.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User name not found - " + principal.getUsername()));
    }

    public AuthenticationResponse login(LoginRequest loginRequest) {
        User u = userRepository.findByEmail(loginRequest.getEmail());
        if(u==null){
            throw new GeneralError("Invalid Email");
        }
        UsernamePasswordAuthenticationToken t = new UsernamePasswordAuthenticationToken(u.getUsername(),
                loginRequest.getPassword());
        Authentication authenticate=null;
        authenticate = authenticationManager.authenticate(t);
        SecurityContextHolder.getContext().setAuthentication(authenticate);

        String token = jwtProvider.generateToken(authenticate);
        return AuthenticationResponse.builder()
                .authenticationToken(token)
                .refreshToken(refreshTokenService.generateRefreshToken().getToken())
                .expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationInMillis()))
                .username(u.getUsername())
                .build();
    }

    public AuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        refreshTokenService.validateRefreshToken(refreshTokenRequest.getRefreshToken());
        String token = jwtProvider.generateTokenWithUserName(refreshTokenRequest.getUsername());
        return AuthenticationResponse.builder()
                .authenticationToken(token)
                .refreshToken(refreshTokenRequest.getRefreshToken())
                .expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationInMillis()))
                .username(refreshTokenRequest.getUsername())
                .build();
    }

    public boolean isLoggedIn() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return !(authentication instanceof AnonymousAuthenticationToken) && authentication.isAuthenticated();
    }

    @Transactional
    public void updatePassword(String password) {
        User user = getCurrentUser();
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }
}
