package com.example.demo.repo;

import com.example.demo.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepo extends JpaRepository<JobApplication, Long> {
    Optional<JobApplication> findByJobPostAndUser(JobPost jobPost, User currentUser);
    void deleteByJobPostAndUser(JobPost jobPost, User currentUser);
    List<JobApplication> findByJobPost(JobPost jobPost);
}
