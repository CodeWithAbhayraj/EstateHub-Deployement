package com.example.location.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CityResponse {

    private Long id;

    private String name;

    private Boolean enabled;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}