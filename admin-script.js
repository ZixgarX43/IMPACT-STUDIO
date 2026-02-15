// ==================== ADMIN BACKEND SYSTEM ====================
// Product Management, User Management, Reports & Statistics

document.addEventListener('DOMContentLoaded', () => {
    // Initialize data structures
    initializeDataStructures();

    // Load dashboard on page load
    loadDashboardStats();
    loadSalesChart('daily');
    loadTopProductsChart();
    loadRecentTransactions();

    // Setup sidebar navigation
    setupSidebarNavigation();

    // Load Discord settings
    loadDiscordSettings();

    // Load General Settings
    loadGeneralSettings();

    // Setup search functionality
    setupSearchFunctions();

    // Setup chart period toggles
    setupChartControls();

    // ==================== FORM EVENT LISTENERS ====================
    // Product Form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        console.log('✅ Product form found, attaching submit listener');
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('📝 Product form submitted');
            saveProduct();
        });
    } else {
        console.error('❌ Product form NOT found!');
    }

    // Product Image Preview
    const productImageInput = document.getElementById('productImage');
    if (productImageInput) {
        productImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('productImagePreview');
                    preview.src = event.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Category Form
    const categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
        categoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveCategory();
        });
    }

    // Category Image Preview
    const categoryImageInput = document.getElementById('categoryImage');
    if (categoryImageInput) {
        categoryImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('categoryImagePreview');
                    preview.src = event.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Banner Form
    const bannerForm = document.getElementById('bannerForm');
    if (bannerForm) {
        bannerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveBannerSettings();
        });
    }

    const resetBannerBtn = document.getElementById('resetBannerBtn');
    if (resetBannerBtn) {
        resetBannerBtn.addEventListener('click', resetBanner);
    }

    const bannerImageInput = document.getElementById('bannerImageInput');
    if (bannerImageInput) {
        bannerImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('bannerPreview');
                    const placeholder = document.getElementById('bannerPlaceholder');
                    preview.src = event.target.result;
                    preview.style.display = 'block';
                    placeholder.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Theme Form
    const themeForm = document.getElementById('themeForm');
    if (themeForm) {
        themeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveThemeSettings();
        });
    }

    // Discord Form
    const discordForm = document.getElementById('discordForm');
    if (discordForm) {
        discordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const url = document.getElementById('discordWebhookUrl').value;
            localStorage.setItem('discordWebhookUrl', url);
            alert('บันทึก Discord Webhook สำเร็จ!');
        });
    }

    // General Settings Form
    const generalSettingsForm = document.getElementById('generalSettingsForm');
    if (generalSettingsForm) {
        generalSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveGeneralSettings();
        });
    }

    const testDiscordBtn = document.getElementById('testDiscordBtn');
    if (testDiscordBtn) {
        testDiscordBtn.addEventListener('click', testDiscordNotification);
    }
});

// ==================== DATA INITIALIZATION ====================
function initializeDataStructures() {
    // Upgrade existing products with new fields
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let updated = false;

    products = products.map(p => {
        if (!p.hasOwnProperty('stock')) {
            p.stock = 999;
            p.warranty = 'none';
            p.category = 'ทั่วไป';
            p.salesCount = Math.floor(Math.random() * 100);
            updated = true;
        }
        return p;
    });

    if (updated) {
        localStorage.setItem('products', JSON.stringify(products));
    }

    // Upgrade users with new fields
    let users = JSON.parse(localStorage.getItem('users')) || [];
    updated = false;

    users = users.map(u => {
        if (!u.hasOwnProperty('locked')) {
            u.locked = false;
            u.joinDate = new Date().toISOString();
            updated = true;
        }
        return u;
    });

    if (updated) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Initialize purchases if not exists
    if (!localStorage.getItem('purchases')) {
        localStorage.setItem('purchases', JSON.stringify([]));
    }

    // Initialize visitors tracking
    if (!localStorage.getItem('visitors')) {
        const visitors = [];
        const today = new Date().toISOString().split('T')[0];
        visitors.push({ date: today, count: Math.floor(Math.random() * 500) + 100 });
        localStorage.setItem('visitors', JSON.stringify(visitors));
    }
}

// ==================== SIDEBAR NAVIGATION ====================
function setupSidebarNavigation() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');

    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all items
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Hide all sections
            document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));

            // Show selected section
            const section = item.getAttribute('data-section');
            const sectionElement = document.getElementById(`${section}-section`);
            if (sectionElement) {
                sectionElement.classList.add('active');

                // Load data for specific sections
                if (section === 'products') loadProducts();
                if (section === 'categories') loadCategories();
                if (section === 'users') loadUsers();
                if (section === 'reports') loadReportsData();
                if (section === 'banner') loadBannerSettings();
                if (section === 'settings') {
                    loadThemeSettings();
                }
            }
        });
    });
}

