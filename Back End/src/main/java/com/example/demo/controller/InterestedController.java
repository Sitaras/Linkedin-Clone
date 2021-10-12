package com.example.demo.controller;


import com.example.demo.dto.InterestedDto;
import com.example.demo.service.InterestedService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interested/")
@AllArgsConstructor
public class InterestedController {

    private final InterestedService interestedService;

    @PostMapping
    public ResponseEntity<String> interested(@RequestBody InterestedDto interestedDto) {
        interestedService.vote(interestedDto);
        return new ResponseEntity<>("Post was liked successfully",HttpStatus.OK);
    }

    @PostMapping("/delete")
    public ResponseEntity<String> uninterested(@RequestBody InterestedDto unInterestedDto) {
        interestedService.delVote(unInterestedDto);
        return new ResponseEntity<>("Post was unliked successfully",HttpStatus.OK);
    }

    @GetMapping("/{postid}")
    public ResponseEntity<List<String>> getAllInterested(@PathVariable Long postid) {
        List<String> nameList = interestedService.getAllInterests(postid);
        return new ResponseEntity<>(nameList,HttpStatus.OK);
    }
}
