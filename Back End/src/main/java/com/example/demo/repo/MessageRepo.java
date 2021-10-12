package com.example.demo.repo;

import com.example.demo.model.Message;
import com.example.demo.model.Notification;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepo extends JpaRepository<Message, Long> {
    List<Message> findAllBySenderOrReceiverOrderByMessageIdDesc(User sender, User receiver);
    List<Message> findAllByIdentifierOrderByMessageId(String identifier);
}
