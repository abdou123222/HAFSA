// Main application initialization and core functionality
import { AppFeatures } from './features.js';

class StudyFlowApp {
    constructor() {
        this.features = new AppFeatures();
        this.currentView = 'dashboard';
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.init();
    }

    init() {
        this.initializeTheme();
        this.setupEventListeners();
        this.initializeViews();
        this.setupServiceWorker();
        this.loadUserPreferences();
    }

    initializeTheme() {
        document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(e.currentTarget.dataset.view);
            });
        });

        // Theme Toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Quick Actions
        document.getElementById('quickAddTask').addEventListener('click', () => {
            this.features.taskManager.showAddTaskModal();
        });

        document.getElementById('quickStartTimer').addEventListener('click', () => {
            this.features.pomodoroTimer.startSession();
        });

        // Global Search
        const searchInput = document.getElementById('globalSearch');
        searchInput.addEventListener('input', this.debounce(() => {
            this.handleGlobalSearch(searchInput.value);
        }, 300));

        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Window Events
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        window.addEventListener('online', () => {
            this.handleConnectivityChange(true);
        });

        window.addEventListener('offline', () => {
            this.handleConnectivityChange(false);
        });
    }

    handleNavigation(view) {
        // Update active navigation item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.view === view);
        });

        // Update view
        this.currentView = view;
        this.loadView(view);
        
        // Update URL without page reload
        history.pushState({ view }, '', `#${view}`);
    }

    async loadView(view) {
        const viewContainer = document.getElementById('viewContainer');
        viewContainer.innerHTML = '<div class="loading-spinner"></div>';

        try {
            const viewContent = await this.features.viewManager.getView(view);
            viewContainer.innerHTML = viewContent;
            this.initializeViewSpecificFeatures(view);
        } catch (error) {
            this.handleError('Failed to load view', error);
        }
    }

    initializeViewSpecificFeatures(view) {
        switch(view) {
            case 'dashboard':
                this.features.dashboard.initialize();
                break;
            case 'timer':
                this.features.pomodoroTimer.initialize();
                break;
            case 'tasks':
                this.features.taskManager.initialize();
                break;
            case 'calendar':
                this.features.calendar.initialize();
                break;
            case 'analytics':
                this.features.analytics.initialize();
                break;
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
        localStorage.setItem('darkMode', this.isDarkMode);
        this.features.notificationManager.show({
            message: `Switched to ${this.isDarkMode ? 'dark' : 'light'} mode`,
            type: 'info',
            duration: 2000
        });
    }

    async handleGlobalSearch(query) {
        if (query.length < 2) return;

        try {
            const results = await this.features.searchManager.search(query);
            this.features.searchManager.displayResults(results);
        } catch (error) {
            this.handleError('Search failed', error);
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + / for keyboard shortcuts help
        if (e.key === '/' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            this.features.helpManager.showShortcutsGuide();
        }

        // Ctrl/Cmd + K for global search
        if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            document.getElementById('globalSearch').focus();
        }
    }

    handleError(message, error) {
        console.error(message, error);
        this.features.notificationManager.show({
            message: `Error: ${message}`,
            type: 'error',
            duration: 5000
        });
    }

    // Utility Methods
    debounce(func, wait) {
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

    handleResize() {
        const isMobile = window.innerWidth < 768;
        document.body.classList.toggle('is-mobile', isMobile);
        this.features.layoutManager.adjustLayout(isMobile);
    }

    handleConnectivityChange(isOnline) {
        this.features.notificationManager.show({
            message: isOnline ? 'Back online' : 'You are offline',
            type: isOnline ? 'success' : 'warning',
            duration: 3000
        });
    }

    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/service-worker.js');
                console.log('Service Worker registered successfully');
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new StudyFlowApp();
});