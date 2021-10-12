package com.example.demo.repo;

import com.example.demo.model.Notification;
import com.example.demo.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepo extends JpaRepository<Notification, Long> {
    List<Notification> findAllByPostUserUsernameOrderByNotificationIdDesc(String userName);
}
