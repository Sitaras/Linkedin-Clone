package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import java.time.Instant;

import static javax.persistence.FetchType.LAZY;
import static javax.persistence.GenerationType.IDENTITY;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class JobApplication {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long jobApplicationId;
    @NotNull
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "jobPostId", referencedColumnName = "jobPostId")
    private JobPost jobPost;
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private User user;
    private String applicationText;
    private Instant createdDate;
}
