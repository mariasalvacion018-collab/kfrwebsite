let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

// Menu toggle and accessibility
function setMenuState(isOpen) {
    if (!menu || !navbar) return;
    menu.classList.toggle('bx-x', isOpen);
    navbar.classList.toggle('active', isOpen);
    menu.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

if (menu && navbar) {
    menu.addEventListener('click', () => setMenuState(!navbar.classList.contains('active')));
    menu.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setMenuState(!navbar.classList.contains('active'));
        }
    });
}

if (menu && navbar) {
    window.addEventListener('scroll', () => {
        setMenuState(false);
    });
}

// Products data
const products = [
    { id: 1, name: "Crispy Calamari", price: 120, img: "img/calamari.png", category: "Appetizers" },
    { id: 2, name: "Bruschetta Trio", price: 90, img: "img/brushchetta.png", category: "Appetizers" },
    { id: 3, name: "Caesar Salad", price: 85, img: "img/appitizer.png", category: "Appetizers" },
    { id: 4, name: "Grilled Herb Chicken", price: 150, img: "img/chicken.png", category: "Main Course" },
    { id: 5, name: "Pan-Seared Salmon", price: 190, img: "img/lasagna.png", category: "Main Course" },
    { id: 6, name: "Vegetable Lasagna", price: 130, img: "img/pasta spicy.png", category: "Main Course" },
    { id: 7, name: "Steak & Mash", price: 220, img: "img/thigh-chicken-steak.png", category: "Main Course" },
    { id: 8, name: "Spicy Seafood Pasta", price: 170, img: "img/chicken.png", category: "Main Course" },
    { id: 9, name: "Chocolate Lava Cake", price: 110, img: "img/lavacake.png", category: "Desserts" },
    { id: 10, name: "Lemon Cheesecake", price: 105, img: "img/lemon cake.png", category: "Desserts" },
    { id: 11, name: "Tiramisu Delight", price: 115, img: "img/tiramisue.png", category: "Desserts" },
    { id: 12, name: "Panna Cotta", price: 95, img: "img/panna_cotta.png", category: "Desserts" },
    { id: 13, name: "Fresh Orange Juice", price: 70, img: "img/orange juice.png", category: "Beverages" },
    { id: 14, name: "Classic Cola", price: 50, img: "img/coke.png", category: "Beverages" },
    { id: 15, name: "Garlic Bread", price: 60, img: "img/garlic bread.png", category: "Sides" },
    { id: 16, name: "Onion Rings", price: 65, img: "img/onion ring.jpg", category: "Sides" },
    { id: 17, name: "Mixed Veggie Platter", price: 100, img: "img/mixie veggie.png", category: "Sides" },
    { id: 18, name: "Seasoned Fries", price: 80, img: "img/seasoned_fries.png", category: "Sides" }
];

// ================= POPULAR DISHES RENDER =================
function renderPopularDishes() {
    const container = document.getElementById('popular-container');
    if (!container) return;

    const topProducts = products.slice(0, 3);
    container.innerHTML = topProducts.map(product => `
        <div class="dish-card">
            <div class="dish-image-wrapper">
                <img src="${product.img}" alt="${product.name}" loading="lazy" onerror="this.src='img/profile.jpg'">
            </div>
            <h3>${product.name}</h3>
            <span>5/5 ★★★★★</span>
            <p>${product.name} - Freshly prepared with premium ingredients.</p>
            <button class="btn add-to-cart-popular" data-product-id="${product.id}" type="button">Add to Cart</button>
        </div>
    `).join('');

    // Bind add to cart buttons for popular dishes
    container.querySelectorAll('.add-to-cart-popular').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(btn.dataset.productId);
            btn.textContent = '✓ Added!';
            setTimeout(() => {
                btn.textContent = 'Add to Cart';
            }, 1500);
        });
    });
}

// ================= PRODUCTS RENDER =================
function renderProducts() {
    renderProductsMenu();
}

