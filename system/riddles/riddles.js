// Riddle Registry and Loader
// This module manages all available riddles and provides loading functionality

// Import all riddles
import { riddle as gatekeeperRiddle } from './gatekeeper.riddle.js';
import { riddle as mirrorRiddle } from './mirror.riddle.js';

// Registry of all riddles
export const riddles = [
    gatekeeperRiddle,
    mirrorRiddle
];

// Get riddle by ID
export function getRiddleById(id) {
    return riddles.find(r => r.id === id);
}

// Get riddle by index
export function getRiddleByIndex(index) {
    if (index >= 0 && index < riddles.length) {
        return riddles[index];
    }
    return null;
}

// Get total number of riddles
export function getRiddleCount() {
    return riddles.length;
}

// Get index of riddle by ID
export function getRiddleIndex(id) {
    return riddles.findIndex(r => r.id === id);
}