// ==================== DASHBOARD STATISTICS ====================
function loadDashboardStats() {
    const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const visitors = JSON.parse(localStorage.getItem('visitors')) || [];

    // Total Sales
    const totalSales = purchases.reduce((sum, p) => sum + p.amount, 0);
    document.getElementById('totalSales').textContent = `฿${totalSales.toFixed(2)}`;

    // Total Users (exclude admin)
    const totalUsers = users.filter(u => u.role !== 'admin').length;
    document.getElementById('totalUsers').textContent = totalUsers;

    // Total Products
    document.getElementById('totalProducts').textContent = products.length;

    // Conversion Rate
    const totalVisitors = visitors.reduce((sum, v) => sum + v.count, 0);
    const conversionRate = totalVisitors > 0 ? (purchases.length / totalVisitors * 100) : 0;
    document.getElementById('conversionRate').textContent = `${conversionRate.toFixed(1)}%`;
}

// ==================== SALES CHART ====================
let salesChartInstance = null;

function loadSalesChart(period = 'daily') {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
    let labels = [];
    let data = [];

    if (period === 'daily') {
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            labels.push(dateStr.substring(5)); // MM-DD

            const dayPurchases = purchases.filter(p => p.date.startsWith(dateStr));
            const dayTotal = dayPurchases.reduce((sum, p) => sum + p.amount, 0);
            data.push(dayTotal);
        }
    } else {
        // Last 4 weeks
        for (let i = 3; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - (i * 7));
            labels.push(`สัปดาห์ ${4 - i}`);

            const weekStart = new Date(date);
            weekStart.setDate(weekStart.getDate() - 7);
            const weekPurchases = purchases.filter(p => {
                const pDate = new Date(p.date);
                return pDate >= weekStart && pDate < date;
            });
            const weekTotal = weekPurchases.reduce((sum, p) => sum + p.amount, 0);
            data.push(weekTotal);
        }
    }

    if (salesChartInstance) {
        salesChartInstance.destroy();
    }

    salesChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'ยอดขาย (บาท)',
                data: data,
                borderColor: '#00BFFF',
                backgroundColor: 'rgba(0, 191, 255, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ==================== TOP PRODUCTS CHART ====================
let topProductsChartInstance = null;

function loadTopProductsChart() {
    const ctx = document.getElementById('topProductsChart');
    if (!ctx) return;

    const products = JSON.parse(localStorage.getItem('products')) || [];
    const topProducts = products
        .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
        .slice(0, 5);

    const labels = topProducts.map(p => p.name.substring(0, 20));
    const data = topProducts.map(p => p.salesCount || 0);

    if (topProductsChartInstance) {
        topProductsChartInstance.destroy();
    }

    topProductsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'จำนวนที่ขาย',
                data: data,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ==================== RECENT TRANSACTIONS ====================
function loadRecentTransactions() {
    const tbody = document.getElementById('recentTransactions');
    if (!tbody) return;

    const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
    const recent = purchases.slice(-10).reverse();

    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">ยังไม่มีรายการ</td></tr>';
        return;
    }

    tbody.innerHTML = recent.map(p => `
        <tr>
            <td>${new Date(p.date).toLocaleDateString('th-TH')}</td>
            <td>${p.username}</td>
            <td>${p.productName}</td>
            <td>฿${p.amount.toFixed(2)}</td>
        </tr>
    `).join('');
}

// ==================== CHART CONTROLS ====================
function setupChartControls() {
    const chartButtons = document.querySelectorAll('.btn-chart');

    chartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            chartButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const period = btn.getAttribute('data-period');
            loadSalesChart(period);
        });
    });
}

// ==================== PRODUCT MANAGEMENT ====================
function loadProducts() {
    const tbody = document.getElementById('productsTable');
    if (!tbody) return;

    const products = JSON.parse(localStorage.getItem('products')) || [];
    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #999;">ยังไม่มีสินค้า</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(p => `
        <tr>
            <td>
                ${p.image && p.image.startsWith('data:') ?
            `<img src="${p.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">` :
            `<div style="width: 50px; height: 50px; background: #eef; display: flex; align-items: center; justify-content: center; border-radius: 5px; font-size: 0.7rem;">${p.image || 'IMPACT'}</div>`
        }
            </td>
            <td>${p.name}</td>
            <td>฿${p.price}</td>
            <td>${p.stock || 0}</td>
            <td>${getWarrantyText(p.warranty || 'none')}</td>
            <td>${p.category || 'ทั่วไป'}</td>
            <td>${p.salesCount || 0}</td>
            <td>
                <button class="btn-edit" onclick="openEditProductModal(${p.id})" title="แก้ไข">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteProduct(${p.id})" title="ลบ">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function getWarrantyText(warranty) {
    const warranties = {
        'none': 'ไม่มี',
        '7days': '7 วัน',
        '30days': '30 วัน',
        '90days': '90 วัน'
    };
    return warranties[warranty] || 'ไม่มี';
}

window.openAddProductModal = function () {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');

    document.getElementById('productModalTitle').textContent = 'เพิ่มสินค้าใหม่';
    form.reset();
    document.getElementById('productId').value = '';
    document.getElementById('productImagePreview').style.display = 'none';

    // Load categories into select
    loadCategoryOptions();

    modal.style.display = 'block';
}

window.openEditProductModal = function (id) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === id);

    if (!product) return;

    const modal = document.getElementById('productModal');
    document.getElementById('productModalTitle').textContent = 'แก้ไขสินค้า';

    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productDesc').value = product.desc;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productOldPrice').value = product.oldPrice || '';
    document.getElementById('productStock').value = product.stock || 999;
    document.getElementById('productWarranty').value = product.warranty || 'none';
    document.getElementById('productInfo').value = product.productInfo || '';

    loadCategoryOptions();
    document.getElementById('productCategory').value = product.category || '';

    if (product.image && product.image.startsWith('data:')) {
        const preview = document.getElementById('productImagePreview');
        preview.src = product.image;
        preview.style.display = 'block';
    }

    modal.style.display = 'block';
}