// ================= LAZY LOADING FOR IMAGES =================
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ================= ENHANCED KEYBOARD NAVIGATION =================
function initKeyboardNavigation() {
    // Category boxes keyboard navigation
    document.querySelectorAll('.categories-container .box').forEach(box => {
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                filterProducts(box.dataset.category, true);
            }
        });
    });

    // Product boxes keyboard navigation
    document.querySelectorAll('.products-container .box .add-to-cart, .products-container .box .bx-heart').forEach(icon => {
        icon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (icon.classList.contains('add-to-cart')) {
                    addToCart(icon.dataset.productId);
                } else if (icon.classList.contains('bx-heart')) {
                    toggleFavorite(icon.dataset.productId);
                }
            }
        });
    });
}

// ================= IMPROVED CART FUNCTIONALITY =================
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countEls = document.querySelectorAll('.cart-count');
    countEls.forEach(countEl => {
        countEl.textContent = count;
        countEl.style.display = count > 0 ? 'block' : 'none';
        countEl.setAttribute('aria-label', `${count} items in cart`);
    });
}

// ================= IMPROVED ACCESSIBILITY =================
function initAccessibility() {
    // Announce dynamic content changes
    const announceChanges = (message) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    };

    // Enhanced cart feedback
    const originalAddToCart = window.addToCart;
    window.addToCart = function(productId) {
        originalAddToCart(productId);
        const product = products.find(p => p.id == productId);
        if (product) {
            announceChanges(`${product.name} added to cart`);
        }
    };
}

// ================= AUTH FUNCTIONS =================
function hashPassword(password) {
    return btoa(password + 'kfr-salt-2024'); // Simple client-side hash
}

function isAdminUser(user) {
    return user && user.role === 'admin';
}

function hasStaffAccess(user) {
    return isAdminUser(user);
}

function seedAdminUser() {
    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (!users.some(u => u.role === 'admin')) {
            users.push({
                username: 'admin',
                email: 'admin@kfr.com',
                password: hashPassword('Admin123!'),
                role: 'admin'
            });
            localStorage.setItem('users', JSON.stringify(users));
        }
    } catch (e) {
        console.warn('Could not seed admin user:', e);
    }
}

function getGuestUsers() {

    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.filter(u => u.role !== 'admin');
    } catch (e) {
        return [];
    }
}

function getOrderStatistics() {
    try {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        return {
            totalOrders: orders.length,
            totalSales,
            orders
        };
    } catch (e) {
        return { totalOrders: 0, totalSales: 0, orders: [] };
    }
}

function getSystemStatus() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    return {
        uptime: '12h 34m',
        activeUsers: users.length,
        processedOrders: orders.length,
        activeCarts: cart.length,
        serverHealth: 'Good'
    };
}

function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    if (icon) {
        icon.classList.toggle('bx-show', isPassword);
        icon.classList.toggle('bx-show-alt', !isPassword);
    }
}

function showRegister() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'block';
    setAuthMessage('loginMessage', '');
    setAuthMessage('registerMessage', '');
}

function showLogin() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.style.display = 'none';
    if (loginForm) loginForm.style.display = 'block';
    setAuthMessage('loginMessage', '');
    setAuthMessage('registerMessage', '');
}

function setAuthMessage(id, text, type = 'error') {
    const msgEl = document.getElementById(id);
    if (msgEl) {
        msgEl.textContent = text;
        msgEl.className = `message ${type}`;
        // Auto-clear after 5s
        setTimeout(() => {
            if (msgEl && msgEl.textContent === text) {
                msgEl.textContent = '';
                msgEl.className = 'message';
            }
        }, 5000);
    }
}

