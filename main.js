// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const productListElement = document.getElementById('product-list');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    // Toggle mobile navigation
    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
        });
    }

    // Function to render products on the home page
    if (productListElement) {
        renderProducts();
    }

    async function renderProducts() {
        const products = await getProducts(); // Get products from products.js

        if (productListElement) {
            productListElement.innerHTML = ''; // Clear existing content
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <img data-src="${product.imageUrl}" alt="${product.name}" class="lazy-load">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <span class="price">$${product.price.toFixed(2)}</span>
                        <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                    </div>
                `;
                productListElement.appendChild(productCard);
            });

            // Add event listeners for "Add to Cart" buttons
            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const productId = event.target.dataset.productId;
                    addToCart(productId);
                });
            });

            // Apply lazy loading after products are rendered
            applyLazyLoading();
        }
    }

    // --- Product Detail Page (product.html) logic ---
    const productDetailContainer = document.getElementById('product-detail-container');
    if (productDetailContainer) {
        renderProductDetail();
    }

    async function renderProductDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId) {
            productDetailContainer.innerHTML = "<p>Product not found.</p>";
            return;
        }

        const product = await getProductById(productId);

        if (product) {
            productDetailContainer.innerHTML = `
                <div class="product-detail-card">
                    <img src="${product.imageUrl}" alt="${product.name}" class="product-detail-img">
                    <div class="product-detail-info">
                        <h1>${product.name}</h1>
                        <p class="product-detail-description">${product.description}</p>
                        <span class="product-detail-price">$${product.price.toFixed(2)}</span>
                        <div class="quantity-selector">
                            <label for="quantity">Quantity:</label>
                            <input type="number" id="quantity" value="1" min="1">
                        </div>
                        <button class="btn btn-primary add-to-cart-detail-btn" data-product-id="${product.id}">Add to Cart</button>
                        <a href="index.html" class="btn btn-secondary back-to-shop-btn">Back to Shop</a>
                    </div>
                </div>
            `;

            document.querySelector('.add-to-cart-detail-btn').addEventListener('click', (event) => {
                const productId = event.target.dataset.productId;
                const quantity = parseInt(document.getElementById('quantity').value);
                addToCart(productId, quantity);
            });
        } else {
            productDetailContainer.innerHTML = "<p>Product not found.</p>";
        }
    }


    // --- Cart Page (cart.html) logic ---
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPriceElement = document.getElementById('cart-total-price');

    if (cartItemsContainer && cartTotalPriceElement) {
        renderCartItems();
    }

    function renderCartItems() {
        if (!cartItemsContainer) return; // Exit if not on cart page

        cartItemsContainer.innerHTML = ''; // Clear existing items
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty. <a href="index.html">Start shopping!</a></p>';
            cartTotalPriceElement.textContent = '$0.00';
            return;
        }

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity-control">
                        <button class="quantity-minus" data-id="${item.id}">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="item-quantity-input" data-id="${item.id}">
                        <button class="quantity-plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-from-cart-btn" data-id="${item.id}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
            totalPrice += item.price * item.quantity;
        });

        cartTotalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;

        // Add event listeners for quantity controls and remove buttons
        document.querySelectorAll('.quantity-minus').forEach(button => {
            button.addEventListener('click', (event) => {
                const id = event.target.dataset.id;
                const input = document.querySelector(`.item-quantity-input[data-id="${id}"]`);
                updateCartItemQuantity(id, parseInt(input.value) - 1);
            });
        });

        document.querySelectorAll('.quantity-plus').forEach(button => {
            button.addEventListener('click', (event) => {
                const id = event.target.dataset.id;
                const input = document.querySelector(`.item-quantity-input[data-id="${id}"]`);
                updateCartItemQuantity(id, parseInt(input.value) + 1);
            });
        });

        document.querySelectorAll('.item-quantity-input').forEach(input => {
            input.addEventListener('change', (event) => {
                const id = event.target.dataset.id;
                updateCartItemQuantity(id, parseInt(event.target.value));
            });
        });

        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const id = event.target.dataset.id;
                removeFromCart(id);
            });
        });
    }

    // --- Checkout Page (checkout.html) logic ---
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault();
            // In a real app, send data to server, process payment, etc.
            alert('Order placed successfully! (Simulated)');
            localStorage.removeItem('quantumCart'); // Clear cart after checkout
            window.location.href = 'index.html'; // Redirect to home
        });
    }

    // Initial update of cart count on all pages
    updateCartCount();

    // Lazy loading implementation
    function applyLazyLoading() {
        const lazyImages = document.querySelectorAll('.lazy-load');
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // load when 10% of image is visible
        };

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-load');
                    observer.unobserve(img);
                }
            });
        }, observerOptions);

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
});