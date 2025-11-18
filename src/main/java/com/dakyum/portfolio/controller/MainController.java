package com.dakyum.portfolio.controller;

import com.dakyum.portfolio.entity.ContactLog;
import com.dakyum.portfolio.entity.Project;
import com.dakyum.portfolio.repository.ContactLogRepository;
import com.dakyum.portfolio.repository.ProjectRepository;
import com.dakyum.portfolio.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDateTime;

@Controller
public class MainController {
    
    private static final Logger log = LoggerFactory.getLogger(MainController.class);
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private ContactLogRepository contactLogRepository;
    
    @Autowired
    private EmailService emailService;
    
    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("projects", projectRepository.findAllByOrderByDisplayOrderAscCreatedAtDesc());
        return "index";
    }
    
    @GetMapping("/login")
    public String login() {
        return "login";
    }
    
    @GetMapping("/api/project/{id}")
    @ResponseBody
    public Project getProject(@PathVariable Long id) {
        return projectRepository.findById(id).orElse(null);
    }
    
    @PostMapping("/contact")
    public String contact(@RequestParam String name,
                            @RequestParam String email,
                            @RequestParam String message,
                            RedirectAttributes redirectAttributes) {
        ContactLog contactLog = new ContactLog();
        contactLog.setName(name);
        contactLog.setEmail(email);
        contactLog.setMessage(message);
        contactLog.setCreatedAt(LocalDateTime.now());
        contactLog.setProcessed(false);
        contactLogRepository.save(contactLog);
        
        try {
            log.info("Sending email notification to oicrcutie@gmail.com");
            emailService.sendContactNotification(name, email, message);
            log.info("Email sent successfully");
        } catch (Exception e) {
            log.error("Failed to send email: " + e.getMessage(), e);
        }
        
        redirectAttributes.addFlashAttribute("msg", "[SUCCESS] Message sent successfully! I'll get back to you soon.");
        return "redirect:/";
    }
}