function loadCategoryOptions() {
    const select = document.getElementById('productCategory');
    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    select.innerHTML = '<option value="">เลือกหมวดหมู่</option>';
    categories.forEach(c => {
        select.innerHTML += `<option value="${c.name}">${c.name}</option>`;
    });
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

function saveProduct() {
    console.log('💾 saveProduct() called');

    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const desc = document.getElementById('productDesc').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const oldPrice = parseFloat(document.getElementById('productOldPrice').value) || null;
    const stock = parseInt(document.getElementById('productStock').value);
    const warranty = document.getElementById('productWarranty').value;
    const category = document.getElementById('productCategory').value;
    const productInfo = document.getElementById('productInfo').value;
    const imageFile = document.getElementById('productImage').files[0];

    console.log('📋 Form data:', { id, name, desc, price, oldPrice, stock, warranty, category, productInfo });

    if (!name || !desc || !price || !category) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }

    let products = JSON.parse(localStorage.getItem('products')) || [];

    const saveProductData = (imageData) => {
        console.log('💿 Saving product data...');
        if (id) {
            // Edit existing product
            const index = products.findIndex(p => p.id == id);
            if (index !== -1) {
                products[index] = {
                    ...products[index],
                    name,
                    desc,
                    price,
                    oldPrice,
                    stock,
                    warranty,
                    category,
                    productInfo,
                    image: imageData || products[index].image
                };
                console.log('✏️ Updated product:', products[index]);
            }
        } else {
            // Add new product
            const newProduct = {
                id: Date.now(),
                name,
                desc,
                price,
                oldPrice,
                stock,
                warranty,
                category,
                productInfo,
                image: imageData || 'IMPACT',
                badge: 'ใหม่',
                salesCount: 0
            };
            products.push(newProduct);
            console.log('➕ Added new product:', newProduct);
        }

        try {
            localStorage.setItem('products', JSON.stringify(products));
            alert(id ? 'แก้ไขสินค้าสำเร็จ' : 'เพิ่มสินค้าสำเร็จ');
            closeProductModal();
            loadProducts();
            loadDashboardStats();
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                alert('❌ ไม่สามารถบันทึกได้: รูปภาพมีขนาดใหญ่เกินไป กรุณาลดขนาดรูปภาพหรือลบสินค้าเก่าบางรายการ');
                console.error('QuotaExceededError:', e);
            } else {
                alert('เกิดข้อผิดพลาด: ' + e.message);
                console.error('Error saving product:', e);
            }
        }
    };

    if (imageFile) {
        console.log('🖼️ Processing image file...');

        // Compress image before saving
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                // Resize to max 800x800 to save space
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let width = img.width;
                let height = img.height;
                const maxSize = 800;

                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                // Compress to 70% quality
                const compressedImage = canvas.toDataURL('image/jpeg', 0.7);
                console.log('✅ Image compressed:', {
                    original: e.target.result.length,
                    compressed: compressedImage.length,
                    saved: ((1 - compressedImage.length / e.target.result.length) * 100).toFixed(1) + '%'
                });
                saveProductData(compressedImage);
            };
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveProductData(null);
    }
}

window.deleteProduct = function (id) {
    if (!confirm('ต้องการลบสินค้านี้ใช่หรือไม่?')) return;

    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(products));

    alert('ลบสินค้าสำเร็จ');
    loadProducts();
    loadDashboardStats();
};

// ==================== CATEGORY MANAGEMENT ====================
function loadCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    const categories = JSON.parse(localStorage.getItem('categories')) || [];

    if (categories.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #999;">ยังไม่มีหมวดหมู่</p>';
        return;
    }

    grid.innerHTML = categories.map(c => `
        <div class="category-card-admin">
            ${c.image && c.image.startsWith('data:') ?
            `<img src="${c.image}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 10px;">` :
            `<div style="height: 150px; background: #eef; display: flex; align-items: center; justify-content: center; border-radius: 10px; font-size: 2rem; color: #87CEEB;">${c.image || 'IMPACT'}</div>`
        }
            <h4>${c.name}</h4>
            <div class="category-actions">
                <button class="btn-edit" onclick="openEditCategoryModal(${c.id})">
                    <i class="fas fa-edit"></i> แก้ไข
                </button>
                <button class="btn-delete" onclick="deleteCategory(${c.id})">
                    <i class="fas fa-trash"></i> ลบ
                </button>
            </div>
        </div>
    `).join('');
}

window.openAddCategoryModal = function () {
    const modal = document.getElementById('categoryModal');
    const form = document.getElementById('categoryForm');

    document.getElementById('categoryModalTitle').textContent = 'เพิ่มหมวดหมู่ใหม่';
    form.reset();
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryImagePreview').style.display = 'none';

    modal.style.display = 'block';
}

