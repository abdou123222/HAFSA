// Utility functions for the application
export const Utils = {
    // Date and Time Utilities
    formatDate(date, format = 'short') {
        const formats = {
            short: { month: 'short', day: 'numeric' },
            medium: { month: 'short', day: 'numeric', year: 'numeric' },
            long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
            time: { hour: '2-digit', minute: '2-digit' }
        };
        return new Date(date).toLocaleDateString('en-US', formats[format]);
    },

    // Storage Utilities
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Storage error:', error);
                return false;
            }
        },

        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('Storage error:', error);
                return defaultValue;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Storage error:', error);
                return false;
            }
        }
    },

    // DOM Utilities
    dom: {
        createElement(tag, attributes = {}, children = []) {
            const element = document.createElement(tag);
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'className') {
                    element.className = value;
                } else if (key === 'dataset') {
                    Object.entries(value).forEach(([dataKey, dataValue]) => {
                        element.dataset[dataKey] = dataValue;
                    });
                } else {
                    element.setAttribute(key, value);
                }
            });
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else {
                    element.appendChild(child);
                }
            });
            return element;
        },

        removeAllChildren(element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
    },

    // Performance Utilities
    performance: {
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
        },

        throttle(func, limit) {
            let inThrottle;
            return function executedFunction(...args) {
                if (!inThrottle) {
                    func(...args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    },

    // Validation Utilities
    validation: {
        isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },

        isValidDate(date) {
            return !isNaN(new Date(date).getTime());
        },

        sanitizeInput(input) {
            return input.replace(/[<>]/g, '');
        }
    },

    // Error Handling
    errorHandler: {
        logError(error, context = '') {
            console.error(`Error in ${context}:`, error);
            // Could add error tracking service integration here
        },

        displayUserError(message) {
            // Integration with UI notification system
            if (window.app?.features?.notificationManager) {
                window.app.features.notificationManager.show({
                    message,
                    type: 'error',
                    duration: 5000
                });
            }
        }
    },

    // Color Utilities
    colors: {
        lighten(color, percent) {
            const num = parseInt(color.replace('#', ''), 16),
                amt = Math.round(2.55 * percent),
                R = (num >> 16) + amt,
                G = (num >> 8 & 0x00FF) + amt,
                B = (num & 0x0000FF) + amt;
            return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
                (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
                (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
        },

        getContrastColor(hexcolor) {
            const r = parseInt(hexcolor.substr(1, 2), 16);
            const g = parseInt(hexcolor.substr(3, 2), 16);
            const b = parseInt(hexcolor.substr(5, 2), 16);
            const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            return (yiq >= 128) ? '#000000' : '#FFFFFF';
        }
    }
};