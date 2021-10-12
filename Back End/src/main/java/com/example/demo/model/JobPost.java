package com.example.demo.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.Instant;

import static javax.persistence.FetchType.LAZY;
import static javax.persistence.GenerationType.IDENTITY;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobPost {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long jobPostId;
    @NotBlank(message = "JobPost Name cannot be empty or Null")
    @Column(nullable = false)
    private String jobPostName;
    @Nullable
    @Lob
    private String companyName;
    @Nullable
    @Lob
    private String salary;
    @Nullable
    @Lob
    private String skills;
    @Nullable
    @Lob
    private String benefits;
    @Nullable
    @Lob
    private String otherInfo;
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "userId")
    private User user;
    private Instant createdDate;
}
