package com.example.location.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PropertyTypeResponse {


    private Long id;

    private String name;

    private Long areaId;

    private String areaName;

    private Boolean enabled;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


}