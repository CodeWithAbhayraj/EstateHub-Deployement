package com.example.property.image;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyImageResponse {

    private Long id;

    private Long propertyId;

    private String imageUrl;

    private String publicId;

    private LocalDateTime createdAt;
}