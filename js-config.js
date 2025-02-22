// config.js
export const CONFIG = {
    APP: {
        NAME: 'StudyFlow Pro',
        VERSION: '2.0.0',
        ENV: process.env.NODE_ENV || 'development',
        DEBUG: true
    },

    STORAGE: {
        PREFIX: 'studyflow_',
        VERSION: '2'
    },

    TIMER: {
        WORK_DURATION: 25 * 60, // 25 minutes in seconds
        SHORT_BREAK: 5 * 60,    // 5 minutes in seconds
        LONG_BREAK: 15 * 60,    // 15 minutes in seconds
        SESSIONS_BEFORE_LONG_BREAK: 4,
        ALERT_BEFORE_END: 30    // seconds before timer ends
    },

    TASKS: {
        CATEGORIES: [
            'Study',
            'Assignment',
            'Exam Prep',
            'Reading',
            'Project',
            'Research',
            'Review',
            'Other'
        ],
        PRIORITIES: [
            { id: 'high', label: 'High', color: '#ef4444' },
            { id: 'medium', label: 'Medium', color: '#f59e0b' },
            { id: 'low', label: 'Low', color: '#10b981' }
        ],
        STATUSES: [
            { id: 'todo', label: 'To Do' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' }
        ],
        MAX_TASKS: 1000,
        MAX_TITLE_LENGTH: 100,
        MAX_DESCRIPTION_LENGTH: 1000
    },

    UI: {
        THEMES: {
            light: {
                primary: '#2563eb',
                secondary: '#64748b',
                background: '#ffffff',
                surface: '#f8fafc',
                text: '#1e293b',
                border: '#e2e8f0'
            },
            dark: {
                primary: '#3b82f6',
                secondary: '#94a3b8',
                background: '#0f172a',
                surface: '#1e293b',
                text: '#f8fafc',
                border: '#334155'
            }
        },
        ANIMATIONS: {
            duration: {
                fast: 150,
                normal: 250,
                slow: 350
            }
        },
        BREAKPOINTS: {
            mobile: 480,
            tablet: 768,
            desktop: 1024,
            wide: 1280
        }
    },

    NOTIFICATIONS: {
        POSITIONS: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
        DEFAULT_POSITION: 'top-right',
        DEFAULT_DURATION: 3000,
        TYPES: {
            SUCCESS: 'success',
            ERROR: 'error',
            WARNING: 'warning',
            INFO: 'info'
        }
    },

    KEYBOARD_SHORTCUTS: {
        SEARCH: {
            key: 'k',
            modifier: 'ctrl',
            description: 'Open global search'
        },
        NEW_TASK: {
            key: 'n',
            modifier: 'ctrl',
            description: 'Create new task'
        },
        TOGGLE_TIMER: {
            key: 't',
            modifier: 'ctrl',
            description: 'Start/stop timer'
        },
        HELP: {
            key: '/',
            modifier: 'ctrl',
            description: 'Show keyboard shortcuts'
        }
    }
};

export default CONFIG;