window.openEditCategoryModal = function (id) {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const category = categories.find(c => c.id === id);

    if (!category) return;

    const modal = document.getElementById('categoryModal');
    document.getElementById('categoryModalTitle').textContent = 'แก้ไขหมวดหมู่';

    document.getElementById('categoryId').value = category.id;
    document.getElementById('categoryName').value = category.name;

    if (category.image && category.image.startsWith('data:')) {
        const preview = document.getElementById('categoryImagePreview');
        preview.src = category.image;
        preview.style.display = 'block';
    }

    modal.style.display = 'block';
}

function closeCategoryModal() {
    document.getElementById('categoryModal').style.display = 'none';
}

function saveCategory() {
    const id = document.getElementById('categoryId').value;
    const name = document.getElementById('categoryName').value;
    const imageFile = document.getElementById('categoryImage').files[0];

    let categories = JSON.parse(localStorage.getItem('categories')) || [];

    const saveCategoryData = (imageData) => {
        if (id) {
            // Edit existing category
            const index = categories.findIndex(c => c.id == id);
            if (index !== -1) {
                categories[index] = {
                    ...categories[index],
                    name,
                    image: imageData || categories[index].image
                };
            }
        } else {
            // Add new category
            categories.push({
                id: Date.now(),
                name,
                image: imageData || 'IMPACT'
            });
        }

        localStorage.setItem('categories', JSON.stringify(categories));
        alert(id ? 'แก้ไขหมวดหมู่สำเร็จ' : 'เพิ่มหมวดหมู่สำเร็จ');
        closeCategoryModal();
        loadCategories();
    };

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Resize image
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 2200;
                canvas.height = 590;
                ctx.drawImage(img, 0, 0, 2200, 590);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                saveCategoryData(dataUrl);
            };
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveCategoryData(null);
    }
}

window.deleteCategory = function (id) {
    if (!confirm('ต้องการลบหมวดหมู่นี้ใช่หรือไม่?')) return;

    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    categories = categories.filter(c => c.id !== id);
    localStorage.setItem('categories', JSON.stringify(categories));

    alert('ลบหมวดหมู่สำเร็จ');
    loadCategories();
};

// ==================== USER MANAGEMENT ====================
function loadUsers() {
    const tbody = document.getElementById('usersTable');
    if (!tbody) return;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const displayUsers = users.filter(u => u.role !== 'admin');

    if (displayUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">ยังไม่มีสมาชิก</td></tr>';
        return;
    }

    tbody.innerHTML = displayUsers.map(u => `
        <tr>
            <td>${u.username}</td>
            <td><span class="badge-role">${u.role}</span></td>
            <td>฿${(u.points || 0).toFixed(2)}</td>
            <td>
                <span class="badge-status ${u.locked ? 'locked' : 'active'}">
                    ${u.locked ? 'ล็อค' : 'ปกติ'}
                </span>
            </td>
            <td>${new Date(u.joinDate || Date.now()).toLocaleDateString('th-TH')}</td>
            <td>
                <button class="btn-view" onclick="viewUserDetail('${u.username}')" title="ดูประวัติการซื้อ">
                    <i class="fas fa-history"></i>
                </button>
                <button class="btn-edit" onclick="editUserPoints('${u.username}')" title="แก้ไขยอดเงิน">
                    <i class="fas fa-coins"></i>
                </button>
                <button class="btn-warning" onclick="resetUserPassword('${u.username}')" title="รีเซ็ตรหัสผ่าน">
                    <i class="fas fa-key"></i>
                </button>
                <button class="btn-${u.locked ? 'success' : 'danger'}" onclick="toggleUserLock('${u.username}')" title="${u.locked ? 'ปลดล็อค' : 'ล็อค'}บัญชี">
                    <i class="fas fa-${u.locked ? 'unlock' : 'lock'}"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

window.viewUserDetail = function (username) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);

    if (!user) return;

    const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
    const userPurchases = purchases.filter(p => p.username === username);

    const content = document.getElementById('userDetailContent');
    content.innerHTML = `
        <div class="user-detail">
            <div class="user-info-grid">
                <div class="info-item">
                    <label>Username:</label>
                    <span>${user.username}</span>
                </div>
                <div class="info-item">
                    <label>Role:</label>
                    <span>${user.role}</span>
                </div>
                <div class="info-item">
                    <label>ยอดเงิน:</label>
                    <span>฿${(user.points || 0).toFixed(2)}</span>
                </div>
                <div class="info-item">
                    <label>สถานะ:</label>
                    <span class="badge-status ${user.locked ? 'locked' : 'active'}">
                        ${user.locked ? 'ล็อค' : 'ปกติ'}
                    </span>
                </div>
                <div class="info-item">
                    <label>วันที่สมัคร:</label>
                    <span>${new Date(user.joinDate || Date.now()).toLocaleDateString('th-TH')}</span>
                </div>
            </div>
            
            <h3 style="margin-top: 30px; margin-bottom: 15px;"><i class="fas fa-shopping-bag"></i> ประวัติการซื้อสินค้า</h3>
            ${userPurchases.length > 0 ? `
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ข้อมูลสินค้า</th>
                                <th>วันที่</th>
                                <th>สินค้า</th>
                                <th>ยอดเงิน</th>
                                <th>สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${userPurchases.sort((a, b) => new Date(b.date) - new Date(a.date)).map(p => `
                                <tr>
                                    <td>
                                        <div style="background: #f8f9fa; padding: 5px 10px; border-radius: 8px; border: 1px dashed #ddd; font-family: monospace; font-size: 0.8rem;">
                                            ${p.productInfo || 'ไม่มีข้อมูล'}
                                        </div>
                                    </td>
                                    <td>${new Date(p.date).toLocaleDateString('th-TH')}</td>
                                    <td>${p.productName}</td>
                                    <td style="font-weight: bold; color: var(--secondary-color);">฿${p.amount.toFixed(2)}</td>
                                    <td><span class="badge-status active">สำเร็จ</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : '<p style="text-align: center; padding: 20px; color: #999;">ยังไม่มีประวัติการซื้อ</p>'}
        </div>
    `;

    document.getElementById('userModal').style.display = 'block';
};

window.editUserPoints = function (username) {
    const amount = prompt('กรอกจำนวนเงินที่ต้องการเพิ่ม/ลด (เช่น 50 หรือ -20):');
    if (amount === null || isNaN(amount)) return;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);

    if (user) {
        user.points = (user.points || 0) + parseFloat(amount);
        localStorage.setItem('users', JSON.stringify(users));
        alert('ปรับยอดเงินสำเร็จ');
        loadUsers();
    }
};

window.resetUserPassword = function (username) {
    const newPassword = prompt('กรอกรหัสผ่านใหม่:');
    if (!newPassword) return;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);

    if (user) {
        user.password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        alert('รีเซ็ตรหัสผ่านสำเร็จ');
    }
};

window.toggleUserLock = function (username) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);

    if (user) {
        user.locked = !user.locked;
        localStorage.setItem('users', JSON.stringify(users));
        alert(user.locked ? 'ล็อคบัญชีสำเร็จ' : 'ปลดล็อคบัญชีสำเร็จ');
        loadUsers();
    }
};

function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
}

// ==================== REPORTS & STATISTICS ====================
function loadReportsData() {
    const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
    const visitors = JSON.parse(localStorage.getItem('visitors')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];

    // Total Visitors
    const totalVisitors = visitors.reduce((sum, v) => sum + v.count, 0);
    document.getElementById('totalVisitors').textContent = totalVisitors;

    // Total Orders
    document.getElementById('totalOrders').textContent = purchases.length;

    // Average Order Value
    const avgOrderValue = purchases.length > 0 ?
        purchases.reduce((sum, p) => sum + p.amount, 0) / purchases.length : 0;
    document.getElementById('avgOrderValue').textContent = `฿${avgOrderValue.toFixed(2)}`;

    // Top Product
    const topProduct = products.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))[0];
    document.getElementById('topProduct').textContent = topProduct ? topProduct.name : '-';

    // Load Top Products Table
    loadTopProductsTable();
}

function loadTopProductsTable() {
    const tbody = document.getElementById('topProductsTable');
    if (!tbody) return;

    const products = JSON.parse(localStorage.getItem('products')) || [];
    const topProducts = products
        .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
        .slice(0, 10);

    if (topProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">ยังไม่มีข้อมูล</td></tr>';
        return;
    }

    tbody.innerHTML = topProducts.map((p, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${p.name}</td>
            <td>${p.salesCount || 0}</td>
            <td>฿${((p.salesCount || 0) * p.price).toFixed(2)}</td>
        </tr>
    `).join('');
}

