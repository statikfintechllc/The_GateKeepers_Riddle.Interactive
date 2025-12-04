// GitHub Authentication Manager
const GITHUB_TOKEN_KEY = 'github_token';
const GITHUB_REPO_OWNER = 'statikfintechllc';
const GITHUB_REPO_NAME = 'The_GateKeepers_Riddle.Interactive';

/**
 * Save GitHub token to localStorage
 * @param {string} token - GitHub Personal Access Token
 */
export function saveGitHubToken(token) {
    if (!token || token.trim() === '') {
        throw new Error('Token cannot be empty');
    }
    localStorage.setItem(GITHUB_TOKEN_KEY, token.trim());
}

/**
 * Get GitHub token from localStorage
 * @returns {string|null} - GitHub token or null if not found
 */
export function getGitHubToken() {
    return localStorage.getItem(GITHUB_TOKEN_KEY);
}

/**
 * Check if user is authenticated
 * @returns {boolean} - True if token exists
 */
export function isAuthenticated() {
    const token = getGitHubToken();
    return token !== null && token !== '';
}

/**
 * Clear GitHub token (logout)
 */
export function logout() {
    localStorage.removeItem(GITHUB_TOKEN_KEY);
}

/**
 * Verify token by making a test API call
 * @param {string} token - GitHub token to verify
 * @returns {Promise<boolean>} - True if token is valid
 */
export async function verifyToken(token) {
    try {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        return response.ok;
    } catch (error) {
        console.error('Token verification failed:', error);
        return false;
    }
}

/**
 * Create a GitHub issue for AI riddle request
 * @returns {Promise<Object>} - Issue creation response
 */
export async function createRiddleRequestIssue() {
    const token = getGitHubToken();
    
    if (!token) {
        throw new Error('No GitHub token found. Please login first.');
    }

    const issueData = {
        title: 'AI Curated Riddle Request',
        body: `@copilot please use the riddle-finder agent to find and add a new high-quality riddle to the repository.

**Instructions:**
1. Use the riddle-finder agent to search for a new challenging riddle
2. Ensure it follows the riddle template format
3. Check that it's not a duplicate of existing riddles
4. Create a PR with the new riddle file
5. The PR will auto-merge after all checks pass

This request was generated from the PWA interface.`,
        labels: ['documentation', 'enhancement', 'copilot']
    };

    try {
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(issueData)
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to create issue: ${errorData.message || response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating GitHub issue:', error);
        throw error;
    }
}

/**
 * Redirect to game if authenticated, otherwise to login
 */
export function checkAuthAndRedirect() {
    if (isAuthenticated()) {
        // Already authenticated, go to game
        if (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html')) {
            window.location.replace('system/game.html');
        }
    } else {
        // Not authenticated, go to login
        if (!window.location.pathname.endsWith('/index.html') && 
            !window.location.pathname.endsWith('/') &&
            window.location.pathname.includes('system/game.html')) {
            window.location.replace('../index.html');
        }
    }
}
