// Sample food data (this would typically come from a backend)
let foodItems = [
    { id: 1, name: 'Pizza Margherita', price: 12.99, image: 'https://i0.wp.com/cookingitalians.com/wp-content/uploads/2024/11/Margherita-Pizza.jpg?fit=1344%2C768&ssl=1', category: 'Italian', description: 'Classic Italian pizza with tomatoes and mozzarella' },
    { id: 2, name: 'Cheeseburger', price: 8.99, image: 'https://via.placeholder.com/200x200?text=Burger', category: 'Fast Food', description: 'Juicy beef patty with cheese and fresh vegetables' },
    { id: 3, name: 'Sushi Roll', price: 15.99, image: 'https://via.placeholder.com/200x200?text=Sushi', category: 'Japanese', description: 'Fresh salmon and avocado roll' },
    { id: 4, name: 'Pad Thai', price: 11.99, image: 'https://via.placeholder.com/200x200?text=PadThai', category: 'Thai', description: 'Stir-fried rice noodles with shrimp' }
];

let orders = [];
let currentUser = null;

// Initialize food items if not exists
if (!localStorage.getItem('foodItems')) {
    localStorage.setItem('foodItems', JSON.stringify(foodItems));
} else {
    foodItems = JSON.parse(localStorage.getItem('foodItems'));
}

// DOM Elements
const authScreen = document.getElementById('auth-screen');
const mainApp = document.getElementById('main-app');
const authForm = document.getElementById('auth-form');
const orderDialog = document.getElementById('order-dialog');
const foodCategoriesContainer = document.querySelector('.food-categories');
const searchInput = document.getElementById('search-input');
const searchResults = document.querySelector('.search-results');
const ordersList = document.querySelector('.orders-list');
const profileContainer = document.querySelector('.profile-container');

// Initialize dialog
if (!orderDialog.showModal) {
    dialogPolyfill.registerDialog(orderDialog);
}

// Event Listeners
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentUser = {
        id: Date.now(),
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        registeredDate: new Date().toISOString()
    };
    
    // Store user in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(currentUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showMainApp();
});

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredItems = foodItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );
    displaySearchResults(filteredItems);
});

// Functions
function showMainApp() {
    authScreen.style.display = 'none';
    mainApp.style.display = 'block';
    displayFoodItems();
    displayProfile();
    displayOrders();
}

function displayFoodItems() {
    const categories = [...new Set(foodItems.map(item => item.category))];
    foodCategoriesContainer.innerHTML = '';

    categories.forEach(category => {
        const categoryItems = foodItems.filter(item => item.category === category);
        const categorySection = document.createElement('div');
        categorySection.innerHTML = `
            <h4 class="category-title">
                <span class="category-icon material-icons">restaurant</span>
                ${category}
            </h4>
            <div class="category-items">
                ${categoryItems.map(item => `
                    <div class="mdl-card mdl-shadow--2dp food-item">
                        <div class="mdl-card__media">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="food-item-price">$${item.price.toFixed(2)}</div>
                        </div>
                        <div class="mdl-card__title">
                            <h2 class="mdl-card__title-text">${item.name}</h2>
                        </div>
                        <div class="mdl-card__supporting-text">
                            ${item.description || ''}
                        </div>
                        <div class="mdl-card__actions mdl-card--border">
                            <button class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                                onclick="openOrderDialog(${item.id})">
                                <i class="material-icons">shopping_cart</i>
                                Order Now
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        foodCategoriesContainer.appendChild(categorySection);
    });
}

function displaySearchResults(items) {
    searchResults.innerHTML = `
        <h4 class="search-results-title">Search Results</h4>
        <div class="search-results-grid">
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
                        ${item.description || ''}
                    </div>
                    <div class="mdl-card__actions mdl-card--border">
                        <button class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                            onclick="openOrderDialog(${item.id})">
                            <i class="material-icons">shopping_cart</i>
                            Order Now
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function openOrderDialog(foodId) {
    const food = foodItems.find(item => item.id === foodId);
    if (!food) return;

    const orderName = document.getElementById('order-name');
    const orderPhone = document.getElementById('order-phone');
    
    orderName.value = currentUser.name;
    orderPhone.value = currentUser.phone;
    
    orderDialog.querySelector('.place-order').onclick = () => {
        placeOrder(food);
        orderDialog.close();
    };
    
    orderDialog.querySelector('.close').onclick = () => {
        orderDialog.close();
    };
    
    orderDialog.showModal();
}

function placeOrder(food) {
    const order = {
        id: Date.now(),
        food: food,
        user: {
            id: currentUser.id,
            name: document.getElementById('order-name').value,
            address: document.getElementById('order-address').value,
            phone: document.getElementById('order-phone').value
        },
        status: 'pending',
        date: new Date().toISOString()
    };
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    displayOrders();
}

function displayOrders() {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = allOrders.filter(order => order.user.id === currentUser.id);
    
    ordersList.innerHTML = `
        <h4 class="orders-title">
            <span class="material-icons">receipt_long</span>
            Your Orders
        </h4>
        <div class="orders-grid">
            ${userOrders.map(order => `
                <div class="mdl-card mdl-shadow--2dp order-item">
                    <div class="mdl-card__title">
                        <h2 class="mdl-card__title-text">
                            <span class="order-status ${order.status}"></span>
                            ${order.food.name}
                        </h2>
                    </div>
                    <div class="mdl-card__supporting-text">
                        <p><strong>Order ID:</strong> #${order.id}</p>
                        <p><strong>Delivery Address:</strong> ${order.user.address}</p>
                        <p><strong>Phone:</strong> ${order.user.phone}</p>
                        <p><strong>Price:</strong> $${order.food.price.toFixed(2)}</p>
                        <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                        <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function displayProfile() {
    if (!currentUser) return;
    
    profileContainer.innerHTML = `
        <div class="mdl-card mdl-shadow--2dp profile-card">
            <div class="mdl-card__title">
                <div class="profile-header">
                    <span class="profile-avatar material-icons">account_circle</span>
                    <h2 class="mdl-card__title-text">Profile Information</h2>
                </div>
            </div>
            <div class="mdl-card__supporting-text">
                <div class="profile-info">
                    <p>
                        <span class="material-icons">person</span>
                        <strong>Name:</strong> ${currentUser.name}
                    </p>
                    <p>
                        <span class="material-icons">email</span>
                        <strong>Email:</strong> ${currentUser.email}
                    </p>
                    <p>
                        <span class="material-icons">phone</span>
                        <strong>Phone:</strong> ${currentUser.phone}
                    </p>
                    <p>
                        <span class="material-icons">calendar_today</span>
                        <strong>Member Since:</strong> ${new Date(currentUser.registeredDate).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check for existing user
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainApp();
    }
});
