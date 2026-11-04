package com.student.registration.student_registration_backend.controller;

import com.student.registration.student_registration_backend.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api")
public class UserController {

    private final List<User> users = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        user.setId(idCounter.getAndIncrement());
        users.add(user);
        return user;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return new ArrayList<>(users);
    }

    // Delete user by ID
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        Optional<User> userToDelete = users.stream()
                .filter(user -> user.getId().equals(id))
                .findFirst();
        
        if (userToDelete.isPresent()) {
            users.remove(userToDelete.get());
            return ResponseEntity.ok("User deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
}
