package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.AuthService;
import com.example.demo.service.UserDetailsServiceImpl;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/")
@AllArgsConstructor
@Slf4j
public class UserController {

    UserDetailsServiceImpl userService;
    AuthService authService;

    @PostMapping("/updateworkingexperience")
    public ResponseEntity<Void> updateWorkingExperience(@RequestBody UpdateBio bio){
        userService.updateWorkingExperience(bio.getWorkingExperience(), bio.getUserName());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    @PostMapping("/updateskills")
    public ResponseEntity<Void> updateSkills(@RequestBody UpdateBio bio){
        userService.updateSkills(bio.getSkills(), bio.getUserName());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    @PostMapping("/updateeducation")
    public ResponseEntity<Void> updateEducation(@RequestBody UpdateBio bio){
        userService.updateEducation(bio.getEducation(), bio.getUserName());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/info-privacy/workingexperience")
    public ResponseEntity<Void> setWorkingExperiencePrivacy(@RequestBody boolean privacy){
        userService.setWorkingExperiencePrivacy(privacy, authService.getCurrentUser().getUsername());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/info-privacy/education")
    public ResponseEntity<Void> setEducationPrivacy(@RequestBody boolean privacy){
        userService.setEducationPrivacy(privacy, authService.getCurrentUser().getUsername());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/info-privacy/skills")
    public ResponseEntity<Void> setSkillsPrivacy(@RequestBody boolean privacy){
        userService.setSkillsPrivacy(privacy, authService.getCurrentUser().getUsername());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<UserDto> getUser(){
        UserDto user = userService.getUserInfo();
        return new ResponseEntity<UserDto>(user,HttpStatus.OK);
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserDto> getUser(@PathVariable String username){
        UserDto user = userService.getUserInfo(username);
        return new ResponseEntity<UserDto>(user,HttpStatus.OK);
    }

    @GetMapping("/network")
    public ResponseEntity<List<UserDto>> getNetwork(){
        List<UserDto> user = userService.getNetwork();
        return new ResponseEntity<List<UserDto>>(user,HttpStatus.OK);
    }

    @GetMapping("/network/{username}")
    public ResponseEntity<List<UserDto>> getNetworkOfUser(@PathVariable String username){
        List<UserDto> user = userService.getNetworkOfUser(username);
        return new ResponseEntity<List<UserDto>>(user,HttpStatus.OK);
    }


    @PostMapping("/updateprofilepic")
    public ResponseEntity<Void> updateProfPic(@RequestBody UpdateBio bio){
        userService.updateProfilePic(bio.getSkills(), bio.getUserName());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/changeusername")
    public ResponseEntity<Void> changeUsername(@RequestBody ChangeUsername user){
        userService.updateUsername(user.getOldUserName(), user.getNewUserName());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/changeemail")
    public ResponseEntity<Void> changeEmail(@RequestBody ChangeEmail email){
        userService.updateEmail(email.getOldEmail(), email.getNewEmail());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/changepassword")
    public ResponseEntity<Void> changePassword(@RequestBody ChangePassword newPass){
        authService.updatePassword(newPass.getNewPassword());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/searchuser/{username}")
    public ResponseEntity<List<String>> searchUser(@PathVariable String username){
        List<String> userList = userService.searchUser(username);
        return new ResponseEntity<>(userList,HttpStatus.OK);
    }

}
