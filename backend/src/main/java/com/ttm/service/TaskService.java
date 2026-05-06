package com.ttm.service;

import com.ttm.dto.request.TaskRequest;
import com.ttm.dto.response.TaskResponse;
import com.ttm.entity.Project;
import com.ttm.entity.Task;
import com.ttm.entity.User;
import com.ttm.enums.Role;
import com.ttm.enums.TaskPriority;
import com.ttm.enums.TaskStatus;
import com.ttm.exception.BadRequestException;
import com.ttm.exception.ResourceNotFoundException;
import com.ttm.exception.UnauthorizedException;
import com.ttm.repository.TaskRepository;
import com.ttm.repository.ProjectRepository;
import com.ttm.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository,
                       UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TaskResponse createTask(TaskRequest request, String email) {
        User creator = getUserByEmail(email);
        checkAdmin(creator);

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));

        TaskStatus status = parseStatus(request.getStatus());
        TaskPriority priority = parsePriority(request.getPriority());
        LocalDate dueDate = LocalDate.parse(request.getDueDate());

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(status)
                .priority(priority)
                .dueDate(dueDate)
                .project(project)
                .createdBy(creator)
                .build();

        if (request.getAssignedToId() != null) {
            User assignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));

            if (!project.getTeamMembers().contains(assignee)) {
                throw new BadRequestException("Assigned user must be a member of the project");
            }
            task.setAssignedTo(assignee);
        }

        task = taskRepository.save(task);
        return mapToResponse(task);
    }

    public List<TaskResponse> getAllTasks(String email) {
        User user = getUserByEmail(email);

        List<Task> tasks;
        if (user.getRole() == Role.ADMIN) {
            tasks = taskRepository.findAll();
        } else {
            tasks = taskRepository.findByAssignedToId(user.getId());
        }

        return tasks.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long id, String email) {
        User user = getUserByEmail(email);
        Task task = getTaskEntity(id);

        if (user.getRole() != Role.ADMIN &&
            (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(user.getId()))) {
            throw new UnauthorizedException("You can only view tasks assigned to you");
        }

        return mapToResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request, String email) {
        User user = getUserByEmail(email);
        checkAdmin(user);

        Task task = getTaskEntity(id);
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(parseStatus(request.getStatus()));
        task.setPriority(parsePriority(request.getPriority()));
        task.setDueDate(LocalDate.parse(request.getDueDate()));
        task.setProject(project);

        if (request.getAssignedToId() != null) {
            User assignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));
            if (!project.getTeamMembers().contains(assignee)) {
                throw new BadRequestException("Assigned user must be a member of the project");
            }
            task.setAssignedTo(assignee);
        } else {
            task.setAssignedTo(null);
        }

        task = taskRepository.save(task);
        return mapToResponse(task);
    }

    @Transactional
    public void deleteTask(Long id, String email) {
        User user = getUserByEmail(email);
        checkAdmin(user);

        Task task = getTaskEntity(id);
        taskRepository.delete(task);
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long id, String status, String email) {
        User user = getUserByEmail(email);
        Task task = getTaskEntity(id);

        // Admin can update any task status. Member can only update their own.
        if (user.getRole() != Role.ADMIN) {
            if (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(user.getId())) {
                throw new UnauthorizedException("You can only update the status of tasks assigned to you");
            }
        }

        task.setStatus(parseStatus(status));
        task = taskRepository.save(task);
        return mapToResponse(task);
    }

    private Task getTaskEntity(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void checkAdmin(User user) {
        if (user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only admins can perform this action");
        }
    }

    private TaskStatus parseStatus(String status) {
        try {
            return TaskStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + status + ". Must be TODO, IN_PROGRESS, or COMPLETED");
        }
    }

    private TaskPriority parsePriority(String priority) {
        try {
            return TaskPriority.valueOf(priority.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid priority: " + priority + ". Must be LOW, MEDIUM, or HIGH");
        }
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus().name())
                .priority(task.getPriority().name())
                .dueDate(task.getDueDate())
                .projectId(task.getProject().getId())
                .projectName(task.getProject().getName())
                .assignedTo(task.getAssignedTo() != null ? AuthService.mapToUserResponse(task.getAssignedTo()) : null)
                .createdBy(AuthService.mapToUserResponse(task.getCreatedBy()))
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
