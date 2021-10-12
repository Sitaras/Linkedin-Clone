package com.example.demo.mapper;

import com.example.demo.dto.JobPostRequest;
import com.example.demo.dto.JobPostResponse;
import com.example.demo.model.JobPost;
import com.example.demo.model.User;
import com.example.demo.repo.CommentRepo;
import com.example.demo.service.AuthService;
import com.github.marlonlom.utilities.timeago.TimeAgo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class JobPostMapper {

    @Autowired
    private CommentRepo commentRepository;
    @Autowired
    private AuthService authService;

    @Mapping(target = "createdDate", expression = "java(java.time.Instant.now())")
    @Mapping(target = "skills", source = "jobPostRequest.skills")
    @Mapping(target = "user", source = "user")
    public abstract JobPost map(JobPostRequest jobPostRequest, User user);

    @Mapping(target = "id", source = "jobPostId")
    @Mapping(target = "userName", source = "user.username")
    @Mapping(target = "duration", expression = "java(getDuration(jobPost))")
    public abstract JobPostResponse mapToDto(JobPost jobPost);

    String getDuration(JobPost jobPost) {
        return TimeAgo.using(jobPost.getCreatedDate().toEpochMilli());
    }
}
