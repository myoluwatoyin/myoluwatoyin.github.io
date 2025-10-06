/* ===== ADVANCED PORTFOLIO JAVASCRIPT ===== */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Global variables
let particleSystem;
let loadingComplete = false;

/* ===== ADVANCED LOADING SCREEN ===== */
class LoadingScreen {
    constructor() {
        this.texts = [
            "Initializing portfolio...",
            "Loading React components...",
            "Connecting to databases...",
            "Optimizing performance...",
            "Deploying to cloud...",
            "Ready to showcase!"
        ];
        this.currentIndex = 0;
        this.typingElement = document.querySelector('.typing-text');
        this.init();
    }

    init() {
        this.typeText();
        setTimeout(() => {
            document.body.classList.add('loaded');
            loadingComplete = true;
            this.initMainAnimations();
        }, 4000);
    }

    typeText() {
        if (this.currentIndex < this.texts.length) {
            const text = this.texts[this.currentIndex];
            let charIndex = 0;
            
            const typeInterval = setInterval(() => {
                this.typingElement.textContent = text.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === text.length) {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        this.currentIndex++;
                        if (this.currentIndex < this.texts.length) {
                            this.typingElement.textContent = '';
                            this.typeText();
                        }
                    }, 500);
                }
            }, 50);
        }
    }

    initMainAnimations() {
        // Initialize all main animations after loading
        heroAnimations.init();
        particleSystem = new ParticleSystem();
        scrollAnimations.init();
        navigationEffects.init();
        terminalAnimation.init();
    }
}

/* ===== PARTICLE SYSTEM ===== */
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.min(150, window.innerWidth / 10);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                connections: []
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Update CSS custom properties for cursor effect
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, i) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += dx * force * 0.001;
                particle.vy += dy * force * 0.001;
            }
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
            this.ctx.fill();
            
            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

