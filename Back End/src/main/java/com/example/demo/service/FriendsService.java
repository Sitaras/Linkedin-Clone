package com.example.demo.service;

import com.example.demo.dto.FriendsDto;
import com.example.demo.dto.MessageDto;
import com.example.demo.exception.GeneralError;
import com.example.demo.model.Friends;
import com.example.demo.model.Message;
import com.example.demo.model.User;
import com.example.demo.repo.FriendsRepo;
import com.example.demo.repo.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class FriendsService {
    FriendsRepo friendsRepository;
    UserRepo userRepository;

    @Transactional
    public void sendFriendRequest(User sender, String receiverName){
        User receiver = userRepository.findByUsername(receiverName)
                .orElseThrow(() -> new UsernameNotFoundException("No user " +
                        "Found with username : " + receiverName));
        String identifier = String.valueOf(Math.min(receiver.getUserId(),sender.getUserId()))+'-'+String.valueOf(Math.max(receiver.getUserId(),sender.getUserId()));
        friendsRepository.save(mapToFriends(sender,receiver,identifier,true,sender.getUsername()));
    }

    @Transactional
    public void acceptFriendRequest(User accepter,String user2Name){
        User user2 = userRepository.findByUsername(user2Name)
                .orElseThrow(() -> new UsernameNotFoundException("No user " +
                        "Found with username : " + user2Name));
        String identifier = String.valueOf(Math.min(accepter.getUserId(),user2.getUserId()))+'-'+String.valueOf(Math.max(accepter.getUserId(),user2.getUserId()));
        Friends friendship = friendsRepository.findByIdentifierAndPendingRequestAndSentRequestName(identifier,true,user2Name)
                .orElseThrow(() -> new GeneralError("User: " + user2Name+ "has not sent friend request to  : " + accepter.getUsername()));
        friendship.setPendingRequest(false);
        friendship.setSentRequestName(null);
        friendsRepository.save(friendship);
    }

    @Transactional
    public FriendsDto findFriendshipStatus(User user1, String user2Name){
        User user2 = userRepository.findByUsername(user2Name)
                .orElseThrow(() -> new UsernameNotFoundException("No user " +  "Found with username : " + user2Name));
        String identifier = String.valueOf(Math.min(user1.getUserId(),user2.getUserId()))+'-'+String.valueOf(Math.max(user1.getUserId(),user2.getUserId()));
        Optional<Friends> friendship = friendsRepository.findByIdentifier(identifier);
        if(!friendship.isPresent()){
            return mapToDto(null);
        }else{
            Friends friendsPresent = friendship .orElseThrow(() -> new GeneralError("Friendship does not exists"));
            return mapToDto(friendsPresent);
        }
    }

    @Transactional
    public List<String> getFriendsOfUser(String userName){
        User user = userRepository.findByUsername(userName)
                .orElseThrow(() -> new UsernameNotFoundException("No user " +  "Found with username : " + userName));
        List<Friends> requestList = friendsRepository.findAllByUser1OrUser2AndPendingRequest(user,user,false);
        List<String> userNameList = new LinkedList<>();
        for(Friends request: requestList){
            if(!request.isPendingRequest()){
                if(!request.getUser1().getUsername().equals(user.getUsername())){
                    userNameList.add(request.getUser1().getUsername());
                }else{
                    userNameList.add(request.getUser2().getUsername());
                }
            }
        }
        return userNameList;
    }

    @Transactional
    public void cancelFriendRequest(User user1, String user2Name){
        User user2 = userRepository.findByUsername(user2Name)
                .orElseThrow(() -> new UsernameNotFoundException("No user " +
                        "Found with username : " + user2Name));
        String identifier = String.valueOf(Math.min(user1.getUserId(),user2.getUserId()))+'-'+String.valueOf(Math.max(user1.getUserId(),user2.getUserId()));
        Friends friendship = friendsRepository.findByIdentifierAndPendingRequestAndSentRequestName(identifier,true,user1.getUsername())
                .orElseThrow(() -> new GeneralError("User: " + user2Name+ "has not sent friend request to  : " + user1.getUsername()));
        if(friendship.isPendingRequest() && friendship.getSentRequestName().equals(user1.getUsername())){
            friendsRepository.deleteByFriendsId(friendship.getFriendsId());
        }else{
            throw new GeneralError("You have not a pending friend request with user: "+ user2Name);
        }
    }

    @Transactional
    public void declineFriendRequest(User user1, String user2Name){
        User user2 = userRepository.findByUsername(user2Name)
                .orElseThrow(() -> new UsernameNotFoundException("No user " +
                        "Found with username : " + user2Name));
        String identifier = String.valueOf(Math.min(user1.getUserId(),user2.getUserId()))+'-'+String.valueOf(Math.max(user1.getUserId(),user2.getUserId()));
        Friends friendship = friendsRepository.findByIdentifierAndPendingRequestAndSentRequestName(identifier,true,user2Name)
                .orElseThrow(() -> new GeneralError("User: " + user2Name+ "has not sent friend request to  : " + user1.getUsername()));
        if(friendship.isPendingRequest() && friendship.getSentRequestName().equals(user2.getUsername())){
            friendsRepository.deleteByFriendsId(friendship.getFriendsId());
        }else{
            throw new GeneralError("You have not a pending friend request from user: "+ user2Name);
        }
    }

    public List<String> getFriendRequests(User currentUser){
        List<Friends> requestList = friendsRepository.findAllByUser1OrUser2AndPendingRequest(currentUser,currentUser,true);
        List<String> userNameList = new LinkedList<>();
        System.err.println(requestList);
        for(Friends request: requestList){
            if(request.isPendingRequest() && !request.getSentRequestName().equals(currentUser.getUsername())){
                userNameList.add(request.getSentRequestName());
            }
        }
        return userNameList;
    }


    private Friends mapToFriends(User sender, User receiver, String identifier, boolean pendingRequest, String senderName) {
        return Friends.builder()
                .user1(sender)
                .user2(receiver)
                .identifier(identifier)
                .pendingRequest(pendingRequest)
                .sentRequestName(senderName)
                .build();
    }

    private static FriendsDto mapToDto(Friends friendship){
        if(friendship==null){
            return FriendsDto.builder()
                    .exists(false)
                    .friendsId(-1L)
                    .identifier(null)
                    .user1Name(null)
                    .user2Name(null)
                    .pendingRequest(false)
                    .sentRequestName(null).build();
        }
        return FriendsDto.builder()
                .exists(true)
                .friendsId(friendship.getFriendsId())
                .identifier(friendship.getIdentifier())
                .user1Name(friendship.getUser1().getUsername())
                .user2Name(friendship.getUser2().getUsername())
                .pendingRequest(friendship.isPendingRequest())
                .sentRequestName(friendship.getSentRequestName()).build();
    }
}
