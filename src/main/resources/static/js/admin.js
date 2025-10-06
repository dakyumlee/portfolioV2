let currentTab = 'logs';
let currentLogId = null;

function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`button[onclick="showTab('${tabName}')"]`).classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    currentTab = tabName;
}

function showLogDetail(logId) {
    currentLogId = logId;
    
    document.querySelectorAll('.log-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    fetch(`/admin/api/contact/${logId}`, {
        headers: {
            [csrfHeader]: csrfToken
        }
    })
        .then(response => response.json())
        .then(log => {
            const detailContainer = document.getElementById('logDetail');
            const csrfInput = `<input type="hidden" name="${document.querySelector('input[name="_csrf"]').name}" value="${document.querySelector('input[name="_csrf"]').value}">`;
            
            detailContainer.innerHTML = `
                <div class="detail-content active">
                    <div class="detail-header">
                        <div class="detail-title">${log.name}</div>
                        <div class="detail-meta">
                            <span>Email: ${log.email}</span>
                            <span>Date: ${new Date(log.createdAt).toLocaleDateString('ko-KR')}</span>
                            <span class="${log.processed ? 'status-processed' : 'status-pending'}">
                                ${log.processed ? 'PROCESSED' : 'PENDING'}
                            </span>
                        </div>
                    </div>
                    
                    <div class="detail-body">
                        <h4>Message:</h4>
                        <div class="detail-message">${escapeHtml(log.message)}</div>
                        
                        ${log.adminReply ? `
                            <h4>Admin Reply:</h4>
                            <div class="detail-message">${escapeHtml(log.adminReply)}</div>
                        ` : ''}
                    </div>
                    
                    <div class="detail-actions">
                        <form action="/admin/contact/${log.id}/process" method="post" style="display: inline;">
                            ${csrfInput}
                            <button type="submit" class="btn btn-small ${log.processed ? 'btn-secondary' : 'btn-primary'}">
                                ${log.processed ? 'Mark Unprocessed' : 'Mark Processed'}
                            </button>
                        </form>
                        
                        <button class="btn btn-small btn-primary" onclick="showReplyModal(${log.id}, '${escapeHtml(log.email)}', '${escapeHtml(log.name)}')">
                            Send Reply
                        </button>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error fetching log details:', error);
        });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showProjectForm() {
    document.getElementById('modalTitle').textContent = 'New Project';
    document.getElementById('projectForm').reset();
    document.getElementById('projectId').value = '';
    document.getElementById('projectModal').classList.add('active');
}

function editProject(projectId) {
    fetch(`/admin/api/project/${projectId}`, {
        headers: {
            [csrfHeader]: csrfToken
        }
    })
        .then(response => response.json())
        .then(project => {
            document.getElementById('modalTitle').textContent = 'Edit Project';
            document.getElementById('projectId').value = project.id || '';
            document.getElementById('projectTitle').value = project.title || '';
            document.getElementById('projectSummary').value = project.summary || '';
            document.getElementById('projectDescription').value = project.description || '';
            document.getElementById('projectStack').value = project.stack || '';
            document.getElementById('projectDemoUrl').value = project.demoUrl || '';
            document.getElementById('projectRepoUrl').value = project.repoUrl || '';
            document.getElementById('projectDisplayOrder').value = project.displayOrder || 0;
            document.getElementById('projectActive').checked = project.active !== false;
            
            document.getElementById('projectModal').classList.add('active');
        })
        .catch(error => {
            console.error('Error fetching project:', error);
        });
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('active');
}

function showReplyModal(logId, email, name) {
    document.getElementById('replySubject').value = `Re: Contact from ${name}`;
    document.getElementById('replyMessage').value = `안녕하세요 ${name}님,\n\n문의해 주셔서 감사합니다.\n\n\n\n감사합니다.\n이다겸`;
    document.getElementById('replyForm').action = `/admin/contact/${logId}/reply`;
    document.getElementById('replyModal').classList.add('active');
}

function closeReplyModal() {
    document.getElementById('replyModal').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this || e.target.classList.contains('modal-backdrop')) {
                this.classList.remove('active');
            }
        });
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
    
    document.getElementById('projectForm').addEventListener('submit', function(e) {
        const title = document.getElementById('projectTitle').value.trim();
        const summary = document.getElementById('projectSummary').value.trim();
        
        if (!title || !summary) {
            e.preventDefault();
            alert('프로젝트 제목과 요약은 필수 항목입니다.');
            return;
        }
    });
    
    let replyDraft = '';
    const replyTextarea = document.getElementById('replyMessage');
    if (replyTextarea) {
        replyTextarea.addEventListener('input', function() {
            replyDraft = this.value;
            localStorage.setItem('adminReplyDraft', replyDraft);
        });
        
        const savedDraft = localStorage.getItem('adminReplyDraft');
        if (savedDraft) {
            replyTextarea.value = savedDraft;
        }
    }
    
    document.getElementById('replyForm').addEventListener('submit', function() {
        localStorage.removeItem('adminReplyDraft');
    });
    
    document.querySelectorAll('.log-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(4px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    showTab('logs');
                    break;
                case '2':
                    e.preventDefault();
                    showTab('projects');
                    break;
                case '3':
                    e.preventDefault();
                    showTab('monitor');
                    break;
                case 'n':
                    if (currentTab === 'projects') {
                        e.preventDefault();
                        showProjectForm();
                    }
                    break;
            }
        }
    });
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns[0].title = 'Logs (Ctrl+1)';
    tabBtns[1].title = 'Projects (Ctrl+2)';
    tabBtns[2].title = 'Monitor (Ctrl+3)';
    
    showTab('logs');
    
    console.log('Admin console initialized. Keyboard shortcuts available:');
    console.log('Ctrl+1: Logs, Ctrl+2: Projects, Ctrl+3: Monitor');
    console.log('Ctrl+N: New Project (when on Projects tab)');
});
