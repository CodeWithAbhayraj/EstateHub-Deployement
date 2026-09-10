package com.example.favorite.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class FavoriteResponse {

    private Long id;

    private Long buyerId;

    private Long propertyId;

    private LocalDateTime createdAt;
}

