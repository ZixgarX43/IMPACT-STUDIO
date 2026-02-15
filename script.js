// --- Theme Management ---
const applyTheme = () => {
    const themeColors = JSON.parse(localStorage.getItem('themeColors'));
    if (themeColors) {
        const root = document.documentElement;
        for (const [property, value] of Object.entries(themeColors)) {
            root.style.setProperty(property, value);
        }
    }
};
applyTheme();

// --- Global Site Information Rendering ---
const loadSiteSettings = () => {
    const settings = JSON.parse(localStorage.getItem('siteSettings'));
    if (!settings) return;

    // Update Logo
    const siteLogo = document.getElementById('siteLogo');
    if (siteLogo) {
        if (settings.siteName) {
            siteLogo.innerHTML = `${settings.siteName.replace(' STORE', '')} <span class="dot">STORE</span>`;
        }
    }

    // Update Facebook Widget
    const fbPageName = document.getElementById('fbPageName');
    const fbFollowers = document.getElementById('fbFollowers');
    const fbBannerText = document.getElementById('fbBannerText');
    const fbPageBtn = document.getElementById('fbPageBtn');

    if (fbPageName) fbPageName.textContent = settings.fbName || '';
    if (fbFollowers) fbFollowers.textContent = settings.fbFollowers || '';
    if (fbBannerText) fbBannerText.textContent = settings.fbBannerText || '';
    if (fbPageBtn && settings.fbUrl) {
        fbPageBtn.onclick = () => window.open(settings.fbUrl, '_blank');
    }

    // Update Footer
    const footerCopyright = document.getElementById('footerCopyright');
    const footerSiteRef = document.getElementById('footerSiteRef');
    const contactLink1 = document.getElementById('contactLink1');
    const contactLink2 = document.getElementById('contactLink2');

    if (footerCopyright) footerCopyright.textContent = settings.copyright || '';
    if (footerSiteRef) footerSiteRef.textContent = settings.siteName || '';
    if (contactLink1 && settings.contactLink1) contactLink1.href = settings.contactLink1;
    if (contactLink2 && settings.contactLink2) contactLink2.href = settings.contactLink2;

    // Update Footer Features
    const ff1 = document.getElementById('footerFeature1');
    const ff2 = document.getElementById('footerFeature2');
    const ff3 = document.getElementById('footerFeature3');

    if (ff1 && settings.footerF1) {
        const icon = ff1.querySelector('i') ? ff1.querySelector('i').outerHTML : '<i class="fas fa-minus"></i>';
        ff1.innerHTML = `${icon} ${settings.footerF1}`;
    }
    if (ff2 && settings.footerF2) {
        const icon = ff2.querySelector('i') ? ff2.querySelector('i').outerHTML : '<i class="fas fa-minus"></i>';
        ff2.innerHTML = `${icon} ${settings.footerF2}`;
    }
    if (ff3 && settings.footerF3) {
        const icon = ff3.querySelector('i') ? ff3.querySelector('i').outerHTML : '<i class="fas fa-minus"></i>';
        ff3.innerHTML = `${icon} ${settings.footerF3}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(); // Re-apply on load to be sure
    loadSiteSettings(); // Load dynamic site info
    // --- Initial Data Seeding ---
    if (!localStorage.getItem('products')) {
        const defaultProducts = [
            {
                id: 1,
                name: 'YouTube Premium 1 เดือน',
                desc: 'ไม่มีโฆษณา เล่นเบื้องหลังได้',
                price: 39.00,
                oldPrice: 159.00,
                image: 'IMPACT',
                badge: 'ขายดี',
                category: 'YouTube Premium',
                stock: 15
            },
            {
                id: 2,
                name: 'Netflix 4K 1 เดือน',
                desc: 'ดูหนัง ซีรีส์ ไม่อั้น ความชัด 4K',
                price: 99.00,
                oldPrice: 419.00,
                image: 'IMPACT',
                badge: null,
                category: 'Netflix 4K',
                stock: 0
            },
            {
                id: 3,
                name: 'Spotify Premium 1 ปี',
                desc: 'ฟังเพลงไม่มีโฆษณา',
                price: 299.00,
                oldPrice: 1200.00,
                image: 'IMPACT',
                badge: 'มาใหม่',
                category: 'Spotify Premium',
                stock: 5
            },
            {
                id: 4,
                name: 'Canva Pro 1 ปี',
                desc: 'ออกแบบกราฟิกอย่างมืออาชีพ',
                price: 150.00,
                oldPrice: 1850.00,
                image: 'IMPACT',
                badge: null,
                category: 'Game ID',
                stock: 10
            }
        ];
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }

    if (!localStorage.getItem('categories')) {
        // Use placeholders or empty strings for default images if you don't have base64 yet
        // For a real app, you'd host these images. Here we might just use text fallbacks or generic placeholders.
        const defaultCategories = [
            { id: 1, name: 'YouTube Premium', image: 'IMPACT' },
            { id: 2, name: 'Spotify Premium', image: 'IMPACT' },
            { id: 3, name: 'Netflix 4K', image: 'IMPACT' },
            { id: 4, name: 'Game ID', image: 'IMPACT' }
        ];
        localStorage.setItem('categories', JSON.stringify(defaultCategories));
    }

    if (!localStorage.getItem('users')) {
        // Default Admin: admin / admin
        const defaultUsers = [
            { username: 'admin', password: 'password', role: 'admin' }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    // --- Authentication Logic ---
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const navActions = document.querySelector('.nav-actions');

    // Check Login Status on Page Load
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && navActions) {
        let adminLink = '';
        if (currentUser.role === 'admin') {
            adminLink = `<a href="admin.html" class="dropdown-item"><i class="fas fa-user-shield"></i> หลังบ้าน</a>`;
        }

        const profileHtml = `
            <div class="user-profile-widget">
                <div class="profile-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="profile-info">
                    <span class="profile-name">${currentUser.username}</span>
                    <span class="profile-balance">฿${(currentUser.points || 0).toFixed(2)}</span>
                </div>
                <div class="profile-dropdown">
                    <a href="topup.html" class="dropdown-item"><i class="fas fa-wallet"></i> เติมเงิน</a>
                    <a href="history.html" class="dropdown-item"><i class="fas fa-shopping-basket"></i> ประวัติการซื้อ</a>
                    ${adminLink}
                    <div class="dropdown-divider"></div>
                    <a href="#" id="navLogout" class="dropdown-item" style="color: #ff4d4d;"><i class="fas fa-sign-out-alt"></i> ออกจากระบบ</a>
                </div>
            </div>
        `;

        navActions.innerHTML = profileHtml;

        const logoutAction = document.getElementById('navLogout');
        if (logoutAction) {
            logoutAction.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                window.location.reload();
            });
        }
    }

    // --- Load Admin Managed Banner ---
    const loadBanner = () => {
        const bannerImg = document.getElementById('hero-banner-img');
        const placeholder = document.getElementById('hero-placeholder');

        if (!bannerImg || !placeholder) return;

        const bannerData = JSON.parse(localStorage.getItem('promoBanner'));
        if (bannerData && bannerData.image) {
            bannerImg.src = bannerData.image;
            bannerImg.style.display = 'block';
            placeholder.style.display = 'none';
        } else {
            // No banner set - you could set a default here or keep placeholder
            bannerImg.style.display = 'none';
            placeholder.style.display = 'flex';
            placeholder.innerHTML = `
                <i class="fas fa-bullhorn" style="font-size: 3rem; margin-right: 15px;"></i>
                <span>ยังไม่มีโปรโมชั่นในขณะนี้</span>
            `;
        }
    };
    loadBanner();

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            const users = JSON.parse(localStorage.getItem('users')) || [];

            const foundUser = users.find(u => u.username === user && u.password === pass);

            if (foundUser) {
                // Check if account is locked
                if (foundUser.locked) {
                    alert('บัญชีของคุณถูกล็อค กรุณาติดต่อผู้ดูแลระบบ');
                    return;
                }

                localStorage.setItem('currentUser', JSON.stringify(foundUser));
                alert('เข้าสู่ระบบสำเร็จ!');
                window.location.href = foundUser.role === 'admin' ? 'admin.html' : 'index.html';
            } else {
                alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('reg-username').value;
            const pass = document.getElementById('reg-password').value;
            const confirmPass = document.getElementById('reg-confirm-password').value;

            if (pass !== confirmPass) {
                alert('รหัสผ่านไม่ตรงกัน');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.find(u => u.username === user)) {
                alert('ชื่อผู้ใช้นี้มีอยู่แล้ว');
                return;
            }

            users.push({ username: user, password: pass, role: 'user' });
            localStorage.setItem('users', JSON.stringify(users));

            // Discord Notification
            if (typeof window.notifyDiscord === 'function') {
                window.notifyDiscord({
                    title: '👤 สมาชิกใหม่!',
                    color: 3447003,
                    fields: [
                        { name: 'Username', value: user, inline: true },
                        { name: 'เวลา', value: new Date().toLocaleString('th-TH'), inline: true }
                    ]
                });
            }

            alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
            window.location.href = 'login.html';
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }

    // --- Product & Category Rendering (Index Page) ---
    const productGrid = document.querySelector('.product-grid');
    const categoryGrid = document.querySelector('.category-grid');

    if (productGrid && !document.getElementById('adminProductList')) { // Ensure we are on index page not admin
        loadProductsToIndex();
    }
    if (categoryGrid && !document.getElementById('adminCategoryList')) {
        loadCategoriesToIndex();
    }

    function loadProductsToIndex() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        productGrid.innerHTML = products.map(p => {
            const stock = p.stock !== undefined ? p.stock : 0;
            const isOutOfStock = stock <= 0;

            return `
                <div class="product-card">
                    <div class="product-image-container">
                        <span class="badge-app-premium">App premium</span>
                        ${p.badge === 'ขายดี' ? '<div class="corner-ribbon"></div>' : ''}
                        
                        ${p.image.startsWith('data:') ?
                    `<img src="${p.image}" alt="${p.name}">` :
                    `<div class="placeholder-img" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#eee;">${p.image}</div>`
                }
                        
                        <div class="image-overlay-bottom">APP PREMIUM</div>
                    </div>
                    
                    <div class="product-info">
                        <h3>${p.name}</h3>
                        
                        <div class="price-stock-row">
                            <div class="price-badge">${p.price}.00฿</div>
                        </div>
                        
                        <button class="btn-buy ${isOutOfStock ? 'out-of-stock' : 'btn-primary'}" 
                                onclick="${isOutOfStock ? '' : `window.location.href='product.html?id=${p.id}'`}"
                                ${isOutOfStock ? 'disabled' : ''}>
                            ${isOutOfStock ? 'สินค้าหมด' : 'เลือกซื้อสินค้า'}
                        </button>
                        
                        <div class="stock-info">
                            <i class="fas fa-box"></i> คงเหลือ ${stock} ชิ้น
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function loadCategoriesToIndex() {
        const categories = JSON.parse(localStorage.getItem('categories')) || [];
        categoryGrid.innerHTML = categories.map(c => `
            <div class="category-card" onclick="filterByCategory(\`${c.name.replace(/`/g, '\\`')}\`)">
                <div class="category-banner">
                    ${c.image && c.image.startsWith('data:') ?
                `<img src="${c.image}" alt="${c.name}">` :
                `<div class="category-placeholder">${c.image || 'IMPACT'}</div>`
            }
                    <div class="category-overlay">
                        <h3>${c.name}</h3>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Filter products by category
    window.filterByCategory = function (categoryName) {
        window.location.href = `category.html?category=${encodeURIComponent(categoryName)}`;
    };

    // Check if we're filtering by category
    function checkCategoryFilter() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');

        if (category) {
            // Show filtered products
            loadFilteredProducts(category);
            // Update page title
            const sectionTitle = document.querySelector('.products .section-title');
            if (sectionTitle) {
                sectionTitle.textContent = `สินค้าในหมวดหมู่: ${category}`;
            }
            // Add back button
            addBackButton();
            // Hide categories section
            const categoriesSection = document.getElementById('categories');
            if (categoriesSection) {
                categoriesSection.style.display = 'none';
            }
        }
    }

    function loadFilteredProducts(categoryName) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const filteredProducts = products.filter(p => p.category === categoryName);

        if (filteredProducts.length === 0) {
            productGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-box-open" style="font-size: 4rem; color: #ccc; margin-bottom: 20px;"></i>
                    <h3 style="color: #999;">ยังไม่มีสินค้าในหมวดหมู่นี้</h3>
                    <button class="btn btn-primary" onclick="window.location.href='index.html'" style="margin-top: 20px;">
                        <i class="fas fa-arrow-left"></i> กลับหน้าหลัก
                    </button>
                </div>
            `;
            return;
        }

        productGrid.innerHTML = filteredProducts.map(p => {
            const stock = p.stock !== undefined ? p.stock : 0;
            const isOutOfStock = stock <= 0;

            return `
                <div class="product-card">
                    <div class="product-image-container">
                        <span class="badge-app-premium">App premium</span>
                        ${p.badge === 'ขายดี' ? '<div class="corner-ribbon"></div>' : ''}
                        
                        ${p.image && p.image.startsWith('data:') ?
                    `<img src="${p.image}" alt="${p.name}">` :
                    `<div class="placeholder-img" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#eee;">${p.image || 'IMPACT'}</div>`
                }
                        
                        <div class="image-overlay-bottom">APP PREMIUM</div>
                    </div>
                    
                    <div class="product-info">
                        <h3>${p.name}</h3>
                        
                        <div class="price-stock-row">
                            <div class="price-badge">${p.price}.00฿</div>
                        </div>
                        
                        <button class="btn-buy ${isOutOfStock ? 'out-of-stock' : 'btn-primary'}" 
                                onclick="${isOutOfStock ? '' : `window.location.href='product.html?id=${p.id}'`}"
                                ${isOutOfStock ? 'disabled' : ''}>
                            ${isOutOfStock ? 'สินค้าหมด' : 'เลือกซื้อสินค้า'}
                        </button>
                        
                        <div class="stock-info">
                            <i class="fas fa-box"></i> คงเหลือ ${stock} ชิ้น
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function addBackButton() {
        const container = document.querySelector('.products .container');
        if (container && !document.getElementById('backToHome')) {
            const backBtn = document.createElement('div');
            backBtn.id = 'backToHome';
            backBtn.style.marginBottom = '20px';
            backBtn.innerHTML = `
                <button class="btn btn-secondary" onclick="window.location.href='index.html'">
                    <i class="fas fa-arrow-left"></i> กลับหน้าหลัก
                </button>
            `;
            container.insertBefore(backBtn, container.firstChild);
        }
    }

    // Initialize category filter check
    if (productGrid && categoryGrid) {
        checkCategoryFilter();
    }

    // --- Admin Panel Logic ---
    const addProductForm = document.getElementById('addProductForm');
    const adminProductList = document.getElementById('adminProductList');

    // Category Elements (Moved to top level scope of DOMContentLoaded to ensure visibility)
    const addCategoryForm = document.getElementById('addCategoryForm');
    const adminCategoryList = document.getElementById('adminCategoryList');

    if (addProductForm && adminProductList) {
        loadAdminProducts();

        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('p-name').value;
            const desc = document.getElementById('p-desc').value;
            const price = document.getElementById('p-price').value;
            const oldPrice = document.getElementById('p-old-price').value;
            const imageFile = document.getElementById('p-image').files[0];

            if (imageFile) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const products = JSON.parse(localStorage.getItem('products')) || [];
                    const newProduct = {
                        id: Date.now(),
                        name,
                        desc,
                        price,
                        oldPrice,
                        image: event.target.result, // Base64 string
                        badge: 'ใหม่'
                    };
                    products.push(newProduct);
                    localStorage.setItem('products', JSON.stringify(products));
                    alert('เพิ่มสินค้าเรียบร้อย');
                    addProductForm.reset();
                    loadAdminProducts();
                };
                reader.readAsDataURL(imageFile);
            }
        });
    }

    if (addCategoryForm && adminCategoryList) {
        loadAdminCategories();

        addCategoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('c-name').value;
            const imageFile = document.getElementById('c-image').files[0];

            if (!name || !imageFile) {
                alert('กรุณากรอกข้อมูลให้ครบถ้วน');
                return;
            }

            // Check file size (limit to 1MB roughly)
            if (imageFile.size > 1024 * 1024) {
                if (!confirm('รูปภาพมีขนาดใหญ่เกิน 1MB อาจทำให้ระบบช้าหรือบันทึกไม่ได้ ต้องการย่อขนาดอัตโนมัติหรือไม่?')) {
                    return;
                }
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                const img = new Image();
                img.src = event.target.result;
                img.onload = function () {
                    // Force Resize to 2200x590
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    const TARGET_WIDTH = 2200;
                    const TARGET_HEIGHT = 590;

                    canvas.width = TARGET_WIDTH;
                    canvas.height = TARGET_HEIGHT;

                    // Draw image stretched/filled to 2200x590
                    ctx.drawImage(img, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

                    // Compress to JPEG 80% quality to avoid localStorage limit
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

                    try {
                        const categories = JSON.parse(localStorage.getItem('categories')) || [];
                        const newCategory = {
                            id: Date.now(),
                            name,
                            image: dataUrl
                        };

                        categories.push(newCategory);
                        localStorage.setItem('categories', JSON.stringify(categories));
                        alert('เพิ่มหมวดหมู่เรียบร้อย');
                        addCategoryForm.reset();
                        loadAdminCategories();
                    } catch (err) {
                        console.error(err);
                        alert('บันทึกไม่สำเร็จ! ขนาดไฟล์ใหญ่เกินไปสำหรับ LocalStorage (แม้จะย่อแล้ว) กรุณาลองใช้รูปที่รายละเอียดน้อยลง');
                    }
                };
            };
            reader.readAsDataURL(imageFile);
        });
    }

    function loadAdminProducts() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        adminProductList.innerHTML = products.map(p => `
            <div class="admin-product-card">
                ${p.image.startsWith('data:') ? `<img src="${p.image}">` : `<div style="height:120px; background:#eef; display:flex; align-items:center; justify-content:center; color:#888;">${p.image}</div>`}
                <h4>${p.name}</h4>
                <p>${p.price} บาท</p>
                <button class="btn-delete" onclick="deleteProduct(${p.id})">ลบสินค้า</button>
            </div>
        `).join('');
    }

    function loadAdminCategories() {
        const categories = JSON.parse(localStorage.getItem('categories')) || [];
        adminCategoryList.innerHTML = categories.map(c => `
            <div class="admin-product-card">
                ${c.image.startsWith('data:') ? `<img src="${c.image}" style="width:50px; height:50px; object-fit:contain; margin-bottom:10px;">` : `<div style="font-size:2rem; margin-bottom:10px; color:#87CEEB;">${c.image}</div>`}
                <h4>${c.name}</h4>
                <button class="btn-delete" onclick="deleteCategory(${c.id})">ลบ</button>
            </div>
        `).join('');
    }

    // --- Member Management (Admin) ---
    const memberList = document.getElementById('memberList');
    if (memberList) {
        loadMembers();
    }

    function loadMembers() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        memberList.innerHTML = users.map(u => `
            <tr>
                <td>${u.username}</td>
                <td>${u.role}</td>
                <td>${u.points || 0.00}</td>
                <td>
                    ${u.role !== 'admin' ? `<button class="btn-delete" style="background:#ffc107; color:black;" onclick="adjustPoints('${u.username}')">ปรับยอด</button>` : '-'}
                </td>
            </tr>
        `).join('');
    }

    window.adjustPoints = function (username) {
        const amount = prompt('กรอกจำนวนเงินที่ต้องการเพิ่ม/ลด (เช่น 50 หรือ -20):');
        if (amount && !isNaN(amount)) {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            let user = users.find(u => u.username === username);
            if (user) {
                user.points = (user.points || 0) + parseFloat(amount);
                localStorage.setItem('users', JSON.stringify(users));
                loadMembers();
                alert('ปรับยอดเงินสำเร็จ');
            }
        }
    };

    // --- Top-up System & Selection flow ---
    window.showTopupMethod = function (method) {
        document.getElementById('selection-view').style.display = 'none';
        document.getElementById('topup-desc').textContent = 'กรุณากรอกข้อมูลเพื่อชำระเงิน';

        const targetView = document.getElementById(`${method}-view`);
        if (targetView) targetView.style.display = 'block';

        // Reset status message
        const statusMsg = document.getElementById('status-message');
        if (statusMsg) {
            statusMsg.textContent = '';
            statusMsg.style.color = 'inherit';
        }
    };

    window.backToSelection = function () {
        document.querySelectorAll('.method-view').forEach(view => view.style.display = 'none');
        document.getElementById('selection-view').style.display = 'flex';
        document.getElementById('topup-desc').textContent = 'เลือกวิธีการเติมเงินที่ท่านสะดวก';

        const statusMsg = document.getElementById('status-message');
        if (statusMsg) {
            statusMsg.textContent = '';
            statusMsg.style.color = 'inherit';
        }
    };

    const topupForm = document.getElementById('topupForm');
    if (topupForm) {
        topupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fileInput = document.getElementById('slip-image');
            const file = fileInput.files[0];
            const statusMsg = document.getElementById('status-message');
            const btn = document.getElementById('topupBtn');

            if (!file) {
                alert('กรุณาอัปโหลดสลิป');
                return;
            }

            // Check Login
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                alert('กรุณาเข้าสู่ระบบก่อนเติมเงิน');
                window.location.href = 'login.html';
                return;
            }

            statusMsg.textContent = 'กำลังตรวจสอบสลิป... (AI OCR)';
            statusMsg.style.color = 'blue';
            btn.disabled = true;

            try {
                // OCR Process
                const worker = await Tesseract.createWorker('tha+eng');
                const ret = await worker.recognize(file);
                await worker.terminate();

                const text = ret.data.text;
                console.log('OCR Text:', text); // For debugging

                // Simple regex to find transaction ID and Amount (Adjust logic as needed for real banks)
                // This is a basic simulation/example
                // Finding Date format like 14/02/2569 or similar might be complex across banks.
                // We will simulate success if text contains typical bank keywords or assume success for demo if amount is found.

                // Look for amount: 50.00, 100.00, etc.
                const amountMatch = text.match(/([\d,]+)\.\d{2}/);
                // Look for Trans ID (e.g., typical bank ref 0123...) - highly variable
                // Demo: we use the file name or generate a hash to simulate "Reference Check" if regex fails
                // In production: Regex MUST match specific bank slip formats

                if (amountMatch) {
                    const amount = parseFloat(amountMatch[0].replace(',', ''));
                    const refId = "REF-" + Date.now(); // Mock Ref ID for unique check since OCR Ref is hard without specific Bank patterns

                    // Duplicate Check Logic
                    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
                    // Using file size+name as a weak "hash" for duplicate slip upload prevention in demo
                    const fileHash = file.name + file.size;

                    if (transactions.find(t => t.hash === fileHash)) {
                        throw new Error('สลิปนี้ถูกใช้งานไปแล้ว');
                    }

                    // Success Logic
                    transactions.push({ ref: refId, amount: amount, user: currentUser.username, date: new Date().toISOString(), hash: fileHash });
                    localStorage.setItem('transactions', JSON.stringify(transactions));

                    // Add points to user
                    let users = JSON.parse(localStorage.getItem('users')) || [];
                    let userIndex = users.findIndex(u => u.username === currentUser.username);
                    if (userIndex !== -1) {
                        users[userIndex].points = (users[userIndex].points || 0) + amount;
                        localStorage.setItem('users', JSON.stringify(users));
                        // Update current user session
                        currentUser.points = users[userIndex].points;
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    }

                    statusMsg.textContent = `เติมเงินสำเร็จ! ยอด ${amount} บาท`;
                    statusMsg.style.color = 'green';

                    // Webhook Notification
                    if (typeof window.notifyDiscord === 'function') {
                        window.notifyDiscord({
                            title: '💰 เติมเงินใหม่ (QR Slip)',
                            color: 15844367,
                            fields: [
                                { name: 'User', value: currentUser.username, inline: true },
                                { name: 'Amount', value: `฿${amount.toFixed(2)}`, inline: true },
                                { name: 'Ref', value: refId, inline: false }
                            ]
                        });
                    }

                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);

                } else {
                    throw new Error('อ่านยอดเงินไม่ได้ หรือสลิปไม่ชัดเจน');
                }

            } catch (error) {
                console.error(error);
                statusMsg.textContent = 'เกิดข้อผิดพลาด: ' + error.message;
                statusMsg.style.color = 'red';
                btn.disabled = false;
            }
        });
    }

    // --- Gift Link Top-up ---
    const giftTopupForm = document.getElementById('giftTopupForm');
    if (giftTopupForm) {
        giftTopupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const giftLink = document.getElementById('gift-link').value;
            const statusMsg = document.getElementById('status-message');
            const btn = document.getElementById('giftTopupBtn');

            // Logged in check
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                alert('กรุณาเข้าสู่ระบบก่อนเติมเงิน');
                window.location.href = 'login.html';
                return;
            }

            statusMsg.textContent = 'กำลังตรวจสอบลิงก์...';
            statusMsg.style.color = 'blue';
            btn.disabled = true;

            try {
                // Mock balance extraction (Real system would call an API here)
                // TrueWallet Gift Links usually look like: https://gift.truemoney.com/campaign/?v=XXXXXXXXXXXXXXX
                const linkPattern = /^https:\/\/gift\.truemoney\.com\/campaign\/\?v=[a-zA-Z0-9]+$/;

                if (!linkPattern.test(giftLink)) {
                    throw new Error('ลิงก์ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง (ต้องเป็นลิงก์จาก TrueMoney Gift)');
                }

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Duplicate Check
                let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
                if (transactions.find(t => t.link === giftLink)) {
                    throw new Error('ลิงก์นี้เคยถูกใช้งานไปแล้ว');
                }

                // Demo Success: Simulate extracting amount
                const mockAmount = [10, 20, 50, 100, 300, 500][Math.floor(Math.random() * 6)];
                const refId = "GIFT-" + Date.now();

                // Record transaction
                transactions.push({
                    ref: refId,
                    amount: mockAmount,
                    user: currentUser.username,
                    date: new Date().toISOString(),
                    link: giftLink,
                    type: 'gift',
                    hash: giftLink // Use link as hash for gift
                });
                localStorage.setItem('transactions', JSON.stringify(transactions));

                // Add points
                let users = JSON.parse(localStorage.getItem('users')) || [];
                let userIndex = users.findIndex(u => u.username === currentUser.username);
                if (userIndex !== -1) {
                    users[userIndex].points = (users[userIndex].points || 0) + mockAmount;
                    localStorage.setItem('users', JSON.stringify(users));
                    currentUser.points = users[userIndex].points;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }

                statusMsg.textContent = `เติมเงินสำเร็จ! ยอด ${mockAmount} บาท (จากอั่งเปา)`;
                statusMsg.style.color = 'green';

                if (typeof window.notifyDiscord === 'function') {
                    window.notifyDiscord({
                        title: '🎁 เติมเงินใหม่ (Gift Link)',
                        color: 15105570,
                        fields: [
                            { name: 'User', value: currentUser.username, inline: true },
                            { name: 'Amount', value: `฿${mockAmount.toFixed(2)}`, inline: true },
                            { name: 'Ref', value: refId, inline: false }
                        ]
                    });
                }

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);

            } catch (error) {
                statusMsg.textContent = 'เกิดข้อผิดพลาด: ' + error.message;
                statusMsg.style.color = 'red';
                btn.disabled = false;
            }
        });
    }

    // --- Global Discord Notification ---
    window.notifyDiscord = function (embed, customUrl = null) {
        const webhookURL = customUrl || localStorage.getItem('discordWebhookUrl');
        if (!webhookURL) return Promise.resolve(false);

        const payload = {
            embeds: [
                {
                    ...embed,
                    footer: { text: 'ระบบแจ้งเตือนแอดมิน (Capybara Store)' },
                    timestamp: new Date().toISOString()
                }
            ]
        };

        return fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.ok)
            .catch(err => {
                console.error('Discord Webhook Error:', err);
                return false;
            });
    };


    // Global function for delete (needs to be attached to window)
    window.deleteProduct = function (id) {
        if (confirm('ต้องการลบสินค้านี้ใช่หรือไม่?')) {
            let products = JSON.parse(localStorage.getItem('products')) || [];
            products = products.filter(p => p.id !== id);
            localStorage.setItem('products', JSON.stringify(products));
            loadAdminProducts();
        }
    };

    window.deleteCategory = function (id) {
        if (confirm('ต้องการลบหมวดหมู่นี้ใช่หรือไม่?')) {
            let categories = JSON.parse(localStorage.getItem('categories')) || [];
            categories = categories.filter(c => c.id !== id);
            localStorage.setItem('categories', JSON.stringify(categories));
            loadAdminCategories();
        }
    };

    // Mobile Navigation (Existing)
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // Scroll Effects (Existing)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !document.querySelector(targetId)) return; // Fix for empty hrefs
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });
});

