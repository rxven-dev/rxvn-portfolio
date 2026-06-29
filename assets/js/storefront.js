// REAL-TIME STOREFRONT & SHOPPING CART ENGINE
document.addEventListener('DOMContentLoaded', () => {
    let activeCart = JSON.parse(localStorage.getItem('storefrontCart')) || [];

    // Initialize notification counters
    updateCartBadgeCounter();

    // Event Delegation: Intercept dynamic "Add" clicks safely inside the catalog container
    const catalogCardsContainer = document.getElementById('catalogCardsContainer');
    if (catalogCardsContainer) {
        catalogCardsContainer.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('.btn-add-cart');
            if (!targetBtn) return;

            // Stop click from triggering the main details modal popup
            e.preventDefault();
            e.stopPropagation();

            const gameTitle = targetBtn.getAttribute('data-game-title');
            const gamePrice = targetBtn.getAttribute('data-game-price');

            // Push payload object into item matrix array
            activeCart.push({
                title: gameTitle,
                price: parseFloat(gamePrice)
            });

            localStorage.setItem('storefrontCart', JSON.stringify(activeCart));
            updateCartBadgeCounter();
            
            alert(`🛒 Added "${gameTitle}" to your cart!`);
        });
    }

    function updateCartBadgeCounter() {
        // Targets the small numerical circle in your top headers if present
        const globalCartBadge = document.querySelector('.topbar-actions .badge, .notification-btn .badge');
        if (globalCartBadge) {
            globalCartBadge.innerText = activeCart.length;
            globalCartBadge.style.display = activeCart.length > 0 ? 'inline-block' : 'none';
        }
    }
});