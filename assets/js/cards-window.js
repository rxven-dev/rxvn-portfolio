// cards-window.js - Dynamic Game Slider Engine with Real-Time Comments Board
window.openGameDetails = function(gameTitle) {
    const detailWindow = document.getElementById("gameDetailWindow");
    const renderArea = document.getElementById("gameDetailRenderArea");
    
    if (!detailWindow || !renderArea) {
        console.error("Core DOM containers missing from index.html");
        return;
    }

    // 1. Fetch catalog data securely
    const activeCatalog = JSON.parse(localStorage.getItem('systemGamesCatalog')) || [];
    const game = activeCatalog.find(g => g.title === gameTitle);
    
    const safeGame = game || {
        title: gameTitle,
        genre: "Action / Adventure",
        price: 59.99,
        developer: "Independent Studio",
        storage: "50 GB space required"
    };

    const releaseDate = safeGame.released || "October 2024 (Global Deployment)";
    const description = safeGame.description || `Experience an epic masterpiece adventure developed by ${safeGame.developer || 'Independent Studios'}. Immerse yourself in breathtaking environments, tactical gameplay loops, and high-performance visual fidelity layouts.`;
    const initialReviews = safeGame.rating || "9.8 / 10 Masterpiece Edition";
    const bannerImg = safeGame.image || "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600";
    const gamePrice = Number(safeGame.price) ? Number(safeGame.price).toFixed(2) : "59.99";

    // 2. Render out our structural modern layout frame grid
    renderArea.innerHTML = `
        <div class="detail-grid-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; padding: 20px; color: var(--text-primary); font-family: system-ui, sans-serif;">
            
            <div class="detail-media-deck" style="display: flex; flex-direction: column; gap: 16px;">
                <img src="${bannerImg}" alt="${safeGame.title}" class="detail-main-hero-img" style="width: 100%; height: 320px; object-fit: cover; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
                <div class="detail-gallery-row" style="display: flex; gap: 12px;">
                    <img src="${bannerImg}" class="gallery-thumb active" style="width: calc(33.33% - 8px); height: 70px; object-fit: cover; border-radius: 8px; border: 2px solid #6366f1; cursor: pointer;">
                    <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300" class="gallery-thumb" style="width: calc(33.33% - 8px); height: 70px; object-fit: cover; border-radius: 8px; opacity: 0.6;">
                    <img src="https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=300" class="gallery-thumb" style="width: calc(33.33% - 8px); height: 70px; object-fit: cover; border-radius: 8px; opacity: 0.6;">
                </div>
            </div>

            <div class="detail-info-deck" style="display: flex; flex-direction: column; justify-content: space-between; gap: 20px;">
                
                <div class="info-header-block">
                    <span class="detail-genre-pill" style="display: inline-block; background: rgba(99, 102, 241, 0.15); color: #818cf8; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; padding: 6px 12px; border-radius: 20px; margin-bottom: 12px; letter-spacing: 0.5px;">${safeGame.genre}</span>
                    <h2 style="font-size: 2rem; font-weight: 800; margin: 0 0 4px 0; color: #fff; letter-spacing: -0.5px;">${safeGame.title}</h2>
                    <p class="studio-subtext" style="margin: 0; font-size: 0.9rem; color: var(--text-secondary);">Developed by <span style="color: #fff; font-weight: 500;">${safeGame.developer || 'Independent'}</span></p>
                </div>

                <div class="meta-metrics-strip" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 8px 0;">
                    <div class="strip-item" style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 12px 16px; border-radius: 12px;">
                        <h5 style="margin: 0 0 4px 0; font-size: 0.7rem; color: var(--text-secondary); letter-spacing: 0.5px; text-transform: uppercase;">Price Value</h5>
                        <p class="price-highlight" style="margin: 0; font-size: 1.25rem; font-weight: 700; color: #10b981;">${window.formatCurrencyValue(safeGame.price)}</p>
                    </div>
                    <div class="strip-item" style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 12px 16px; border-radius: 12px;">
                        <h5 style="margin: 0 0 4px 0; font-size: 0.7rem; color: var(--text-secondary); letter-spacing: 0.5px; text-transform: uppercase;">Disk Storage</h5>
                        <p style="margin: 0; font-size: 1.05rem; font-weight: 600; color: #fff;">${safeGame.storage || '65 GB safe'}</p>
                    </div>
                    <div class="strip-item" style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 12px 16px; border-radius: 12px;">
                        <h5 style="margin: 0 0 4px 0; font-size: 0.7rem; color: var(--text-secondary); letter-spacing: 0.5px; text-transform: uppercase;">Global Release</h5>
                        <p style="margin: 0; font-size: 1.05rem; font-weight: 600; color: #fff;">${releaseDate}</p>
                    </div>
                    <div class="strip-item" style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 12px 16px; border-radius: 12px;">
                        <h5 style="margin: 0 0 4px 0; font-size: 0.7rem; color: var(--text-secondary); letter-spacing: 0.5px; text-transform: uppercase;">Rating Review</h5>
                        <p style="margin: 0; font-size: 1.05rem; font-weight: 600; color: #f59e0b;"><i class="ri-star-fill"></i> ${initialReviews.split(' ')[0]}</p>
                    </div>
                </div>

                <div class="detail-action-button-group" style="display: flex; gap: 14px; margin-top: 8px; width: 100%;">
                    <button class="btn btn-primary" 
                            onclick="window.addGameToCart('${safeGame.title.replace(/'/g, "\\'")}', '${safeGame.price}', '${bannerImg}');"
                            style="flex: 1; padding: 14px 20px; font-weight: 600; font-size: 0.95rem; border-radius: 12px; display: flex; justify-content: center; align-items: center; gap: 8px; cursor: pointer; background: #6366f1; color: white; border: none; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.2);">
                        <i class="ri-shopping-cart-2-line"></i> Add to Cart
                    </button>
                    <button class="btn" 
                            onclick="window.addGameToCart('${safeGame.title.replace(/'/g, "\\'")}', '${safeGame.price}', '${bannerImg}'); document.getElementById('closeDetailWindowBtn').click(); document.getElementById('nav-cart').click();"
                            style="flex: 1; padding: 14px 20px; font-weight: 600; font-size: 0.95rem; border-radius: 12px; display: flex; justify-content: center; align-items: center; gap: 8px; cursor: pointer; background: #10b981; color: white; border: none; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.2);">
                        <i class="ri-flashlight-line"></i> Buy Now Instant
                    </button>
                </div>

                <div class="detail-description-box" style="background: rgba(255,255,255,0.02); border-radius: 12px; padding: 16px; border: 1px solid var(--border-color);">
                    <h3 style="margin: 0 0 8px 0; font-size: 0.95rem; font-weight: 700; color: #fff;">Overview Description</h3>
                    <p style="margin: 0; font-size: 0.88rem; line-height: 1.5; color: var(--text-secondary); text-align: justify;">${description}</p>
                </div>

                <div class="detail-comments-section" style="display: flex; flex-direction: column; gap: 10px; border-top: 1px solid var(--border-color); padding-top: 16px;">
                    <h3 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: #fff;">Community Hub Conversations</h3>
                    
                    <div id="liveCommentsStream" style="display: flex; flex-direction: column; gap: 8px; max-height: 130px; overflow-y: auto; padding-right: 4px;">
                        </div>

                    <div style="display: flex; gap: 8px; margin-top: 4px;">
                        <input type="text" id="newCommentInput" placeholder="Share your feedback with the platform hub..." 
                               style="flex: 1; background: var(--bg-input); border: 1px solid var(--border-color); color: var(--text-primary); padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; outline: none;">
                        <button onclick="window.submitPlatformComment('${safeGame.title.replace(/'/g, "\\'")}')" 
                                style="background: #6366f1; color: white; border: none; padding: 10px 20px; font-weight: 600; border-radius: 8px; cursor: pointer; font-size: 0.85rem; transition: 0.2s;"
                                onmouseover="this.style.background='#4f46e5'" onmouseout="this.style.background='#6366f1'">
                            Post
                        </button>
                    </div>
                </div>

            </div>
        </div>
    `;

    // 3. Kick off live execution loop to display existing saved comments
    window.refreshCommentsDisplay(safeGame.title);

    // 4. Slide open window panel layout cleanly
    detailWindow.classList.add("active");
};

