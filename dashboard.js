// Dashboard JavaScript
class PortfolioDashboard {
    constructor() {
        this.currentUser = null;
        this.projects = [];
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.loadProjects();
        this.updateStats();
    }

    checkAuth() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        
        this.currentUser = user;
        document.getElementById('userEmail').textContent = user.email;
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.sidebar-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href').substring(1);
                this.showSection(target);
            });
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Add project form
        document.getElementById('addProjectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProject();
        });

        // Modal close
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });

        // Template selection
        this.setupTemplateFunctionality();
    }

    setupTemplateFunctionality() {
        // Template selection functionality
        this.selectedTemplate = 'modern'; // Default template
        
        // Update template display in generate section
        this.updateTemplateDisplay();
        
        // Populate projects dropdown in generate section
        this.populateProjectsDropdown();
    }

    selectTemplate(templateName) {
        this.selectedTemplate = templateName;
        this.updateTemplateDisplay();
        this.showSection('generate');
        this.showNotification(`Template "${templateName}" selected!`, 'success');
    }

    updateTemplateDisplay() {
        const templateInput = document.getElementById('selectedTemplate');
        if (templateInput) {
            templateInput.value = this.selectedTemplate;
        }
        
        // Update template select in preview section
        const templateSelect = document.getElementById('templateSelect');
        if (templateSelect) {
            templateSelect.value = this.selectedTemplate;
        }
    }

    populateProjectsDropdown() {
        const projectsSelect = document.getElementById('includeProjects');
        if (projectsSelect) {
            projectsSelect.innerHTML = '';
            
            this.projects.forEach((project, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = project.title;
                option.selected = true;
                projectsSelect.appendChild(option);
            });
        }
    }

    updatePreview() {
        const templateSelect = document.getElementById('templateSelect');
        if (templateSelect) {
            this.selectedTemplate = templateSelect.value;
            this.updateTemplateDisplay();
            this.refreshPreview();
        }
    }

    refreshPreview() {
        const previewFrame = document.getElementById('portfolioPreview');
        if (previewFrame) {
            // Generate preview URL based on selected template
            const previewUrl = this.generatePreviewUrl(this.selectedTemplate);
            previewFrame.src = previewUrl;
        }
    }

    generatePreviewUrl(template) {
        // Create a preview URL based on the selected template
        // This is a placeholder - in a real app, this would generate actual template previews
        const baseUrl = 'data:text/html;charset=utf-8,';
        const templateHtml = this.getTemplateHtml(template);
        return baseUrl + encodeURIComponent(templateHtml);
    }

    getTemplateHtml(template) {
        // Return HTML for different templates
        const templates = {
            modern: `
                <html>
                <head>
                    <title>Modern Portfolio Preview</title>
                    <style>
                        body { font-family: 'Arial', sans-serif; background: #f5f5f5; margin: 0; padding: 2rem; }
                        .header { background: #4CAF50; color: white; padding: 2rem; border-radius: 10px; margin-bottom: 2rem; }
                        .project { background: white; padding: 1.5rem; margin: 1rem 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Modern Portfolio Preview</h1>
                        <p>Clean and minimalist design</p>
                    </div>
                    <div class="project">
                        <h3>Sample Project</h3>
                        <p>This is how your projects will appear in the modern template.</p>
                    </div>
                </body>
                </html>
            `,
            creative: `
                <html>
                <head>
                    <title>Creative Portfolio Preview</title>
                    <style>
                        body { font-family: 'Georgia', serif; background: linear-gradient(135deg, #ff6b6b, #4ecdc4); margin: 0; padding: 2rem; }
                        .header { background: rgba(255,255,255,0.9); padding: 2rem; border-radius: 15px; margin-bottom: 2rem; }
                        .project { background: rgba(255,255,255,0.8); padding: 1.5rem; margin: 1rem 0; border-radius: 10px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Creative Portfolio Preview</h1>
                        <p>Bold and vibrant design</p>
                    </div>
                    <div class="project">
                        <h3>Sample Project</h3>
                        <p>This is how your projects will appear in the creative template.</p>
                    </div>
                </body>
                </html>
            `,
            professional: `
                <html>
                <head>
                    <title>Professional Portfolio Preview</title>
                    <style>
                        body { font-family: 'Times New Roman', serif; background: #f8f9fa; margin: 0; padding: 2rem; }
                        .header { background: #2196F3; color: white; padding: 2rem; border-radius: 5px; margin-bottom: 2rem; }
                        .project { background: white; padding: 1.5rem; margin: 1rem 0; border: 1px solid #ddd; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Professional Portfolio Preview</h1>
                        <p>Corporate and elegant design</p>
                    </div>
                    <div class="project">
                        <h3>Sample Project</h3>
                        <p>This is how your projects will appear in the professional template.</p>
                    </div>
                </body>
                </html>
            `,
            minimal: `
                <html>
                <head>
                    <title>Minimal Portfolio Preview</title>
                    <style>
                        body { font-family: 'Helvetica', sans-serif; background: white; margin: 0; padding: 2rem; }
                        .header { border-bottom: 1px solid #eee; padding-bottom: 1rem; margin-bottom: 2rem; }
                        .project { padding: 1rem 0; border-bottom: 1px solid #eee; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Minimal Portfolio Preview</h1>
                        <p>Simple and clean design</p>
                    </div>
                    <div class="project">
                        <h3>Sample Project</h3>
                        <p>This is how your projects will appear in the minimal template.</p>
                    </div>
                </body>
                </html>
            `
        };
        return templates[template] || templates.modern;
    }

    generatePortfolio() {
        const portfolioTitle = document.getElementById('portfolioTitle').value || 'My Portfolio';
        const selectedProjects = Array.from(document.getElementById('includeProjects').selectedOptions).map(option => 
            this.projects[parseInt(option.value)]
        );
        
        // Show generation status
        const statusDiv = document.getElementById('generationStatus');
        const progressFill = document.getElementById('progressFill');
        const statusText = document.getElementById('statusText');
        
        if (statusDiv && progressFill && statusText) {
            statusDiv.style.display = 'block';
            
            // Simulate generation process
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                progressFill.style.width = `${progress}%`;
                
                if (progress < 30) {
                    statusText.textContent = 'Preparing your portfolio...';
                } else if (progress < 60) {
                    statusText.textContent = 'Processing template...';
                } else if (progress < 90) {
                    statusText.textContent = 'Adding projects...';
                } else {
                    statusText.textContent = 'Finalizing...';
                }
                
                if (progress >= 100) {
                    clearInterval(interval);
                    statusText.textContent = 'Portfolio generated successfully!';
                    
                    // Generate the actual portfolio
                    const portfolioUrl = this.createPortfolio(portfolioTitle, selectedProjects, this.selectedTemplate);
                    document.getElementById('portfolioUrl').value = portfolioUrl;
                    
                    this.showNotification('Portfolio generated successfully!', 'success');
                    
                    // Hide status after 3 seconds
                    setTimeout(() => {
                        statusDiv.style.display = 'none';
                    }, 3000);
                }
            }, 200);
        }
    }

    createPortfolio(title, projects, template) {
        // Create the actual portfolio HTML
        const portfolioHtml = this.generatePortfolioHtml(title, projects, template);
        
        // Save to localStorage
        const portfolioId = Date.now();
        const portfolio = {
            id: portfolioId,
            title: title,
            template: template,
            projects: projects,
            html: portfolioHtml,
            createdAt: new Date().toISOString()
        };
        
        // Save portfolio
        const portfolios = JSON.parse(localStorage.getItem('portfolios')) || [];
        portfolios.push(portfolio);
        localStorage.setItem('portfolios', JSON.stringify(portfolios));
        
        // Return URL for viewing
        return `portfolio-${portfolioId}.html`;
    }

    generatePortfolioHtml(title, projects, template) {
        const templateStyles = {
            modern: `
                <style>
                    body { font-family: 'Arial', sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
                    .header { background: #4CAF50; color: white; padding: 3rem 2rem; text-align: center; }
                    .projects { padding: 2rem; max-width: 1200px; margin: 0 auto; }
                    .project { background: white; margin: 1rem 0; padding: 2rem; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                </style>
            `,
            creative: `
                <style>
                    body { font-family: 'Georgia', serif; background: linear-gradient(135deg, #ff6b6b, #4ecdc4); margin: 0; padding: 0; }
                    .header { background: rgba(255,255,255,0.9); padding: 3rem 2rem; text-align: center; }
                    .projects { padding: 2rem; max-width: 1200px; margin: 0 auto; }
                    .project { background: rgba(255,255,255,0.8); margin: 1rem 0; padding: 2rem; border-radius: 15px; }
                </style>
            `,
            professional: `
                <style>
                    body { font-family: 'Times New Roman', serif; background: #f8f9fa; margin: 0; padding: 0; }
                    .header { background: #2196F3; color: white; padding: 3rem 2rem; text-align: center; }
                    .projects { padding: 2rem; max-width: 1200px; margin: 0 auto; }
                    .project { background: white; margin: 1rem 0; padding: 2rem; border: 1px solid #ddd; }
                </style>
            `,
            minimal: `
                <style>
                    body { font-family: 'Helvetica', sans-serif; background: white; margin: 0; padding: 0; }
                    .header { border-bottom: 1px solid #eee; padding: 3rem 2rem; text-align: center; }
                    .projects { padding: 2rem; max-width: 800px; margin: 0 auto; }
                    .project { padding: 2rem 0; border-bottom: 1px solid #eee; }
                </style>
            `
        };
        
        const projectsHtml = projects.map(project => `
            <div class="project">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <p><strong>Technologies:</strong> ${project.technologies}</p>
                ${project.link ? `<p><strong>Link:</strong> <a href="${project.link}">${project.link}</a></p>` : ''}
                ${project.image ? `<img src="${project.image}" alt="${project.title}" style="max-width: 100%; height: auto;">` : ''}
            </div>
        `).join('');
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${templateStyles[template] || templateStyles.modern}
            </head>
            <body>
                <div class="header">
                    <h1>${title}</h1>
                    <p>Generated with ${template} template</p>
                </div>
                <div class="projects">
                    ${projectsHtml}
                </div>
            </body>
            </html>
        `;
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        document.getElementById(sectionId).classList.add('active');

        // Update active nav
        document.querySelectorAll('.sidebar-menu li').forEach(li => {
            li.classList.remove('active');
        });
        document.querySelector(`[href="#${sectionId}"]`).parentElement.classList.add('active');
    }

    loadProjects() {
        const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
        this.projects = savedProjects;
        this.renderProjects();
    }

    saveProjects() {
        localStorage.setItem('projects', JSON.stringify(this.projects));
    }

    renderProjects() {
        const grid = document.getElementById('projectsGrid');
        grid.innerHTML = '';

        if (this.projects.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open" style="font-size: 3rem; color: var(--muted);"></i>
                    <h3>No projects yet</h3>
                    <p>Add your first project to get started!</p>
                </div>
            `;
            return;
        }

        this.projects.forEach((project, index) => {
            const projectCard = this.createProjectCard(project, index);
            grid.appendChild(projectCard);
        });
    }

    createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <img src="${project.image || 'https://via.placeholder.com/300x200?text=Project+Image'}" 
                 alt="${project.title}" class="project-image">
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.split(',').map(tech => 
                        `<span class="tech-tag">${tech.trim()}</span>`
                    ).join('')}
                </div>
                <div class="project-actions">
                    <button class="btn-primary" onclick="dashboard.previewProject(${index})">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                    <button class="btn-secondary" onclick="dashboard.editProject(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-secondary" onclick="dashboard.deleteProject(${index})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
        return card;
    }

    addProject() {
        const form = document.getElementById('addProjectForm');
        const formData = new FormData(form);
        const fileInput = document.getElementById('projectFile');
        const files = fileInput.files;

        // Handle file uploads
        let uploadedFiles = [];
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                uploadedFiles.push({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified
                });
            }
        }

        const newProject = {
            id: Date.now(),
            title: formData.get('title'),
            description: formData.get('description'),
            technologies: formData.get('technologies'),
            link: formData.get('link') || null, // Keep link as optional
            image: formData.get('image'),
            files: uploadedFiles,
            views: 0,
            likes: 0,
            createdAt: new Date().toISOString()
        };

        this.projects.unshift(newProject);
        this.saveProjects();
        this.renderProjects();
        this.updateStats();
        
        form.reset();
        this.showNotification('Project added successfully!', 'success');
    }

    editProject(index) {
        const project = this.projects[index];
        
        // Populate form with project data
        document.getElementById('projectTitle').value = project.title;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectTech').value = project.technologies;
        document.getElementById('projectLink').value = project.link;
        document.getElementById('projectImage').value = project.image;

        // Change form to edit mode
        const form = document.getElementById('addProjectForm');
        form.removeEventListener('submit', this.addProject);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProject(index);
        });

        // Update button text
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Project';
        
        this.showSection('add-project');
    }

    updateProject(index) {
        const form = document.getElementById('addProjectForm');
        const formData = new FormData(form);
        const fileInput = document.getElementById('projectFile');
        const files = fileInput.files;

        // Handle file uploads for updates
        let uploadedFiles = [];
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                uploadedFiles.push({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified
                });
            }
        }

        this.projects[index] = {
            ...this.projects[index],
            title: formData.get('title'),
            description: formData.get('description'),
            technologies: formData.get('technologies'),
            link: formData.get('link'),
            image: formData.get('image'),
            files: uploadedFiles
        };

        this.saveProjects();
        this.renderProjects();
        
        // Reset form
        form.reset();
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Project';
        
        this.showNotification('Project updated successfully!', 'success');
        this.showSection('projects');
    }

    deleteProject(index) {
        if (confirm('Are you sure you want to delete this project?')) {
            this.projects.splice(index, 1);
            this.saveProjects();
            this.renderProjects();
            this.updateStats();
            this.showNotification('Project deleted successfully!', 'success');
        }
    }

    previewProject(index) {
        const project = this.projects[index];
        const modal = document.getElementById('projectModal');
        const content = document.getElementById('modalContent');

        let filesHtml = '';
        if (project.files && project.files.length > 0) {
            filesHtml = `
                <div style="margin-top: 1rem;">
                    <h4>Uploaded Files:</h4>
                    <ul style="list-style: none; padding: 0;">
                        ${project.files.map(file => `
                            <li style="padding: 0.5rem; background: #f5f5f5; margin-bottom: 0.5rem; border-radius: 5px;">
                                <i class="fas fa-file"></i> ${file.name} 
                                <span style="color: #666; font-size: 0.9em;">(${this.formatFileSize(file.size)})</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }

        content.innerHTML = `
            <h2>${project.title}</h2>
            <img src="${project.image || 'https://via.placeholder.com/600x400?text=Project+Image'}" 
                 alt="${project.title}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 10px; margin: 1rem 0;">
            <p><strong>Description:</strong> ${project.description}</p>
            <p><strong>Technologies:</strong> ${project.technologies}</p>
            ${project.link ? `<p><strong>Link:</strong> <a href="${project.link}" target="_blank">${project.link}</a></p>` : ''}
            ${filesHtml}
            <div style="margin-top: 1rem;">
                <p><strong>Views:</strong> ${project.views}</p>
                <p><strong>Likes:</strong> ${project.likes}</p>
            </div>
        `;

        modal.style.display = 'block';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    closeModal() {
        document.getElementById('projectModal').style.display = 'none';
    }

    updateStats() {
        document.getElementById('totalProjects').textContent = this.projects.length;
        document.getElementById('totalViews').textContent = this.projects.reduce((sum, p) => sum + p.views, 0);
        document.getElementById('totalLikes').textContent = this.projects.reduce((sum, p) => sum + p.likes, 0);
    }

    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 5px;
            color: white;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        if (type === 'success') {
            notification.style.background = 'var(--success)';
        } else if (type === 'error') {
            notification.style.background = 'var(--error)';
        } else {
            notification.style.background = 'var(--primary)';
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize dashboard
const dashboard = new PortfolioDashboard();

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Demo data for testing
if (dashboard.projects.length === 0) {
    const demoProjects = [
        {
            id: 1,
            title: "Portfolio Website",
            description: "A responsive portfolio website built with modern web technologies.",
            technologies: "HTML, CSS, JavaScript",
            link: "https://example.com/portfolio",
            image: "https://via.placeholder.com/300x200/0f56a7/ffffff?text=Portfolio",
            views: 150,
            likes: 25,
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            title: "E-commerce App",
            description: "A full-featured e-commerce application with shopping cart functionality.",
            technologies: "React, Node.js, MongoDB",
            link: "https://example.com/shop",
            image: "https://via.placeholder.com/300x200/17d7ff/ffffff?text=E-commerce",
            views: 320,
            likes: 45,
            createdAt: new Date().toISOString()
        }
    ];
    
    localStorage.setItem('projects', JSON.stringify(demoProjects));
    dashboard.loadProjects();
    dashboard.updateStats();
}
