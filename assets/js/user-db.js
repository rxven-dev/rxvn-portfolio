// --- GLOBAL CENTRAL DATABASE CONFIGURATION ---
// Using a fresh, open JSON storage endpoint that allows instant initialization
const CLOUD_DB_URL = "https://jsonstorage.net/api/items/9d76e4b8-620c-4876-9281-b58097b6a67f";

/**
 * Fetches the entire user registry list array from the central cloud database node.
 */
async function fetchCloudUsers() {
    try {
        const response = await fetch(CLOUD_DB_URL);
        if (!response.ok) return []; // If file is empty or new, return empty array
        const data = await response.json();
        // Extract array from our container format safely
        return data && Array.isArray(data.users) ? data.users : [];
    } catch (err) {
        console.error("Cloud Database Read Error:", err);
        return [];
    }
}

/**
 * Saves and overrides the user registry list array on the cloud storage container.
 */
async function saveCloudUsers(usersArray) {
    try {
        const response = await fetch(CLOUD_DB_URL, {
            method: 'PUT', // Overwrites the JSON data securely
            body: JSON.stringify({ users: usersArray }),
            headers: { 'Content-Type': 'application/json' }
        });
        return response.ok;
    } catch (err) {
        console.error("Cloud Database Write Error:", err);
        return false;
    }
}

/**
 * Directly appends a single new user account node to the cloud tracking logs.
 */
async function registerNewCloudUser(newUser) {
    let currentUsersList = await fetchCloudUsers();
    
    // Prevent duplicate emails
    if (!currentUsersList.some(user => user.email === newUser.email)) {
        currentUsersList.push(newUser);
    }
    
    return await saveCloudUsers(currentUsersList);
}

/**
 * Updates an existing user's profile information in the cloud database.
 * Merges new updates (like name or avatar) without erasing the existing password.
 */
async function updateCloudUserProfile(email, updatedFields) {
    try {
        let currentUsersList = await fetchCloudUsers();
        
        // Find the user index matching the email
        const userIndex = currentUsersList.findIndex(user => user.email.toLowerCase() === email.toLowerCase());
        
        if (userIndex !== -1) {
            // Merge the existing data with the new values
            currentUsersList[userIndex] = { ...currentUsersList[userIndex], ...updatedFields };
            
            // Save the updated list back to the cloud database
            return await saveCloudUsers(currentUsersList);
        }
        return false;
    } catch (err) {
        console.error("Failed to update profile in cloud:", err);
        return false;
    }
}