// --- GLOBAL LIVE HUB COMMENTS COMPILING CONTROLLER ---
window.refreshCommentsDisplay = function(gameTitle) {
    const contextContainer = document.getElementById("liveCommentsStream");
    if (!contextContainer) return;

    // Grab database map object storage or setup clean base default structure
    const globalCommentsMap = JSON.parse(localStorage.getItem("systemHubCommentsRegistry")) || {};
    
    // FIXED: Default array is now completely empty instead of hosting placeholder accounts
    if (!globalCommentsMap[gameTitle]) {
        globalCommentsMap[gameTitle] = []; 
        localStorage.setItem("systemHubCommentsRegistry", JSON.stringify(globalCommentsMap));
    }

    const currentComments = globalCommentsMap[gameTitle];
    contextContainer.innerHTML = "";

    // If there are no comments yet, show a clean, friendly reminder text line
    if (currentComments.length === 0) {
        contextContainer.innerHTML = `
            <div style="font-size: 0.85rem; color: var(--text-secondary); font-style: italic; padding: 8px 4px;">
                No conversations yet. Be the first to start the discussion stream!
            </div>
        `;
        return;
    }

    // Find this loop inside window.refreshCommentsDisplay and apply this style update:
    currentComments.forEach(comment => {
        const itemNode = document.createElement("div");
        // Updated style string to cleanly snap to 100% width of the community grid column container
        itemNode.style = "font-size: 0.82rem; background: var(--bg-input); padding: 10px 14px; border-radius: 8px; border-left: 3px solid #6366f1; display: flex; flex-direction: column; gap: 3px; width: 100%; box-sizing: border-box;";
        itemNode.innerHTML = `
            <span style="color: #818cf8; font-weight: 700;">@${comment.user}:</span>
            <span style="color: var(--text-secondary); line-height: 1.4;">${comment.text}</span>
        `;
        contextContainer.appendChild(itemNode);
    });

    // Auto scroll view stream down to show the latest inputs posted
    contextContainer.scrollTop = contextContainer.scrollHeight;
};

