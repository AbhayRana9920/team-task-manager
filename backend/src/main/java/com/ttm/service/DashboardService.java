package com.ttm.service;

import com.ttm.dto.response.DashboardResponse;
import com.ttm.entity.User;
import com.ttm.enums.Role;
import com.ttm.enums.TaskPriority;
import com.ttm.enums.TaskStatus;
import com.ttm.exception.ResourceNotFoundException;
import com.ttm.exception.UnauthorizedException;
import com.ttm.repository.ProjectRepository;
import com.ttm.repository.TaskRepository;
import com.ttm.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public DashboardService(ProjectRepository projectRepository, TaskRepository taskRepository,
                            UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public DashboardResponse getAdminDashboard(String email) {
        User user = getUserByEmail(email);
        if (user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only admins can access the admin dashboard");
        }

        long totalProjects = projectRepository.countAll();
        long totalTasks = taskRepository.count();
        long completedTasks = taskRepository.countByStatus(TaskStatus.COMPLETED);
        long inProgressTasks = taskRepository.countByStatus(TaskStatus.IN_PROGRESS);
        long pendingTasks = taskRepository.countByStatus(TaskStatus.TODO);
        long overdueTasks = taskRepository.countOverdue(LocalDate.now());

        Map<String, Long> tasksByStatus = new HashMap<>();
        tasksByStatus.put("TODO", pendingTasks);
        tasksByStatus.put("IN_PROGRESS", inProgressTasks);
        tasksByStatus.put("COMPLETED", completedTasks);

        Map<String, Long> tasksByPriority = new HashMap<>();
        tasksByPriority.put("LOW", taskRepository.countByPriority(TaskPriority.LOW));
        tasksByPriority.put("MEDIUM", taskRepository.countByPriority(TaskPriority.MEDIUM));
        tasksByPriority.put("HIGH", taskRepository.countByPriority(TaskPriority.HIGH));

        return DashboardResponse.builder()
                .totalProjects(totalProjects)
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .pendingTasks(pendingTasks)
                .inProgressTasks(inProgressTasks)
                .overdueTasks(overdueTasks)
                .tasksByStatus(tasksByStatus)
                .tasksByPriority(tasksByPriority)
                .build();
    }

    public DashboardResponse getMemberDashboard(String email) {
        User user = getUserByEmail(email);

        long totalTasks = taskRepository.countByAssignedToId(user.getId());
        long completedTasks = taskRepository.countByAssignedToIdAndStatus(user.getId(), TaskStatus.COMPLETED);
        long inProgressTasks = taskRepository.countByAssignedToIdAndStatus(user.getId(), TaskStatus.IN_PROGRESS);
        long pendingTasks = taskRepository.countByAssignedToIdAndStatus(user.getId(), TaskStatus.TODO);
        long overdueTasks = taskRepository.countOverdueByAssignedToId(user.getId(), LocalDate.now());

        Map<String, Long> tasksByStatus = new HashMap<>();
        tasksByStatus.put("TODO", pendingTasks);
        tasksByStatus.put("IN_PROGRESS", inProgressTasks);
        tasksByStatus.put("COMPLETED", completedTasks);

        return DashboardResponse.builder()
                .totalProjects(0)
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .pendingTasks(pendingTasks)
                .inProgressTasks(inProgressTasks)
                .overdueTasks(overdueTasks)
                .tasksByStatus(tasksByStatus)
                .tasksByPriority(new HashMap<>())
                .build();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