// ==================== SEARCH FUNCTIONS ====================
function setupSearchFunctions() {
    const searchProducts = document.getElementById('searchProducts');
    if (searchProducts) {
        searchProducts.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#productsTable tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }

    const searchUsers = document.getElementById('searchUsers');
    if (searchUsers) {
        searchUsers.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#usersTable tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }
}

// ==================== MODAL CLOSE ON OUTSIDE CLICK ====================
window.onclick = function (event) {
    const productModal = document.getElementById('productModal');
    const categoryModal = document.getElementById('categoryModal');
    const userModal = document.getElementById('userModal');

    if (event.target === productModal) {
        closeProductModal();
    }
    if (event.target === categoryModal) {
        closeCategoryModal();
    }
    if (event.target === userModal) {
        closeUserModal();
    }
};

// ==================== BANNER MANAGEMENT ====================
function loadBannerSettings() {
    const banner = JSON.parse(localStorage.getItem('promoBanner')) || {
        image: ''
    };

    const preview = document.getElementById('bannerPreview');
    const placeholder = document.getElementById('bannerPlaceholder');

    if (banner.image) {
        preview.src = banner.image;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
    } else {
        preview.style.display = 'none';
        placeholder.style.display = 'flex';
    }
}

function saveBannerSettings() {
    const imageInput = document.getElementById('bannerImageInput');
    const file = imageInput.files[0];

    const saveData = (imageData) => {
        const currentBanner = JSON.parse(localStorage.getItem('promoBanner')) || {};
        const banner = {
            image: imageData || currentBanner.image || ''
        };
        localStorage.setItem('promoBanner', JSON.stringify(banner));
        alert('บันทึกการตั้งค่า Banner สำเร็จ');
        loadBannerSettings();
        if (typeof loadBanner === 'function') loadBanner(); // Reload if on same page (unlikely)
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                // Standard banner size
                canvas.width = 2200;
                canvas.height = 590;
                ctx.drawImage(img, 0, 0, 2200, 590);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                saveData(dataUrl);
            };
        };
        reader.readAsDataURL(file);
    } else {
        saveData(null);
    }
}

