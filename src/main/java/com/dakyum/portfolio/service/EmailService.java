package com.dakyum.portfolio.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;

@Service
public class EmailService {
    
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    
    private final Resend resend;
    
    public EmailService(@Value("${resend.api.key}") String apiKey) {
        this.resend = new Resend(apiKey);
    }
    
    public void sendContactNotification(String name, String email, String message) {
        try {
            CreateEmailOptions params = CreateEmailOptions.builder()
                .from("onboarding@resend.dev")
                .to("oicrcutie@gmail.com")
                .replyTo("oicrcutie@gmail.com")
                .subject("[Portfolio Contact] " + name)
                .html("<p><strong>Name:</strong> " + name + "</p>" +
                        "<p><strong>Email:</strong> " + email + "</p>" +
                        "<p><strong>Message:</strong></p>" +
                        "<p>" + message.replace("\n", "<br>") + "</p>")
                .build();
            
            CreateEmailResponse data = resend.emails().send(params);
            log.info("Email sent successfully with ID: " + data.getId());
        } catch (ResendException e) {
            log.error("Failed to send email: " + e.getMessage(), e);
            throw new RuntimeException("이메일 전송 실패: " + e.getMessage());
        }
    }
    
    public void sendReply(String to, String subject, String text) {
        try {
            CreateEmailOptions params = CreateEmailOptions.builder()
                .from("onboarding@resend.dev")
                .to(to)
                .replyTo("oicrcutie@gmail.com")
                .subject(subject)
                .html("<p>" + text.replace("\n", "<br>") + "</p>")
                .build();
            
            CreateEmailResponse data = resend.emails().send(params);
            log.info("Reply email sent successfully with ID: " + data.getId());
        } catch (ResendException e) {
            log.error("Failed to send reply email: " + e.getMessage(), e);
            throw new RuntimeException("이메일 전송 실패: " + e.getMessage());
        }
    }
}