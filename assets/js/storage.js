// GitHub Storage System - Secure Data Management
// This uses GitHub API to store data in your repository

const GITHUB_CONFIG = {
    owner: 'Player456B', // Replace with your GitHub username
    repo: 'rajmarketingmysore',     // Replace with your repo name
    token: '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',      // Replace with your GitHub token (keep secret!)
    branch: 'main'
};

class SecureStorage {
    constructor() {
        this.baseUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents`;
        this.headers = {
            'Authorization': `token ${GITHUB_CONFIG.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };
        this.initDataStructures();
    }

    // Initialize data structures if they don't exist
    async initDataStructures() {
        const structures = [
            { file: 'users.json', default: { customers: [], dealers: [], admins: [] } },
            { file: 'orders.json', default: { orders: [] } },
            { file: 'payments.json', default: { payments: [] } },
            { file: 'installations.json', default: { installations: [] } },
            { file: 'carpenters.json', default: { carpenters: [] } },
            { file: 'memberships.json', default: { memberships: [] } },
            { file: 'notifications.json', default: { notifications: [] } },
            { file: 'service-areas.json', default: { areas: [] } }
        ];

        for (const struct of structures) {
            await this.createFileIfNotExists(struct.file, struct.default);
        }
    }

    // Create file if it doesn't exist
    async createFileIfNotExists(filename, defaultData) {
        try {
            await this.getFile(filename);
        } catch (error) {
            // File doesn't exist, create it
            await this.saveFile(filename, defaultData);
        }
    }

    // Get file from GitHub
    async getFile(filename) {
        try {
            const response = await fetch(`${this.baseUrl}/${filename}`, {
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error('File not found');
            }
            
            const data = await response.json();
            const content = atob(data.content);
            return {
                sha: data.sha,
                content: JSON.parse(content)
            };
        } catch (error) {
            throw error;
        }
    }

    // Save file to GitHub
    async saveFile(filename, content, sha = null) {
        const fileContent = btoa(JSON.stringify(content, null, 2));
        const body = {
            message: `Update ${filename}`,
            content: fileContent,
            branch: GITHUB_CONFIG.branch
        };

        if (sha) {
            body.sha = sha;
        }

        const response = await fetch(`${this.baseUrl}/${filename}`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Failed to save file');
        }

        return await response.json();
    }

    // ========== USER MANAGEMENT ==========
    
    async registerUser(userData, type = 'customer') {
        const { content, sha } = await this.getFile('users.json');
        
        const newUser = {
            id: this.generateId(),
            ...userData,
            type: type,
            createdAt: new Date().toISOString(),
            status: 'active',
            profilePhoto: userData.profilePhoto || 'default-avatar.jpg',
            coverPhoto: userData.coverPhoto || 'default-cover.jpg'
        };
        
        content[`${type}s`].push(newUser);
        await this.saveFile('users.json', content, sha);
        
        // Create notification
        await this.createNotification({
            userId: newUser.id,
            type: 'welcome',
            message: `Welcome to Raj Marketing, ${newUser.name}!`,
            read: false
        });
        
        return newUser;
    }

    async loginUser(email, password, type = 'customer') {
        const { content } = await this.getFile('users.json');
        const users = content[`${type}s`] || [];
        
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            // Don't send password back
            const { password, ...safeUser } = user;
            return safeUser;
        }
        return null;
    }

    async getUserById(userId, type = 'customer') {
        const { content } = await this.getFile('users.json');
        const users = content[`${type}s`] || [];
        return users.find(u => u.id === userId);
    }

    async updateUser(userId, updates, type = 'customer') {
        const { content, sha } = await this.getFile('users.json');
        const users = content[`${type}s`] || [];
        const index = users.findIndex(u => u.id === userId);
        
        if (index !== -1) {
            users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
            await this.saveFile('users.json', content, sha);
            return users[index];
        }
        return null;
    }

    // ========== ORDER MANAGEMENT ==========

