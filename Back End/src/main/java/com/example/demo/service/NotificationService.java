package com.example.demo.service;

import com.example.demo.dto.NotificationDto;
import com.example.demo.model.*;
import com.example.demo.repo.NotificationRepo;
import com.github.marlonlom.utilities.timeago.TimeAgo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class NotificationService {

    NotificationRepo notificationRepository;

    public void notify(Post post, User currentUser, boolean commented){
        notificationRepository.save(mapToNotification(post,currentUser,commented));
    }

    public List<NotificationDto> getNotificationsOfUser(String username){
        return notificationRepository.findAllByPostUserUsernameOrderByNotificationIdDesc(username)
                .stream()
                .map(NotificationService::mapToDto)
                .collect(toList());
    }

    private Notification mapToNotification(Post post, User currentUser, boolean commented) {
        return Notification.builder()
                .user(currentUser)
                .post(post)
                .commented(commented)
                .createdDate(java.time.Instant.now())
                .build();
    }

    private static NotificationDto mapToDto(Notification notification){
        return NotificationDto.builder()
                .userName(notification.getUser().getUsername())
                .postId(notification.getPost().getPostId())
                .commented(notification.isCommented())
                .duration(getDuration(notification))
                .build();
    }

    static String getDuration(Notification notification) {
        return TimeAgo.using(notification.getCreatedDate().toEpochMilli());
    }
}
