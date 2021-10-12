package com.example.demo.service;


import com.example.demo.dto.UserDto;
import com.example.demo.exception.GeneralError;
import com.example.demo.model.User;
import com.example.demo.repo.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static java.util.Collections.singletonList;

@Service
@AllArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepo userRepository;

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) SecurityContextHolder.
                getContext().getAuthentication().getPrincipal();
        return userRepository.findByUsername(principal.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User name not found - " + principal.getUsername()));
    }


    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        User user = userOptional
                .orElseThrow(() -> new UsernameNotFoundException("No user " +
                        "Found with username : " + username));

        return new org.springframework.security
                .core.userdetails.User(user.getUsername(), user.getPassword(),
                user.isEnabled(), true, true,
                true, getAuthorities("USER"));
    }

    private Collection<? extends GrantedAuthority> getAuthorities(String role) {
        return singletonList(new SimpleGrantedAuthority(role));
    }

    @Transactional
    public void updateWorkingExperience(String workingExperience,String userName){
        Optional<User> userOptional = userRepository.findByUsername(userName);
        User user = userOptional.orElseThrow(() -> new UsernameNotFoundException("No user " +
                "Found with username : " + userName));


        user.setWorkingExperience(workingExperience);
        userRepository.save(user);
    }

    @Transactional
    public void updateSkills(String skills,String userName){
        Optional<User> userOptional = userRepository.findByUsername(userName);
        User user = userOptional.orElseThrow(() -> new UsernameNotFoundException("No user " +
                "Found with username : " + userName));


        user.setSkills(skills);
        userRepository.save(user);
    }

    @Transactional
    public void updateEducation(String education,String userName){
        Optional<User> userOptional = userRepository.findByUsername(userName);
        User user = userOptional.orElseThrow(() -> new UsernameNotFoundException("No user " +
                "Found with username : " + userName));


        user.setEducation(education);
        userRepository.save(user);
    }

    @Transactional
    public void setEducationPrivacy(boolean privacy,String userName){
        Optional<User> userOptional = userRepository.findByUsername(userName);
        User user = userOptional.orElseThrow(() -> new UsernameNotFoundException("No user " +
                "Found with username : " + userName));


        user.setPublicEducation(privacy);
        userRepository.save(user);
    }

    @Transactional
    public void setSkillsPrivacy(boolean privacy,String userName){
        Optional<User> userOptional = userRepository.findByUsername(userName);
        User user = userOptional.orElseThrow(() -> new UsernameNotFoundException("No user " +
                "Found with username : " + userName));


        user.setPublicSkills(privacy);
        userRepository.save(user);
    }

    @Transactional
    public void setWorkingExperiencePrivacy(boolean privacy,String userName){
        Optional<User> userOptional = userRepository.findByUsername(userName);
        User user = userOptional.orElseThrow(() -> new UsernameNotFoundException("No user " +
                "Found with username : " + userName));


        user.setPublicWorkingExperience(privacy);
        userRepository.save(user);
    }

    @Transactional
    public UserDto getUserInfo(){

        User u = getCurrentUser();
        UserDto temp = new UserDto(u.getUserId(),u.getUsername(),u.getEmail(),u.getPhone(),u.getImageUrl(),u.isAdmin(),u.getWorkingExperience(),u.getEducation(),
                u.getSkills(),u.isPublicWorkingExperience(),u.isPublicEducation(),u.isPublicSkills());

        return temp;
    }

    @Transactional
    public UserDto getUserInfo(String userName){

        Optional<User>  userOptional = userRepository.findByUsername(userName);
        User u = userOptional
                .orElseThrow(() -> new UsernameNotFoundException("No user " +
                        "Found with username : " + userName));
        UserDto temp = new UserDto(u.getUserId(),u.getUsername(),u.getEmail(),u.getPhone(),u.getImageUrl(),u.isAdmin(),u.getWorkingExperience(),u.getEducation(),
                u.getSkills(),u.isPublicWorkingExperience(),u.isPublicEducation(),u.isPublicSkills());

        return temp;
    }

    @Transactional(readOnly = true)
    public List<UserDto> getNetwork(){
        List<User> allUsers = userRepository.findAll();
        List<UserDto> network = new ArrayList<>();
        User currUser = getCurrentUser();
        for(User u:allUsers){
            if(!u.getUserId().equals(currUser.getUserId())){
                UserDto temp = new UserDto(u.getUserId(),u.getUsername(),u.getEmail(),u.getPhone(),u.getImageUrl(),u.isAdmin(),u.getWorkingExperience(),u.getEducation(),
                        u.getSkills(),u.isPublicWorkingExperience(),u.isPublicEducation(),u.isPublicSkills());
                network.add(temp);
            }
        }
        return network;
    }

    @Transactional(readOnly = true)
    public List<UserDto> getNetworkOfUser(String username){
        List<User> allUsers = userRepository.findAll();
        List<UserDto> network = new ArrayList<>();
        for(User u:allUsers){
            if(!u.getUsername().equals(username)){
                UserDto temp = new UserDto(u.getUserId(),u.getUsername(),u.getEmail(),u.getPhone(),u.getImageUrl(),u.isAdmin(),u.getWorkingExperience(),u.getEducation(),
                        u.getSkills(),u.isPublicWorkingExperience(),u.isPublicEducation(),u.isPublicSkills());
                network.add(temp);
            }
        }
        return network;
    }

    @Transactional
    public void updateProfilePic(String picUrl,String userName){
        Optional<User> userOptional = userRepository.findByUsername(userName);
        User user = userOptional.orElseThrow(() -> new UsernameNotFoundException("No user " +
                "Found with username : " + userName));


        user.setImageUrl(picUrl);
        userRepository.save(user);
    }

    @Transactional
    public void updateUsername(String oldUserName,String newUserName){
        Optional<User> userOptional = userRepository.findByUsername(oldUserName);
        User user = userOptional.orElseThrow(() -> new UsernameNotFoundException("No user " +
                "Found with username : " + oldUserName));
        Optional<User> alreadyExistsUser = userRepository.findByUsername(newUserName);
        if(alreadyExistsUser.isPresent()){
            throw new GeneralError("Username already taken");
        }

        user.setUsername(newUserName);
        userRepository.save(user);
    }

    @Transactional
    public void updateEmail(String oldEmail, String newEmail) {
        User user = getCurrentUser();
        User alreadyExistsUser = userRepository.findByEmail(newEmail);
        if(alreadyExistsUser!=null){
            throw new GeneralError("Email already taken");
        }
        user.setEmail(newEmail);
        userRepository.save(user);
    }

    @Transactional
    public List<String> searchUser(String username){
        List<User> userList = userRepository.findAllByUsernameContains(username);
        List<String> nameList = new LinkedList<>();
        for(User u:userList){
            nameList.add(u.getUsername());
        }
        return nameList;
    }


}
