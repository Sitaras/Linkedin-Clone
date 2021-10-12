package com.example.demo.service;


import com.example.demo.dto.JobPostRequest;
import com.example.demo.dto.JobPostResponse;
import com.example.demo.exception.PostNotFoundException;
import com.example.demo.mapper.JobPostMapper;
import com.example.demo.model.JobPost;
import com.example.demo.model.User;
import com.example.demo.repo.JobPostRepo;
import com.example.demo.repo.UserRepo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class JobPostService {

    public final JobPostRepo jobPostRepository;
    private final JobPostMapper jobPostMapper;
    private final AuthService authService;
    private final UserRepo userRepository;

    public void save(JobPostRequest jobPostRequest) {
        jobPostRepository.save(jobPostMapper.map(jobPostRequest, authService.getCurrentUser()));
    }

    @Transactional(readOnly = true)
    public JobPostResponse getJobPost(Long id) {
        JobPost jobPost = jobPostRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(id.toString()));
        return jobPostMapper.mapToDto(jobPost);
    }

    @Transactional(readOnly = true)
    public List<JobPostResponse> getAllJobPosts() {
        return jobPostRepository.findByOrderByJobPostIdDesc()
                .stream()
                .map(jobPostMapper::mapToDto)
                .collect(toList());
    }

    @Transactional(readOnly = true)
    public List<JobPostResponse> getJobPostsByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
        return jobPostRepository.findByUser(user)
                .stream()
                .map(jobPostMapper::mapToDto)
                .collect(toList());
    }
}
