// Admin credentials
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const adminDashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const usersList = document.querySelector('.users-list');
const adminOrdersList = document.querySelector('.admin-orders-list');
const adminSearchInput = document.getElementById('admin-search-input');
const adminSearchResults = document.querySelector('.admin-search-results');
const addFoodForm = document.getElementById('add-food-form');

// Event Listeners
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        showAdminDashboard();
    } else {
        alert('Invalid credentials');
    }
});

adminSearchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const foodItems = JSON.parse(localStorage.getItem('foodItems') || '[]');
    const filteredItems = foodItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );
    displayAdminSearchResults(filteredItems);
});

addFoodForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newFood = {
        id: Date.now(),
        name: document.getElementById('food-name').value,
        price: parseFloat(document.getElementById('food-price').value),
        category: document.getElementById('food-category').value,
        image: document.getElementById('food-image').value,
        description: document.getElementById('food-description').value
    };

    const foodItems = JSON.parse(localStorage.getItem('foodItems') || '[]');
    foodItems.push(newFood);
    localStorage.setItem('foodItems', JSON.stringify(foodItems));
    
    addFoodForm.reset();
    alert('Food item added successfully!');
});

// Functions
function showAdminDashboard() {
    loginScreen.style.display = 'none';
    adminDashboard.style.display = 'block';
    displayUsers();
    displayAdminOrders();
}

function displayUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    usersList.innerHTML = `
        <h4 class="admin-section-title">
            <span class="material-icons">people</span>
            Registered Users
        </h4>
        <div class="users-grid">
            ${users.map(user => `
                <div class="mdl-card mdl-shadow--2dp user-card">
                    <div class="mdl-card__title">
                        <span class="material-icons user-avatar">account_circle</span>
                        <h2 class="mdl-card__title-text">${user.name}</h2>
                    </div>
                    <div class="mdl-card__supporting-text">
                        <p><span class="material-icons">email</span> <strong>Email:</strong> ${user.email}</p>
                        <p><span class="material-icons">phone</span> <strong>Phone:</strong> ${user.phone}</p>
                        <p><span class="material-icons">calendar_today</span> <strong>Registered:</strong> ${new Date(user.registeredDate).toLocaleDateString()}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function displayAdminOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    adminOrdersList.innerHTML = `
        <h4 class="admin-section-title">
            <span class="material-icons">receipt_long</span>
            All Orders
        </h4>
        <div class="orders-grid">
            ${orders.map(order => `
                <div class="mdl-card mdl-shadow--2dp order-card">
                    <div class="mdl-card__title">
                        <h2 class="mdl-card__title-text">
                            <span class="order-status ${order.status}"></span>
                            Order #${order.id}
                        </h2>
                    </div>
                    <div class="mdl-card__supporting-text">
                        <p><span class="material-icons">person</span> <strong>Customer:</strong> ${order.user.name}</p>
                        <p><span class="material-icons">location_on</span> <strong>Address:</strong> ${order.user.address}</p>
                        <p><span class="material-icons">phone</span> <strong>Phone:</strong> ${order.user.phone}</p>
                        <p><span class="material-icons">restaurant</span> <strong>Food:</strong> ${order.food.name}</p>
                        <p><span class="material-icons">attach_money</span> <strong>Price:</strong> $${order.food.price.toFixed(2)}</p>
                        <p><span class="material-icons">schedule</span> <strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                        <p><span class="material-icons">fiber_manual_record</span> <strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                    </div>
                    <div class="mdl-card__actions mdl-card--border">
                        ${order.status === 'pending' ? `
                            <button class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                                onclick="completeOrder(${order.id})">
                                <i class="material-icons">check_circle</i>
                                Complete Order
                            </button>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function displayAdminSearchResults(items) {
    adminSearchResults.innerHTML = `
        <h4 class="admin-section-title">
            <span class="material-icons">search</span>
            Food Items
        </h4>
        <div class="food-items-grid">
            ${items.map(item => `
                <div class="mdl-card mdl-shadow--2dp food-item">
                    <div class="mdl-card__media">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="food-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <div class="mdl-card__title">
                        <h2 class="mdl-card__title-text">${item.name}</h2>
                    </div>
                    <div class="mdl-card__supporting-text">
                        <p><strong>Category:</strong> ${item.category}</p>
                        ${item.description ? `<p><strong>Description:</strong> ${item.description}</p>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function completeOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
            return { ...order, status: 'completed' };
        }
        return order;
    });
    
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    displayAdminOrders();
}

// Initialize admin dashboard if already logged in
document.addEventListener('DOMContentLoaded', () => {
    // You might want to add proper session management here
});
