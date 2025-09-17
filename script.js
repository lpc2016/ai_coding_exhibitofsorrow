// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// 初始化网站功能
function initializeWebsite() {
    setupNavigation();
    setupGameControls();
    setupIframeLoading();
    setupScrollEffects();
    setupMobileMenu();
}

// 导航功能设置
function setupNavigation() {
    // 平滑滚动到指定区域
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 只对内部锚点链接进行平滑滚动处理
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // 考虑导航栏高度
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            // 外部链接（如privacy.html, terms.html）将正常跳转，不阻止默认行为
         });
    });

    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(26, 26, 46, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(26, 26, 46, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// 游戏控制功能
function setupGameControls() {
    const gameIframe = document.getElementById('game-iframe');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const reloadBtn = document.getElementById('reload-btn');
    const gameContainer = document.querySelector('.game-frame-container');

    // 检查元素是否存在，然后绑定事件
    if (fullscreenBtn && gameContainer) {
        // 全屏功能
        fullscreenBtn.addEventListener('click', function() {
            toggleFullscreen(gameContainer);
        });
    }

    if (reloadBtn) {
        // 重新加载游戏
        reloadBtn.addEventListener('click', function() {
            reloadGame();
        });
    }

    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
}

// 切换全屏模式
function toggleFullscreen(element) {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && 
        !document.mozFullScreenElement && !document.msFullscreenElement) {
        // 进入全屏
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    } else {
        // 退出全屏
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// 处理全屏状态变化
function handleFullscreenChange() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const gameContainer = document.querySelector('.game-frame-container');
    
    if (document.fullscreenElement || document.webkitFullscreenElement || 
        document.mozFullScreenElement || document.msFullscreenElement) {
        if (fullscreenBtn) fullscreenBtn.textContent = '退出全屏';
        if (gameContainer) gameContainer.classList.add('fullscreen');
    } else {
        if (fullscreenBtn) fullscreenBtn.textContent = '全屏';
        if (gameContainer) gameContainer.classList.remove('fullscreen');
    }
}

// 重新加载游戏
function reloadGame() {
    const gameIframe = document.getElementById('game-iframe');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // 显示加载动画
    loadingOverlay.style.opacity = '1';
    loadingOverlay.style.pointerEvents = 'auto';
    
    // 重新加载iframe
    const currentSrc = gameIframe.src;
    gameIframe.src = '';
    
    setTimeout(() => {
        gameIframe.src = currentSrc;
    }, 100);
}

// iframe加载状态管理
function setupIframeLoading() {
    const gameIframe = document.getElementById('game-iframe');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // iframe加载完成后隐藏加载动画
    gameIframe.addEventListener('load', function() {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            loadingOverlay.style.pointerEvents = 'none';
        }, 1000); // 延迟1秒隐藏，确保游戏完全加载
    });
    
    // iframe加载错误处理
    gameIframe.addEventListener('error', function() {
        loadingOverlay.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #f44336; margin-bottom: 1rem;">⚠️ 游戏加载失败</h3>
                <p style="margin-bottom: 1rem;">请检查网络连接或稍后重试</p>
                <button onclick="reloadGame()" style="
                    background: #64b5f6;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                ">重新加载</button>
                <br><br>
                <a href="https://html-classic.itch.zone/html/14611877/index.html" 
                   target="_blank" 
                   style="color: #64b5f6; text-decoration: none;">
                    直接访问游戏 →
                </a>
            </div>
        `;
    });
}

// 滚动效果设置
function setupScrollEffects() {
    // 元素进入视口时的动画效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.about-section, .controls-section, .control-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 移动端菜单设置
function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // 点击菜单项后关闭移动端菜单
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// 平滑滚动到游戏区域
function scrollToGame() {
    const gameSection = document.getElementById('game');
    if (gameSection) {
        const offsetTop = gameSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// 键盘快捷键支持
document.addEventListener('keydown', function(e) {
    // F11 - 切换全屏
    if (e.key === 'F11') {
        e.preventDefault();
        const gameContainer = document.querySelector('.game-frame-container');
        toggleFullscreen(gameContainer);
    }
    
    // F5 - 重新加载游戏
    if (e.key === 'F5' && e.ctrlKey) {
        e.preventDefault();
        reloadGame();
    }
    
    // Escape - 退出全屏
    if (e.key === 'Escape' && (document.fullscreenElement || document.webkitFullscreenElement)) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
});

// 页面可见性API - 当页面不可见时暂停某些动画
document.addEventListener('visibilitychange', function() {
    // 页面可见性变化处理
    if (document.hidden) {
        // 页面不可见时的处理
        console.log('页面不可见');
    } else {
        // 页面可见时的处理
        console.log('页面可见');
    }
});

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
});

// 性能优化：防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 优化滚动事件性能
const optimizedScrollHandler = debounce(function() {
    // 滚动相关的性能敏感操作
}, 16); // 约60fps

window.addEventListener('scroll', optimizedScrollHandler);

// 导出全局函数供HTML调用
window.scrollToGame = scrollToGame;
window.reloadGame = reloadGame;