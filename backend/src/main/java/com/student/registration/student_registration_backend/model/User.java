package com.student.registration.student_registration_backend.model;

import lombok.Data;

@Data // This annotation from Lombok automatically generates getters, setters, and other methods.
public class User {

    private Long id;

    private String name;
    private String email;
    private String course;
    private String studentClass;
    private Double percentage;
    private String branch;
    private String mobileNumber;
}
