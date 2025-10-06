package com.dakyum.portfolio.controller;

import com.dakyum.portfolio.entity.ContactLog;
import com.dakyum.portfolio.entity.Project;
import com.dakyum.portfolio.repository.ContactLogRepository;
import com.dakyum.portfolio.repository.ProjectRepository;
import com.dakyum.portfolio.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDateTime;
import java.util.Optional;

@Controller
@RequestMapping("/admin")
public class AdminController {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private ContactLogRepository contactLogRepository;
    
    @Autowired
    private EmailService emailService;
    
    @GetMapping
    public String admin(Model model) {
        model.addAttribute("logs", contactLogRepository.findAllByOrderByCreatedAtDesc());
        model.addAttribute("projects", projectRepository.findAllByOrderByDisplayOrderAscCreatedAtDesc());
        model.addAttribute("unprocessedCount", contactLogRepository.findUnprocessed().size());
        return "admin";
    }
    
    @PostMapping("/project")
    public String saveProject(@ModelAttribute Project project, RedirectAttributes redirectAttributes) {
        if (project.getId() == null) {
            project.setCreatedAt(LocalDateTime.now());
        }
        project.setUpdatedAt(LocalDateTime.now());
        projectRepository.save(project);
        redirectAttributes.addFlashAttribute("message", "프로젝트가 저장되었습니다.");
        return "redirect:/admin#projects";
    }
    
    @PostMapping("/project/{id}/delete")
    public String deleteProject(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        projectRepository.deleteById(id);
        redirectAttributes.addFlashAttribute("message", "프로젝트가 삭제되었습니다.");
        return "redirect:/admin#projects";
    }
    
    @PostMapping("/contact/{id}/process")
    public String processContact(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        Optional<ContactLog> contactOpt = contactLogRepository.findById(id);
        if (contactOpt.isPresent()) {
            ContactLog contact = contactOpt.get();
            contact.setProcessed(!contact.getProcessed());
            if (contact.getProcessed()) {
                contact.setProcessedAt(LocalDateTime.now());
            } else {
                contact.setProcessedAt(null);
            }
            contactLogRepository.save(contact);
            redirectAttributes.addFlashAttribute("message", "처리 상태가 변경되었습니다.");
        }
        return "redirect:/admin#logs";
    }
    
    @PostMapping("/contact/{id}/reply")
    public String replyContact(@PathVariable Long id,
                              @RequestParam String replySubject,
                              @RequestParam String replyMessage,
                              RedirectAttributes redirectAttributes) {
        Optional<ContactLog> contactOpt = contactLogRepository.findById(id);
        if (contactOpt.isPresent()) {
            ContactLog contact = contactOpt.get();
            try {
                emailService.sendReply(contact.getEmail(), replySubject, replyMessage);
                
                contact.setAdminReply(replyMessage);
                contact.setProcessed(true);
                contact.setProcessedAt(LocalDateTime.now());
                contactLogRepository.save(contact);
                
                redirectAttributes.addFlashAttribute("message", "답장이 전송되었습니다.");
            } catch (Exception e) {
                redirectAttributes.addFlashAttribute("error", "이메일 전송에 실패했습니다: " + e.getMessage());
            }
        }
        return "redirect:/admin#logs";
    }
    
    @GetMapping("/api/contact/{id}")
    @ResponseBody
    public ContactLog getContact(@PathVariable Long id) {
        return contactLogRepository.findById(id).orElse(null);
    }
    
    @GetMapping("/api/project/{id}")
    @ResponseBody
    public Project getProject(@PathVariable Long id) {
        return projectRepository.findById(id).orElse(new Project());
    }
}
