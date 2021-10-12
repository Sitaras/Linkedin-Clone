package com.example.demo.controller;


import com.example.demo.dto.NotificationDto;
import com.example.demo.service.AuthService;
import com.example.demo.service.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications/")
@AllArgsConstructor
public class NotificationController {

    NotificationService notificationService;
    AuthService authService;

    @GetMapping()
    public ResponseEntity<List<NotificationDto>> getUser(){
        List<NotificationDto> notificationDtoList = notificationService.getNotificationsOfUser(authService.getCurrentUser().getUsername());
        return new ResponseEntity<>(notificationDtoList,HttpStatus.OK);
    }
}