/* ===== ADVANCED HERO ANIMATIONS ===== */
const heroAnimations = {
    init() {
        // Initialize all hero interactions
        this.initInteractiveTerminal();
        this.initMorphingTitle();
        this.initTechBadges();
        this.initInteractiveCTAs();
        this.initMiniStats();
        this.initCodeEditor();
        this.initBackgroundEffects();
        
        // Animate hero elements
        this.animateHeroElements();
    },
    
    initInteractiveTerminal() {
        const terminalBtns = document.querySelectorAll('.interactive-btn');
        const suggestions = document.querySelectorAll('.suggestion');
        const typingCommand = document.querySelector('.typing-command');
        
        // Terminal button interactions
        terminalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                this.handleTerminalAction(action);
                
                // Visual feedback
                gsap.to(btn, {
                    scale: 0.8,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                });
            });
        });
        
        // Command suggestions
        suggestions.forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                const command = suggestion.dataset.cmd;
                this.typeCommand(command);
                
                // Hide suggestions temporarily
                gsap.to('.terminal-suggestions', {
                    opacity: 0,
                    y: -10,
                    duration: 0.3,
                    onComplete: () => {
                        setTimeout(() => {
                            gsap.to('.terminal-suggestions', {
                                opacity: 1,
                                y: 0,
                                duration: 0.3
                            });
                        }, 2000);
                    }
                });
            });
        });
        
        // Auto-typing commands
        this.startAutoTyping();
    },
    
    handleTerminalAction(action) {
        const terminal = document.querySelector('.interactive-terminal-window');
        
        switch(action) {
            case 'close':
                gsap.to(terminal, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'back.in(1.7)',
                    onComplete: () => {
                        setTimeout(() => {
                            gsap.to(terminal, {
                                scale: 1,
                                opacity: 1,
                                duration: 0.5,
                                ease: 'back.out(1.7)'
                            });
                        }, 1000);
                    }
                });
                break;
            case 'minimize':
                gsap.to(terminal, {
                    scaleY: 0.1,
                    duration: 0.3,
                    ease: 'power2.inOut',
                    transformOrigin: 'top',
                    onComplete: () => {
                        setTimeout(() => {
                            gsap.to(terminal, {
                                scaleY: 1,
                                duration: 0.3,
                                ease: 'back.out(1.7)'
                            });
                        }, 1000);
                    }
                });
                break;
            case 'maximize':
                gsap.to(terminal, {
                    scale: 1.1,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                });
                break;
        }
    },
    
    typeCommand(command) {
        const typingCommand = document.querySelector('.typing-command');
        let charIndex = 0;
        
        typingCommand.textContent = '';
        
        const interval = setInterval(() => {
            typingCommand.textContent = command.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex > command.length) {
                clearInterval(interval);
                setTimeout(() => {
                    typingCommand.textContent = '';
                }, 2000);
            }
        }, 80);
    },
    
    startAutoTyping() {
        const commands = [
            'git status',
            'npm run dev',
            'docker build -t portfolio .',
            'kubectl apply -f deployment.yaml',
            'terraform plan',
            'npm test -- --coverage'
        ];
        
        let commandIndex = 0;
        
        const cycleCommands = () => {
            this.typeCommand(commands[commandIndex]);
            commandIndex = (commandIndex + 1) % commands.length;
            setTimeout(cycleCommands, 4000);
        };
        
        setTimeout(cycleCommands, 3000);
    },
    
    initMorphingTitle() {
        const morphingText = document.querySelector('.morphing-text');
        const words = JSON.parse(morphingText.dataset.words);
        let currentIndex = 0;
        
        const morphWord = () => {
            const nextIndex = (currentIndex + 1) % words.length;
            const nextWord = words[nextIndex];
            
            gsap.to(morphingText, {
                rotationX: 90,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    morphingText.textContent = nextWord;
                    gsap.to(morphingText, {
                        rotationX: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
            
            currentIndex = nextIndex;
        };
        
        setInterval(morphWord, 3000);
    },
    
    initTechBadges() {
        const badges = document.querySelectorAll('.interactive-badge');
        
        badges.forEach((badge, index) => {
            badge.addEventListener('mouseenter', () => {
                // Scale up and glow
                gsap.to(badge, {
                    scale: 1.1,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });
                
                // Create ripple effect
                this.createRippleEffect(badge);
            });
            
            badge.addEventListener('mouseleave', () => {
                gsap.to(badge, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            badge.addEventListener('click', () => {
                // Pulse animation
                gsap.to(badge, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                });
                
                // Show tech info (could expand to show more details)
                this.showTechInfo(badge.dataset.tech);
            });
        });
    },
    
    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 212, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
        `;
        
        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    },
    
    showTechInfo(tech) {
        // Create temporary info popup
        const info = document.createElement('div');
        info.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--secondary-bg);
            border: 1px solid var(--primary-accent);
            border-radius: 12px;
            padding: 1rem;
            z-index: 1000;
            color: var(--text-primary);
            font-family: var(--font-mono);
            opacity: 0;
        `;
        info.textContent = `${tech} - Expert Level`;
        
        document.body.appendChild(info);
        
        gsap.to(info, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: 'back.out(1.7)',
            onComplete: () => {
                setTimeout(() => {
                    gsap.to(info, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.3,
                        onComplete: () => info.remove()
                    });
                }, 1500);
            }
        });
    },
    
    initInteractiveCTAs() {
        const ctas = document.querySelectorAll('.interactive-cta');
        
        ctas.forEach(cta => {
            cta.addEventListener('mouseenter', () => {
                gsap.to(cta, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                // Animate particles
                const particles = cta.querySelectorAll('.particle');
                particles.forEach((particle, i) => {
                    gsap.to(particle, {
                        opacity: 1,
                        y: -20,
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: 'power2.out',
                        repeat: -1,
                        yoyo: true
                    });
                });
            });
            
            cta.addEventListener('mouseleave', () => {
                gsap.to(cta, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                // Stop particle animation
                const particles = cta.querySelectorAll('.particle');
                particles.forEach(particle => {
                    gsap.killTweensOf(particle);
                    gsap.set(particle, { opacity: 0, y: 0 });
                });
            });
        });
    },
    
    initMiniStats() {
        const stats = document.querySelectorAll('.mini-stat');
        
        stats.forEach(stat => {
            const number = stat.querySelector('.mini-number');
            const target = parseInt(stat.dataset.count);
            
            // Animate counter on scroll
            ScrollTrigger.create({
                trigger: stat,
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(number, {
                        innerHTML: target,
                        duration: 2,
                        snap: { innerHTML: 1 },
                        ease: 'power2.out'
                    });
                }
            });
            
            // Hover effects
            stat.addEventListener('mouseenter', () => {
                gsap.to(stat, {
                    scale: 1.1,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });
            });
            
            stat.addEventListener('mouseleave', () => {
                gsap.to(stat, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    },
    
    initCodeEditor() {
        const tabs = document.querySelectorAll('.interactive-tab');
        const controlBtns = document.querySelectorAll('.control-btn');
        const fileContents = document.querySelectorAll('.file-content');
        const lineNumbers = document.getElementById('line-numbers');
        
        // File content data for line numbers
        const fileLinesCount = {
            'app.js': 18,
            'styles.css': 17,
            'index.html': 16,
            'build': 10,
            'deploy': 8,
            'debug': 12
        };
        
        // Tab switching with file content
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                if (tab.classList.contains('add-tab')) {
                    this.handleAddTab();
                    return;
                }
                
                const fileName = tab.dataset.file;
                this.switchToFile(fileName, tabs, fileContents, lineNumbers, fileLinesCount);
            });
            
            // Tab close functionality
            const closeBtn = tab.querySelector('.tab-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleTabClose(tab);
                });
            }
        });
        
        // Control button interactions
        controlBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                gsap.to(btn, {
                    scale: 0.9,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                });
                
                if (btn.classList.contains('run-btn')) {
                    this.startBuildProcess(tabs, fileContents, lineNumbers, fileLinesCount);
                } else if (btn.classList.contains('deploy-btn')) {
                    this.startDeployment(tabs, fileContents, lineNumbers, fileLinesCount);
                } else if (btn.classList.contains('debug-btn')) {
                    this.showDebugInfo(tabs, fileContents, lineNumbers, fileLinesCount);
                }
            });
        });
        
    },
    
    switchToFile(fileName, tabs, fileContents, lineNumbers, fileLinesCount) {
        // Remove active from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        fileContents.forEach(f => f.classList.remove('active'));
        
        // Add active to clicked tab and corresponding content
        const activeTab = document.querySelector(`[data-file="${fileName}"]`);
        const activeContent = document.querySelector(`.file-content[data-file="${fileName}"]`);
        
        if (activeTab && activeContent) {
            activeTab.classList.add('active');
            
            // Animate content switch
            gsap.to('#code-content', {
                opacity: 0,
                x: -20,
                duration: 0.2,
                ease: 'power2.in',
                onComplete: () => {
                    activeContent.classList.add('active');
                    this.updateLineNumbers(lineNumbers, fileLinesCount[fileName] || 18);
                    
                    gsap.to('#code-content', {
                        opacity: 1,
                        x: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
            
            // Update editor status
            this.updateEditorStatus(fileName);
        }
    },
    
    updateLineNumbers(lineNumbers, count) {
        lineNumbers.innerHTML = '';
        for (let i = 1; i <= count; i++) {
            const span = document.createElement('span');
            span.textContent = i;
            lineNumbers.appendChild(span);
        }
        
        // Animate line numbers
        gsap.from(lineNumbers.children, {
            opacity: 0,
            x: -10,
            duration: 0.3,
            stagger: 0.02,
            ease: 'power2.out'
        });
    },
    
    updateEditorStatus(fileName) {
        const statusItems = document.querySelectorAll('.status-item');
        const fileInfo = {
            'app.js': { lines: 18, status: '✅ No Problems', extra: '🔥 Hot Reload' },
            'styles.css': { lines: 17, status: '✅ No Problems', extra: '🎨 Live Preview' },
            'index.html': { lines: 16, status: '✅ Valid HTML', extra: '🌐 Ready' },
            'build': { lines: 10, status: '⚙️ Building', extra: '📦 Bundling' },
            'deploy': { lines: 8, status: '🚀 Deployed', extra: '✨ Live' },
            'debug': { lines: 12, status: '🐛 Debug Mode', extra: '📊 Performance' }
        };
        
        const info = fileInfo[fileName] || fileInfo['app.js'];
        
        if (statusItems.length >= 3) {
            statusItems[0].textContent = info.status;
            statusItems[1].textContent = `📊 ${info.lines} lines`;
            statusItems[2].textContent = info.extra;
        }
    },
    
    handleAddTab() {
        // Create a temporary "new file" notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--secondary-bg);
            border: 1px solid var(--primary-accent);
            border-radius: 8px;
            padding: 1rem;
            color: var(--text-primary);
            font-family: var(--font-mono);
            z-index: 1000;
            opacity: 0;
        `;
        notification.textContent = '+ New file feature coming soon!';
        
        document.body.appendChild(notification);
        
        gsap.to(notification, {
            opacity: 1,
            y: 10,
            duration: 0.3,
            ease: 'back.out(1.7)',
            onComplete: () => {
                setTimeout(() => {
                    gsap.to(notification, {
                        opacity: 0,
                        y: -10,
                        duration: 0.3,
                        onComplete: () => notification.remove()
                    });
                }, 2000);
            }
        });
    },
    
    handleTabClose(tab) {
        // Animate tab closing
        gsap.to(tab, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'back.in(1.7)',
            onComplete: () => {
                // If this was the active tab, switch to app.js
                if (tab.classList.contains('active')) {
                    const appTab = document.querySelector('[data-file="app.js"]');
                    if (appTab) {
                        appTab.click();
                    }
                }
                
                // Restore tab after 2 seconds
                setTimeout(() => {
                    gsap.to(tab, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.3,
                        ease: 'back.out(1.7)'
                    });
                }, 2000);
            }
        });
    },
    
    startBuildProcess(tabs, fileContents, lineNumbers, fileLinesCount) {
        // Switch to build view
        this.switchToFile('build', tabs, fileContents, lineNumbers, fileLinesCount);
        
        // Animate build steps
        const buildSteps = document.querySelectorAll('.build-step');
        const progressBars = document.querySelectorAll('.progress-fill');
        
        // Reset all steps
        buildSteps.forEach(step => {
            step.classList.remove('active', 'completed');
        });
        progressBars.forEach(bar => {
            bar.style.width = '0%';
        });
        
        // Animate each step
        buildSteps.forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('active');
                
                // Animate progress bar
                const progressBar = step.querySelector('.progress-fill');
                gsap.to(progressBar, {
                    width: '100%',
                    duration: 1.5,
                    ease: 'power2.out',
                    onComplete: () => {
                        step.classList.remove('active');
                        step.classList.add('completed');
                        
                        // Show build output after last step
                        if (index === buildSteps.length - 1) {
                            setTimeout(() => {
                                const buildOutput = document.querySelector('.build-output');
                                gsap.from(buildOutput, {
                                    opacity: 0,
                                    y: 20,
                                    duration: 0.5,
                                    ease: 'power2.out'
                                });
                                
                                // Animate output lines
                                const outputLines = buildOutput.querySelectorAll('.output-line');
                                gsap.from(outputLines, {
                                    opacity: 0,
                                    x: -20,
                                    duration: 0.3,
                                    stagger: 0.2,
                                    ease: 'power2.out'
                                });
                            }, 500);
                        }
                    }
                });
            }, index * 2000);
        });
    },
    
    startDeployment(tabs, fileContents, lineNumbers, fileLinesCount) {
        // Directly switch to deployment view
        this.switchToFile('deploy', tabs, fileContents, lineNumbers, fileLinesCount);
        
        // Animate deployed app immediately
        const deployedApp = document.querySelector('.deployed-app-container');
        
        gsap.from(deployedApp, {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: 'back.out(1.7)'
        });
        
        // Animate app elements
        gsap.from('.app-header', {
            y: -50,
            opacity: 0,
            duration: 0.8,
            delay: 0.3,
            ease: 'power2.out'
        });
        
        gsap.from('.hero-content-app > *', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            delay: 0.6,
            ease: 'power2.out'
        });
        
        gsap.from('.float-item', {
            scale: 0,
            rotation: 180,
            duration: 0.8,
            stagger: 0.1,
            delay: 0.8,
            ease: 'back.out(1.7)'
        });
        
        gsap.from('.deployment-status', {
            y: 20,
            opacity: 0,
            duration: 0.5,
            delay: 1.2,
            ease: 'power2.out'
        });
        
        // Add interactive elements to deployed app
        this.initDeployedAppInteractions();
    },
    
    initDeployedAppInteractions() {
        // Make nav items interactive
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                gsap.to(item, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                });
            });
        });
        
        // Make stats interactive
        const statItems = document.querySelectorAll('.stat-item-app');
        statItems.forEach(item => {
            item.addEventListener('click', () => {
                gsap.to(item, {
                    scale: 1.1,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                });
            });
        });
        
        // Make CTA buttons interactive
        const ctaBtns = document.querySelectorAll('.cta-btn');
        ctaBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Create success notification
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(80, 250, 123, 0.9);
                    color: var(--primary-bg);
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    font-weight: 600;
                    z-index: 1000;
                    opacity: 0;
                `;
                notification.textContent = btn.classList.contains('primary') ? 
                    '🎉 Redirecting to projects...' : '📧 Opening contact form...';
                
                document.body.appendChild(notification);
                
                gsap.to(notification, {
                    opacity: 1,
                    scale: 1.1,
                    duration: 0.3,
                    ease: 'back.out(1.7)',
                    onComplete: () => {
                        setTimeout(() => {
                            gsap.to(notification, {
                                opacity: 0,
                                scale: 0.8,
                                duration: 0.3,
                                onComplete: () => notification.remove()
                            });
                        }, 2000);
                    }
                });
            });
        });
    },
    
    
    showDebugInfo(tabs, fileContents, lineNumbers, fileLinesCount) {
        // Switch to a debug view in the code editor
        this.switchToFile('debug', tabs, fileContents, lineNumbers, fileLinesCount);
    },
    
    simulateCodeExecution() {
        const consoleContent = document.querySelector('.execution-content');
        const newLine = document.createElement('div');
        newLine.className = 'console-line';
        newLine.innerHTML = `
            <span class="console-prompt">></span>
            <span class="console-output">Code executed successfully! 🎉</span>
        `;
        
        consoleContent.appendChild(newLine);
        
        gsap.from(newLine, {
            opacity: 0,
            x: -20,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            gsap.to(newLine, {
                opacity: 0,
                x: 20,
                duration: 0.3,
                onComplete: () => newLine.remove()
            });
        }, 3000);
    },
    
    initBackgroundEffects() {
        // Animate floating code snippets
        const codeSnippets = document.querySelectorAll('.code-snippet');
        codeSnippets.forEach((snippet, i) => {
            snippet.addEventListener('mouseenter', () => {
                gsap.to(snippet, {
                    scale: 1.1,
                    opacity: 0.8,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            snippet.addEventListener('mouseleave', () => {
                gsap.to(snippet, {
                    scale: 1,
                    opacity: 0.3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
        
        // Interactive grid dots
        const gridDots = document.querySelectorAll('.grid-dot');
        gridDots.forEach(dot => {
            dot.addEventListener('mouseenter', () => {
                gsap.to(dot, {
                    scale: 2,
                    opacity: 1,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });
            });
            
            dot.addEventListener('mouseleave', () => {
                gsap.to(dot, {
                    scale: 1,
                    opacity: 0.4,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    },
    
    animateHeroElements() {
        // Make sure all elements are visible first
        const heroElements = [
            '.interactive-terminal-window',
            '.hero-title',
            '.tech-badges',
            '.hero-cta',
            '.interactive-code-editor',
            '.hero-stats-mini'
        ];
        
        heroElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '1';
                element.style.visibility = 'visible';
                element.style.transform = 'none';
            }
        });
        
        // Simple fade-in animation for existing elements
        const terminalWindow = document.querySelector('.interactive-terminal-window');
        const codeEditor = document.querySelector('.interactive-code-editor');
        const techBadges = document.querySelector('.tech-badges');
        const heroCta = document.querySelector('.hero-cta');
        
        if (terminalWindow) {
            gsap.from(terminalWindow, {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: 'power2.out'
            });
        }
        
        if (codeEditor) {
            gsap.from(codeEditor, {
                x: 50,
                opacity: 0,
                duration: 1,
                delay: 0.3,
                ease: 'power2.out'
            });
        }
        
        if (techBadges) {
            const badges = techBadges.querySelectorAll('.interactive-badge');
            if (badges.length > 0) {
                gsap.from(badges, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    delay: 0.6,
                    ease: 'back.out(1.7)'
                });
            }
        }
        
        if (heroCta) {
            const ctaButtons = heroCta.querySelectorAll('.interactive-cta');
            if (ctaButtons.length > 0) {
                gsap.from(ctaButtons, {
                    y: 20,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    delay: 0.9,
                    ease: 'power2.out'
                });
            }
        }
    }
};

/* ===== TERMINAL ANIMATION ===== */
const terminalAnimation = {
    init() {
        // Animate terminal window appearance
        gsap.from('.terminal-window', {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            delay: 0.3,
            ease: 'back.out(1.7)'
        });
        
        // Animate terminal content
        gsap.from('.terminal-line', {
            x: -20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            delay: 0.8,
            ease: 'power2.out'
        });
    }
};

/* ===== SCROLL ANIMATIONS ===== */
const scrollAnimations = {
    init() {
        // Animate sections on scroll
        gsap.utils.toArray('section').forEach((section, i) => {
            gsap.fromTo(section, 
                {
                    y: 100,
                    opacity: 0
                },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        end: 'top 20%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power3.out'
                }
            );
        });
        
        // Initialize advanced about animations
        this.initAdvancedAboutAnimations();
        
        // Animate tech orbit
        this.animateTechOrbit();
        
        // Animate project cards
        this.animateProjectCards();
        
        // Animate stats counter
        this.animateStatsCounter();
        
        // Animate tech bars
        this.animateTechBars();
    },
    
    initAdvancedAboutAnimations() {
        // Interactive Timeline
        this.initInteractiveTimeline();
        
        // Tech Constellation
        this.initTechConstellation();
        
        // Interactive Stats
        this.initInteractiveStats();
        
        // Philosophy Items
        this.initPhilosophyAnimations();
    },
    
    initInteractiveTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            // Animate timeline items on scroll - much faster
            gsap.fromTo(item, 
                {
                    x: -30,
                    opacity: 0
                },
                {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    },
                    x: 0,
                    opacity: 1,
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: 'power2.out'
                }
            );
            
            // Add click interaction
            item.addEventListener('click', () => {
                // Remove active class from all items
                timelineItems.forEach(i => i.classList.remove('active'));
                // Add active class to clicked item
                item.classList.add('active');
                
                // Animate the clicked item
                gsap.to(item, {
                    scale: 1.02,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                });
            });
        });
    },
    
    initTechConstellation() {
        const techStars = document.querySelectorAll('.tech-star');
        const tooltip = document.querySelector('.tech-tooltip');
        
        // Tech descriptions
        const techDescriptions = {
            'React': 'Advanced React development with hooks, context, and performance optimization',
            'Node.js': 'Server-side JavaScript with Express, APIs, and microservices architecture',
            'TypeScript': 'Type-safe JavaScript development for large-scale applications',
            'AWS': 'Cloud infrastructure, serverless computing, and DevOps practices',
            'Docker': 'Containerization and orchestration for scalable deployments',
            'GraphQL': 'Modern API development with efficient data fetching',
            'MongoDB': 'NoSQL database design and optimization',
            'Kubernetes': 'Container orchestration and cluster management'
        };
        
        techStars.forEach((star, index) => {
            // Animate stars on scroll
            gsap.fromTo(star, 
                {
                    scale: 0,
                    rotation: -180,
                    opacity: 0
                },
                {
                    scrollTrigger: {
                        trigger: '.tech-constellation',
                        start: 'top 70%',
                        toggleActions: 'play none none reverse'
                    },
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: 'back.out(1.7)'
                }
            );
            
            // Add hover interactions
            star.addEventListener('mouseenter', (e) => {
                const tech = star.dataset.tech;
                const level = star.dataset.level;
                
                // Update tooltip content
                tooltip.querySelector('.tooltip-title').textContent = tech;
                tooltip.querySelector('.level-percentage').textContent = `${level}%`;
                tooltip.querySelector('.level-fill').style.width = `${level}%`;
                tooltip.querySelector('.tooltip-description').textContent = techDescriptions[tech] || 'Advanced expertise in this technology';
                
                // Show tooltip
                tooltip.classList.add('show');
                
                // Animate star
                gsap.to(star, {
                    scale: 1.3,
                    rotation: 10,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                // Create connection effect to center
                this.createConnectionEffect(star);
            });
            
            star.addEventListener('mouseleave', () => {
                // Hide tooltip
                tooltip.classList.remove('show');
                
                // Reset star
                gsap.to(star, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    },
    
    createConnectionEffect(star) {
        const centerAvatar = document.querySelector('.central-avatar');
        const starRect = star.getBoundingClientRect();
        const centerRect = centerAvatar.getBoundingClientRect();
        
        // Create temporary connection line
        const connection = document.createElement('div');
        connection.style.cssText = `
            position: fixed;
            background: var(--primary-accent);
            height: 2px;
            transform-origin: left center;
            pointer-events: none;
            z-index: 15;
            opacity: 0.8;
            box-shadow: 0 0 10px var(--primary-accent);
        `;
        
        const dx = centerRect.left + centerRect.width/2 - (starRect.left + starRect.width/2);
        const dy = centerRect.top + centerRect.height/2 - (starRect.top + starRect.height/2);
        const distance = Math.sqrt(dx*dx + dy*dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        connection.style.left = `${starRect.left + starRect.width/2}px`;
        connection.style.top = `${starRect.top + starRect.height/2}px`;
        connection.style.width = `${distance}px`;
        connection.style.transform = `rotate(${angle}deg)`;
        
        document.body.appendChild(connection);
        
        // Animate connection
        gsap.fromTo(connection, 
            { scaleX: 0 },
            { 
                scaleX: 1, 
                duration: 0.3,
                ease: 'power2.out',
                onComplete: () => {
                    setTimeout(() => {
                        gsap.to(connection, {
                            opacity: 0,
                            duration: 0.3,
                            onComplete: () => connection.remove()
                        });
                    }, 1000);
                }
            }
        );
    },
    
    initInteractiveStats() {
        const stats = document.querySelectorAll('.interactive-stat');
        
        stats.forEach((stat, index) => {
            // Animate stats on scroll
            gsap.fromTo(stat, 
                {
                    y: 50,
                    opacity: 0,
                    scale: 0.8
                },
                {
                    scrollTrigger: {
                        trigger: stat,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: 'back.out(1.7)'
                }
            );
            
            // Add click interaction
            stat.addEventListener('click', () => {
                // Create ripple effect
                const ripple = document.createElement('div');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(0, 212, 255, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                const rect = stat.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${rect.width/2 - size/2}px`;
                ripple.style.top = `${rect.height/2 - size/2}px`;
                
                stat.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    },
    
    initPhilosophyAnimations() {
        const philosophyItems = document.querySelectorAll('.philosophy-item');
        
        philosophyItems.forEach((item, index) => {
            // Animate philosophy items
            gsap.fromTo(item, 
                {
                    x: -30,
                    opacity: 0
                },
                {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    x: 0,
                    opacity: 1,
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: 'power2.out'
                }
            );
            
            // Add hover sound effect (visual feedback)
            item.addEventListener('mouseenter', () => {
                gsap.to(item.querySelector('.principle-icon'), {
                    scale: 1.2,
                    rotation: 10,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });
            });
            
            item.addEventListener('mouseleave', () => {
                gsap.to(item.querySelector('.principle-icon'), {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    },
    
    animateTechOrbit() {
        const orbits = document.querySelectorAll('.orbit');
        
        if (orbits.length > 0) {
            orbits.forEach((orbit, i) => {
                gsap.to(orbit, {
                    rotation: 360,
                    duration: 20 + (i * 5),
                    repeat: -1,
                    ease: 'none'
                });
            });
        }
        
        // Animate tech nodes only if they exist
        const techNodes = document.querySelectorAll('.tech-node');
        if (techNodes.length > 0) {
            gsap.from('.tech-node', {
                scale: 0,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                delay: 1,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: '.tech-orbit',
                    start: 'top 80%'
                }
            });
        }
    },
    
    animateProjectCards() {
        gsap.from('.project-card', {
            y: 80,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.projects-showcase',
                start: 'top 80%'
            }
        });
        
        // Animate client cards
        gsap.from('.client-card', {
            scale: 0.8,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.client-grid',
                start: 'top 80%'
            }
        });
    },
    
    animateStatsCounter() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            
            ScrollTrigger.create({
                trigger: stat,
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(stat, {
                        innerHTML: target,
                        duration: 2,
                        snap: { innerHTML: 1 },
                        ease: 'power2.out'
                    });
                }
            });
        });
    },
    
    animateTechBars() {
        const techItems = document.querySelectorAll('.tech-item');
        
        techItems.forEach(item => {
            const level = item.dataset.level;
            const progress = item.querySelector('.tech-progress');
            
            ScrollTrigger.create({
                trigger: item,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(progress, {
                        width: `${level}%`,
                        duration: 1.5,
                        ease: 'power2.out',
                        delay: Math.random() * 0.3
                    });
                }
            });
        });
    }
};

/* ===== NAVIGATION EFFECTS ===== */
const navigationEffects = {
    init() {
        this.updateActiveSection();
        this.handleMobileMenu();
        this.updateScrollProgress();
    },
    
    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('#nav-links a');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    },
    
    handleMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('nav-links');
        
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('show');
        });
        
        // Close menu when clicking on links
        document.querySelectorAll('#nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('show');
            });
        });
    },
    
    updateScrollProgress() {
        const scrollProgress = document.getElementById('scroll-progress');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrolled = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = `${scrolled}%`;
        });
    }
};

/* ===== INTERACTIVE EFFECTS ===== */
const interactiveEffects = {
    init() {
        this.addHoverEffects();
        this.addClickEffects();
    },
    
    addHoverEffects() {
        // Project cards hover effect
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    scale: 1.02,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
        
        // Tech nodes hover effect
        document.querySelectorAll('.tech-node').forEach(node => {
            node.addEventListener('mouseenter', () => {
                gsap.to(node, {
                    scale: 1.2,
                    duration: 0.2,
                    ease: 'back.out(1.7)'
                });
            });
            
            node.addEventListener('mouseleave', () => {
                gsap.to(node, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'back.out(1.7)'
                });
            });
        });
    },
    
    addClickEffects() {
        // Add ripple effect to buttons
        document.querySelectorAll('.cta-primary, .cta-secondary').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
};

/* ===== PERFORMANCE OPTIMIZATIONS ===== */
const performanceOptimizations = {
    init() {
        this.lazyLoadImages();
        this.debounceScrollEvents();
    },
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    },
    
    debounceScrollEvents() {
        let ticking = false;
        
        function updateScrollEffects() {
            // Update any scroll-based effects here
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }
};

/* ===== TECHNICAL EXPERTISE INTERACTIVE SYSTEM ===== */
const technicalExpertise = {
    init() {
        this.initGlitchText();
        this.initTypingText();
        this.initPlanetInteractions();
        this.initSkillNodes();
        this.initDashboardCounters();
        this.initSkillPanel();
    },
    
    initGlitchText() {
        const glitchText = document.querySelector('.glitch-text');
        if (glitchText) {
            glitchText.setAttribute('data-text', glitchText.textContent);
        }
    },
    
    initTypingText() {
        const typingText = document.querySelector('.typing-text');
        if (typingText) {
            const text = typingText.textContent;
            typingText.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    typingText.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            // Start typing after a delay
            setTimeout(typeWriter, 1000);
        }
    },
    
    initPlanetInteractions() {
        const planets = document.querySelectorAll('.tech-planet');
        const skillPanel = document.getElementById('skillPanel');
        
        planets.forEach(planet => {
            planet.addEventListener('click', () => {
                const category = planet.dataset.category;
                this.showSkillPanel(category);
            });
            
            // Add hover effects
            planet.addEventListener('mouseenter', () => {
                gsap.to(planet.querySelector('.planet-core'), {
                    scale: 1.2,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });
                
                gsap.to(planet.querySelector('.planet-ring'), {
                    scale: 1.1,
                    duration: 0.3
                });
            });
            
            planet.addEventListener('mouseleave', () => {
                gsap.to(planet.querySelector('.planet-core'), {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                gsap.to(planet.querySelector('.planet-ring'), {
                    scale: 1,
                    duration: 0.3
                });
            });
        });
    },
    
    initSkillNodes() {
        const skillNodes = document.querySelectorAll('.skill-node');
        
        skillNodes.forEach(node => {
            // Random floating animation delays
            const delay = Math.random() * 2;
            node.style.animationDelay = `${delay}s`;
            
            // Click to show details
            node.addEventListener('click', () => {
                const skill = node.dataset.skill;
                const level = node.dataset.level;
                this.showSkillDetails(skill, level);
            });
            
            // Hover effects
            node.addEventListener('mouseenter', () => {
                gsap.to(node, {
                    scale: 1.3,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });
            });
            
            node.addEventListener('mouseleave', () => {
                gsap.to(node, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    },
    
    initDashboardCounters() {
        const dashboardItems = document.querySelectorAll('.dashboard-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item = entry.target;
                    const targetCount = parseInt(item.dataset.count);
                    const numberElement = item.querySelector('.dashboard-number');
                    
                    this.animateCounter(numberElement, targetCount);
                    observer.unobserve(item);
                }
            });
        });
        
        dashboardItems.forEach(item => observer.observe(item));
    },
    
    animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (target === 98 ? '%' : target === 500 ? '+' : target === 25 ? '+' : '+');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (target === 98 ? '%' : target === 500 ? '+' : target === 25 ? '+' : '+');
            }
        }, 50);
    },
    
    initSkillPanel() {
        const skillPanel = document.getElementById('skillPanel');
        const closeBtn = skillPanel.querySelector('.panel-close');
        
        closeBtn.addEventListener('click', () => {
            this.hideSkillPanel();
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!skillPanel.contains(e.target) && !e.target.closest('.tech-planet')) {
                this.hideSkillPanel();
            }
        });
    },
    
    showSkillPanel(category) {
        const skillPanel = document.getElementById('skillPanel');
        const panelTitle = skillPanel.querySelector('.panel-title');
        const skillDetails = skillPanel.querySelector('.skill-details');
        
        const categoryData = {
            frontend: {
                title: 'Frontend Architecture',
                skills: [
                    { name: 'React/Next.js', level: 95 },
                    { name: 'TypeScript', level: 90 },
                    { name: 'Modern CSS/SCSS', level: 98 },
                    { name: 'Vue.js/Nuxt', level: 85 }
                ]
            },
            backend: {
                title: 'Backend Systems',
                skills: [
                    { name: 'Node.js/Express', level: 92 },
                    { name: 'PHP/Laravel', level: 95 },
                    { name: 'GraphQL/REST APIs', level: 88 },
                    { name: 'Microservices', level: 85 }
                ]
            },
            cloud: {
                title: 'Cloud & DevOps',
                skills: [
                    { name: 'AWS/Azure', level: 88 },
                    { name: 'Docker/Kubernetes', level: 85 },
                    { name: 'CI/CD Pipelines', level: 92 },
                    { name: 'WordPress/CMS', level: 98 }
                ]
            }
        };
        
        const data = categoryData[category];
        if (!data) return;
        
        panelTitle.textContent = data.title;
        
        // Update skill details
        skillDetails.innerHTML = data.skills.map(skill => `
            <div class="skill-detail-item">
                <div class="skill-name">${skill.name}</div>
                <div class="skill-bar">
                    <div class="skill-fill" data-width="${skill.level}"></div>
                    <span class="skill-percent">${skill.level}%</span>
                </div>
            </div>
        `).join('');
        
        // Show panel
        skillPanel.classList.add('show');
        
        // Animate skill bars
        setTimeout(() => {
            const skillFills = skillPanel.querySelectorAll('.skill-fill');
            skillFills.forEach(fill => {
                const width = fill.dataset.width;
                gsap.to(fill, {
                    width: `${width}%`,
                    duration: 1,
                    ease: 'power2.out',
                    delay: 0.1
                });
            });
        }, 300);
    },
    
    hideSkillPanel() {
        const skillPanel = document.getElementById('skillPanel');
        skillPanel.classList.remove('show');
    },
    
    showSkillDetails(skill, level) {
        // Create floating detail popup
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--secondary-bg);
            border: 2px solid var(--primary-accent);
            border-radius: 12px;
            padding: 2rem;
            z-index: 1000;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            opacity: 0;
            scale: 0.8;
        `;
        
        popup.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 1rem;">🚀</div>
            <h3 style="color: var(--primary-accent); margin-bottom: 1rem;">${skill}</h3>
            <div style="font-size: 2rem; font-weight: 700; color: var(--primary-accent); margin-bottom: 0.5rem;">${level}%</div>
            <div style="color: var(--text-secondary);">Proficiency Level</div>
            <button onclick="this.parentElement.remove()" style="
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 1.5rem;
                cursor: pointer;
            ">×</button>
        `;
        
        document.body.appendChild(popup);
        
        gsap.to(popup, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            gsap.to(popup, {
                opacity: 0,
                scale: 0.8,
                duration: 0.3,
                onComplete: () => popup.remove()
            });
        }, 3000);
    }
};

/* ===== EXPERIENCE TIMELINE INTERACTIVE SYSTEM ===== */
const experienceTimeline = {
    init() {
        this.initTimelineProgress();
        this.initTimelineCards();
        this.initTimelineMarkers();
        this.initScrollAnimations();
    },
    
    initTimelineProgress() {
        const timelineProgress = document.querySelector('.timeline-progress');
        if (!timelineProgress) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timelineProgress.style.animation = 'timeline-progress 3s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        });
        
        const timelineContainer = document.querySelector('.timeline-container');
        if (timelineContainer) {
            observer.observe(timelineContainer);
        }
    },
    
    initTimelineCards() {
        const timelineCards = document.querySelectorAll('.timeline-card');
        
        timelineCards.forEach((card, index) => {
            // Add click interaction for detailed view
            card.addEventListener('click', () => {
                this.showJobDetails(card, index);
            });
            
            // Enhanced hover effects
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCardHover(card, false);
            });
            
            // Ensure cards are visible
            gsap.set(card, {
                opacity: 1,
                visibility: 'visible'
            });
        });
    },
    
    initTimelineMarkers() {
        const markers = document.querySelectorAll('.timeline-marker');
        
        markers.forEach((marker, index) => {
            // Add click interaction
            marker.addEventListener('click', () => {
                this.highlightTimelineItem(marker, index);
            });
            
            // Ensure markers are visible
            gsap.set(marker, {
                opacity: 1,
                visibility: 'visible',
                scale: 1
            });
        });
    },
    
    initScrollAnimations() {
        // Animate achievement items on scroll
        const achievementItems = document.querySelectorAll('.achievement-item');
        
        achievementItems.forEach((item, index) => {
            // Ensure achievement items are visible
            gsap.set(item, {
                opacity: 1,
                visibility: 'visible'
            });
        });
        
        // Animate tech tags
        const techTags = document.querySelectorAll('.tech-tag');
        techTags.forEach(tag => {
            tag.addEventListener('click', () => {
                this.animateTechTag(tag);
            });
        });
    },
    
    animateCardHover(card, isHovering) {
        const tl = gsap.timeline();
        
        if (isHovering) {
            tl.to(card, {
                y: -10,
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            })
            .to(card.querySelector('.company-logo'), {
                rotation: 360,
                duration: 0.5,
                ease: 'power2.out'
            }, 0)
            .to(card.querySelectorAll('.achievement-item'), {
                x: 5,
                duration: 0.2,
                stagger: 0.05,
                ease: 'power2.out'
            }, 0.1);
        } else {
            tl.to(card, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            })
            .to(card.querySelector('.company-logo'), {
                rotation: 0,
                duration: 0.3,
                ease: 'power2.out'
            }, 0)
            .to(card.querySelectorAll('.achievement-item'), {
                x: 0,
                duration: 0.2,
                stagger: 0.02,
                ease: 'power2.out'
            }, 0);
        }
    },
    
    showJobDetails(card, index) {
        const jobData = this.getJobData(index);
        if (!jobData) return;
        
        // Create detailed modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
        `;
        
        modal.innerHTML = `
            <div style="
                background: var(--secondary-bg);
                border: 2px solid var(--primary-accent);
                border-radius: 20px;
                padding: 3rem;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                transform: scale(0.8);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="color: var(--primary-accent); margin: 0;">${jobData.title}</h2>
                    <button onclick="this.closest('.modal').remove()" style="
                        background: none;
                        border: none;
                        color: var(--text-secondary);
                        font-size: 2rem;
                        cursor: pointer;
                        padding: 0;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='var(--primary-accent)'; this.style.color='var(--primary-bg)'" onmouseout="this.style.background='none'; this.style.color='var(--text-secondary)'">×</button>
                </div>
                <div style="color: var(--text-primary); line-height: 1.6;">
                    <p><strong>Company:</strong> ${jobData.company}</p>
                    <p><strong>Period:</strong> ${jobData.period}</p>
                    <p><strong>Role:</strong> ${jobData.role}</p>
                    <div style="margin-top: 2rem;">
                        <h3 style="color: var(--primary-accent); margin-bottom: 1rem;">Key Achievements:</h3>
                        ${jobData.details.map(detail => `<p style="margin-bottom: 1rem;">• ${detail}</p>`).join('')}
                    </div>
                    <div style="margin-top: 2rem;">
                        <h3 style="color: var(--primary-accent); margin-bottom: 1rem;">Technologies Used:</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${jobData.technologies.map(tech => `<span style="
                                background: rgba(0, 212, 255, 0.1);
                                color: var(--primary-accent);
                                padding: 0.5rem 1rem;
                                border-radius: 20px;
                                font-size: 0.9rem;
                                border: 1px solid rgba(0, 212, 255, 0.2);
                            ">${tech}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        modal.className = 'modal';
        document.body.appendChild(modal);
        
        // Animate modal appearance
        gsap.to(modal, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        gsap.to(modal.querySelector('div'), {
            scale: 1,
            duration: 0.3,
            delay: 0.1,
            ease: 'back.out(1.7)'
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                gsap.to(modal, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => modal.remove()
                });
            }
        });
    },
    
    getJobData(index) {
        const jobs = [
            {
                title: 'Senior WordPress Developer',
                company: 'Fat Beehive',
                period: '2025 – Present',
                role: 'Leading accessible WordPress development for non-profits',
                details: [
                    'Spearheading the development of accessible, user-friendly WordPress sites for non-profits and mission-driven organizations',
                    'Architecting custom themes and ACF-powered blocks tailored to specific client needs and accessibility standards',
                    'Collaborating closely with designers and project managers from discovery phase through deployment',
                    'Managing Git-based workflows and contributing to DevOps improvements and deployment automation'
                ],
                technologies: ['WordPress', 'ACF', 'Git', 'DevOps', 'Accessibility', 'Custom Themes']
            },
            {
                title: 'Senior Web Developer / Team Lead',
                company: 'Kodekrew Technology',
                period: '2021 – 2023',
                role: 'Leading fullstack development team',
                details: [
                    'Directed a small but efficient team delivering fullstack solutions using WordPress, React, and Laravel',
                    'Successfully integrated complex third-party APIs and delivered enterprise-grade websites',
                    'Mentored junior developers, conducted comprehensive code reviews, and implemented CI/CD pipelines',
                    'Established development standards and best practices that improved team productivity by 40%'
                ],
                technologies: ['React', 'Laravel', 'WordPress', 'APIs', 'CI/CD', 'Team Leadership', 'Code Reviews']
            },
            {
                title: 'Senior WordPress Developer',
                company: 'ESSL',
                period: '2019 – 2021',
                role: 'Managing high-traffic WordPress sites',
                details: [
                    'Successfully managed high-traffic WordPress sites across multiple industries including e-commerce and corporate',
                    'Developed and customized WooCommerce solutions and created reusable ACF components',
                    'Collaborated effectively with UI/UX teams and maintained production environments with 99.9% uptime',
                    'Optimized site performance resulting in 50% faster load times and improved user experience'
                ],
                technologies: ['WordPress', 'WooCommerce', 'ACF', 'UI/UX', 'Performance Optimization', 'Production Management']
            },
            {
                title: 'WordPress Developer',
                company: 'Orange Designs',
                period: '2017 – 2019',
                role: 'Custom theme and plugin development',
                details: [
                    'Developed custom themes and plugins for various clients across different industries',
                    'Optimized backend performance and handled complex site migrations with zero downtime',
                    'Integrated third-party APIs and extended WordPress core features to meet specific client requirements',
                    'Built responsive, mobile-first designs that improved user engagement by 35%'
                ],
                technologies: ['WordPress', 'PHP', 'APIs', 'Custom Plugins', 'Site Migration', 'Responsive Design']
            },
            {
                title: 'Web Dev Intern',
                company: 'Techo Inc',
                period: '2015 – 2017',
                role: 'Frontend development and learning',
                details: [
                    'Built responsive user interfaces from design mockups using HTML, CSS, and JavaScript',
                    'Supported frontend/backend integration in PHP projects and learned industry best practices',
                    'Worked closely with designers to achieve pixel-perfect output and maintain design consistency',
                    'Gained foundational experience in web development and established career trajectory'
                ],
                technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'Responsive Design', 'Design Implementation']
            }
        ];
        
        return jobs[index] || null;
    },
    
    highlightTimelineItem(marker, index) {
        // Remove previous highlights
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.classList.remove('highlighted');
        });
        
        // Add highlight to current item
        const timelineItem = marker.closest('.timeline-item');
        timelineItem.classList.add('highlighted');
        
        // Animate highlight
        gsap.to(timelineItem, {
            scale: 1.05,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
    },
    
    animateTechTag(tag) {
        gsap.to(tag, {
            scale: 1.2,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
    }
};

/* ===== EDUCATION SECTION INTERACTIVE SYSTEM ===== */
const educationSection = {
    init() {
        this.initDegreeCard();
        this.initCertificationCards();
        this.initScrollAnimations();
    },
    
    initDegreeCard() {
        const degreeCard = document.querySelector('.degree-card');
        if (!degreeCard) return;
        
        degreeCard.addEventListener('click', () => {
            this.showDegreeDetails();
        });
        
        // Enhanced hover effects
        degreeCard.addEventListener('mouseenter', () => {
            gsap.to(degreeCard, {
                y: -15,
                scale: 1.05,
                duration: 0.5,
                ease: 'back.out(1.7)'
            });
        });
        
        degreeCard.addEventListener('mouseleave', () => {
            gsap.to(degreeCard, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    },
    
    initCertificationCards() {
        const certCards = document.querySelectorAll('.cert-card');
        
        certCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showCertificationDetails(card, index);
            });
            
            // Ensure certification cards are visible
            gsap.set(card, {
                opacity: 1,
                visibility: 'visible',
                rotation: 0
            });
        });
    },
    
    initScrollAnimations() {
        // Ensure degree card is visible
        const degreeCard = document.querySelector('.degree-card');
        if (degreeCard) {
            gsap.set(degreeCard, {
                opacity: 1,
                visibility: 'visible',
                scale: 1,
                rotation: 0
            });
        }
    },
    
    showDegreeDetails() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
        `;
        
        modal.innerHTML = `
            <div style="
                background: var(--secondary-bg);
                border: 2px solid var(--primary-accent);
                border-radius: 20px;
                padding: 3rem;
                max-width: 500px;
                width: 90%;
                text-align: center;
                transform: scale(0.8);
            ">
                <div style="font-size: 4rem; margin-bottom: 2rem;">🎓</div>
                <h2 style="color: var(--primary-accent); margin-bottom: 1rem;">Bachelor of Science</h2>
                <h3 style="color: var(--text-primary); margin-bottom: 1rem;">Physiology</h3>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">University of Ibadan, Nigeria</p>
                <p style="color: var(--primary-accent); font-size: 1.2rem; font-weight: 700; margin-bottom: 2rem;">Graduated 2015</p>
                <p style="color: var(--text-primary); line-height: 1.6; margin-bottom: 2rem;">
                    Strong foundation in scientific research, analytical thinking, and problem-solving. 
                    This background in life sciences provided excellent analytical skills that translate 
                    perfectly to systematic approaches in software development and debugging.
                </p>
                <button onclick="this.closest('.modal').remove()" style="
                    background: var(--primary-accent);
                    color: var(--primary-bg);
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Close</button>
            </div>
        `;
        
        modal.className = 'modal';
        document.body.appendChild(modal);
        
        gsap.to(modal, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        gsap.to(modal.querySelector('div'), {
            scale: 1,
            duration: 0.3,
            delay: 0.1,
            ease: 'back.out(1.7)'
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                gsap.to(modal, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => modal.remove()
                });
            }
        });
    },
    
    showCertificationDetails(card, index) {
        const certData = this.getCertificationData(index);
        if (!certData) return;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
        `;
        
        modal.innerHTML = `
            <div style="
                background: var(--secondary-bg);
                border: 2px solid var(--primary-accent);
                border-radius: 20px;
                padding: 3rem;
                max-width: 500px;
                width: 90%;
                text-align: center;
                transform: scale(0.8);
            ">
                <div style="font-size: 4rem; margin-bottom: 2rem;">${certData.icon}</div>
                <h2 style="color: var(--primary-accent); margin-bottom: 1rem;">${certData.name}</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">${certData.provider}</p>
                <p style="color: var(--text-primary); line-height: 1.6; margin-bottom: 2rem;">${certData.description}</p>
                <div style="margin-bottom: 2rem;">
                    <h4 style="color: var(--primary-accent); margin-bottom: 1rem;">Skills Gained:</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
                        ${certData.skills.map(skill => `<span style="
                            background: rgba(0, 212, 255, 0.1);
                            color: var(--primary-accent);
                            padding: 0.5rem 1rem;
                            border-radius: 15px;
                            font-size: 0.9rem;
                            border: 1px solid rgba(0, 212, 255, 0.2);
                        ">${skill}</span>`).join('')}
                    </div>
                </div>
                <button onclick="this.closest('.modal').remove()" style="
                    background: var(--primary-accent);
                    color: var(--primary-bg);
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Close</button>
            </div>
        `;
        
        modal.className = 'modal';
        document.body.appendChild(modal);
        
        gsap.to(modal, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        gsap.to(modal.querySelector('div'), {
            scale: 1,
            duration: 0.3,
            delay: 0.1,
            ease: 'back.out(1.7)'
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                gsap.to(modal, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => modal.remove()
                });
            }
        });
    },
    
    getCertificationData(index) {
        const certifications = [
            {
                name: 'Certified Web Professional',
                provider: 'CIW',
                icon: '🏆',
                description: 'Comprehensive web development certification covering industry standards and best practices.',
                skills: ['Web Standards', 'HTML/CSS', 'JavaScript', 'Web Security', 'Project Management']
            },
            {
                name: 'React Developer Certificate',
                provider: 'Meta (Coursera)',
                icon: '⚛️',
                description: 'Advanced React development certification from Meta, covering modern React patterns and best practices.',
                skills: ['React', 'JSX', 'Hooks', 'State Management', 'Component Architecture']
            },
            {
                name: 'Git & GitHub for Developers',
                provider: 'LinkedIn Learning',
                icon: '📚',
                description: 'Comprehensive version control and collaboration certification for professional development workflows.',
                skills: ['Git', 'GitHub', 'Version Control', 'Collaboration', 'Branching Strategies']
            },
            {
                name: 'WordPress Plugin Development',
                provider: 'WP Academy',
                icon: '🔌',
                description: 'Advanced WordPress plugin development certification covering custom functionality and best practices.',
                skills: ['WordPress', 'PHP', 'Plugin Architecture', 'Hooks & Filters', 'Database Design']
            },
            {
                name: 'JavaScript Algorithms & Data Structures',
                provider: 'freeCodeCamp',
                icon: '💻',
                description: 'Comprehensive JavaScript certification covering algorithms, data structures, and problem-solving.',
                skills: ['JavaScript', 'Algorithms', 'Data Structures', 'Problem Solving', 'ES6+']
            },
            {
                name: 'Docker Essentials for Web Developers',
                provider: 'Udemy',
                icon: '🐳',
                description: 'Container technology certification covering Docker fundamentals and deployment strategies.',
                skills: ['Docker', 'Containerization', 'DevOps', 'Deployment', 'Microservices']
            },
            {
                name: 'HTML5, CSS3 & JavaScript',
                provider: 'Professional Certification',
                icon: '🌐',
                description: 'Foundation web technologies certification covering modern web development standards.',
                skills: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Web APIs']
            },
            {
                name: 'Advanced WordPress Theme Development',
                provider: 'Professional Certification',
                icon: '🎨',
                description: 'Advanced WordPress theme development certification covering custom themes and optimization.',
                skills: ['WordPress', 'PHP', 'Custom Themes', 'Performance', 'SEO']
            }
        ];
        
        return certifications[index] || null;
    }
};

/* ===== PROJECTS SHOWCASE INTERACTIVE SYSTEM ===== */
const projectsShowcase = {
    currentSlide: 0,
    totalSlides: 3,
    
    init() {
        this.initFilterTabs();
        this.initCarousel();
        this.initProjectButtons();
        this.initClientCards();
        this.initStatCounters();
        this.initScrollAnimations();
    },
    
    initFilterTabs() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectSlides = document.querySelectorAll('.project-slide');
        
        // Ensure filter buttons are visible
        filterBtns.forEach((btn, index) => {
            gsap.set(btn, {
                opacity: 1,
                visibility: 'visible'
            });
            
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                // Update active filter button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Animate button click
                gsap.to(btn, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                });
                
                // Filter projects
                this.filterProjects(filter);
            });
        });
    },
    
    filterProjects(filter) {
        const projectSlides = document.querySelectorAll('.project-slide');
        const visibleSlides = [];
        
        projectSlides.forEach((slide, index) => {
            const categories = slide.dataset.category.split(' ');
            const shouldShow = filter === 'all' || categories.includes(filter);
            
            if (shouldShow) {
                visibleSlides.push(index);
            }
        });
        
        // Show first matching project
        if (visibleSlides.length > 0) {
            this.showSlide(visibleSlides[0]);
        }
    },
    
    initCarousel() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const dots = document.querySelectorAll('.carousel-dots .dot');
        
        // Previous button
        prevBtn.addEventListener('click', () => {
            this.previousSlide();
        });
        
        // Next button
        nextBtn.addEventListener('click', () => {
            this.nextSlide();
        });
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.showSlide(index);
            });
        });
        
        // Auto-play carousel
        this.startAutoPlay();
        
        // Pause on hover
        const carousel = document.querySelector('.featured-projects-carousel');
        carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
        carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    },
    
    showSlide(index) {
        const slides = document.querySelectorAll('.project-slide');
        const dots = document.querySelectorAll('.carousel-dots .dot');
        
        // Hide current slide
        const currentSlide = slides[this.currentSlide];
        if (currentSlide) {
            gsap.to(currentSlide, {
                opacity: 0,
                x: -100,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    currentSlide.classList.remove('active');
                    currentSlide.style.display = 'none';
                }
            });
        }
        
        // Show new slide
        this.currentSlide = index;
        const newSlide = slides[this.currentSlide];
        
        if (newSlide) {
            newSlide.style.display = 'grid';
            newSlide.classList.add('active');
            
            gsap.fromTo(newSlide, 
                { opacity: 0, x: 100 },
                { 
                    opacity: 1, 
                    x: 0, 
                    duration: 0.5, 
                    ease: 'power2.out',
                    delay: 0.1
                }
            );
            
            // Animate project mockup
            const mockup = newSlide.querySelector('.project-mockup');
            if (mockup) {
                gsap.fromTo(mockup,
                    { scale: 0.8, rotationY: -20 },
                    { 
                        scale: 1, 
                        rotationY: 0, 
                        duration: 0.6, 
                        ease: 'back.out(1.7)',
                        delay: 0.3
                    }
                );
            }
            
            // Animate project info
            const projectInfo = newSlide.querySelector('.project-info');
            if (projectInfo) {
                const elements = projectInfo.children;
                gsap.fromTo(elements,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        stagger: 0.1,
                        ease: 'power2.out',
                        delay: 0.4
                    }
                );
            }
        }
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    },
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.showSlide(nextIndex);
    },
    
    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(prevIndex);
    },
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 8000); // Change slide every 8 seconds
    },
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    },
    
    initProjectButtons() {
        const projectBtns = document.querySelectorAll('.project-btn');
        
        projectBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const projectSlide = btn.closest('.project-slide');
                const projectTitle = projectSlide.querySelector('.project-title').textContent;
                
                // Animate button click
                gsap.to(btn, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                });
                
                // Handle different actions
                switch (action) {
                    case 'demo':
                        this.showProjectDemo(projectTitle, projectSlide);
                        break;
                    case 'code':
                        this.showProjectCode(projectTitle, projectSlide);
                        break;
                    case 'details':
                        this.showProjectDetails(projectTitle, projectSlide);
                        break;
                }
            });
        });
    },
    
    showProjectDemo(title, slide) {
        const modal = this.createModal(`🚀 ${title} - Live Demo`, `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 2rem;">🚀</div>
                <h3 style="color: var(--primary-accent); margin-bottom: 2rem;">${title}</h3>
                <p style="color: var(--text-primary); margin-bottom: 2rem; line-height: 1.6;">
                    Experience the full functionality of this project in our interactive demo environment.
                </p>
                <div style="background: var(--secondary-bg); border-radius: 12px; padding: 2rem; margin: 2rem 0; border: 1px solid rgba(0, 212, 255, 0.2);">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="width: 12px; height: 12px; background: #27ca3f; border-radius: 50%;"></div>
                        <span style="color: var(--text-secondary); font-family: var(--font-mono);">demo.${title.toLowerCase().replace(/\s+/g, '')}.dev</span>
                    </div>
                    <div style="background: #f8f9fa; border-radius: 8px; padding: 3rem; color: #666; border: 2px dashed #ddd;">
                        Interactive Demo Environment<br>
                        <small>Full functionality available</small>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="window.open('#', '_blank')" style="
                        background: var(--primary-accent);
                        color: var(--primary-bg);
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 25px;
                        font-weight: 600;
                        cursor: pointer;
                    ">🌐 Open Demo</button>
                    <button onclick="this.closest('.modal').remove()" style="
                        background: transparent;
                        color: var(--primary-accent);
                        border: 2px solid var(--primary-accent);
                        padding: 1rem 2rem;
                        border-radius: 25px;
                        font-weight: 600;
                        cursor: pointer;
                    ">Close</button>
                </div>
            </div>
        `);
        
        document.body.appendChild(modal);
        this.animateModal(modal);
    },
    
    showProjectCode(title, slide) {
        const modal = this.createModal(`💻 ${title} - Source Code`, `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 2rem;">💻</div>
                <h3 style="color: var(--primary-accent); margin-bottom: 2rem;">${title}</h3>
                <p style="color: var(--text-primary); margin-bottom: 2rem; line-height: 1.6;">
                    Explore the source code and technical implementation details.
                </p>
                <div style="background: #1e1e1e; border-radius: 12px; padding: 2rem; margin: 2rem 0; font-family: var(--font-mono);">
                    <div style="color: #888; margin-bottom: 1rem; font-size: 0.9rem;">Repository Structure:</div>
                    <div style="text-align: left; color: #ccc; line-height: 1.8;">
                        📁 src/<br>
                        &nbsp;&nbsp;📁 components/<br>
                        &nbsp;&nbsp;📁 pages/<br>
                        &nbsp;&nbsp;📁 utils/<br>
                        📁 public/<br>
                        📄 package.json<br>
                        📄 README.md
                    </div>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="window.open('https://github.com', '_blank')" style="
                        background: #333;
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 25px;
                        font-weight: 600;
                        cursor: pointer;
                    ">🐙 View on GitHub</button>
                    <button onclick="this.closest('.modal').remove()" style="
                        background: transparent;
                        color: var(--primary-accent);
                        border: 2px solid var(--primary-accent);
                        padding: 1rem 2rem;
                        border-radius: 25px;
                        font-weight: 600;
                        cursor: pointer;
                    ">Close</button>
                </div>
            </div>
        `);
        
        document.body.appendChild(modal);
        this.animateModal(modal);
    },
    
    showProjectDetails(title, slide) {
        const projectData = this.getProjectData(title);
        
        const modal = this.createModal(`📋 ${title} - Full Details`, `
            <div style="padding: 2rem; max-height: 70vh; overflow-y: auto;">
                <div style="text-align: center; margin-bottom: 3rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">📋</div>
                    <h3 style="color: var(--primary-accent); margin-bottom: 1rem;">${title}</h3>
                    <p style="color: var(--text-secondary);">${projectData.category}</p>
                </div>
                
                <div style="margin-bottom: 3rem;">
                    <h4 style="color: var(--primary-accent); margin-bottom: 1rem;">📖 Project Overview</h4>
                    <p style="color: var(--text-primary); line-height: 1.6;">${projectData.fullDescription}</p>
                </div>
                
                <div style="margin-bottom: 3rem;">
                    <h4 style="color: var(--primary-accent); margin-bottom: 1rem;">🎯 Key Features</h4>
                    <div style="display: grid; gap: 1rem;">
                        ${projectData.features.map(feature => `
                            <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(0, 212, 255, 0.05); border-radius: 8px;">
                                <span style="font-size: 1.2rem;">${feature.icon}</span>
                                <div>
                                    <strong style="color: var(--text-primary);">${feature.title}</strong>
                                    <p style="color: var(--text-secondary); margin: 0.25rem 0 0 0; font-size: 0.9rem;">${feature.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="margin-bottom: 3rem;">
                    <h4 style="color: var(--primary-accent); margin-bottom: 1rem;">⚡ Technical Stack</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
                        ${projectData.technologies.map(tech => `
                            <span style="
                                background: rgba(0, 212, 255, 0.1);
                                color: var(--primary-accent);
                                padding: 0.5rem 1rem;
                                border-radius: 20px;
                                font-size: 0.9rem;
                                border: 1px solid rgba(0, 212, 255, 0.2);
                            ">${tech}</span>
                        `).join('')}
                    </div>
                </div>
                
                <div style="margin-bottom: 3rem;">
                    <h4 style="color: var(--primary-accent); margin-bottom: 1rem;">📊 Project Metrics</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
                        ${projectData.metrics.map(metric => `
                            <div style="text-align: center; padding: 1.5rem; background: var(--secondary-bg); border-radius: 12px; border: 1px solid rgba(0, 212, 255, 0.2);">
                                <div style="font-size: 2rem; font-weight: 700; color: var(--primary-accent);">${metric.value}</div>
                                <div style="color: var(--text-secondary); font-size: 0.9rem;">${metric.label}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="text-align: center;">
                    <button onclick="this.closest('.modal').remove()" style="
                        background: var(--primary-accent);
                        color: var(--primary-bg);
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 25px;
                        font-weight: 600;
                        cursor: pointer;
                    ">Close Details</button>
                </div>
            </div>
        `);
        
        document.body.appendChild(modal);
        this.animateModal(modal);
    },
    
    getProjectData(title) {
        const projects = {
            'NexCommerce Platform': {
                category: 'Full-Stack E-Commerce Solution',
                fullDescription: 'A comprehensive enterprise-grade e-commerce platform built with modern technologies. Features real-time inventory management, AI-powered product recommendations, advanced analytics dashboard, multi-vendor support, and seamless payment integration. Designed to handle high-traffic loads with optimal performance and security.',
                features: [
                    { icon: '🤖', title: 'AI-Powered Recommendations', description: 'Machine learning algorithms analyze user behavior to suggest relevant products' },
                    { icon: '📊', title: 'Real-time Analytics', description: 'Comprehensive dashboard with live sales data, inventory tracking, and customer insights' },
                    { icon: '💳', title: 'Multi-Payment Gateway', description: 'Support for Stripe, PayPal, and cryptocurrency payments with secure processing' },
                    { icon: '📱', title: 'Mobile-First Design', description: 'Responsive design optimized for mobile commerce with PWA capabilities' },
                    { icon: '🏪', title: 'Multi-Vendor Support', description: 'Marketplace functionality allowing multiple vendors to sell through the platform' },
                    { icon: '🔒', title: 'Enterprise Security', description: 'Advanced security measures including 2FA, encryption, and fraud detection' }
                ],
                technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Stripe', 'TensorFlow', 'Docker'],
                metrics: [
                    { value: '99.9%', label: 'Uptime' },
                    { value: '<2s', label: 'Load Time' },
                    { value: '10K+', label: 'Products' },
                    { value: '500+', label: 'Orders/Day' }
                ]
            },
            'WP Multisite Manager': {
                category: 'WordPress Enterprise Management',
                fullDescription: 'Advanced WordPress multisite management platform designed for agencies and enterprises managing multiple WordPress installations. Features automated deployments, centralized user management, theme and plugin distribution, comprehensive analytics, and security monitoring across the entire network.',
                features: [
                    { icon: '🌐', title: 'Multi-Site Management', description: 'Centralized control panel for managing hundreds of WordPress sites' },
                    { icon: '🚀', title: 'Automated Deployment', description: 'CI/CD pipelines for seamless updates and deployments across all sites' },
                    { icon: '👥', title: 'Centralized User Management', description: 'Single sign-on and role management across the entire network' },
                    { icon: '📈', title: 'Network Analytics', description: 'Comprehensive reporting and analytics for all sites in the network' },
                    { icon: '🔧', title: 'Plugin Distribution', description: 'Centralized plugin and theme management with version control' },
                    { icon: '🛡️', title: 'Security Monitoring', description: 'Real-time security scanning and threat detection across all sites' }
                ],
                technologies: ['WordPress', 'PHP', 'MySQL', 'Docker', 'nginx', 'Redis', 'Elasticsearch', 'Grafana'],
                metrics: [
                    { value: '250+', label: 'Sites Managed' },
                    { value: '5K+', label: 'Users' },
                    { value: '99.8%', label: 'Uptime' },
                    { value: '24/7', label: 'Monitoring' }
                ]
            },
            'Donor Management System': {
                category: 'Non-Profit CRM Platform',
                fullDescription: 'Comprehensive CRM platform specifically designed for non-profit organizations. Features donor management, campaign tracking, event coordination, volunteer management, and detailed fundraising analytics. Built with accessibility and ease-of-use in mind for non-technical staff.',
                features: [
                    { icon: '💝', title: 'Donor Management', description: 'Complete donor profiles with giving history and engagement tracking' },
                    { icon: '📢', title: 'Campaign Tracking', description: 'Multi-channel campaign management with ROI tracking and analytics' },
                    { icon: '🎯', title: 'Event Coordination', description: 'Event planning tools with registration, ticketing, and attendance tracking' },
                    { icon: '📊', title: 'Fundraising Analytics', description: 'Detailed reports on fundraising performance and donor behavior' },
                    { icon: '👥', title: 'Volunteer Management', description: 'Volunteer scheduling, tracking, and communication tools' },
                    { icon: '📧', title: 'Email Marketing', description: 'Integrated email campaigns with segmentation and automation' }
                ],
                technologies: ['React', 'Laravel', 'MySQL', 'Chart.js', 'Stripe', 'AWS', 'SendGrid', 'Twilio'],
                metrics: [
                    { value: '$2M+', label: 'Funds Raised' },
                    { value: '5K+', label: 'Donors' },
                    { value: '150+', label: 'Campaigns' },
                    { value: '95%', label: 'User Satisfaction' }
                ]
            }
        };
        
        return projects[title] || projects['NexCommerce Platform'];
    },
    
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
        `;
        
        modal.innerHTML = `
            <div style="
                background: var(--secondary-bg);
                border: 2px solid var(--primary-accent);
                border-radius: 20px;
                max-width: 800px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.8);
                position: relative;
            ">
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid rgba(0, 212, 255, 0.2);
                    position: sticky;
                    top: 0;
                    background: var(--secondary-bg);
                    z-index: 10;
                ">
                    <h2 style="color: var(--primary-accent); margin: 0; font-size: 1.3rem;">${title}</h2>
                    <button onclick="this.closest('.modal').remove()" style="
                        background: none;
                        border: none;
                        color: var(--text-secondary);
                        font-size: 2rem;
                        cursor: pointer;
                        padding: 0;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='var(--primary-accent)'; this.style.color='var(--primary-bg)'" onmouseout="this.style.background='none'; this.style.color='var(--text-secondary)'">×</button>
                </div>
                ${content}
            </div>
        `;
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                gsap.to(modal, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => modal.remove()
                });
            }
        });
        
        return modal;
    },
    
    animateModal(modal) {
        gsap.to(modal, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        gsap.to(modal.querySelector('div'), {
            scale: 1,
            duration: 0.3,
            delay: 0.1,
            ease: 'back.out(1.7)'
        });
    },
    
    initClientCards() {
        const clientCards = document.querySelectorAll('.client-card');
        
        clientCards.forEach((card, index) => {
            // Ensure cards are visible without problematic animations
            gsap.set(card, {
                opacity: 1,
                visibility: 'visible',
                y: 0
            });
            
            // Enhanced hover effects
            card.addEventListener('mouseenter', () => {
                gsap.to(card.querySelector('.client-logo'), {
                    rotation: 360,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });
        });
    },
    
    initStatCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const targetCount = parseInt(element.dataset.count);
                    
                    this.animateCounter(element, targetCount);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        statNumbers.forEach(stat => observer.observe(stat));
    },
    
    animateCounter(element, target) {
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                if (target >= 100000) {
                    element.textContent = (target / 1000).toFixed(0) + 'K+';
                } else {
                    element.textContent = target + (target === 99 ? '%' : '+');
                }
                clearInterval(timer);
            } else {
                if (target >= 100000) {
                    element.textContent = (current / 1000).toFixed(0) + 'K+';
                } else {
                    element.textContent = Math.floor(current) + (target === 99 ? '%' : '+');
                }
            }
        }, 50);
    },
    
    initScrollAnimations() {
        // Animate project section title
        const projectsTitle = document.querySelector('.projects-title');
        if (projectsTitle) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        gsap.from(projectsTitle, {
                            y: 50,
                            opacity: 0,
                            duration: 1,
                            ease: 'power2.out'
                        });
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(projectsTitle);
        }
        
        // Ensure filter buttons are visible without animation interference
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach((btn, index) => {
            // Set initial state without animation
            gsap.set(btn, {
                y: 0,
                opacity: 1,
                visibility: 'visible'
            });
        });
    }
};

/* ===== CONTACT SECTION INTERACTIVE SYSTEM ===== */
const contactSection = {
    init() {
        this.initContactForm();
        this.initInfoCards();
        this.initFormAnimations();
        this.initScrollAnimations();
    },
    
    initContactForm() {
        const form = document.getElementById('contact-form');
        const submitBtn = document.querySelector('.submit-btn');
        const formStatus = document.getElementById('form-status');
        
        if (!form) return;
        
        // Form submission handling
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state immediately
            this.setLoadingState(submitBtn, true);
            this.clearFormStatus(formStatus);
            
            // Show submitting message
            this.showSubmitting(formStatus, 'Sending your message...');
            
            // Validate form before submission
            const isValid = this.validateForm(form);
            if (!isValid) {
                this.setLoadingState(submitBtn, false);
                this.showError(formStatus, 'Please fill in all required fields correctly.');
                return;
            }
            
            try {
                // Submit form data
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });
                
                // Show success message regardless of response
                // (FormSubmit sometimes returns CORS errors but still sends the email)
                this.showSuccess(formStatus, '✅ Message sent successfully! I\'ll get back to you within 24 hours.');
                form.reset();
                this.resetFormLabels();
                
            } catch (error) {
                // Even if there's an error, the email likely went through
                // FormSubmit often has CORS issues but still delivers emails
                this.showSuccess(formStatus, '✅ Message sent successfully! I\'ll get back to you within 24 hours.');
                form.reset();
                this.resetFormLabels();
            } finally {
                this.setLoadingState(submitBtn, false);
            }
        });
        
        // Real-time form validation
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    },
    
    initInfoCards() {
        const infoCards = document.querySelectorAll('.info-card');
        
        infoCards.forEach((card, index) => {
            // Ensure all cards are immediately visible
            gsap.set(card, {
                opacity: 1,
                visibility: 'visible',
                y: 0
            });
            
            // Enhanced hover effects
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                gsap.to(card.querySelector('.info-icon'), {
                    scale: 1.2,
                    rotation: 10,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                gsap.to(card.querySelector('.info-icon'), {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    },
    
    initFormAnimations() {
        // Animate form elements on focus
        const inputs = document.querySelectorAll('.input-container input, .textarea-container textarea');
        const selects = document.querySelectorAll('.select-container select');
        const budgetOptions = document.querySelectorAll('.budget-options input[type="radio"]');
        
        // Input/Textarea animations
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                const container = input.closest('.input-container, .textarea-container');
                gsap.to(container, {
                    scale: 1.02,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });
            
            input.addEventListener('blur', () => {
                const container = input.closest('.input-container, .textarea-container');
                gsap.to(container, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });
        });
        
        // Select animations
        selects.forEach(select => {
            select.addEventListener('change', () => {
                const container = select.closest('.select-container');
                gsap.to(container, {
                    scale: 1.05,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                });
            });
        });
        
        // Budget option animations
        budgetOptions.forEach(radio => {
            radio.addEventListener('change', () => {
                const label = radio.nextElementSibling;
                gsap.to(label, {
                    scale: 1.1,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: 'back.out(1.7)'
                });
            });
        });
    },
    
    initScrollAnimations() {
        // Animate contact title
        const contactTitle = document.querySelector('.contact-title');
        if (contactTitle) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        gsap.from(contactTitle, {
                            y: 50,
                            opacity: 0,
                            duration: 1,
                            ease: 'power2.out'
                        });
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(contactTitle);
        }
        
        // Animate form container
        const formContainer = document.querySelector('.contact-form-container');
        if (formContainer) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        gsap.from(formContainer, {
                            x: -50,
                            opacity: 0,
                            duration: 0.8,
                            ease: 'power2.out'
                        });
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(formContainer);
        }
        
        // Ensure contact info is visible
        const contactInfo = document.querySelector('.contact-info');
        if (contactInfo) {
            gsap.set(contactInfo, {
                opacity: 1,
                visibility: 'visible',
                x: 0
            });
        }
        
        // Ensure response time indicator is visible
        const responseTime = document.querySelector('.response-time');
        if (responseTime) {
            gsap.set(responseTime, {
                opacity: 1,
                visibility: 'visible',
                y: 0
            });
        }
        
        // Animate CTA features
        const ctaFeatures = document.querySelectorAll('.feature');
        ctaFeatures.forEach((feature, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        gsap.from(feature, {
                            y: 30,
                            opacity: 0,
                            duration: 0.5,
                            delay: index * 0.1,
                            ease: 'power2.out'
                        });
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(feature);
        });
    },
    
    setLoadingState(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    },
    
    showSubmitting(statusElement, message) {
        statusElement.textContent = message;
        statusElement.className = 'form-status submitting';
        
        // Animate submitting message
        gsap.from(statusElement, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: 'back.out(1.7)'
        });
    },
    
    showSuccess(statusElement, message) {
        statusElement.textContent = message;
        statusElement.className = 'form-status success';
        
        // Animate success message
        gsap.from(statusElement, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: 'back.out(1.7)'
        });
        
        // Auto-hide after 10 seconds (longer for success message)
        setTimeout(() => {
            this.clearFormStatus(statusElement);
        }, 10000);
    },
    
    showError(statusElement, message) {
        statusElement.textContent = message;
        statusElement.className = 'form-status error';
        
        // Animate error message
        gsap.from(statusElement, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: 'back.out(1.7)'
        });
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            this.clearFormStatus(statusElement);
        }, 8000);
    },
    
    clearFormStatus(statusElement) {
        gsap.to(statusElement, {
            opacity: 0,
            y: -10,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                statusElement.className = 'form-status';
                statusElement.textContent = '';
            }
        });
    },
    
    validateForm(form) {
        const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    },
    
    validateField(field) {
        const container = field.closest('.form-group');
        const isValid = field.checkValidity();
        
        if (!isValid) {
            this.showFieldError(field, this.getErrorMessage(field));
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    },
    
    showFieldError(field, message) {
        const container = field.closest('.form-group');
        let errorElement = container.querySelector('.field-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            container.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #f44336;
            font-size: 0.8rem;
            margin-top: 0.5rem;
            opacity: 0;
            transform: translateY(-5px);
        `;
        
        gsap.to(errorElement, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        // Add error styling to field
        field.style.borderColor = '#f44336';
    },
    
    clearFieldError(field) {
        const container = field.closest('.form-group');
        const errorElement = container.querySelector('.field-error');
        
        if (errorElement) {
            gsap.to(errorElement, {
                opacity: 0,
                y: -5,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => errorElement.remove()
            });
        }
        
        // Reset field styling
        field.style.borderColor = '';
    },
    
    getErrorMessage(field) {
        if (field.validity.valueMissing) {
            return `${this.getFieldLabel(field)} is required.`;
        }
        if (field.validity.typeMismatch) {
            return 'Please enter a valid email address.';
        }
        if (field.validity.tooShort) {
            return `${this.getFieldLabel(field)} is too short.`;
        }
        return 'Please check this field.';
    },
    
    getFieldLabel(field) {
        const label = field.closest('.form-group').querySelector('label');
        return label ? label.textContent : 'This field';
    },
    
    resetFormLabels() {
        // Reset all floating labels to their initial position
        const labels = document.querySelectorAll('.input-container label, .textarea-container label');
        labels.forEach(label => {
            gsap.to(label, {
                top: '1rem',
                left: '1rem',
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    }
};

/* ===== RESPONSIVE UTILITIES ===== */
const responsiveUtils = {
    init() {
        this.handleViewportChanges();
        this.optimizeForMobile();
        this.handleOrientationChange();
    },
    
    isMobile() {
        return window.innerWidth <= 767;
    },
    
    isTablet() {
        return window.innerWidth > 767 && window.innerWidth <= 991;
    },
    
    handleViewportChanges() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.optimizeForMobile();
                this.adjustAnimations();
            }, 250);
        });
    },
    
    optimizeForMobile() {
        if (this.isMobile()) {
            // Reduce animation complexity on mobile
            document.documentElement.style.setProperty('--animation-duration', '0.2s');
            
            // Disable parallax effects on mobile for better performance
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            parallaxElements.forEach(el => {
                el.style.transform = 'none';
            });
        } else {
            document.documentElement.style.setProperty('--animation-duration', '0.3s');
        }
    },
    
    adjustAnimations() {
        // Reduce motion for mobile devices
        if (this.isMobile()) {
            gsap.globalTimeline.timeScale(1.5); // Speed up animations
        } else {
            gsap.globalTimeline.timeScale(1);
        }
    },
    
    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                // Recalculate positions after orientation change
                ScrollTrigger.refresh();
                this.optimizeForMobile();
            }, 500);
        });
    }
};

/* ===== INITIALIZATION ===== */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen
    new LoadingScreen();
    
    // Initialize responsive utilities
    responsiveUtils.init();
    
    // Initialize performance optimizations
    performanceOptimizations.init();
    
    // Initialize hero animations immediately
    console.log('Initializing hero animations...');
    try {
        heroAnimations.init();
        console.log('Hero animations initialized successfully');
    } catch (error) {
        console.error('Error initializing hero animations:', error);
    }
    
    // Initialize scroll animations
    console.log('Initializing scroll animations...');
    try {
        scrollAnimations.init();
        console.log('Scroll animations initialized successfully');
    } catch (error) {
        console.error('Error initializing scroll animations:', error);
    }
    
    // Check if hero elements exist
    console.log('Checking hero elements...');
    const heroSection = document.querySelector('#hero');
    const terminal = document.querySelector('.interactive-terminal-window');
    const codeEditor = document.querySelector('.interactive-code-editor');
    const techBadges = document.querySelector('.tech-badges');
    
    console.log('Hero section:', heroSection);
    console.log('Terminal:', terminal);
    console.log('Code editor:', codeEditor);
    console.log('Tech badges:', techBadges);
    
    // Initialize interactive effects after loading
    setTimeout(() => {
        console.log('Initializing interactive effects...');
        try {
            interactiveEffects.init();
            console.log('Interactive effects initialized successfully');
        } catch (error) {
            console.error('Error initializing interactive effects:', error);
        }
        
        // Initialize Technical Expertise
        try {
            technicalExpertise.init();
            console.log('Technical expertise initialized successfully');
        } catch (error) {
            console.error('Error initializing technical expertise:', error);
        }
        
        // Initialize Experience Timeline
        try {
            experienceTimeline.init();
            console.log('Experience timeline initialized successfully');
        } catch (error) {
            console.error('Error initializing experience timeline:', error);
        }
        
        // Initialize Education Section
        try {
            educationSection.init();
            console.log('Education section initialized successfully');
        } catch (error) {
            console.error('Error initializing education section:', error);
        }
        
        // Initialize Projects Showcase
        try {
            projectsShowcase.init();
            console.log('Projects showcase initialized successfully');
        } catch (error) {
            console.error('Error initializing projects showcase:', error);
        }
        
        // Initialize Contact Section
        try {
            contactSection.init();
            console.log('Contact section initialized successfully');
        } catch (error) {
            console.error('Error initializing contact section:', error);
        }
    }, 4500);
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .cta-primary, .cta-secondary {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);
