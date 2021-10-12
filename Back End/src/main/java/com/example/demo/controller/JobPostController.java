package com.example.demo.controller;

import com.example.demo.dto.JobPostRequest;
import com.example.demo.dto.JobPostResponse;
import com.example.demo.service.JobPostService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.ResponseEntity.status;

@RestController
@RequestMapping("/api/jobposts/")
@AllArgsConstructor
@Slf4j
public class JobPostController {
    private final JobPostService jobPostService;

    @PostMapping
    public ResponseEntity<Void> createJobPost(@RequestBody JobPostRequest jobPostRequest) {
        jobPostService.save(jobPostRequest);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<JobPostResponse>> getAllJobPosts() {
        return status(HttpStatus.OK).body(jobPostService.getAllJobPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobPostResponse> getJobPost(@PathVariable Long id) {
        return status(HttpStatus.OK).body(jobPostService.getJobPost(id));
    }


    @GetMapping("by-user/{name}")
    public ResponseEntity<List<JobPostResponse>> getJobPostsByUsername(@PathVariable String name) {
        return status(HttpStatus.OK).body(jobPostService.getJobPostsByUsername(name));
    }
}
