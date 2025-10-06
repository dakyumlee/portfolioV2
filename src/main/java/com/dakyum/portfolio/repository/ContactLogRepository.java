package com.dakyum.portfolio.repository;

import com.dakyum.portfolio.entity.ContactLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContactLogRepository extends JpaRepository<ContactLog, Long> {
    List<ContactLog> findAllByOrderByCreatedAtDesc();
    
    @Query("SELECT COUNT(c) FROM ContactLog c WHERE c.createdAt >= :startDate")
    long countByCreatedAtAfter(LocalDateTime startDate);
    
    @Query("SELECT c FROM ContactLog c WHERE c.processed = false ORDER BY c.createdAt DESC")
    List<ContactLog> findUnprocessed();
}