function resetBanner() {
    if (confirm('คุณต้องการกลับไปใช้ค่าเริ่มต้นใช่หรือไม่?')) {
        localStorage.removeItem('promoBanner');
        alert('คืนค่าเริ่มต้นสำเร็จ');
        loadBannerSettings();
    }
}

// ==================== THEME MANAGEMENT ====================
const themes = {
    'light-blue': {
        '--primary-color': '#4FC3F7',
        '--secondary-color': '#03A9F4',
        '--accent-color': '#E1F5FE',
        '--background': '#F0F9FF',
        '--text-dark': '#263238',
        '--text-light': '#546E7A',
        '--card-shadow': '0 10px 25px rgba(3, 169, 244, 0.08)',
        '--hover-shadow': '0 15px 35px rgba(3, 169, 244, 0.15)',
        '--btn-shadow': '0 4px 15px rgba(3, 169, 244, 0.2)'
    },
    'capybara-orange': {
        '--primary-color': '#FFB347',
        '--secondary-color': '#FF8C00',
        '--accent-color': '#FFF3E0',
        '--background': '#FFFBF0',
        '--text-dark': '#4A3B28',
        '--text-light': '#8D775F',
        '--card-shadow': '0 10px 25px rgba(255, 140, 0, 0.08)',
        '--hover-shadow': '0 15px 35px rgba(255, 140, 0, 0.15)',
        '--btn-shadow': '0 4px 15px rgba(255, 140, 0, 0.2)'
    },
    'deep-purple': {
        '--primary-color': '#9575CD',
        '--secondary-color': '#673AB7',
        '--accent-color': '#F3E5F5',
        '--background': '#F8F4FF',
        '--text-dark': '#311B92',
        '--text-light': '#5E35B1',
        '--card-shadow': '0 10px 25px rgba(103, 58, 183, 0.08)',
        '--hover-shadow': '0 15px 35px rgba(103, 58, 183, 0.15)',
        '--btn-shadow': '0 4px 15px rgba(103, 58, 183, 0.2)'
    },
    'soft-pink': {
        '--primary-color': '#F06292',
        '--secondary-color': '#E91E63',
        '--accent-color': '#FCE4EC',
        '--background': '#FFF5F8',
        '--text-dark': '#880E4F',
        '--text-light': '#C2185B',
        '--card-shadow': '0 10px 25px rgba(233, 30, 99, 0.08)',
        '--hover-shadow': '0 15px 35px rgba(233, 30, 99, 0.15)',
        '--btn-shadow': '0 4px 15px rgba(233, 30, 99, 0.2)'
    },
    'emerald-green': {
        '--primary-color': '#28B463',
        '--secondary-color': '#1D8348',
        '--accent-color': '#E9F7EF',
        '--background': '#F4FBF7',
        '--text-dark': '#145A32',
        '--text-light': '#1E8449',
        '--card-shadow': '0 10px 25px rgba(40, 180, 99, 0.08)',
        '--hover-shadow': '0 15px 35px rgba(40, 180, 99, 0.15)',
        '--btn-shadow': '0 4px 15px rgba(40, 180, 99, 0.2)'
    },
    'royal-gold': {
        '--primary-color': '#D4AC0D',
        '--secondary-color': '#9A7D0A',
        '--accent-color': '#FEF9E7',
        '--background': '#FFFDFA',
        '--text-dark': '#7D6608',
        '--text-light': '#9A7D0A',
        '--card-shadow': '0 10px 25px rgba(212, 172, 13, 0.08)',
        '--hover-shadow': '0 15px 35px rgba(212, 172, 13, 0.15)',
        '--btn-shadow': '0 4px 15px rgba(212, 172, 13, 0.2)'
    },
    'midnight-red': {
        '--primary-color': '#E74C3C',
        '--secondary-color': '#C0392B',
        '--accent-color': '#FDEDEC',
        '--background': '#FFF5F5',
        '--text-dark': '#7B241C',
        '--text-light': '#922B21',
        '--card-shadow': '0 10px 25px rgba(231, 76, 60, 0.08)',
        '--hover-shadow': '0 15px 35px rgba(231, 76, 60, 0.15)',
        '--btn-shadow': '0 4px 15px rgba(231, 76, 60, 0.2)'
    },
    'modern-dark': {
        '--primary-color': '#37474F',
        '--secondary-color': '#263238',
        '--accent-color': '#455A64',
        '--background': '#121212',
        '--text-dark': '#ECEFF1',
        '--text-light': '#B0BEC5',
        '--card-shadow': '0 10px 25px rgba(0, 0, 0, 0.5)',
        '--hover-shadow': '0 15px 35px rgba(0, 0, 0, 0.7)',
        '--btn-shadow': '0 4px 15px rgba(0, 0, 0, 0.5)'
    }
};

