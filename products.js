// js/products.js

const products = [
    {
        id: 'P001',
        name: 'Quantum-Core Laptop',
        description: 'Blazing fast laptop with a revolutionary quantum processor and holographic display.',
        price: 2499.99,
        imageUrl: 'images/product-laptop.webp'
    },
    {
        id: 'P002',
        name: 'Neural Interface Headset',
        description: 'Connect directly to the digital realm. Experience augmented reality like never before.',
        price: 1299.99,
        imageUrl: 'images/product-headset.webp'
    },
    {
        id: 'P003',
        name: 'Bio-Enhancement Pills',
        description: 'Boost your cognitive function and physical performance naturally. (Disclaimer: Consult a physician.)',
        price: 199.99,
        imageUrl: 'images/product-pills.webp'
    },
    {
        id: 'P004',
        name: 'Automated Cleaning Drone',
        description: 'Keep your living space spotless with this autonomous, silent cleaning marvel.',
        price: 799.99,
        imageUrl: 'images/product-drone.webp'
    },
    {
        id: 'P005',
        name: 'Portable Fusion Reactor',
        description: 'Unlimited, clean energy on the go. Power your devices for years.',
        price: 4999.99,
        imageUrl: 'images/product-reactor.webp'
    },
    {
        id: 'P006',
        name: 'Smart Fabric Jacket',
        description: 'Adapts to any climate, self-cleaning, and features integrated health monitoring.',
        price: 899.99,
        imageUrl: 'images/product-jacket.webp'
    }
];

// Function to simulate fetching products
function getProducts() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(products);
        }, 500); // Simulate network delay
    });
}

function getProductById(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            const product = products.find(p => p.id === id);
            resolve(product);
        }, 300); // Simulate network delay
    });
}