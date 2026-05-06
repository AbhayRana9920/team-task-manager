package com.ttm.service;

import com.ttm.dto.request.ProjectRequest;
import com.ttm.dto.response.ProjectResponse;
import com.ttm.dto.response.UserResponse;
import com.ttm.entity.Project;
import com.ttm.entity.User;
import com.ttm.enums.Role;
import com.ttm.exception.BadRequestException;
import com.ttm.exception.ResourceNotFoundException;
import com.ttm.exception.UnauthorizedException;
import com.ttm.repository.ProjectRepository;
import com.ttm.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ProjectResponse createProject(ProjectRequest request, String email) {
        User user = getUserByEmail(email);
        checkAdmin(user);

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .createdBy(user)
                .build();

        // Add creator as team member
        project.getTeamMembers().add(user);
        project = projectRepository.save(project);
        return mapToResponse(project);
    }

    public List<ProjectResponse> getAllProjects(String email) {
        User user = getUserByEmail(email);

        List<Project> projects;
        if (user.getRole() == Role.ADMIN) {
            projects = projectRepository.findAll();
        } else {
            projects = projectRepository.findByTeamMemberId(user.getId());
        }

        return projects.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(Long id, String email) {
        User user = getUserByEmail(email);
        Project project = getProjectEntity(id);

        if (user.getRole() != Role.ADMIN && !project.getTeamMembers().contains(user)) {
            throw new UnauthorizedException("You are not a member of this project");
        }

        return mapToResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request, String email) {
        User user = getUserByEmail(email);
        checkAdmin(user);

        Project project = getProjectEntity(id);
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project = projectRepository.save(project);
        return mapToResponse(project);
    }

    @Transactional
    public void deleteProject(Long id, String email) {
        User user = getUserByEmail(email);
        checkAdmin(user);

        Project project = getProjectEntity(id);
        projectRepository.delete(project);
    }

    @Transactional
    public ProjectResponse addMember(Long projectId, Long userId, String email) {
        User admin = getUserByEmail(email);
        checkAdmin(admin);

        Project project = getProjectEntity(projectId);
        User member = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (project.getTeamMembers().contains(member)) {
            throw new BadRequestException("User is already a member of this project");
        }

        project.getTeamMembers().add(member);
        project = projectRepository.save(project);
        return mapToResponse(project);
    }

    @Transactional
    public ProjectResponse removeMember(Long projectId, Long userId, String email) {
        User admin = getUserByEmail(email);
        checkAdmin(admin);

        Project project = getProjectEntity(projectId);
        User member = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!project.getTeamMembers().contains(member)) {
            throw new BadRequestException("User is not a member of this project");
        }

        project.getTeamMembers().remove(member);
        project = projectRepository.save(project);
        return mapToResponse(project);
    }

    public Project getProjectEntity(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
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

    private ProjectResponse mapToResponse(Project project) {
        List<UserResponse> members = project.getTeamMembers().stream()
                .map(AuthService::mapToUserResponse)
                .collect(Collectors.toList());

        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .createdBy(AuthService.mapToUserResponse(project.getCreatedBy()))
                .teamMembers(members)
                .taskCount(project.getTasks() != null ? project.getTasks().size() : 0)
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
