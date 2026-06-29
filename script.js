document.addEventListener("DOMContentLoaded", () => {
    
    // Grab all the "Buy Now" buttons on the store grid
    const buyButtons = document.querySelectorAll(".buy-btn");
    
    // Loop through every single button to listen for a user click
    buyButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            
            // Find the specific card elements related to the clicked button
            const gameCard = event.target.closest(".game-card");
            const gameTitle = gameCard.querySelector("h3").innerText;
            const gamePrice = gameCard.querySelector(".price").innerText;
            
            // Trigger a gaming checkout alert notification
            alert(`🎮 Added to Cart: ${gameTitle}\n💰 Price: ${gamePrice}\n\nThank you for checking out my website!`);
            
            // Change button text temporarily to show it worked
            button.innerText = "Added ✅";
            button.style.backgroundColor = "#4ade80"; // Turn it green
            
            setTimeout(() => {
                button.innerText = "Buy Now";
                button.style.backgroundColor = "#4f46e5"; // Change back to indigo
            }, 2000);
        });
    });
    
    console.log("Gamer Hub script successfully connected.");
});