    async createOrder(orderData) {
        const { content, sha } = await this.getFile('orders.json');
        
        const newOrder = {
            id: this.generateId('ORD'),
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            timeline: [
                { status: 'order_placed', date: new Date().toISOString(), note: 'Order placed successfully' }
            ]
        };
        
        content.orders.push(newOrder);
        await this.saveFile('orders.json', content, sha);
        
        // Notify admin
        await this.createNotification({
            userId: 'admin',
            type: 'new_order',
            message: `New order #${newOrder.id} received`,
            data: { orderId: newOrder.id }
        });
        
        return newOrder;
    }

    async getCustomerOrders(customerId) {
        const { content } = await this.getFile('orders.json');
        return content.orders.filter(o => o.customerId === customerId);
    }

    async getDealerOrders(dealerId) {
        const { content } = await this.getFile('orders.json');
        return content.orders.filter(o => o.dealerId === dealerId);
    }

    async updateOrderStatus(orderId, status, note = '') {
        const { content, sha } = await this.getFile('orders.json');
        const order = content.orders.find(o => o.id === orderId);
        
        if (order) {
            order.status = status;
            order.timeline.push({
                status: status,
                date: new Date().toISOString(),
                note: note
            });
            order.updatedAt = new Date().toISOString();
            
            await this.saveFile('orders.json', content, sha);
            
            // Notify customer
            await this.createNotification({
                userId: order.customerId,
                type: 'order_update',
                message: `Order #${orderId} status updated to ${status}`,
                data: { orderId, status }
            });
            
            return order;
        }
        return null;
    }

    // ========== PAYMENT MANAGEMENT ==========

