package com.example.property.image;

import lombok.*;

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