package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobPostResponse {
    private Long id;
    private String jobPostName;
    private String companyName;
    private String salary;
    private String skills;
    private String benefits;
    private String otherInfo;
    private String userName;
    private String duration;
    private Integer applies;
}