    async createPayment(paymentData) {
        const { content, sha } = await this.getFile('payments.json');
        
        const newPayment = {
            id: this.generateId('PAY'),
            ...paymentData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        content.payments.push(newPayment);
        await this.saveFile('payments.json', content, sha);
        
        return newPayment;
    }

    async getCustomerPayments(customerId) {
        const { content } = await this.getFile('payments.json');
        return content.payments.filter(p => p.customerId === customerId);
    }

    async updatePaymentStatus(paymentId, status, transactionId = null) {
        const { content, sha } = await this.getFile('payments.json');
        const payment = content.payments.find(p => p.id === paymentId);
        
        if (payment) {
            payment.status = status;
            if (transactionId) payment.transactionId = transactionId;
            payment.updatedAt = new Date().toISOString();
            
            await this.saveFile('payments.json', content, sha);
            return payment;
        }
        return null;
    }

    // ========== INSTALLATION MANAGEMENT ==========

    async scheduleInstallation(installationData) {
        const { content, sha } = await this.getFile('installations.json');
        
        const newInstallation = {
            id: this.generateId('INS'),
            ...installationData,
            status: 'scheduled',
            createdAt: new Date().toISOString()
        };
        
        content.installations.push(newInstallation);
        await this.saveFile('installations.json', content, sha);
        
        return newInstallation;
    }

    async updateInstallationStatus(installationId, status, updates = {}) {
        const { content, sha } = await this.getFile('installations.json');
        const installation = content.installations.find(i => i.id === installationId);
        
        if (installation) {
            installation.status = status;
            installation.updatedAt = new Date().toISOString();
            Object.assign(installation, updates);
            
            await this.saveFile('installations.json', content, sha);
            return installation;
        }
        return null;
    }

    async getInstallationsByDealer(dealerId) {
        const { content } = await this.getFile('installations.json');
        return content.installations.filter(i => i.dealerId === dealerId);
    }

    // ========== CARPENTER MANAGEMENT ==========

    async addCarpenter(carpenterData) {
        const { content, sha } = await this.getFile('carpenters.json');
        
        const newCarpenter = {
            id: this.generateId('CAR'),
            ...carpenterData,
            status: 'active',
            rating: 5.0,
            jobsCompleted: 0,
            createdAt: new Date().toISOString()
        };
        
        content.carpenters.push(newCarpenter);
        await this.saveFile('carpenters.json', content, sha);
        
        return newCarpenter;
    }

    async getCarpentersByArea(area) {
        const { content } = await this.getFile('carpenters.json');
        return content.carpenters.filter(c => c.areas.includes(area) && c.status === 'active');
    }

    async updateCarpenter(carpenterId, updates) {
        const { content, sha } = await this.getFile('carpenters.json');
        const index = content.carpenters.findIndex(c => c.id === carpenterId);
        
        if (index !== -1) {
            content.carpenters[index] = { ...content.carpenters[index], ...updates };
            await this.saveFile('carpenters.json', content, sha);
            return content.carpenters[index];
        }
        return null;
    }

    // ========== MEMBERSHIP MANAGEMENT ==========

    async createMembership(membershipData) {
        const { content, sha } = await this.getFile('memberships.json');
        
        const newMembership = {
            id: this.generateId('MEM'),
            ...membershipData,
            createdAt: new Date().toISOString(),
            expiryDate: this.calculateExpiry(membershipData.type)
        };
        
        content.memberships.push(newMembership);
        await this.saveFile('memberships.json', content, sha);
        
        return newMembership;
    }

    async getMembershipByUser(userId) {
        const { content } = await this.getFile('memberships.json');
        return content.memberships.find(m => m.userId === userId && m.status === 'active');
    }

    // ========== NOTIFICATION MANAGEMENT ==========

    async createNotification(notificationData) {
        const { content, sha } = await this.getFile('notifications.json');
        
        const newNotification = {
            id: this.generateId('NOT'),
            ...notificationData,
            read: false,
            createdAt: new Date().toISOString()
        };
        
        content.notifications.push(newNotification);
        await this.saveFile('notifications.json', content, sha);
        
        return newNotification;
    }

    async getUserNotifications(userId) {
        const { content } = await this.getFile('notifications.json');
        return content.notifications
            .filter(n => n.userId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    async markNotificationAsRead(notificationId) {
        const { content, sha } = await this.getFile('notifications.json');
        const notification = content.notifications.find(n => n.id === notificationId);
        
        if (notification) {
            notification.read = true;
            await this.saveFile('notifications.json', content, sha);
            return notification;
        }
        return null;
    }

    // ========== SERVICE AREA MANAGEMENT ==========

    async addServiceArea(areaData) {
        const { content, sha } = await this.getFile('service-areas.json');
        
        const newArea = {
            id: this.generateId('AREA'),
            ...areaData,
            createdAt: new Date().toISOString()
        };
        
        content.areas.push(newArea);
        await this.saveFile('service-areas.json', content, sha);
        
        return newArea;
    }

    async getServiceAreas() {
        const { content } = await this.getFile('service-areas.json');
        return content.areas;
    }

    // ========== UTILITY FUNCTIONS ==========

    generateId(prefix = '') {
        return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    calculateExpiry(membershipType) {
        const date = new Date();
        switch(membershipType) {
            case 'monthly':
                date.setMonth(date.getMonth() + 1);
                break;
            case 'quarterly':
                date.setMonth(date.getMonth() + 3);
                break;
            case 'yearly':
                date.setFullYear(date.getFullYear() + 1);
                break;
            default:
                date.setFullYear(date.getFullYear() + 1);
        }
        return date.toISOString();
    }

    // ========== ADMIN ONLY FUNCTIONS ==========

    async getAllUsers() {
        const { content } = await this.getFile('users.json');
        return content;
    }

    async getAllOrders() {
        const { content } = await this.getFile('orders.json');
        return content.orders;
    }

    async getAllPayments() {
        const { content } = await this.getFile('payments.json');
        return content.payments;
    }

    async getDashboardStats() {
        const users = await this.getAllUsers();
        const orders = await this.getAllOrders();
        const payments = await this.getAllPayments();
        
        return {
            totalCustomers: users.customers?.length || 0,
            totalDealers: users.dealers?.length || 0,
            totalOrders: orders.length,
            pendingOrders: orders.filter(o => o.status === 'pending').length,
            totalRevenue: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
            recentOrders: orders.slice(0, 5)
        };
    }

    async deleteUser(userId, type) {
        const { content, sha } = await this.getFile('users.json');
        const users = content[`${type}s`] || [];
        const index = users.findIndex(u => u.id === userId);
        
        if (index !== -1) {
            users.splice(index, 1);
            await this.saveFile('users.json', content, sha);
            return true;
        }
        return false;
    }
}

// Initialize storage
const storage = new SecureStorage();

// Make storage available globally
window.storage = storage;
