package com.example.demo.repo;

import com.example.demo.model.JobPost;
import com.example.demo.model.Post;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostRepo extends JpaRepository<JobPost, Long> {
    List<JobPost> findByUser(User user);
    List<JobPost> findByOrderByJobPostIdDesc();
}
