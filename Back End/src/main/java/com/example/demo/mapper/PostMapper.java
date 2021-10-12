package com.example.demo.mapper;


import com.example.demo.dto.PostRequest;
import com.example.demo.dto.PostResponse;
import com.example.demo.model.Interested;
import com.example.demo.model.Post;
import com.example.demo.model.User;
import com.example.demo.repo.CommentRepo;
import com.example.demo.repo.InterestedRepo;
import com.example.demo.service.AuthService;

import com.github.marlonlom.utilities.timeago.TimeAgo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;


@Mapper(componentModel = "spring")
public abstract class PostMapper {

    @Autowired
    private CommentRepo commentRepository;
    @Autowired
    private InterestedRepo interestedRepository;
    @Autowired
    private AuthService authService;


    @Mapping(target = "createdDate", expression = "java(java.time.Instant.now())")
    @Mapping(target = "description", source = "postRequest.description")
    @Mapping(target = "interests", constant = "0")
    @Mapping(target = "user", source = "user")
    public abstract Post map(PostRequest postRequest, User user);

    @Mapping(target = "id", source = "postId")
    @Mapping(target = "interestsCount", source = "interests")
    @Mapping(target = "userName", source = "user.username")
    @Mapping(target = "commentCount", expression = "java(commentCount(post))")
    @Mapping(target = "duration", expression = "java(getDuration(post))")
    @Mapping(target = "shownInterest", expression = "java(isPostInterested(post))")
    @Mapping(target = "videoUploaded", source = "videoUploaded")
    public abstract PostResponse mapToDto(Post post);

    Integer commentCount(Post post) {
        return commentRepository.findByPost(post).size();
    }

    String getDuration(Post post) {
        return TimeAgo.using(post.getCreatedDate().toEpochMilli());
    }

    boolean isPostInterested(Post post) {
        if (authService.isLoggedIn()) {
            Optional<Interested> voteForPostByUser =
                    interestedRepository.findTopByPostAndUserOrderByInterestedIdDesc(post,
                            authService.getCurrentUser());
            return voteForPostByUser.isPresent();
        }
        return false;
    }

}