function register() {
    const username = document.getElementById('regUsername')?.value?.trim();
    const email = document.getElementById('regEmail')?.value?.trim();
    const password = document.getElementById('regPassword')?.value;

    if (!username || !email || !password || password.length < 6) {
        setAuthMessage('registerMessage', 'Please fill all fields. Password min 6 chars.', 'error');
        return;
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
        setAuthMessage('registerMessage', 'Please enter a valid email address.', 'error');
        return;
    }

    let users = [];
    try {
        users = JSON.parse(localStorage.getItem('users') || '[]');
    } catch (e) {
        users = [];
    }

    if (users.find(u => u.email === email || u.username === username)) {
        setAuthMessage('registerMessage', 'Username or email already exists.', 'error');
        return;
    }

    const hashedPassword = hashPassword(password);
    const newUser = { username, email, password: hashedPassword, role: 'guest' };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    setAuthMessage('registerMessage', 'Registration successful! Redirecting...', 'success');
    setTimeout(() => window.location.href = 'index.html', 1500);
}

function login() {
    seedAdminUser(); // ensure admin account always exists before checking credentials

    const email = document.getElementById('email')?.value?.trim();
    const password = document.getElementById('password')?.value;

    if (!email || !password) {
        setAuthMessage('loginMessage', 'Email and password required.', 'error');
        return;
    }

    let users = [];
    try {
        users = JSON.parse(localStorage.getItem('users') || '[]');
    } catch (e) {
        setAuthMessage('loginMessage', 'Login error. Try again.', 'error');
        return;
    }

    const hashedPassword = hashPassword(password);
    const user = users.find(u => u.email === email && u.password === hashedPassword);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        setAuthMessage('loginMessage', 'Login successful! Redirecting...', 'success');
        setTimeout(() => {
            if (isAdminUser(user)) {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1000);
    } else {
        setAuthMessage('loginMessage', 'Invalid email or password.', 'error');
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function editProfile() {
    const username = document.getElementById('editUsername')?.value?.trim();
    const email = document.getElementById('editEmail')?.value?.trim();
    const currentPassword = document.getElementById('currentPassword')?.value || '';
    const newPassword = document.getElementById('newPassword')?.value || '';
    const confirmNewPassword = document.getElementById('confirmNewPassword')?.value || '';
    const currentUser = getCurrentUser();

    if (!currentUser) {
        alert('You must be logged in to update profile.');
        window.location.href = 'login.html';
        return;
    }

    if (!username || !email) {
        alert('Username and email required.');
        return;
    }

    if (!currentPassword) {
        alert('Current password required.');
        return;
    }

    const hashedCurrentPw = hashPassword(currentPassword);
    if (hashedCurrentPw !== currentUser.password) {
        alert('Current password is incorrect.');
        return;
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (newPassword) {
        if (newPassword.length < 6) {
            alert('New password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            alert('New password and confirmation do not match.');
            return;
        }
    }

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const exists = users.some(u => (u.email === email || u.username === username) && u.email !== currentUser.email);
    if (exists) {
        alert('Another account already uses that username or email.');
        return;
    }

    const updatedUser = {
        username,
        email,
        password: newPassword ? hashPassword(newPassword) : currentUser.password
    };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex > -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
    }

    alert('Profile updated successfully!');
    location.reload();
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser'));
    } catch (e) {
        return null;
    }
}

function userOrders() {
    const user = getCurrentUser();
    if (!user) return [];

    try {
        const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        return allOrders.filter(order => order.billing?.email === user.email);
    } catch (e) {
        return [];
    }
}

function getHelpReports() {
    try {
        return JSON.parse(localStorage.getItem('helpReports') || '[]');
    } catch (e) {
        return [];
    }
}

function getSupportUsers() {
    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.filter(u => u.role === 'support');
    } catch (e) {
        return [];
    }
}

function assignReportToSupport(reportId, supportEmail) {
    const reports = getHelpReports();
    const report = reports.find(r => r.id === reportId);
    if (report) {
        report.assignedTo = supportEmail;
        saveHelpReports(reports);
    }
}

function getHelpReports() {
    // For fallback if API fails, but primarily use API
    return fetch('/api/help-reports')
        .then(response => response.json())
        .catch(err => {
            console.warn('API unavailable, using localStorage fallback:', err);
            return JSON.parse(localStorage.getItem('helpReports') || '[]');
        });
}

function saveHelpReports(reports) {
    // Save to localStorage as backup
    localStorage.setItem('helpReports', JSON.stringify(reports));
}

async function submitHelpReport(event) {
    event.preventDefault();

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });

    const submitBtn = document.querySelector('#helpForm button[type="submit"]');
    const originalText = submitBtn?.textContent || 'Submit';

    const name = document.getElementById('helpName')?.value.trim();
    const email = document.getElementById('helpEmail')?.value.trim();
    const subject = document.getElementById('helpSubject')?.value.trim();
    const message = document.getElementById('helpMessage')?.value.trim();

    let hasErrors = false;

    if (!name) {
        document.getElementById('nameError').textContent = 'Name is required.';
        document.getElementById('nameError').style.display = 'block';
        hasErrors = true;
    }

    if (!email) {
        document.getElementById('emailError').textContent = 'Email is required.';
        document.getElementById('emailError').style.display = 'block';
        hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email.';
        document.getElementById('emailError').style.display = 'block';
        hasErrors = true;
    }

    if (!subject) {
        document.getElementById('subjectError').textContent = 'Subject is required.';
        document.getElementById('subjectError').style.display = 'block';
        hasErrors = true;
    }

    if (!message) {
        document.getElementById('messageError').textContent = 'Message is required.';
        document.getElementById('messageError').style.display = 'block';
        hasErrors = true;
    }

    if (hasErrors) {
        return;
    }

    // Show loading state
    if (submitBtn) {
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch('/api/help-reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, subject, message }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('Failed to submit report');
        }

        alert('Report submitted successfully!');
        document.getElementById('helpForm')?.reset();
        closeHelpModal();

        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 300);

    } catch (error) {
        if (error.name === 'AbortError') {
            alert('Request timed out. Saving locally.');
        } else {
            alert('Server not available. Saving locally.');
        }
        console.error('Error submitting report:', error);
        // Fallback to localStorage
        const report = {
            id: Date.now(),
            name,
            email,
            subject,
            message,
            date: new Date().toLocaleString(),
            status: 'new',
            assignedTo: 'admin@kfr.com'
        };

        const reports = JSON.parse(localStorage.getItem('helpReports') || '[]');
        reports.unshift(report);
        localStorage.setItem('helpReports', JSON.stringify(reports));

        document.getElementById('helpForm')?.reset();
        closeHelpModal();

        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 300);
    } finally {
        // Reset button
        if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

// Profile header update function
function updateProfileHeader() {
    const currentUser = getCurrentUser();
    const profileDivs = document.querySelectorAll('.profile');

    profileDivs.forEach(profile => {
        if (currentUser) {
            profile.innerHTML = `<i class='bx bx-user-circle' aria-hidden="true"></i>`;
            profile.style.cursor = 'pointer';
            profile.onclick = () => {
                if (hasStaffAccess(currentUser)) {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'profile.html';
                }
            };
        } else {
            profile.innerHTML = `<i class='bx bx-user' aria-hidden="true"></i>`;
            profile.style.cursor = 'pointer';
            profile.onclick = () => window.location.href = 'login.html';
        }
    });

    // Auto-redirect if on profile.html and no user
    if (!currentUser && window.location.pathname.includes('profile.html')) {
        window.location.href = 'login.html';
    }
}

function setActiveNavLink() {
    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const links = document.querySelectorAll('.navbar a');
    links.forEach(link => {
        link.classList.remove('home-active');
        const href = link.getAttribute('href').toLowerCase();
        if (pathname.endsWith('index.html') || pathname.endsWith('/') || pathname.includes('index-fixed.html')) {
            if (href.endsWith('#home') && (hash === '' || hash === '#home')) {
                link.classList.add('home-active');
            }
        }
        if (href.includes('about.html') || hash === '#about') {
            if (pathname.includes('about.html') || hash === '#about') {
                link.classList.add('home-active');
            }
        }
        if (href.includes('help.html') || hash.startsWith('#faq') || hash.startsWith('#submit-ticket') || hash.startsWith('#my-tickets')) {
            if (pathname.includes('help.html') || hash.startsWith('#faq') || hash.startsWith('#submit-ticket') || hash.startsWith('#my-tickets')) {
                link.classList.add('home-active');
            }
        }
        if (href.includes('#categories') && hash === '#categories') link.classList.add('home-active');
        if (href.includes('#products') && hash === '#products') link.classList.add('home-active');
    });
}

function updateNavbarAuth() {
    const currentUser = getCurrentUser();
    const loginLinks = document.querySelectorAll('#login-nav-link');
    loginLinks.forEach(link => {
        link.style.display = currentUser ? 'none' : 'block';
    });

    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let adminNavItem = document.querySelector('#admin-nav-link')?.parentElement;

    if (hasStaffAccess(currentUser)) {
        // Ensure admin/support link exists and is visible for staff users.
        if (!adminNavItem) {
            adminNavItem = document.createElement('li');
            const label = isAdminUser(currentUser) ? 'Admin' : 'Support';
            adminNavItem.innerHTML = `<a id="admin-nav-link" href="admin.html">${label}</a>`;
            navbar.appendChild(adminNavItem);
        } else {
            const link = adminNavItem.querySelector('a');
            if (link) {
                link.textContent = isAdminUser(currentUser) ? 'Admin' : 'Support';
            }
        }
    } else {
        // remove staff link for non-staff users
        if (adminNavItem) {
            adminNavItem.remove();
        }
    }
}

function updateNavbar() {
    updateProfileHeader();
    updateNavbarAuth();
    setActiveNavLink();
    updateCartCount();
}

// Cart functions
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cartItems')) || [];
    } catch (e) {
        console.warn('Cart data corrupted, resetting:', e);
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('cartItems', JSON.stringify(cart));
}

