package com.ttm.controller;

import com.ttm.dto.request.StatusUpdateRequest;
import com.ttm.dto.request.TaskRequest;
import com.ttm.dto.response.ApiResponse;
import com.ttm.dto.response.TaskResponse;
import com.ttm.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @Valid @RequestBody TaskRequest request, Authentication authentication) {
        TaskResponse response = taskService.createTask(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Task created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks(Authentication authentication) {
        List<TaskResponse> tasks = taskService.getAllTasks(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(
            @PathVariable Long id, Authentication authentication) {
        TaskResponse task = taskService.getTaskById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id, @Valid @RequestBody TaskRequest request, Authentication authentication) {
        TaskResponse response = taskService.updateTask(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long id, Authentication authentication) {
        taskService.deleteTask(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTaskStatus(
            @PathVariable Long id, @Valid @RequestBody StatusUpdateRequest request, Authentication authentication) {
        TaskResponse response = taskService.updateTaskStatus(id, request.getStatus(), authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Task status updated successfully", response));
    }
}
