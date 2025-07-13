// js/cart.js

let cart = JSON.parse(localStorage.getItem('quantumCart')) || [];

function saveCart() {
    localStorage.setItem('quantumCart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cartItemCountElement = document.getElementById('cart-item-count');
    if (cartItemCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartItemCountElement.textContent = totalItems;
    }
}

function addToCart(productId, quantity = 1) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        // Find product details to add to cart
        getProductById(productId).then(product => {
            if (product) {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    quantity: quantity
                });
                saveCart();
                alert(`${product.name} added to cart!`);
            } else {
                console.error('Product not found for adding to cart:', productId);
            }
        });
        return; // Exit here to prevent immediate saveCart before product is fetched
    }
    saveCart();
    alert('Product added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    // Re-render cart if on cart page
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
    }
}

function updateCartItemQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, newQuantity); // Ensure quantity is at least 1
        saveCart();
        // Re-render cart if on cart page
        if (window.location.pathname.includes('cart.html')) {
            renderCartItems();
        }
    }
}

// Initial cart count update
document.addEventListener('DOMContentLoaded', updateCartCount);