function setupThemeListeners() {
    const radioModes = document.querySelectorAll('input[name="themeMode"]');
    const presetSection = document.getElementById('preset-controls');
    const customSection = document.getElementById('custom-controls');
    const themeSelect = document.getElementById('themeSelect');

    const customPrimary = document.getElementById('custom-primary');
    const customSecondary = document.getElementById('custom-secondary');
    const customAccent = document.getElementById('custom-accent');
    const customPrimaryHex = document.getElementById('custom-primary-hex');
    const customSecondaryHex = document.getElementById('custom-secondary-hex');
    const customAccentHex = document.getElementById('custom-accent-hex');

    // Toggle Sections
    radioModes.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'preset') {
                presetSection.style.display = 'block';
                customSection.style.display = 'none';
                updateThemePreviews(themeSelect.value);
            } else {
                presetSection.style.display = 'none';
                customSection.style.display = 'block';
                updateCustomPreview();
            }
        });
    });

    // Preset selection change
    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            updateThemePreviews(e.target.value);
        });
    }

    // Custom Color Listeners (Sync color picker with text box)
    const syncColor = (picker, text) => {
        picker.addEventListener('input', (e) => {
            text.value = e.target.value.toUpperCase();
            updateCustomPreview();
        });
        text.addEventListener('input', (e) => {
            const val = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(val)) {
                picker.value = val;
                updateCustomPreview();
            }
        });
    };

    if (customPrimary && customPrimaryHex) syncColor(customPrimary, customPrimaryHex);
    if (customSecondary && customSecondaryHex) syncColor(customSecondary, customSecondaryHex);
    if (customAccent && customAccentHex) syncColor(customAccent, customAccentHex);
}

function updateCustomPreview() {
    const primary = document.getElementById('custom-primary').value;
    const secondary = document.getElementById('custom-secondary').value;
    const accent = document.getElementById('custom-accent').value;

    const pPrimary = document.getElementById('preview-primary');
    const pSecondary = document.getElementById('preview-secondary');
    const pAccent = document.getElementById('preview-accent');

    if (pPrimary) pPrimary.style.background = primary;
    if (pSecondary) pSecondary.style.background = secondary;
    if (pAccent) pAccent.style.background = accent;
}

function loadThemeSettings() {
    const activeTheme = localStorage.getItem('activeTheme') || 'light-blue';
    const themeMode = localStorage.getItem('themeMode') || 'preset';

    // Set Mode
    const radioMode = document.querySelector(`input[name="themeMode"][value="${themeMode}"]`);
    if (radioMode) {
        radioMode.checked = true;
        radioMode.dispatchEvent(new Event('change'));
    }

    // Set Preset or Custom
    if (themeMode === 'preset') {
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) themeSelect.value = activeTheme;
        updateThemePreviews(activeTheme);
    } else {
        const themeColors = JSON.parse(localStorage.getItem('themeColors')) || themes['light-blue'];
        document.getElementById('custom-primary').value = themeColors['--primary-color'];
        document.getElementById('custom-primary-hex').value = themeColors['--primary-color'];
        document.getElementById('custom-secondary').value = themeColors['--secondary-color'];
        document.getElementById('custom-secondary-hex').value = themeColors['--secondary-color'];
        document.getElementById('custom-accent').value = themeColors['--accent-color'];
        document.getElementById('custom-accent-hex').value = themeColors['--accent-color'];
        updateCustomPreview();
    }

    setupThemeListeners();
}

function saveThemeSettings() {
    const themeMode = document.querySelector('input[name="themeMode"]:checked').value;
    let selectedColors = {};
    let activeTheme = '';

    if (themeMode === 'preset') {
        activeTheme = document.getElementById('themeSelect').value;
        selectedColors = themes[activeTheme];
    } else {
        activeTheme = 'custom';
        const primary = document.getElementById('custom-primary').value;
        const secondary = document.getElementById('custom-secondary').value;
        const accent = document.getElementById('custom-accent').value;

        // Generate full theme object for custom colors
        selectedColors = {
            '--primary-color': primary,
            '--secondary-color': secondary,
            '--accent-color': accent,
            '--background': `${accent}20`, // Use accent with 20/256 opacity
            '--text-dark': darkenColor(secondary, 40),
            '--text-light': darkenColor(primary, 20),
            '--card-shadow': `0 10px 25px ${hexToRGBA(secondary, 0.08)}`,
            '--hover-shadow': `0 15px 35px ${hexToRGBA(secondary, 0.15)}`,
            '--btn-shadow': `0 4px 15px ${hexToRGBA(secondary, 0.2)}`
        };
    }

    // Save to localStorage
    localStorage.setItem('themeMode', themeMode);
    localStorage.setItem('activeTheme', activeTheme);
    localStorage.setItem('themeColors', JSON.stringify(selectedColors));

    // Apply immediately to admin panel
    applyThemeInternally(selectedColors);

    alert('บันทึกธีมเว็บไซต์สำเร็จ! การเปลี่ยนแปลงมีผลทั่วทั้งเว็บไซต์');
}

// --- Helper Functions for Theme Generation ---
function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function darkenColor(hex, percent) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = Math.floor(r * (1 - percent / 100));
    g = Math.floor(g * (1 - percent / 100));
    b = Math.floor(b * (1 - percent / 100));

    const toHex = (n) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function updateThemePreviews(themeKey) {
    const colors = themes[themeKey];
    if (!colors) return;

    const pPrimary = document.getElementById('preview-primary');
    const pSecondary = document.getElementById('preview-secondary');
    const pAccent = document.getElementById('preview-accent');

    if (pPrimary) pPrimary.style.background = colors['--primary-color'];
    if (pSecondary) pSecondary.style.background = colors['--secondary-color'];
    if (pAccent) pAccent.style.background = colors['--accent-color'];
}

