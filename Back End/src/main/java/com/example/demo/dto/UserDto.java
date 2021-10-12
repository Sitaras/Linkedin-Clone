package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    private Long userId;
    private String username;
    private String email;
    private String phone;
    private String imageUrl;
    private boolean admin;
    private String workingExperience;
    private String education;
    private String skills;
    private boolean publicWorkingExperience;
    private boolean publicEducation;
    private boolean publicSkills;
}
