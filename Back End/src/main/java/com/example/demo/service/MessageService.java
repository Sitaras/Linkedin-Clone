package com.example.demo.service;

import com.example.demo.dto.MessageDto;
import com.example.demo.model.Message;
import com.example.demo.model.User;
import com.example.demo.repo.MessageRepo;
import com.example.demo.repo.UserRepo;
import com.github.marlonlom.utilities.timeago.TimeAgo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class MessageService {

    MessageRepo messageRepository;
    UserRepo userRepo;

    public void sendMessage(User sender, String receiverName, String text){
        User receiver = userRepo.findByUsername(receiverName)
                .orElseThrow(() -> new UsernameNotFoundException("No user " +
                        "Found with username : " + receiverName));
        String identifier = String.valueOf(Math.min(receiver.getUserId(),sender.getUserId()))+'-'+String.valueOf(Math.max(receiver.getUserId(),sender.getUserId()));
        messageRepository.save(mapToMessage(sender,receiver,text,identifier));
    }

    public List<MessageDto> getMessages(User user1, String username2){
        User user2 = userRepo.findByUsername(username2)
                .orElseThrow(() -> new UsernameNotFoundException("No user " + "Found with username : " + username2));
        String identifier = String.valueOf(Math.min(user1.getUserId(),user2.getUserId()))+'-'+String.valueOf(Math.max(user1.getUserId(),user2.getUserId()));
        return messageRepository.findAllByIdentifierOrderByMessageId(identifier)
                .stream()
                .map(MessageService::mapToDto)
                .collect(toList());
    }

    public List<String> getContactList(User currentUser){
        List<String> contactList = new LinkedList<>();
        List<Message> messages = messageRepository.findAllBySenderOrReceiverOrderByMessageIdDesc(currentUser,currentUser);
        for(Message message: messages){
            if(message.getSender().getUsername().equals(currentUser.getUsername()) && !contactList.contains(message.getReceiver().getUsername())){
                contactList.add(message.getReceiver().getUsername());
            }
            else if(message.getReceiver().getUsername().equals(currentUser.getUsername()) && !contactList.contains(message.getSender().getUsername())){
                contactList.add(message.getSender().getUsername());
            }
        }
        return contactList;
    }


    private Message mapToMessage(User sender, User receiver, String text, String identifier) {
        return Message.builder()
                .sender(sender)
                .receiver(receiver)
                .identifier(identifier)
                .text(text)
                .createdDate(java.time.Instant.now())
                .build();
    }

    private static MessageDto mapToDto(Message message){
        return MessageDto.builder()
                .messageId(message.getMessageId())
                .identifier(message.getIdentifier())
                .senderName(message.getSender().getUsername())
                .receiverName(message.getReceiver().getUsername())
                .text(message.getText())
                .duration(getDuration(message))
                .build();
    }

    static String getDuration(Message message) {
        return TimeAgo.using(message.getCreatedDate().toEpochMilli());
    }
}
