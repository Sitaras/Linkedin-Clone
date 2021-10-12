package com.example.demo.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import java.time.Instant;

import static javax.persistence.FetchType.LAZY;
import static javax.persistence.GenerationType.IDENTITY;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long messageId;
    private String identifier;
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "receiver_id")
    private User receiver;
    private String text;
    private Instant createdDate;
}
