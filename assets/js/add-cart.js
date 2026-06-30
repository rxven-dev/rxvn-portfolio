// add-cart.js - Safe E-Commerce Cart Engine Module
document.addEventListener("DOMContentLoaded", () => {
    // Initial global cart array state instance mapped from memory storage cache
    let cartRegistry = JSON.parse(localStorage.getItem("globalCartRegistry")) || [];

    // Safely look up DOM components
    const navBadge = document.getElementById("cart-nav-badge");
    const cartStream = document.getElementById("cartPageItemsStream");
    const subtotalDisplay = document.getElementById("summarySubtotal");
    const taxDisplay = document.getElementById("summaryTax");
    const totalDisplay = document.getElementById("summaryTotal");
    const checkoutBtn = document.getElementById("btnProcessCheckout");

    // Global listener interface injection so outside files can invoke actions cleanly
    window.addGameToCart = function(title, price, image) {
        const structuralPrice = parseFloat(price) || 0;
        const existingItem = cartRegistry.find(item => item.title === title);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartRegistry.push({ title, price: structuralPrice, image, quantity: 1 });
        }

        synchronizeCartState();
        window.showCustomPopup('Game has been successfully added to your checkout cart selection!', 'success');
    };

    function synchronizeCartState() {
        localStorage.setItem("globalCartRegistry", JSON.stringify(cartRegistry));
        window.renderCheckoutCart();
    }

    // EXPOSED GLOBAL FUNCTION: Wired up to listen directly to currency-changer updates!
    window.renderCheckoutCart = function() {
        // Defensive check: Ensure cartRegistry is treated cleanly as an array
        if (!Array.isArray(cartRegistry)) {
            cartRegistry = [];
        }

        // Calculate Badge Quantities Total Sum safely
        const itemsCount = cartRegistry.reduce((acc, item) => acc + (item.quantity || 0), 0);
        
        if (navBadge) {
            if (itemsCount > 0) {
                navBadge.innerText = itemsCount;
                navBadge.style.display = "inline-block";
            } else {
                navBadge.style.display = "none";
            }
        }

        if (!cartStream) return; // Exit logic trace gracefully if user isn't on cart screen window view

        if (cartRegistry.length === 0) {
            cartStream.innerHTML = `<p style="color: var(--text-secondary); text-align: center; padding: 24px 0;">Your shopping cart is currently empty.</p>`;
            
            // Format fallback values through currency changer context maps safely
            const fallbackZero = typeof window.formatCurrencyValue === "function" ? window.formatCurrencyValue(0) : "$0.00";
            if (subtotalDisplay) subtotalDisplay.innerText = fallbackZero;
            if (taxDisplay) taxDisplay.innerText = fallbackZero;
            if (totalDisplay) totalDisplay.innerText = fallbackZero;
            return;
        }

        let runningSubtotal = 0;
        cartStream.innerHTML = "";

        cartRegistry.forEach((item, index) => {
            const itemQty = item.quantity || 1;
            const itemPrice = item.price || 0;
            const itemCost = itemPrice * itemQty;
            runningSubtotal += itemCost;

            // Translate base USD calculations using dynamic system formatter rules
            const formattedPriceEach = typeof window.formatCurrencyValue === "function" 
                ? window.formatCurrencyValue(itemPrice) 
                : `$${itemPrice.toFixed(2)}`;
                
            const formattedCostTotal = typeof window.formatCurrencyValue === "function" 
                ? window.formatCurrencyValue(itemCost) 
                : `$${itemCost.toFixed(2)}`;

            const rowNode = document.createElement("div");
            rowNode.style = "display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; gap: 16px; margin-bottom: 12px;";
            
            // FIXED BELOW: Updated onclick properties to target window.updateQtyAdjust and window.removeItemFromNode
            rowNode.innerHTML = `
                <div style="display: flex; align-items: center; gap: 14px;">
                    <img src="${item.image || 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=100'}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 6px;">
                    <div>
                        <h4 style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">${item.title}</h4>
                        <p style="color: var(--success); font-size: 0.85rem; font-weight: 600;">${formattedPriceEach} each</p>
                    </div>
                </div>
                
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="display: flex; align-items: center; background: var(--bg-input); border-radius: 6px; overflow: hidden; border: 1px solid var(--border-color);">
                        <button class="cart-qty-btn" onclick="window.updateQtyAdjust(${index}, -1)" style="padding: 4px 10px; background:transparent; border:none; cursor:pointer; color: var(--text-primary); font-weight:700;">-</button>
                        <span style="padding: 0 4px; font-size: 0.85rem; font-weight:600; min-width:20px; text-align:center;">${itemQty}</span>
                        <button class="cart-qty-btn" onclick="window.updateQtyAdjust(${index}, 1)" style="padding: 4px 10px; background:transparent; border:none; cursor:pointer; color: var(--text-primary); font-weight:700;">+</button>
                    </div>
                    <span style="font-weight: 700; font-size: 1rem; min-width: 70px; text-align: right;">${formattedCostTotal}</span>
                    <button onclick="window.removeItemFromNode(${index})" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center;"><i class="ri-delete-bin-6-line"></i></button>
                </div>
            `;
            cartStream.appendChild(rowNode);
        });

        // Compute checkout calculations
        const calculatedTax = runningSubtotal * 0.05;
        const totalInvoiceSummary = runningSubtotal + calculatedTax;

        // Apply final dynamic summary outputs mapped out cleanly
        if (subtotalDisplay) {
            subtotalDisplay.innerText = typeof window.formatCurrencyValue === "function" ? window.formatCurrencyValue(runningSubtotal) : `$${runningSubtotal.toFixed(2)}`;
        }
        if (taxDisplay) {
            taxDisplay.innerText = typeof window.formatCurrencyValue === "function" ? window.formatCurrencyValue(calculatedTax) : `$${calculatedTax.toFixed(2)}`;
        }
        if (totalDisplay) {
            totalDisplay.innerText = typeof window.formatCurrencyValue === "function" ? window.formatCurrencyValue(totalInvoiceSummary) : `$${totalInvoiceSummary.toFixed(2)}`;
        }
    };

    window.updateQtyAdjust = function(index, direction) {
        if (!cartRegistry[index]) return;
        cartRegistry[index].quantity = (cartRegistry[index].quantity || 1) + direction;
        if (cartRegistry[index].quantity <= 0) {
            cartRegistry.splice(index, 1);
        }
        synchronizeCartState();
    };

    window.removeItemFromNode = function(index) {
        if (!cartRegistry[index]) return;
        cartRegistry.splice(index, 1);
        synchronizeCartState();
    };

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            alert("🔒 Checkout Complete! Licenses have been provisioned to your profile.");
            cartRegistry = [];
            synchronizeCartState();
        });
    }

    // Initialize UI rendering checks smoothly on start load
    window.renderCheckoutCart();
});