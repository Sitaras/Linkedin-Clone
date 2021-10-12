package com.example.demo.controller;

import com.example.demo.dto.MessageDto;
import com.example.demo.service.AuthService;
import com.example.demo.service.MessageService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/message/")
@AllArgsConstructor
public class MessageController {

    MessageService messageService;
    AuthService authService;

    @PostMapping()
    public ResponseEntity<Void> sendMessage(@RequestBody MessageDto messageDto){
        messageService.sendMessage(authService.getCurrentUser(), messageDto.getReceiverName(),messageDto.getText());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<MessageDto>> getUser(@PathVariable String username){
        List<MessageDto> messageDtoList = messageService.getMessages(authService.getCurrentUser(),username);
        return new ResponseEntity<>(messageDtoList,HttpStatus.OK);
    }

    @GetMapping("/contactlist")
    public ResponseEntity<List<String>> getContactList(){
        List<String> contactList = messageService.getContactList(authService.getCurrentUser());
        return new ResponseEntity<>(contactList,HttpStatus.OK);
    }
}
