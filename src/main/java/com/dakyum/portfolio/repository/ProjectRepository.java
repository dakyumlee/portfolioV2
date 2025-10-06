package com.dakyum.portfolio.repository;

import com.dakyum.portfolio.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByActiveTrueOrderByDisplayOrderAscCreatedAtDesc();
    List<Project> findAllByOrderByDisplayOrderAscCreatedAtDesc();
}