function addToCart(productId) {
    const cart = getCart();
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) return;

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart(cart);
    updateCartCount();
    showToast(`${product.name} added to cart!`);
}

function showToast(message) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('visible');
    }, 20);

    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function clearCart() {
    localStorage.removeItem('cartItems');
    updateCartCount();
    const cartContainer = document.getElementById('cart-container');
    if (cartContainer) {
        if (typeof loadCartPage === 'function') loadCartPage();
    }
}

function calculateTotal(cart) {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function viewCart() {
    window.location.href = 'cart.html';
}

// Favorites functions
function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem('favorites')) || [];
    } catch (e) {
        console.warn('Favorites data corrupted, resetting:', e);
        return [];
    }
}

function saveFavorites(favs) {
    localStorage.setItem('favorites', JSON.stringify(favs));
}

function isFavorite(productId) {
    return getFavorites().some(item => item.id === parseInt(productId));
}

function toggleFavorite(productId) {
    const favorites = getFavorites();
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) return;

    const existingIndex = favorites.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
        favorites.splice(existingIndex, 1);
    } else {
        favorites.push({ ...product });
    }
    saveFavorites(favorites);
    updateFavoriteIcons();
    renderFavorites();
}

function updateFavoriteIcons() {
    document.querySelectorAll('.bx-heart').forEach(heart => {
        const productId = heart.dataset.productId;
        if (productId) {
            if (isFavorite(productId)) {
                heart.classList.add('active');
            } else {
                heart.classList.remove('active');
            }
        }
    });
}

