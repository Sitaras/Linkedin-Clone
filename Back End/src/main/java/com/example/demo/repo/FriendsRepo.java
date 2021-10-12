package com.example.demo.repo;

import com.example.demo.model.Friends;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FriendsRepo extends JpaRepository<Friends, Long> {
    List<Friends> findAllByUser1OrUser2AndPendingRequest(User user1, User user2, boolean pendingRequest);
    Optional<Friends> findByIdentifierAndPendingRequestAndSentRequestName(String identifier,boolean pendingRequest,String senderName);
    Optional<Friends> findByIdentifier(String identifier);
    void deleteByFriendsId(Long id);
}
