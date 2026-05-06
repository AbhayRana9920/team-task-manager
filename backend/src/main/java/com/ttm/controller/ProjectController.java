package com.ttm.controller;

import com.ttm.dto.request.ProjectRequest;
import com.ttm.dto.response.ApiResponse;
import com.ttm.dto.response.ProjectResponse;
import com.ttm.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @Valid @RequestBody ProjectRequest request, Authentication authentication) {
        ProjectResponse response = projectService.createProject(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Project created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getAllProjects(Authentication authentication) {
        List<ProjectResponse> projects = projectService.getAllProjects(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(
            @PathVariable Long id, Authentication authentication) {
        ProjectResponse project = projectService.getProjectById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(project));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @PathVariable Long id, @Valid @RequestBody ProjectRequest request, Authentication authentication) {
        ProjectResponse response = projectService.updateProject(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @PathVariable Long id, Authentication authentication) {
        projectService.deleteProject(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }

    @PostMapping("/{projectId}/members/{userId}")
    public ResponseEntity<ApiResponse<ProjectResponse>> addMember(
            @PathVariable Long projectId, @PathVariable Long userId, Authentication authentication) {
        ProjectResponse response = projectService.addMember(projectId, userId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Member added successfully", response));
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<ApiResponse<ProjectResponse>> removeMember(
            @PathVariable Long projectId, @PathVariable Long userId, Authentication authentication) {
        ProjectResponse response = projectService.removeMember(projectId, userId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Member removed successfully", response));
    }
}
