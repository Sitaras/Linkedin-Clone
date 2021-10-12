package com.example.demo.controller;

import com.example.demo.dto.FriendsDto;
import com.example.demo.service.AuthService;
import com.example.demo.service.FriendsService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends/")
@AllArgsConstructor
public class FriendsController {

    FriendsService friendsService;
    AuthService authService;

    @PostMapping("/request/{receiver}")
    public ResponseEntity<Void> sendFriendRequest(@PathVariable String receiver){
        friendsService.sendFriendRequest(authService.getCurrentUser(),receiver);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/accept/{fromuser}")
    public ResponseEntity<Void> acceptFriendRequest(@PathVariable String fromuser){
        friendsService.acceptFriendRequest(authService.getCurrentUser(),fromuser);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/decline/{fromuser}")
    public ResponseEntity<Void> declineFriendRequest(@PathVariable String fromuser){
        friendsService.declineFriendRequest(authService.getCurrentUser(),fromuser);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/cancel/{fromuser}")
    public ResponseEntity<Void> cancelFriendRequest(@PathVariable String fromuser){
        friendsService.cancelFriendRequest(authService.getCurrentUser(),fromuser);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{withuser}")
    public ResponseEntity<FriendsDto> getFriendshipStatus(@PathVariable String withuser){
        FriendsDto friendship = friendsService.findFriendshipStatus(authService.getCurrentUser(),withuser);
        return new ResponseEntity<>(friendship,HttpStatus.OK);
    }

    @GetMapping("/requests")
    public ResponseEntity<List<String>> getFriendRequests(){
        List<String> requestList = friendsService.getFriendRequests(authService.getCurrentUser());
        return new ResponseEntity<>(requestList,HttpStatus.OK);
    }

    @GetMapping("/all/{ofuser}")
    public ResponseEntity<List<String>> getFriendRequests(@PathVariable String ofuser){
        List<String> requestList = friendsService.getFriendsOfUser(ofuser);
        return new ResponseEntity<>(requestList,HttpStatus.OK);
    }

}