// --- Purchase Logic (Added as global) ---
window.buyProduct = function (productId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('กรุณาเข้าสู่ระบบก่อนซื้อสินค้า');
        window.location.href = 'login.html';
        return;
    }

    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);

    if (!product) {
        alert('ไม่พบข้อมูลสินค้า');
        return;
    }

    if ((product.stock || 0) <= 0) {
        alert('ขออภัย สินค้าหมดแล้ว');
        return;
    }

    if ((currentUser.points || 0) < product.price) {
        alert('ยอดเงินของคุณไม่เพียงพอ กรุณาเติมเงินก่อนทำรายการ');
        window.location.href = 'topup.html';
        return;
    }

    if (!confirm(`คุณต้องการซื้อ ${product.name} ในราคา ฿${product.price} ใช่หรือไม่?`)) {
        return;
    }

    // Process Transaction
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === currentUser.username);

    if (userIndex !== -1) {
        // Deduct points
        users[userIndex].points = (users[userIndex].points || 0) - product.price;

        // Update current user
        currentUser.points = users[userIndex].points;

        // Save users and current session
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Record purchase
        const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
        const newPurchase = {
            id: Date.now(),
            username: currentUser.username,
            productId: product.id,
            productName: product.name,
            productInfo: product.productInfo || 'ไม่มีข้อมูล',
            amount: product.price,
            date: new Date().toISOString()
        };
        purchases.push(newPurchase);
        localStorage.setItem('purchases', JSON.stringify(purchases));

        // Update product stock and sales count
        const pIndex = products.findIndex(p => p.id === productId);
        if (pIndex !== -1) {
            // Check stock again to be sure (it should have been checked at the start)
            if ((products[pIndex].stock || 0) <= 0) {
                alert('ขออภัย สินค้าหมดกะทันหัน');
                return;
            }

            // Decrement stock and increment sales count
            products[pIndex].stock = (products[pIndex].stock || 0) - 1;
            products[pIndex].salesCount = (products[pIndex].salesCount || 0) + 1;
            localStorage.setItem('products', JSON.stringify(products));
        }

        alert('สั่งซื้อสินค้าสำเร็จ!');

        // Discord Notification
        if (typeof window.notifyDiscord === 'function') {
            window.notifyDiscord({
                title: '🛒 การสั่งซื้อใหม่!',
                color: 1752220,
                fields: [
                    { name: 'User', value: currentUser.username, inline: true },
                    { name: 'Product', value: product.name, inline: true },
                    { name: 'Amount', value: `฿${product.price.toFixed(2)}`, inline: true }
                ]
            });
        }

        window.location.href = 'history.html';
    } else {
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้');
    }
};
