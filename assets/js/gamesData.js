// Game Catalog Complete Storage Matrix
const initialGamesCatalog = [
    {
        title: "Elden Ring",
        genre: "Action RPG",
        price: 59.99,
        stock: "In Stock",
        developer: "FromSoftware",
        storage: "60 GB available space",
        image: "https://images.unsplash.com/photo-1655821888788-6107699e173b?w=600&auto=format&fit=crop&q=60"
    },
    {
        title: "Cyberpunk 2077",
        genre: "Sci-Fi RPG",
        price: 49.99,
        stock: "In Stock",
        developer: "CD PROJEKT RED",
        storage: "70 GB available space (SSD Recommended)",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=60"
    },
    {
        title: "Minecraft",
        genre: "Sandbox",
        price: 26.95,
        stock: "Low Stock",
        developer: "Mojang Studios",
        storage: "4 GB available space",
        image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&auto=format&fit=crop&q=60"
    },
    {
        title: "Grand Theft Auto V",
        genre: "Action / Open World",
        price: 29.99,
        stock: "In Stock",
        developer: "Rockstar North",
        storage: "110 GB available space",
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=60"
    },
    {
        title: "First Light 007",
        genre: "First-Person Shooter",
        price: 19.99,
        stock: "In Stock",
        developer: "MI6 Global Software",
        storage: "25 GB available space",
        image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&auto=format&fit=crop&q=60"
    },
    {
        title: "Meccha Chameleon",
        genre: "Arcade / Indie",
        price: 14.99,
        stock: "Low Stock",
        developer: "RetroIndie Labs",
        storage: "800 MB available space",
        image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=60"
    }
];

// Force override on runtime if structure changed to prevent local memory parsing bugs
localStorage.setItem('systemGamesCatalog', JSON.stringify(initialGamesCatalog));