function renderFavorites() {
    const container = document.querySelector('.favorites-container');
    if (!container) return;

    const favorites = getFavorites();
    if (!favorites || favorites.length === 0) {
        container.innerHTML = '<p>No favorite products yet. Tap the heart icon on products to save favorites.</p>';
        return;
    }

    container.innerHTML = favorites.map(item => `
        <div class="favorite-item">
            <div class="favorite-image-wrapper">
                <img src="${item.img}" alt="${item.name}" loading="lazy" onerror="this.src='img/profile.jpg'">
            </div>
            <div class="favorite-info">
                <h4>${item.name}</h4>
                <span>₱${item.price}</span>
            </div>
            <button class="btn remove-favorite" data-product-id="${item.id}">Remove</button>
        </div>
    `).join('');
}

function renderProductsMenu() {
    const container = document.getElementById('dynamic-products') || document.querySelector('.products-container');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="box" data-product-id="${product.id}" data-category="${product.category}">
            <img src="${product.img}" alt="${product.name}" loading="lazy" onerror="this.src='img/profile.jpg'">
            <span>Chef Special</span>
            <h2>${product.name}</h2>
            <h3 class="price">₱${product.price}</h3>
            <i class="bx bx-cart-alt add-to-cart" data-product-id="${product.id}" aria-label="Add ${product.name} to cart" tabindex="0" role="button"></i>
            <i class="bx bx-heart" data-product-id="${product.id}" aria-label="Add ${product.name} to favorites" tabindex="0" role="button"></i>
            <span class="discount">-25%</span>
        </div>
    `).join('');

    updateFavoriteIcons();
}

// Category filtering
let currentFilter = 'all';

function filterProducts(category, shouldScroll = true) {
    currentFilter = category;
    const productBoxes = document.querySelectorAll('.products-container .box');
    const categoryBoxes = document.querySelectorAll('.categories-container .box');

    // Toggle active category style
    categoryBoxes.forEach(box => box.classList.remove('active-category'));
    if (category !== 'all') {
        const activeCat = document.querySelector(`.categories-container .box[data-category="${category}"]`);
        if (activeCat) activeCat.classList.add('active-category');
    }

    // Show / hide products by category
    productBoxes.forEach(box => {
        const productCat = box.dataset.category;
        if (category === 'all' || productCat === category) {
            box.classList.remove('hidden');
        } else {
            box.classList.add('hidden');
        }
    });

    if (shouldScroll) {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    }
}

// Filter products when clicking footer category links
function filterFooterCategory(category) {
    filterProducts(category, true);
}

function removeItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    if (typeof loadCartPage === 'function') loadCartPage();
    updateCartCount();
}

// ================= MODULE LOADER =================
function loadModules() {
    const aboutContainer = document.getElementById('about-container');
    const footerContainer = document.getElementById('footer-container');

    // Load About
    if (aboutContainer) {
        fetch('about.html')
            .then(response => response.text())
            .then(html => {
                aboutContainer.innerHTML = html;
                console.log('About section loaded');
                // Update profile / auth UI inside loaded content
                updateProfileHeader();
                updateNavbarAuth();
                setActiveNavLink();
                updateCartCount();
            })
            .catch(err => {
                console.warn('Failed to load about.html:', err);
                aboutContainer.innerHTML = '<p>About section unavailable.</p>';
            });
    }

    // Load Footer
    if (footerContainer) {
        fetch('footer.html')
            .then(response => response.text())
            .then(html => {
                footerContainer.innerHTML = html;
                console.log('Footer loaded');
            })
            .catch(err => {
                console.warn('Failed to load footer.html:', err);
                footerContainer.innerHTML = '<p>Footer unavailable.</p>';
            });
    }
}

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
    seedAdminUser();
    updateProfileHeader();
    if (document.querySelector('#login-nav-link')) updateNavbarAuth();
    setActiveNavLink();
    updateCartCount();
    updateFavoriteIcons();
    renderFavorites();

    // Render popular dishes if container exists
    if (document.getElementById('popular-container')) {
        renderPopularDishes();
    }

    const currentUser = getCurrentUser();
    const isAuthPage = window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('register.html');
    if (isAuthPage && currentUser) {
        window.location.href = 'profile.html';
        return;
    }

    // Load modules if containers exist
    loadModules();

    // Restaurant product menu rendering
    renderProductsMenu();

    // Preserve continue shopping filter and hash behavior
    const savedFilter = localStorage.getItem('kfr-last-filter');
    const initialFilter = savedFilter || 'all';
    filterProducts(initialFilter, false); // Don't scroll on initial load
    localStorage.removeItem('kfr-last-filter');

    if (window.location.hash === '#products') {
        const productsSection = document.querySelector('#products');
        if (productsSection) {
            setTimeout(() => productsSection.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    }

    // Auth form binding (login.html) - always bind first
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm) loginForm.addEventListener('submit', (e) => { e.preventDefault(); login(); });
    if (registerForm) registerForm.addEventListener('submit', (e) => { e.preventDefault(); register(); });

    // Switch links - always bind (fixes login.html)
    document.querySelectorAll('.switch-link[data-action]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (link.dataset.action === 'register') {
                showRegister();
            } else {
                showLogin();
            }
        });
    });

    // Category handlers (products pages only)
    document.querySelectorAll('.categories-container .box').forEach(box => {
        box.style.cursor = 'pointer';
        box.addEventListener('click', () => {
            const category = box.dataset.category;
            // If clicking on already active category, reset to 'all'
            if (box.classList.contains('active-category')) {
                filterProducts('all', true);
            } else {
                filterProducts(category, true);
            }
        });
    });

    // See all
    const seeAllBtn = document.querySelector('.categories .btn');
    if (seeAllBtn) seeAllBtn.addEventListener('click', (e) => { e.preventDefault(); filterProducts('all', true); });

    // Home 'Shop Now' button (smooth scroll)
    document.querySelectorAll('.shop-now').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productsSection = document.querySelector('#products');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Cart page continue shopping button
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('kfr-last-filter', 'all');
            window.location.href = 'index.html#products';
        });
    }

    // Book table form
    const bookTableForm = document.getElementById('tableBookForm');
    if (bookTableForm) {
        bookTableForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('guestName').value.trim();
            const email = document.getElementById('guestEmail').value.trim();
            const phone = document.getElementById('guestPhone').value.trim();
            const date = document.getElementById('guestDate').value;
            const time = document.getElementById('guestTime').value;
            const guestCount = document.getElementById('guestCount').value;
            const notes = document.getElementById('guestNotes').value.trim();

            // Save reservation
            const reservation = {
                id: Date.now(),
                name,
                email,
                phone,
                date,
                time,
                guestCount: parseInt(guestCount),
                notes,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            const reservations = JSON.parse(localStorage.getItem('tableReservations') || '[]');
            reservations.push(reservation);
            localStorage.setItem('tableReservations', JSON.stringify(reservations));

            showToast(`Thanks ${name}, your table is booked for ${date} at ${time}! Reservation ID: ${reservation.id}`);
            bookTableForm.reset();
        });
    }

    // Event delegation for cart/favorite buttons
    document.addEventListener('click', (e) => {
        const cartBtn = e.target.closest('.add-to-cart[data-product-id]');
        if (cartBtn) {
            e.stopPropagation();
            addToCart(cartBtn.dataset.productId);
            // Visual feedback
            const originalIcon = cartBtn.className;
            cartBtn.className = 'bx bx-check add-to-cart';
            cartBtn.style.color = 'var(--green-color)';
            setTimeout(() => {
                cartBtn.className = originalIcon;
                cartBtn.style.color = '';
            }, 1000);
            return;
        }

        const favBtn = e.target.closest('.bx-heart[data-product-id]');
        if (favBtn) {
            e.stopPropagation();
            toggleFavorite(favBtn.dataset.productId);
            favBtn.style.transform = 'scale(1.2)';
            setTimeout(() => favBtn.style.transform = '', 200);
            return;
        }

        const removeFav = e.target.closest('.remove-favorite[data-product-id]');
        if (removeFav) {
            e.stopPropagation();
            toggleFavorite(removeFav.dataset.productId);
            return;
        }
    });

    // Initialize enhanced features
    initLazyLoading();
    initKeyboardNavigation();
    initAccessibility();
});