window.submitPlatformComment = function(gameTitle) {
    const inputField = document.getElementById("newCommentInput");
    if (!inputField) return;

    const textContent = inputField.value.trim();
    if (!textContent) {
        alert("Please type a comment message string before publishing!");
        return;
    }

    const globalCommentsMap = JSON.parse(localStorage.getItem("systemHubCommentsRegistry")) || {};
    if (!globalCommentsMap[gameTitle]) globalCommentsMap[gameTitle] = [];

    // Push new structured chat node payload object (Simulating active user profile placeholder name)
    globalCommentsMap[gameTitle].push({
        user: "Adrian_Dev", 
        text: textContent
    });

    // Sync state map array back up into browser system cache storage
    localStorage.setItem("systemHubCommentsRegistry", JSON.stringify(globalCommentsMap));
    
    // Refresh components and wipe text fields clean
    window.refreshCommentsDisplay(gameTitle);
    inputField.value = "";
};

// Core closing backdrop action initialization mapping listener
document.addEventListener("DOMContentLoaded", () => {
    const detailWindow = document.getElementById("gameDetailWindow");
    const closeBtn = document.getElementById("closeDetailWindowBtn");
    if (closeBtn && detailWindow) {
        closeBtn.addEventListener("click", () => {
            detailWindow.classList.remove("active");
        });
    }
});