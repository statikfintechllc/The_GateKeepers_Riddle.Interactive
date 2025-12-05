// GitHub Authentication Module
// Handles GitHub Personal Access Token authentication for riddle requests

const GITHUB_TOKEN_KEY = 'github_token';
const GITHUB_REPO_OWNER = 'statikfintechllc';
const GITHUB_REPO_NAME = 'The_GateKeepers_Riddle.Interactive';

// Check if user is authenticated
export function isAuthenticated() {
    const token = localStorage.getItem(GITHUB_TOKEN_KEY);
    return token !== null && token.trim() !== '';
}

// Get the stored GitHub token
export function getGitHubToken() {
    return localStorage.getItem(GITHUB_TOKEN_KEY);
}

// Save GitHub token
export function saveGitHubToken(token) {
    if (!token || token.trim() === '') {
        throw new Error('Token cannot be empty');
    }
    localStorage.setItem(GITHUB_TOKEN_KEY, token.trim());
}

// Clear GitHub token (logout)
export function clearGitHubToken() {
    localStorage.removeItem(GITHUB_TOKEN_KEY);
}

// Validate token format (basic check)
export function isValidTokenFormat(token) {
    if (!token || typeof token !== 'string') {
        return false;
    }
    
    // GitHub tokens start with 'ghp_' for classic PATs or 'github_pat_' for fine-grained
    const trimmedToken = token.trim();
    return trimmedToken.startsWith('ghp_') || trimmedToken.startsWith('github_pat_');
}

// Verify token by making a test API call
export async function verifyToken(token) {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error verifying token:', error);
        return false;
    }
}

// Create a GitHub issue for riddle request
export async function createRiddleRequestIssue() {
    const token = getGitHubToken();
    if (!token) {
        throw new Error('Not authenticated');
    }
    
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: 'New Riddle Requested',
                labels: ['documentation', 'enhancement'],
                body: '@copilot Please run the riddle-finder-agent to find and add a new high-quality riddle to the game.'
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create issue');
        }
        
        const issue = await response.json();
        return issue;
    } catch (error) {
        console.error('Error creating riddle request issue:', error);
        throw error;
    }
}

// Open GitHub issue creation page (fallback if API fails)
export function openGitHubIssueTemplate() {
    const issueUrl = `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues/new?template=riddle_request.md&title=New+Riddle+Requested&labels=documentation,enhancement&assignees=Copilot`;
    window.open(issueUrl, '_blank');
}

// Navigate to login page
export function redirectToLogin() {
    // Determine if we're in root or system directory
    const currentPath = window.location.pathname;
    if (currentPath.includes('/system/')) {
        // We're in system directory, go up one level
        window.location.href = '../index.html';
    } else {
        // We're in root, just refresh to index.html
        window.location.href = 'index.html';
    }
}

// Navigate to app (riddle page)
export function redirectToApp() {
    // Determine if we're in root or system directory
    const currentPath = window.location.pathname;
    if (currentPath.includes('/system/')) {
        // We're already in system, just go to riddle.html
        window.location.href = 'riddle.html';
    } else {
        // We're in root, navigate to system/riddle.html
        window.location.href = 'system/riddle.html';
    }
}
