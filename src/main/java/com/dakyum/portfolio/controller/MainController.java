package com.dakyum.portfolio.controller;

import com.dakyum.portfolio.entity.ContactLog;
import com.dakyum.portfolio.repository.ContactLogRepository;
import com.dakyum.portfolio.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class MainController {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private ContactLogRepository contactLogRepository;
    
    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("projects", projectRepository.findAllByActiveTrueOrderByDisplayOrderAscCreatedAtDesc());
        return "index";
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
        
        contactLogRepository.save(contactLog);
        
        redirectAttributes.addFlashAttribute("msg", "[LOG] contact.log updated successfully");
        return "redirect:/#contact";
    }
    
    @GetMapping("/login")
    public String login() {
        return "login";
    }
    
    @GetMapping("/api/project/{id}")
    @ResponseBody
    public String getProjectLog(@PathVariable Long id) {
        return projectRepository.findById(id)
            .map(project -> String.format(
                "> run module %s\n[BOOT] Initializing module...\n[READY] %s\nDemo: %s\nRepo: %s",
                project.getTitle(),
                project.getSummary() != null ? project.getSummary() : "Module loaded",
                project.getDemoUrl() != null ? project.getDemoUrl() : "N/A",
                project.getRepoUrl() != null ? project.getRepoUrl() : "N/A"
            ))
            .orElse("> module not found");
    }
}
