package com.example.demo.service;


import com.example.demo.dto.JobApplicationDto;
import com.example.demo.dto.JobApplicationResponse;
import com.example.demo.exception.GeneralError;
import com.example.demo.exception.PostNotFoundException;
import com.example.demo.model.JobApplication;
import com.example.demo.model.JobPost;
import com.example.demo.repo.JobApplicationRepo;
import com.example.demo.repo.JobPostRepo;
import com.github.marlonlom.utilities.timeago.TimeAgo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@Service
@AllArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepo jobApplicationRepository;
    private final JobPostRepo jobPostRepository;
    private final AuthService authService;

    @Transactional
    public void apply(JobApplicationDto jobApplicationDto) {
        JobPost jobPost = jobPostRepository.findById(jobApplicationDto.getJobPostId())
                .orElseThrow(() -> new PostNotFoundException("Job Post Not Found with ID - " + jobApplicationDto.getJobPostId()));
        Optional<JobApplication> alreadyApplied = jobApplicationRepository.findByJobPostAndUser(jobPost, authService.getCurrentUser());
        if (alreadyApplied.isPresent()) {
            throw new GeneralError("You have have already applied for this job");
        }

        jobApplicationRepository.save(mapToApply(jobApplicationDto, jobPost));
    }

    public List<JobApplicationResponse> getApplications(Long jobPostId){
        JobPost jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new PostNotFoundException(jobPostId.toString()));
        if(jobPost.getUser().getUserId() != authService.getCurrentUser().getUserId()) {
            throw new GeneralError("You are not the publisher of the job post");
        }
        return jobApplicationRepository.findByJobPost(jobPost)
                .stream()
                .map(JobApplicationService::mapToResponse).collect(toList());
    }

    private JobApplication mapToApply(JobApplicationDto jobApplicationDto, JobPost jobPost) {
        return JobApplication.builder()
                .jobPost(jobPost)
                .user(authService.getCurrentUser())
                .applicationText(jobApplicationDto.getApplicationText())
                .createdDate(java.time.Instant.now())
                .build();
    }

    private static JobApplicationResponse mapToResponse(JobApplication jobApplication){
        return JobApplicationResponse.builder()
                .userName(jobApplication.getUser().getUsername())
                .applicationText(jobApplication.getApplicationText())
                .duration(getDuration(jobApplication))
                .build();
    }

    static String getDuration(JobApplication jobApplication) {
        return TimeAgo.using(jobApplication.getCreatedDate().toEpochMilli());
    }

}
