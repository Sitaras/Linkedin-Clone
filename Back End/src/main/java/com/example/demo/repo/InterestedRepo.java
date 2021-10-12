package com.example.demo.repo;

import com.example.demo.model.Interested;
import com.example.demo.model.Post;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterestedRepo extends JpaRepository<Interested, Long> {
    Optional<Interested> findTopByPostAndUserOrderByInterestedIdDesc(Post post, User currentUser);
    Optional<Interested> findByPostAndUser(Post post, User currentUser);
    void deleteByPostAndUser(Post post, User currentUser);
    List<Interested> findAllByPost(Post post);
}
