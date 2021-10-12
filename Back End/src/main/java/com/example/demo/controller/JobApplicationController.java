package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.JobApplicationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.ResponseEntity.status;

@RestController
@RequestMapping("/api/jobapplication/")
@AllArgsConstructor
public class JobApplicationController {

    JobApplicationService jobApplicationService;

    @PostMapping
    public ResponseEntity<String> apply(@RequestBody JobApplicationDto jobApplicationDto) {
        jobApplicationService.apply(jobApplicationDto);
        return new ResponseEntity<>("Job application was successfully",HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<JobApplicationResponse>> getApplications(@PathVariable Long id) {
        return status(HttpStatus.OK).body(jobApplicationService.getApplications(id));
    }

}
