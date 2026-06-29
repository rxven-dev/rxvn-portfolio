document.addEventListener("DOMContentLoaded", () => {
    
    console.log("GameVantage Operational Interface Engine Running.");

    // --- FALLBACK INITIALIZATION ENGINE ---
    let catalogData = JSON.parse(localStorage.getItem('systemGamesCatalog'));
    if (!catalogData || catalogData.length === 0) {
        const initialGamesCatalog = [
            { title: "Elden Ring", genre: "Action RPG", price: 59.99, stock: "In Stock" },
            { title: "Cyberpunk 2077", genre: "Sci-Fi RPG", price: 49.99, stock: "In Stock" },
            { title: "Minecraft", genre: "Sandbox", price: 26.95, stock: "Low Stock" },
            { title: "Grand Theft Auto V", genre: "Action / Open World", price: 29.99, stock: "In Stock" },
            { title: "First Light 007", genre: "First-Person Shooter", price: 19.99, stock: "In Stock" },
            { title: "Mecha Chameleon", genre: "Arcade / Indie", price: 14.99, stock: "Low Stock" }
        ];
        localStorage.setItem('systemGamesCatalog', JSON.stringify(initialGamesCatalog));
    }

    // DOM Elements Cache Mapping
    const formModal = document.getElementById("gameModal");
    const registerBtn = document.querySelector(".btn-primary");
    const tableBody = document.querySelector(".dashboard-table tbody");
    const searchInput = document.querySelector(".search-bar input");
    const catalogCardsContainer = document.getElementById('catalogCardsContainer');

    const grossRevenueDisplay = document.querySelector(".metrics-grid .metric-card:nth-child(1) .metric-value");
    const unitsDistributedDisplay = document.querySelector(".metrics-grid .metric-card:nth-child(2) .metric-value");

    // Custom Game Image Creation Variables
    const gameImageUploadInput = document.getElementById("gameImageUploadInput");
    const newGameImagePreview = document.getElementById("newGameImagePreview");
    let temporaryGameImageBase64 = "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600";

    // --- COVER BANNER BASE64 LISTENER ENGINE ---
    gameImageUploadInput?.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1.5 * 1024 * 1024) {
                alert("File size too large. Please pick a compressed game banner under 1.5MB.");
                return;
            }
            const reader = new FileReader();
            reader.onload = function(event) {
                temporaryGameImageBase64 = event.target.result;
                if (newGameImagePreview) newGameImagePreview.src = temporaryGameImageBase64;
            };
            reader.readAsDataURL(file);
        }
    });

    // --- VIEW SWITCH PANEL LINKS ---
    let revenueChartInstance = null; 
    const menuItems = ["nav-overview", "nav-catalog", "nav-sales", "nav-profile", "nav-settings", "nav-cart"].map(id => document.getElementById(id));
    const viewItems = ["view-overview", "view-catalog", "view-sales", "view-profile", "view-settings", "view-cart"].map(id => document.getElementById(id));
    

    function switchView(targetId, targetViewId) {
        menuItems.forEach(item => item?.classList.remove("active"));
        viewItems.forEach(view => view?.classList.remove("active-view"));
        document.getElementById(targetId)?.classList.add("active");
        document.getElementById(targetViewId)?.classList.add("active-view");
    }

    // --- DATA DISPLAY INITIALIZER PIPELINE ---
    window.renderCatalogCards = function() {
        const activeCatalog = JSON.parse(localStorage.getItem('systemGamesCatalog')) || [];

        if (tableBody) {
            tableBody.innerHTML = "";
            activeCatalog.forEach(game => {
                const pillClass = game.stock === "In Stock" ? "active" : game.stock === "Low Stock" ? "warning" : "danger";
                const row = document.createElement("tr");
                row.style.cursor = "pointer";
                row.innerHTML = `
                    <td class="font-medium">${game.title}</td>
                    <td>${game.genre}</td>
                    <td>${window.formatCurrencyValue ? window.formatCurrencyValue(game.price) : '$' + Number(game.price).toFixed(2)}</td>
                    <td>0 units</td>
                    <td><span class="status-pill ${pillClass}">${game.stock}</span></td>
                    <td class="text-right"><button class="table-action-btn"><i class="ri-more-2-fill"></i></button></td>
                `;
                row.addEventListener("click", () => {
                    if (typeof window.openGameDetails === "function") {
                        window.openGameDetails(game.title);
                    }
                });
                tableBody.appendChild(row);
            });
        }

        if (catalogCardsContainer) {
            catalogCardsContainer.innerHTML = "";
            activeCatalog.forEach(game => {
                const card = document.createElement("div");
                card.className = "game-display-card";
                
                card.onclick = function(e) {
                    if (e.target.closest('.btn-add-cart')) return;
                    
                    console.log("Card Click Event Registered successfully for game:", game.title);
                    if (typeof window.openGameDetails === "function") {
                        window.openGameDetails(game.title);
                    }
                };
                
                let bannerImg = game.image || "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600";
                
                card.innerHTML = `
                    <div class="game-card-banner-wrapper">
                        <img src="${bannerImg}" alt="Cover">
                    </div>
                    <div class="game-card-meta">
                        <span class="genre-tag">${game.genre}</span>
                        <h3>${game.title}</h3>
                        <p>Studio: ${game.developer || 'Independent'}</p>
                    </div>
                    <div class="game-card-footer">
                        <span class="game-price">${window.formatCurrencyValue ? window.formatCurrencyValue(game.price) : '$' + Number(game.price).toFixed(2)}</span>
                        <button class="btn btn-primary btn-add-cart" 
                                onclick="event.stopPropagation(); window.addGameToCart('${game.title.replace(/'/g, "\\'")}', '${game.price}', '${bannerImg}');"
                                data-game-title="${game.title}" 
                                data-game-price="${game.price}">
                            <i class="ri-shopping-cart-2-line"></i> Add
                        </button>
                    </div>
                `;
                
                catalogCardsContainer.appendChild(card);
            });
        }
        recalculateLiveMetrics(activeCatalog);
    };

    function recalculateLiveMetrics(currentCatalog) {
        let baseRevenue = currentCatalog.reduce((sum, game) => sum + (Number(game.price) * 50), 0); 
        let baseCopies = currentCatalog.length * 50;
        
        if (grossRevenueDisplay) {
            grossRevenueDisplay.innerText = window.formatCurrencyValue ? window.formatCurrencyValue(baseRevenue) : '$' + baseRevenue.toFixed(2);
        }
        if (unitsDistributedDisplay) unitsDistributedDisplay.innerHTML = `${baseCopies.toLocaleString()} <span class="unit">copies</span>`;
    }

    // --- FORM MODAL & GLOBAL INTERACTION BINDINGS ---
    registerBtn?.addEventListener("click", () => { 
        temporaryGameImageBase64 = "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600";
        if (newGameImagePreview) newGameImagePreview.src = temporaryGameImageBase64;
        if (formModal) formModal.style.display = "flex"; 
    });
    
    document.getElementById("closeModalBtn")?.addEventListener("click", () => formModal.style.display = "none");
    document.getElementById("cancelModalBtn")?.addEventListener("click", () => formModal.style.display = "none");

    window.addEventListener("click", (e) => {
        if (e.target === formModal) formModal.style.display = "none";
    });

    // --- COMMIT CUSTOM GAME PACK NODE INTO SYSTEM ---
    document.getElementById("newGameForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("gameTitle").value.trim();
        const genre = document.getElementById("gameGenre").value.trim();
        const developer = document.getElementById("gameDeveloper").value.trim();
        const storage = document.getElementById("gameStorage").value.trim();
        const price = parseFloat(document.getElementById("gamePrice").value);
        const stock = document.getElementById("gameStock").value;

        const currentCatalog = JSON.parse(localStorage.getItem('systemGamesCatalog')) || [];
        
        currentCatalog.push({
            title, 
            genre, 
            price, 
            stock,
            developer: developer || "Independent Developer Studio",
            storage: storage || "Variable Space Needed",
            image: temporaryGameImageBase64
        });
        
        localStorage.setItem('systemGamesCatalog', JSON.stringify(currentCatalog));
        window.renderCatalogCards();
        if (formModal) formModal.style.display = "none";
        e.target.reset();
    });

    searchInput?.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        const rows = tableBody?.querySelectorAll("tr");
        rows?.forEach(row => {
            const match = row.innerText.toLowerCase().includes(query);
            row.style.display = match ? "" : "none";
        });
    });

    // --- GLOBAL MODERN NOTIFICATION INTERFACES ENGINE ---
    window.showCustomToast = function(message) {
        const toast = document.getElementById("customToastNotification");
        const toastMsg = document.getElementById("customToastMessage");
        if (!toast) return;

        toastMsg.textContent = message;
        toast.style.display = "flex";

        setTimeout(() => {
            toast.style.animation = "fadeIn 0.2s ease reverse forwards";
            setTimeout(() => {
                toast.style.display = "none";
                toast.style.animation = "";
            }, 200);
        }, 3500);
    };

    // --- FIX: ULTRA-STABLE CONFIRMATION MODAL INTERFACE ---
    window.showCustomConfirm = function(options, onConfirmCallback) {
        const modal = document.getElementById("customConfirmModal");
        const titleEl = document.getElementById("customModalTitle");
        const msgEl = document.getElementById("customModalMessage");
        const iconWrapper = document.getElementById("customModalIcon");
        const confirmBtn = document.getElementById("customModalConfirmBtn");
        const cancelBtn = document.getElementById("customModalCancelBtn");

        if (!modal || !confirmBtn || !cancelBtn) return;

        // Apply customized settings text parameters safely
        titleEl.textContent = options.title || "Confirm Action";
        msgEl.textContent = options.message || "Are you sure?";
        
        if (options.isDanger) {
            iconWrapper.className = "modal-icon-wrapper danger";
            iconWrapper.innerHTML = `<i class="ri-error-warning-line"></i>`;
            confirmBtn.className = "modal-btn modal-btn-danger";
        } else {
            iconWrapper.className = "modal-icon-wrapper";
            iconWrapper.innerHTML = `<i class="ri-question-line"></i>`;
            confirmBtn.className = "modal-btn modal-btn-primary";
        }

        // Display overlay visual space instantly
        modal.style.display = "flex";

        // FIX: Remove old event listeners by re-assigning clean handlers directly
        cancelBtn.onclick = function() {
            modal.style.display = "none";
        };

        confirmBtn.onclick = function() {
            modal.style.display = "none";
            if (typeof onConfirmCallback === "function") {
                onConfirmCallback(); // Execute redirect routine
            }
        };
    };

    // Call dynamic global loader on layout initial loop setup
    window.renderCatalogCards();

    // --- REVENUE GROWTH CHART ENGINE ---
    const ctx = document.getElementById('revenueChart');
    if (ctx) {
        const existingChart = Chart.getChart(ctx);
        if (existingChart) existingChart.destroy();

        revenueChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [{
                    label: 'Gross Revenue Growth',
                    data: [35000, 58000, 85000, 136492.84],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointBackgroundColor: '#6366f1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true, 
                aspectRatio: 2, 
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(55, 65, 81, 0.3)' },
                        ticks: { 
                            color: '#9ca3af',
                            callback: function(value) {
                                const activeTab = document.querySelector('.sidebar-menu li.active')?.id || 'nav-overview';
                                if (activeTab === 'nav-sales') {
                                    return Number(value).toLocaleString();
                                }
                                if (typeof window.formatCurrencyValue === 'function') {
                                    try {
                                        const formatted = window.formatCurrencyValue(value);
                                        if (formatted && !formatted.includes('NaN')) {
                                            return formatted.includes('.') ? formatted.split('.')[0] : formatted;
                                        }
                                    } catch (err) {
                                        console.log("Chart conversion fallback:", err);
                                    }
                                }
                                return '$' + Number(value).toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#9ca3af' }
                    }
                }
            }
        });

        revenueChartInstance.baseOverviewData = [35000, 58000, 85000, 136492.84];
        revenueChartInstance.baseSalesData = [200, 450, 780, 2840];
    }

    // --- FIXED TAB SWITCHER LOOP LISTENER (BYPASSES TERMINAL SIGN OUT) ---
    menuItems.forEach((btn, index) => {
        btn?.addEventListener("click", (e) => {
            // CRITICAL FIX: If they click settings or logout, do NOT call preventDefault 
            // or break the native propagation flow!
            if (btn && (btn.id === 'nav-settings' || btn.id === 'settingsLogoutBtn')) {
                switchView(btn.id, viewItems[index].id);
                return; 
            }

            e.preventDefault();
            switchView(btn.id, viewItems[index].id);

            if (revenueChartInstance) {
                const currency = window.getActiveCurrencyExchange ? window.getActiveCurrencyExchange() : { rate: 1.0 };
                
                if (btn.id === 'nav-sales') {
                    revenueChartInstance.data.datasets[0].data = [...revenueChartInstance.baseSalesData]; 
                    revenueChartInstance.data.datasets[0].label = 'Units Sold';
                } else if (btn.id === 'nav-overview') {
                    revenueChartInstance.data.datasets[0].data = revenueChartInstance.baseOverviewData.map(val => val * currency.rate);
                    revenueChartInstance.data.datasets[0].label = 'Gross Revenue Growth';
                }
                revenueChartInstance.update();
            }
        });
    });

    // --- ULTRA-STABLE TERMINAL SIGN OUT INTERCEPT MATRIX ---
    document.addEventListener("click", (e) => {
        const logoutBtn = e.target.closest("#settingsLogoutBtn");
        
        if (logoutBtn) {
            e.preventDefault();
            
            if (typeof window.showCustomConfirm === "function") {
                window.showCustomConfirm({
                    title: "Terminate Session",
                    message: "Are you sure you want to sign out of the active publisher terminal?",
                    isDanger: true
                }, () => {
                    window.location.href = "auth.html";
                });
            } else {
                if (confirm("Are you sure you want to sign out?")) {
                    window.location.href = "auth.html";
                }
            }
        }
    });

    // --- FIXED: CLEAN GLOBAL CURRENCY SWITCH WITH NO CONFIG CHANGES ---
    window.refreshAnalyticsChartCurrency = function() {
        if (!revenueChartInstance) return;

        const currency = window.getActiveCurrencyExchange ? window.getActiveCurrencyExchange() : { rate: 1.0 };
        const activeTab = document.querySelector('.sidebar-menu li.active')?.id || 'nav-overview';

        if (activeTab === 'nav-sales') {
            revenueChartInstance.data.datasets[0].data = [...revenueChartInstance.baseSalesData];
        } else {
            revenueChartInstance.data.datasets[0].data = revenueChartInstance.baseOverviewData.map(val => val * currency.rate);
        }

        revenueChartInstance.update();
    };
});