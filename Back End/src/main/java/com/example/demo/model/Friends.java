package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import static javax.persistence.FetchType.LAZY;
import static javax.persistence.GenerationType.IDENTITY;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Friends {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long friendsId;
    private String identifier;
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "user1_id")
    private User user1;
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "user2_id")
    private User user2;
    private boolean pendingRequest;
    private String sentRequestName;
}
