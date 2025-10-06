let bootSequenceComplete = false;

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => document.getElementById('boot-line-1').classList.add('active'), 100);
    setTimeout(() => document.getElementById('boot-line-2').classList.add('active'), 800);
    setTimeout(() => document.getElementById('boot-line-3').classList.add('active'), 1500);
    setTimeout(() => {
        document.getElementById('boot-enter').classList.add('active');
        bootSequenceComplete = true;
    }, 2200);
});

function enterModules() {
    if (!bootSequenceComplete) return;
    document.querySelector('.section-start').style.display = 'none';
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
}

function runModule(projectId) {
    fetch(`/api/project/${projectId}`)
        .then(response => response.json())
        .then(project => {
            showProjectModal(project);
            logToConsole(`[EXEC] Loading module: ${project.title}...`);
            setTimeout(() => {
                logToConsole(`[INFO] ${project.title} module executed successfully`);
                logToConsole(`[STACK] ${project.stack || 'N/A'}`);
            }, 300);
        })
        .catch(err => {
            logToConsole(`[ERROR] Failed to load module: ${err.message}`);
        });
}

function showProjectModal(project) {
    const existingModal = document.querySelector('.project-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeProjectModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title-bar">
                    <span class="modal-icon">▸</span>
                    <span class="modal-title">${project.title}</span>
                </div>
                <button class="modal-close" onclick="closeProjectModal()">✕</button>
            </div>
            <div class="modal-body">
                <div class="modal-section">
                    <div class="modal-label">Description</div>
                    <p class="modal-text">${project.description || project.summary}</p>
                </div>
                ${project.stack ? `
                <div class="modal-section">
                    <div class="modal-label">Tech Stack</div>
                    <div class="modal-tags">
                        ${project.stack.split(',').map(tech => 
                            `<span class="modal-tag">${tech.trim()}</span>`
                        ).join('')}
                    </div>
                </div>
                ` : ''}
                ${project.demoUrl ? `
                <div class="modal-section">
                    <div class="modal-label">Demo URL</div>
                    <a href="${project.demoUrl}" target="_blank" class="modal-link">
                        ${project.demoUrl} <span class="link-icon">↗</span>
                    </a>
                </div>
                ` : ''}
                ${project.repoUrl ? `
                <div class="modal-section">
                    <div class="modal-label">Repository</div>
                    <a href="${project.repoUrl}" target="_blank" class="modal-link">
                        ${project.repoUrl} <span class="link-icon">↗</span>
                    </a>
                </div>
                ` : ''}
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeProjectModal()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeProjectModal() {
    const modal = document.querySelector('.project-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

function logToConsole(message) {
    const output = document.getElementById('consoleOutput');
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    output.textContent += `\n[${timestamp}] ${message}`;
    output.scrollTop = output.scrollHeight;
}

function clearConsole() {
    document.getElementById('consoleOutput').textContent = 'PORTFOLIO CONSOLE v1.0.0\nReady for module execution...\n\n> _';
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
