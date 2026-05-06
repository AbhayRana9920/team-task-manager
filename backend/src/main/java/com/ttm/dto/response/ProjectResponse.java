package com.ttm.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private UserResponse createdBy;
    private List<UserResponse> teamMembers;
    private int taskCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
