package com.ttm.repository;

import com.ttm.entity.Task;
import com.ttm.enums.TaskPriority;
import com.ttm.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectId(Long projectId);

    List<Task> findByAssignedToId(Long userId);

    long countByStatus(TaskStatus status);

    long countByPriority(TaskPriority priority);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.dueDate < :today AND t.status <> 'COMPLETED'")
    long countOverdue(@Param("today") LocalDate today);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedTo.id = :userId AND t.status = :status")
    long countByAssignedToIdAndStatus(@Param("userId") Long userId, @Param("status") TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedTo.id = :userId")
    long countByAssignedToId(@Param("userId") Long userId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedTo.id = :userId AND t.dueDate < :today AND t.status <> 'COMPLETED'")
    long countOverdueByAssignedToId(@Param("userId") Long userId, @Param("today") LocalDate today);

    @Query("SELECT t FROM Task t WHERE t.project.id IN :projectIds")
    List<Task> findByProjectIdIn(@Param("projectIds") List<Long> projectIds);
}