function applyThemeInternally(colors) {
    const root = document.documentElement;
    for (const [property, value] of Object.entries(colors)) {
        root.style.setProperty(property, value);
    }
}

// ==================== DISCORD WEBHOOK FUNCTIONS ====================

function loadDiscordSettings() {
    const url = localStorage.getItem('discordWebhookUrl');
    const input = document.getElementById('discordWebhookUrl');
    if (url && input) {
        input.value = url;
    }
}

// ==================== GENERAL SETTINGS FUNCTIONS ====================

function loadGeneralSettings() {
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {
        siteName: 'Capybara STORE',
        tagline: 'เติมเกม ราคาถูก ปลอดภัย',
        fbName: 'Over System - O...',
        fbFollowers: '1,057 ผู้ติดตาม',
        fbBannerText: 'โปรโมชั่นเทศกาลตรุษจีน',
        fbUrl: 'https://facebook.com/yourpage',
        copyright: '2025 OVSM CLOUD | Model Capybara',
        contactLink1: '#',
        contactLink2: '#',
        footerF1: 'WebSite OVSM ราคา เริ่มต้น 79 บาท',
        footerF2: 'เว็บไซต์ ขายแอปพรีเมี่ยม / ID เกม ต้อง OVSM',
        footerF3: 'ราคาถูก อัพเดทตลอด เว็บไซต์ออนไลน์ตลอด 24/7'
    };

    const mapping = {
        'settingSiteName': 'siteName',
        'settingTagline': 'tagline',
        'settingFbName': 'fbName',
        'settingFbFollowers': 'fbFollowers',
        'settingFbBannerText': 'fbBannerText',
        'settingFbUrl': 'fbUrl',
        'settingCopyright': 'copyright',
        'settingContactLink1': 'contactLink1',
        'settingContactLink2': 'contactLink2',
        'settingFooterF1': 'footerF1',
        'settingFooterF2': 'footerF2',
        'settingFooterF3': 'footerF3'
    };

    for (const [id, key] of Object.entries(mapping)) {
        const input = document.getElementById(id);
        if (input) input.value = settings[key] || '';
    }
}

function saveGeneralSettings() {
    const settings = {
        siteName: document.getElementById('settingSiteName').value,
        tagline: document.getElementById('settingTagline').value,
        fbName: document.getElementById('settingFbName').value,
        fbFollowers: document.getElementById('settingFbFollowers').value,
        fbBannerText: document.getElementById('settingFbBannerText').value,
        fbUrl: document.getElementById('settingFbUrl').value,
        copyright: document.getElementById('settingCopyright').value,
        contactLink1: document.getElementById('settingContactLink1').value,
        contactLink2: document.getElementById('settingContactLink2').value,
        footerF1: document.getElementById('settingFooterF1').value,
        footerF2: document.getElementById('settingFooterF2').value,
        footerF3: document.getElementById('settingFooterF3').value
    };

    localStorage.setItem('siteSettings', JSON.stringify(settings));
    alert('บันทึกข้อมูลเว็บไซต์สำเร็จ!');

    // Sync with preview if needed (though we don't have a live preview for general info yet)
}

function testDiscordNotification() {
    const url = document.getElementById('discordWebhookUrl').value;
    if (!url) {
        alert('กรุณาใส่ Webhook URL ก่อนทดสอบ');
        return;
    }

    const testBtn = document.getElementById('testDiscordBtn');
    const originalText = testBtn.innerHTML;
    testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังส่ง...';
    testBtn.disabled = true;

    const embed = {
        title: '🔔 ทดสอบการแจ้งเตือน (OVSM CLOUD)',
        description: 'ยินดีด้วย! การเชื่อมต่อ Discord Webhook ของคุณทำงานได้ถูกต้อง',
        color: 5814783, // Discord blue
        fields: [
            { name: 'สถานะ', value: '✅ พร้อมใช้งาน', inline: true },
            { name: 'เวลา', value: new Date().toLocaleString('th-TH'), inline: true }
        ],
        footer: { text: 'ระบบแจ้งเตือนแอดมิน (Capybara Store)' },
        timestamp: new Date().toISOString()
    };

    if (typeof window.notifyDiscord === 'function') {
        window.notifyDiscord(embed, url)
            .then(success => {
                if (success) alert('ส่งการแจ้งเตือนทดสอบสำเร็จ! ตรวจสอบที่ Discord ของคุณ');
                else alert('ส่งล้มเหลว ตรวจสอบ Webhook URL อีกครั้ง');
                testBtn.innerHTML = originalText;
                testBtn.disabled = false;
            });
    } else {
        // Fallback if script.js not loaded or notifyDiscord not yet global
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        }).then(res => {
            if (res.ok) alert('ส่งการแจ้งเตือนทดสอบสำเร็จ! ตรวจสอบที่ Discord ของคุณ');
            else alert('ส่งล้มเหลว ตรวจสอบ Webhook URL อีกครั้ง');
            testBtn.innerHTML = originalText;
            testBtn.disabled = false;
        }).catch(err => {
            alert('เกิดข้อผิดพลาด: ' + err.message);
            testBtn.innerHTML = originalText;
            testBtn.disabled = false;
        });
    }
}
