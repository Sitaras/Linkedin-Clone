package com.example.demo.service;

import com.example.demo.dto.InterestedDto;
import com.example.demo.dto.UnInterestedDto;
import com.example.demo.exception.GeneralError;
import com.example.demo.exception.PostNotFoundException;
import com.example.demo.model.Interested;
import com.example.demo.model.Post;
import com.example.demo.repo.InterestedRepo;
import com.example.demo.repo.PostRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class InterestedService {

    private final InterestedRepo interestedRepository;
    private final PostRepo postRepository;
    private final AuthService authService;
    private final NotificationService notificationService;

    @Transactional
    public void vote(InterestedDto interestedDto) {
        Post post = postRepository.findById(interestedDto.getPostId())
                .orElseThrow(() -> new PostNotFoundException("Post Not Found with ID - " + interestedDto.getPostId()));
        Optional<Interested> voteByPostAndUser = interestedRepository.findByPostAndUser(post, authService.getCurrentUser());
        if (voteByPostAndUser.isPresent()) {
            throw new GeneralError("You have already shown interest for this post");
        }

        post.setInterests(post.getInterests()+1);
        interestedRepository.save(mapToVote(interestedDto, post));
        postRepository.save(post);
        notificationService.notify(post,authService.getCurrentUser(),false);
    }

    @Transactional(readOnly = true)
    public List<String> getAllInterests(Long postId){
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post Not Found with ID - " + postId));
        List<Interested> interestedList= interestedRepository.findAllByPost(post);
        List<String> nameList = new LinkedList<>();
        for(Interested interested: interestedList){
            nameList.add(interested.getUser().getUsername());
        }
        return nameList;
    }

    private Interested mapToVote(InterestedDto interestedDto, Post post) {
        return Interested.builder()
                .post(post)
                .user(authService.getCurrentUser())
                .build();
    }

    @Transactional
    public void delVote(InterestedDto unInterestedDto) {
        Post post = postRepository.findById(unInterestedDto.getPostId())
                .orElseThrow(() -> new PostNotFoundException("Post Not Found with ID - " + unInterestedDto.getPostId()));
        post.setInterests(post.getInterests()-1);
        interestedRepository.deleteByPostAndUser(post, authService.getCurrentUser());
        postRepository.save(post);
    }
}
