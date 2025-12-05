document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENT SELECTION ---
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = document.getElementById('close-checkout-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCount = document.querySelector('.cart-count');
    const checkoutForm = document.getElementById('checkout-form');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    let cart = [];

    // --- CART FUNCTIONALITY ---
    const updateCartUI = () => {
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;
        let itemCount = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <span>${item.name}</span>
                    <span>৳${item.price}</span>
                `;
                cartItemsContainer.appendChild(cartItem);
                totalPrice += item.price;
                itemCount++;
            });
        }

        cartTotalPrice.textContent = totalPrice;
        cartCount.textContent = itemCount;
    };

    const addToCart = (e) => {
        const button = e.target;
        const name = button.getAttribute('data-name');
        const price = parseInt(button.getAttribute('data-price'));

        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            alert('This item is already in your cart!');
            return;
        }

        cart.push({ name, price });
        updateCartUI();
        
        // Visual feedback
        button.textContent = 'Added!';
        button.style.backgroundColor = '#28a745';
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.backgroundColor = '';
        }, 1500);
    };

    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // --- MODAL FUNCTIONALITY ---
    const openModal = (modal) => {
        modal.style.display = 'block';
    };

    const closeModal = (modal) => {
        modal.style.display = 'none';
    };

    cartBtn.addEventListener('click', () => openModal(cartModal));
    closeCartBtn.addEventListener('click', () => closeModal(cartModal));
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Add some items first!');
            return;
        }
        closeModal(cartModal);
        openModal(checkoutModal);
    });
    closeCheckoutBtn.addEventListener('click', () => closeModal(checkoutModal));

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) closeModal(cartModal);
        if (e.target === checkoutModal) closeModal(checkoutModal);
    });

    // --- CHECKOUT FUNCTIONALITY ---
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        let orderDetails = `Order Placed Successfully!\n\n`;
        orderDetails += `Name: ${name}\n`;
        orderDetails += `Address: ${address}\n`;
        orderDetails += `Phone: ${phone}\n`;
        orderDetails += `Payment Method: ${paymentMethod === 'bkash' ? 'Bkash' : 'Cash on Delivery'}\n\n`;
        orderDetails += `Items:\n`;
        cart.forEach(item => {
            orderDetails += `- ${item.name}: ৳${item.price}\n`;
        });
        orderDetails += `\nTotal Amount: ৳${cartTotalPrice.textContent}`;
        
        if (paymentMethod === 'bkash') {
            orderDetails += `\n\nPlease pay the total amount to our Bkash number: 01XXXXXXXXX and send the transaction ID to our WhatsApp.`;
        } else {
            orderDetails += `\n\nYou will pay on delivery.`;
        }

        alert(orderDetails);

        // Reset cart and form
        cart = [];
        updateCartUI();
        checkoutForm.reset();
        closeModal(checkoutModal);
    });

    // --- FILTER FUNCTIONALITY ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            productCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- INITIAL CART UI ---
    updateCartUI();
});
