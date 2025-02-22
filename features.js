// Enhanced features.js with better organization and functionality
import { createClient } from '@supabase/supabase-js';

export class AppFeatures {
    constructor() {
        this.initializeFeatures();
        this.setupEventListeners();
    }

    async initializeFeatures() {
        this.taskManager = new TaskManager();
        this.pomodoroTimer = new PomodoroTimer();
        this.notificationManager = new NotificationManager();
        this.themeManager = new ThemeManager();
        
        // Initialize all features
        await Promise.all([
            this.taskManager.initialize(),
            this.pomodoroTimer.initialize(),
            this.themeManager.initialize()
        ]);
    }

    setupEventListeners() {
        // Global event listeners
        document.addEventListener('DOMContentLoaded', () => {
            this.handleDOMReady();
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.themeManager.toggleTheme();
            });
        }

        // Quick actions
        this.setupQuickActions();
    }

    setupQuickActions() {
        const quickAddTask = document.getElementById('quickAddTask');
        if (quickAddTask) {
            quickAddTask.addEventListener('click', () => {
                this.taskManager.showAddTaskModal();
            });
        }

        const quickStartTimer = document.getElementById('quickStartTimer');
        if (quickStartTimer) {
            quickStartTimer.addEventListener('click', () => {
                this.pomodoroTimer.startSession();
            });
        }
    }

    handleDOMReady() {
        // Update UI components
        this.taskManager.updateUI();
        this.pomodoroTimer.updateUI();
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
        this.categories = ['Study', 'Assignment', 'Exam', 'Reading', 'Project'];
        this.priorities = ['High', 'Medium', 'Low'];
    }

    async initialize() {
        await this.loadTasks();
        this.setupTaskListeners();
    }

    async loadTasks() {
        try {
            const storedTasks = localStorage.getItem('tasks');
            this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.tasks = [];
        }
    }

    async addTask(taskData) {
        const task = {
            id: crypto.randomUUID(),
            ...taskData,
            createdAt: new Date().toISOString(),
            status: 'pending',
            progress: 0
        };

        this.tasks.unshift(task);
        await this.saveTasks();
        this.updateUI();
        
        return task;
    }

    async updateTask(taskId, updates) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) throw new Error('Task not found');

        this.tasks[taskIndex] = {
            ...this.tasks[taskIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        await this.saveTasks();
        this.updateUI();
    }

    async deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        await this.saveTasks();
        this.updateUI();
    }

    setupTaskListeners() {
        document.addEventListener('click', (e) => {
            const taskElement = e.target.closest('.task-item');
            if (!taskElement) return;

            const taskId = taskElement.dataset.id;
            const action = e.target.dataset.action;

            if (action === 'edit') {
                this.showEditTaskModal(taskId);
            } else if (action === 'delete') {
                this.confirmDeleteTask(taskId);
            } else if (action === 'toggle') {
                this.toggleTaskCompletion(taskId);
            }
        });
    }

    // ... (rest of the TaskManager implementation)
}

class PomodoroTimer {
    constructor() {
        this.settings = {
            workDuration: 25 * 60,
            shortBreak: 5 * 60,
            longBreak: 15 * 60,
            sessionsBeforeLongBreak: 4
        };
        this.currentSession = null;
        this.sessions = [];
    }

    // ... (PomodoroTimer implementation)
}

class NotificationManager {
    show({ message, type = 'info', duration = 3000 }) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} animate-in slide-in-right`;
        
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${this.getIcon(type)}</span>
                <span class="toast-message">${message}</span>
            </div>
            <div class="toast-progress"></div>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('animate-out', 'slide-out-right');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    getIcon(type) {
        const icons = {
            success: '<svg>...</svg>',
            error: '<svg>...</svg>',
            warning: '<svg>...</svg>',
            info: '<svg>...</svg>'
        };
        return icons[type] || icons.info;
    }
}

class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
    }

    initialize() {
        this.applyTheme();
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
    }
}

export {
    TaskManager,
    PomodoroTimer,
    NotificationManager,
    ThemeManager
};