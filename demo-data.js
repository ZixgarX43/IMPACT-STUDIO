// Demo Data Generator for Admin System
// Run this in browser console to populate demo data

function generateDemoData() {
    console.log('Generating demo data...');

    // Add demo users
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const demoUsers = [
        { username: 'user1', password: 'password', role: 'user', points: 150.50, locked: false, joinDate: '2026-01-15T10:00:00Z' },
        { username: 'user2', password: 'password', role: 'user', points: 89.00, locked: false, joinDate: '2026-01-20T14:30:00Z' },
        { username: 'user3', password: 'password', role: 'user', points: 250.75, locked: true, joinDate: '2026-02-01T09:15:00Z' },
        { username: 'user4', password: 'password', role: 'user', points: 45.25, locked: false, joinDate: '2026-02-05T16:45:00Z' },
        { username: 'user5', password: 'password', role: 'user', points: 320.00, locked: false, joinDate: '2026-02-10T11:20:00Z' }
    ];

    demoUsers.forEach(demoUser => {
        if (!users.find(u => u.username === demoUser.username)) {
            users.push(demoUser);
        }
    });
    localStorage.setItem('users', JSON.stringify(users));
    console.log('✓ Demo users created');

    // Add demo purchases
    const products = JSON.parse(localStorage.getItem('products')) || [];
    let purchases = JSON.parse(localStorage.getItem('purchases')) || [];

    const demoPurchases = [
        { id: 1, username: 'user1', productId: 1, productName: 'YouTube Premium 1 เดือน', amount: 39.00, date: '2026-02-10T10:30:00Z' },
        { id: 2, username: 'user2', productId: 2, productName: 'Netflix 4K 1 เดือน', amount: 99.00, date: '2026-02-11T14:20:00Z' },
        { id: 3, username: 'user1', productId: 3, productName: 'Spotify Premium 1 ปี', amount: 299.00, date: '2026-02-12T09:15:00Z' },
        { id: 4, username: 'user4', productId: 1, productName: 'YouTube Premium 1 เดือน', amount: 39.00, date: '2026-02-12T16:45:00Z' },
        { id: 5, username: 'user5', productId: 4, productName: 'Canva Pro 1 ปี', amount: 150.00, date: '2026-02-13T11:30:00Z' },
        { id: 6, username: 'user2', productId: 1, productName: 'YouTube Premium 1 เดือน', amount: 39.00, date: '2026-02-13T15:00:00Z' },
        { id: 7, username: 'user1', productId: 2, productName: 'Netflix 4K 1 เดือน', amount: 99.00, date: '2026-02-14T10:20:00Z' },
        { id: 8, username: 'user5', productId: 1, productName: 'YouTube Premium 1 เดือน', amount: 39.00, date: '2026-02-14T13:45:00Z' },
        { id: 9, username: 'user4', productId: 3, productName: 'Spotify Premium 1 ปี', amount: 299.00, date: '2026-02-14T17:30:00Z' },
        { id: 10, username: 'user2', productId: 4, productName: 'Canva Pro 1 ปี', amount: 150.00, date: '2026-02-15T09:00:00Z' }
    ];

    purchases = [...purchases, ...demoPurchases];
    localStorage.setItem('purchases', JSON.stringify(purchases));
    console.log('✓ Demo purchases created');

    // Update product sales counts
    if (products.length > 0) {
        products.forEach(p => {
            const productPurchases = purchases.filter(pur => pur.productId === p.id);
            p.salesCount = productPurchases.length;
        });
        localStorage.setItem('products', JSON.stringify(products));
        console.log('✓ Product sales counts updated');
    }

    // Add visitor data for the last 7 days
    let visitors = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        visitors.push({
            date: dateStr,
            count: Math.floor(Math.random() * 300) + 150
        });
    }
    localStorage.setItem('visitors', JSON.stringify(visitors));
    console.log('✓ Visitor data created');

    console.log('✅ All demo data generated successfully!');
    console.log('Reload the admin page to see the data.');
}

// Run the function
generateDemoData();
