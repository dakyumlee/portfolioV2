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

@Controller
public class MainController {
    
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
        ContactLog log = new ContactLog();
        log.setName(name);
        log.setEmail(email);
        log.setMessage(message);
        log.setCreatedAt(LocalDateTime.now());
        log.setProcessed(false);
        contactLogRepository.save(log);
        
        try {
            emailService.sendContactNotification(name, email, message);
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        redirectAttributes.addFlashAttribute("msg", "[SUCCESS] Message sent successfully! I'll get back to you soon.");
        return "redirect:/#contact";
    }
}
