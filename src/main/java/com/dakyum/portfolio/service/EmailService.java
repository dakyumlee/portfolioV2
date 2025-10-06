package com.dakyum.portfolio.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender emailSender;
    
    public void sendContactNotification(String name, String email, String message) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo("oicrcutie@gmail.com");
            mailMessage.setSubject("[Portfolio Contact] " + name);
            mailMessage.setText("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message);
            mailMessage.setFrom("noreply@dakyum.com");
            
            emailSender.send(mailMessage);
        } catch (Exception e) {
            throw new RuntimeException("이메일 전송 실패: " + e.getMessage());
        }
    }
    
    public void sendReply(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            message.setFrom("noreply@dakyum.com");
            
            emailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("이메일 전송 실패: " + e.getMessage());
        }
    }
}
