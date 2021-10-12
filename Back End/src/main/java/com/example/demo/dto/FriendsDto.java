package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FriendsDto {
    private Long friendsId;
    private String identifier;
    private String user1Name;
    private String user2Name;
    private boolean pendingRequest;
    private String sentRequestName;
    private boolean exists;
}
