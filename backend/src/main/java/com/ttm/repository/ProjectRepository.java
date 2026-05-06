package com.ttm.repository;

import com.ttm.entity.Project;
import com.ttm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByCreatedBy(User createdBy);

    @Query("SELECT p FROM Project p JOIN p.teamMembers m WHERE m.id = :userId")
    List<Project> findByTeamMemberId(@Param("userId") Long userId);

    @Query("SELECT COUNT(p) FROM Project p")
    long countAll();
}
