let currentSection = 'start';

function enterModules() {
    document.getElementById('projects').scrollIntoView({ 
        behavior: 'smooth' 
    });
    currentSection = 'projects';
}

function runModule(projectId) {
    const consoleOutput = document.getElementById('consoleOutput');
    
    appendToConsole('\n> loading module ' + projectId + '...');
    
    fetch('/api/project/' + projectId)
        .then(response => response.text())
        .then(data => {
            setTimeout(() => {
                appendToConsole('\n' + data);
            }, 300);
        })
        .catch(error => {
            appendToConsole('\n[ERROR] Failed to load module: ' + error.message);
        });
}

function appendToConsole(text) {
    const consoleOutput = document.getElementById('consoleOutput');
    consoleOutput.textContent += text;
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function clearConsole() {
    const consoleOutput = document.getElementById('consoleOutput');
    consoleOutput.textContent = 'PORTFOLIO CONSOLE v1.0.0\nReady for module execution...\n\n> _';
}

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                currentSection = targetId.substring(1);
            }
        });
    });
    
    setTimeout(() => {
        const bootLines = document.querySelectorAll('.boot-line, .boot-enter');
        bootLines.forEach((line, index) => {
            line.style.animationDelay = (index * 0.7 + 0.5) + 's';
        });
    }, 100);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            clearConsole();
        }
        
        if (e.key === 'Enter' && currentSection === 'start') {
            enterModules();
        }
    });
    
    const contactSection = document.getElementById('contact');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const firstInput = entry.target.querySelector('input[name="name"]');
                if (firstInput) {
                    setTimeout(() => firstInput.focus(), 500);
                }
            }
        });
    });
    
    if (contactSection) {
        observer.observe(contactSection);
    }
    
    let typingQueue = [];
    let isTyping = false;
    
    function typeText(text, element, callback) {
        if (isTyping) {
            typingQueue.push({ text, element, callback });
            return;
        }
        
        isTyping = true;
        let index = 0;
        const originalText = element.textContent;
        
        function typeChar() {
            if (index < text.length) {
                element.textContent = originalText + text.substring(0, index + 1);
                index++;
                setTimeout(typeChar, 20);
            } else {
                element.textContent = originalText + text;
                isTyping = false;
                if (callback) callback();
                
                if (typingQueue.length > 0) {
                    const next = typingQueue.shift();
                    typeText(next.text, next.element, next.callback);
                }
            }
        }
        
        typeChar();
    }
    
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        document.body.style.backgroundPosition = `0 ${rate}px`;
    });
    
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                currentSection = window.location.hash.substring(1);
            }
        }, 100);
    }
    
    console.log(`
    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
    █                                      █
    █    PORTFOLIO CONSOLE v1.0.0         █
    █    Developer: 이다겸 (1998.05.11)    █
    █    Type 'help' for available cmds    █
    █                                      █
    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
    `);
    
    window.help = function() {
        console.log('Available commands:\n- enterModules()\n- runModule(id)\n- clearConsole()');
    };
    
    window.enterModules = enterModules;
    window.runModule = runModule;
    window.clearConsole = clearConsole;
});
