package com.example.demo.repo;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User,Long> {
    void deleteUserByUserId(Long userId);
    Optional<User> findByUsername(String username);
    User findByEmail(String email);
    List<User> findAll();
    List<User> findAllByUsernameContains(String username);
}
