/**
 * GameVantage - Sales & Financial Analytics Sub-Engine
 * Handles live transactional telemetry modeling and reporting.
 */
document.addEventListener("DOMContentLoaded", () => {
    const salesViewContainer = document.getElementById("view-sales");
    if (!salesViewContainer) return;

    let financialChartInstance = null;

    // --- RE-RENDER ENTIRE SALES PAGE WITH CORRECT CURRENCY ---
    window.renderSalesAnalyticsPage = function() {
        // 1. Fetch live database catalog information
        const catalogData = JSON.parse(localStorage.getItem('systemGamesCatalog')) || [];
        
        // 2. Compute dynamic metrics based on catalog values (USD defaults)
        const grossRevenue = catalogData.reduce((sum, game) => sum + (Number(game.price) * 50), 0);
        const platformCut = grossRevenue * 0.12; 
        const netPayout = grossRevenue - platformCut;

        // 3. Inject the clean layout using dynamic formatCurrencyValue formatting
        salesViewContainer.innerHTML = `
            <div class="content-container">
                <div class="welcome-banner">
                    <div>
                        <h1>Sales & Financial Analytics</h1>
                        <p class="subtitle">Track storefront metrics, net payouts, and licensing pipelines.</p>
                    </div>
                    <div class="date-badge">
                        <i class="ri-calendar-line"></i> Live Ledger Matrix
                    </div>
                </div>

                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-header">
                            <span class="metric-title">Gross Revenue Ledger</span>
                            <div class="metric-icon-box bg-blue"><i class="ri-refund-2-line"></i></div>
                        </div>
                        <h2 class="metric-value">${window.formatCurrencyValue ? window.formatCurrencyValue(grossRevenue) : '$' + grossRevenue.toFixed(2)}</h2>
                        <span class="metric-trend up"><i class="ri-arrow-up-line"></i> +12.4% <span class="trend-label">vs last qtr</span></span>
                    </div>

                    <div class="metric-card">
                        <div class="metric-header">
                            <span class="metric-title">Platform Share (12%)</span>
                            <div class="metric-icon-box bg-danger"><i class="ri-percent-line"></i></div>
                        </div>
                        <h2 class="metric-value" style="color: var(--accent-red);">${window.formatCurrencyValue ? window.formatCurrencyValue(platformCut) : '$' + platformCut.toFixed(2)}</h2>
                        <span class="metric-trend down"><i class="ri-arrow-down-line"></i> Contractual <span class="trend-label">Fixed Split</span></span>
                    </div>

                    <div class="metric-card">
                        <div class="metric-header">
                            <span class="metric-title">Net Publisher Payout</span>
                            <div class="metric-icon-box bg-emerald"><i class="ri-bank-card-line"></i></div>
                        </div>
                        <h2 class="metric-value" style="color: var(--accent-green);">${window.formatCurrencyValue ? window.formatCurrencyValue(netPayout) : '$' + netPayout.toFixed(2)}</h2>
                        <span class="metric-trend up"><i class="ri-checkbox-circle-line"></i> Ready <span class="trend-label">For Clearance</span></span>
                    </div>
                </div>

                <div class="chart-section" style="margin-top: 24px;">
                    <div class="chart-container-header">
                        <h3>Financial Performance Matrix</h3>
                        <p class="subtitle">Comparative analysis of Gross Volumes vs Liquid Payout Pools.</p>
                    </div>
                    <div class="chart-canvas-wrapper" style="position: relative; height: 320px; width: 100%;">
                        <canvas id="financialMetricsChart"></canvas>
                    </div>
                </div>
            </div>
        `;

        // 4. Build the Interactive Chart
        const ctx = document.getElementById('financialMetricsChart');
        if (ctx) {
            if (financialChartInstance) financialChartInstance.destroy();

            const currency = window.getActiveCurrencyExchange ? window.getActiveCurrencyExchange() : { rate: 1.0 };

            financialChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        {
                            label: 'Gross Vol',
                            // Scale the numbers directly by the active rate right inside the data array!
                            data: [
                                grossRevenue * 0.45 * currency.rate, 
                                grossRevenue * 0.6 * currency.rate, 
                                grossRevenue * 0.55 * currency.rate, 
                                grossRevenue * 0.8 * currency.rate, 
                                grossRevenue * 0.75 * currency.rate, 
                                grossRevenue * currency.rate
                            ],
                            borderColor: '#6366f1',
                            backgroundColor: 'transparent',
                            fill: false,
                            tension: 0.4,
                            borderWidth: 3,
                            pointBackgroundColor: '#6366f1',
                            pointRadius: 4
                        },
                        {
                            label: 'Net Profit',
                            // Scale the numbers directly by the active rate right inside the data array!
                            data: [
                                netPayout * 0.4 * currency.rate, 
                                netPayout * 0.55 * currency.rate, 
                                netPayout * 0.5 * currency.rate, 
                                netPayout * 0.75 * currency.rate, 
                                netPayout * 0.7 * currency.rate, 
                                netPayout * currency.rate
                            ],
                            borderColor: '#10b981',
                            backgroundColor: 'transparent',
                            fill: false,
                            tension: 0.4,
                            borderWidth: 2,
                            pointBackgroundColor: '#10b981',
                            pointRadius: 3,
                            borderDash: [5, 5]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            labels: { color: '#9ca3af', font: { family: 'Inter' } }
                        }
                    },
                    scales: {
                        y: {
                            grid: { color: 'rgba(55, 65, 81, 0.25)' },
                            ticks: { 
                                color: '#9ca3af', 
                                font: { family: 'Inter' },
                                // Dynamically look at our platform currency wrapper safely!
                                callback: function(value) {
                                    if (window.formatCurrencyValue) {
                                        const formatted = window.formatCurrencyValue(value);
                                        return formatted.includes('.') ? formatted.split('.')[0] : formatted;
                                    }
                                    return '$' + value;
                                }
                            }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#9ca3af', font: { family: 'Inter' } }
                        }
                    }
                }
            });
        }
    };

    // Run the script instantly on load
    window.renderSalesAnalyticsPage();
});