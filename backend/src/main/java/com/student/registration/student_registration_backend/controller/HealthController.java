package com.student.registration.student_registration_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/")
    public ResponseEntity<String> root() {
        return ResponseEntity.ok("EasyCRUD Backend is running!");
    }
} 