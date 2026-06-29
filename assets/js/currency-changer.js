// assets/js/currency-changer.js - Platform Multi-Currency Converter Engine

// 1. Setup global static rate matrix factors relative to base standard USD ($1.00)
window.CURRENCY_RATES = {
    USD: { code: 'USD', symbol: '$', rate: 1.00 },
    EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
    GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
    PHP: { code: 'PHP', symbol: '₱', rate: 58.50 }
};

// 2. Fetch active localized currency state payload values
window.getActiveCurrencyExchange = function() {
    const savedCode = localStorage.getItem('platformSelectedCurrency') || 'USD';
    return window.CURRENCY_RATES[savedCode] || window.CURRENCY_RATES.USD;
};

// 3. Calculation helper function to format currency cleanly based on state strings
window.formatCurrencyValue = function(usdAmount) {
    const currency = window.getActiveCurrencyExchange();
    const convertedAmount = (Number(usdAmount) * currency.rate).toFixed(2);
    return `${currency.symbol}${convertedAmount}`;
};

// 4. Global state management routine to update active values on selection switch
window.updatePlatformCurrencyExchange = function(newCurrencyCode) {
    if (!window.CURRENCY_RATES[newCurrencyCode]) return;

    // CRITICAL FIX: Save selection to local browser memory cache FIRST to stop the display delay!
    localStorage.setItem('platformSelectedCurrency', newCurrencyCode);
    
    // Refresh the Overview Gross Revenue text value card instantly
    const grossRevenueEl = document.getElementById('analyticsGrossRevenue');
    if (grossRevenueEl) {
        const baseUsd = grossRevenueEl.getAttribute('data-base-usd') || "136492.84";
        grossRevenueEl.textContent = window.formatCurrencyValue(baseUsd);
    }
    
    // --- ADDED FIX: UPDATE CHECKOUT CART SUMMARY PANELS INSTANTLY ---
    const subtotalEl = document.querySelector(".cart-subtotal");
    const taxEl = document.querySelector(".cart-tax");
    const totalEl = document.querySelector(".cart-total");

    if (subtotalEl || taxEl || totalEl) {
        const currency = window.getActiveCurrencyExchange();
        
        if (subtotalEl) {
            const baseSub = subtotalEl.getAttribute("data-base-usd") || "0.00";
            subtotalEl.textContent = window.formatCurrencyValue(baseSub);
        }
        if (taxEl) {
            const baseTax = taxEl.getAttribute("data-base-usd") || "0.00";
            taxEl.textContent = window.formatCurrencyValue(baseTax);
        }
        if (totalEl) {
            const baseTotal = totalEl.getAttribute("data-base-usd") || "0.00";
            totalEl.textContent = window.formatCurrencyValue(baseTotal);
        }
    }
    
    // Force the Catalog Card list layout grid to refresh immediately
    if (typeof window.renderCatalogCards === 'function') {
        window.renderCatalogCards(); 
    }
    
    // Force the Checkout Cart grid view page elements to refresh immediately
    if (typeof window.renderCheckoutCart === 'function') {
        window.renderCheckoutCart();
    }
    
    // Force the Sales & Financial Analytics Page module templates to refresh immediately
    if (typeof window.renderSalesAnalyticsPage === 'function') {
        window.renderSalesAnalyticsPage();
    }
    
    // Update active main dashboards charts safely
    if (typeof window.refreshAnalyticsChartCurrency === 'function') {
        window.refreshAnalyticsChartCurrency();
    }
    
    // Update open detail panels if looking at a game drawer view
    const activeDetailTitle = document.querySelector("#gameDetailRenderArea h2");
    if (activeDetailTitle && typeof window.openGameDetails === 'function') {
        window.openGameDetails(activeDetailTitle.textContent);
    }
};