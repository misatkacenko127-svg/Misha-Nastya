/**
 * INTERACTIVE STORY GAME - CORE APPLICATION LOGIC
 * Manages progress, unlocks, hidden hearts, and game state
 */

class StoryGame {
  constructor() {
    this.storagePrefix = 'misha_nastya_';
    this.progress = this.loadProgress();
    this.foundHearts = this.loadFoundHearts();
    this.isInitialized = false;
  }

  /**
   * Load progress from localStorage
   */
  loadProgress() {
    const stored = localStorage.getItem(this.storagePrefix + 'progress');
    return stored
      ? JSON.parse(stored)
      : {
          completedQuests: [],
          unlockedSections: ['beginning', 'memories', 'quests'],
          currentSection: 'home',
          lastVisit: new Date().toISOString()
        };
  }

  /**
   * Save progress to localStorage
   */
  saveProgress() {
    localStorage.setItem(
      this.storagePrefix + 'progress',
      JSON.stringify(this.progress)
    );
  }

  /**
   * Load found hearts from localStorage
   */
  loadFoundHearts() {
    const stored = localStorage.getItem(this.storagePrefix + 'found_hearts');
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Save found hearts to localStorage
   */
  saveFoundHearts() {
    localStorage.setItem(
      this.storagePrefix + 'found_hearts',
      JSON.stringify(this.foundHearts)
    );
  }

  /**
   * Complete a quest
   */
  completeQuest(questId) {
    if (!this.progress.completedQuests.includes(questId)) {
      this.progress.completedQuests.push(questId);
      this.checkAndUnlock();
      this.saveProgress();
      return true;
    }
    return false;
  }

  /**
   * Check if quest is completed
   */
  isQuestCompleted(questId) {
    return this.progress.completedQuests.includes(questId);
  }

  /**
   * Find a hidden heart
   */
  findHeart(heartId) {
    if (!this.foundHearts.includes(heartId)) {
      this.foundHearts.push(heartId);
      this.saveFoundHearts();

      if (this.foundHearts.length === 5) {
        this.unlockSection('secret');
      }

      return true;
    }
    return false;
  }

  /**
   * Check how many hearts have been found
   */
  getFoundHeartsCount() {
    return this.foundHearts.length;
  }

  /**
   * Check if heart is found
   */
  isHeartFound(heartId) {
    return this.foundHearts.includes(heartId);
  }

  /**
   * Unlock a section
   */
  unlockSection(sectionId) {
    if (!this.progress.unlockedSections.includes(sectionId)) {
      this.progress.unlockedSections.push(sectionId);
      this.saveProgress();
      this.triggerUnlockAnimation(sectionId);
      return true;
    }
    return false;
  }

  /**
   * Check if section is unlocked
   */
  isSectionUnlocked(sectionId) {
    // Check if section requires quests
    const node = CONTENT.mapNodes.find(n => n.id === sectionId);
    if (!node) return true;

    if (!node.requiredQuests || node.requiredQuests.length === 0) {
      return this.progress.unlockedSections.includes(sectionId);
    }

    // Check if all required quests are completed
    return node.requiredQuests.every(questId =>
      this.progress.completedQuests.includes(questId)
    );
  }

  /**
   * Automatically unlock sections based on quest progress
   */
  checkAndUnlock() {
    const questCounts = this.progress.completedQuests.length;

    // Unlock music after first quest
    if (questCounts >= 1) {
      this.unlockSection('music');
    }

    // Unlock letters after 2 quests
    if (questCounts >= 2) {
      this.unlockSection('letters');
    }

    // Unlock future after all 5 quests
    if (questCounts >= 5) {
      this.unlockSection('future');
    }
  }

  /**
   * Trigger visual unlock animation
   */
  triggerUnlockAnimation(sectionId) {
    const event = new CustomEvent('section-unlocked', {
      detail: { sectionId }
    });
    document.dispatchEvent(event);
  }

  /**
   * Initialize the game
   */
  initialize() {
    if (this.isInitialized) return;

    // Check all unlock conditions
    this.checkAndUnlock();

    // Setup hidden heart detection
    this.setupHeartDetection();

    // Setup quest completion listeners
    this.setupQuestListeners();

    // Show a toast whenever any page unlocks a new section
    document.addEventListener('section-unlocked', (e) => {
      showUnlockToast(e.detail.sectionId);
    });

    this.isInitialized = true;
  }

  /**
   * Setup hidden heart detection
   */
  setupHeartDetection() {
    // This will be called from individual pages
    // to set up click handlers for hidden hearts
  }

  /**
   * Setup quest completion listeners
   */
  setupQuestListeners() {
    document.addEventListener('quest-completed', (e) => {
      const { questId } = e.detail;
      this.completeQuest(questId);
    });
  }

  /**
   * Get all available sections for current progress
   */
  getAvailableSections() {
    return CONTENT.mapNodes.filter(node =>
      this.isSectionUnlocked(node.id)
    );
  }

  /**
   * Get locked sections (for display purposes)
   */
  getLockedSections() {
    return CONTENT.mapNodes.filter(node =>
      !this.isSectionUnlocked(node.id)
    );
  }

  /**
   * Reset all progress (debug/reset button)
   */
  resetProgress() {
    localStorage.removeItem(this.storagePrefix + 'progress');
    localStorage.removeItem(this.storagePrefix + 'found_hearts');
    this.progress = this.loadProgress();
    this.foundHearts = this.loadFoundHearts();
  }

  /**
   * Get game state summary
   */
  getGameSummary() {
    return {
      completedQuests: this.progress.completedQuests.length,
      totalQuests: 5,
      unlockedSections: this.progress.unlockedSections.length,
      totalSections: CONTENT.mapNodes.length,
      foundHearts: this.foundHearts.length,
      totalHearts: 5,
      progress: Math.round(
        (this.progress.completedQuests.length / 5 +
          this.foundHearts.length / 5) *
          50
      )
    };
  }
}

// Initialize global game instance
const game = new StoryGame();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  game.initialize();
});

// Dispatch quest completion event
function completeQuest(questId) {
  const event = new CustomEvent('quest-completed', {
    detail: { questId }
  });
  document.dispatchEvent(event);
}

// Find hidden heart from any page
function findHiddenHeart(heartId) {
  const found = game.findHeart(heartId);
  if (found) {
    // Show visual feedback
    showHeartFoundAnimation(heartId);
  }
  return found;
}

// Show animation when heart is found
function showHeartFoundAnimation(heartId) {
  const event = new CustomEvent('heart-found', {
    detail: { heartId, found: game.getFoundHeartsCount() }
  });
  document.dispatchEvent(event);
}

// Unlock section (can be called from any page)
function unlockGameSection(sectionId) {
  game.unlockSection(sectionId);
}

// Utility: Calculate days together
function getDaysTogether() {
  const startDate = new Date(CONTENT.startDate + 'T00:00:00');
  const today = new Date();
  const diff = today.getTime() - startDate.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

// Utility: Live days/hours/minutes/seconds since the relationship started
function getTimeTogether() {
  const startDate = new Date(CONTENT.startDate + 'T00:00:00');
  const diffMs = Math.max(0, Date.now() - startDate.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  };
}

// Utility: Bind a live counter to DOM elements and keep it updating every second
function startLiveCounter({ days, hours, minutes, seconds }) {
  function tick() {
    const t = getTimeTogether();
    if (days) days.textContent = t.days.toLocaleString('uk-UA');
    if (hours) hours.textContent = String(t.hours).padStart(2, '0');
    if (minutes) minutes.textContent = String(t.minutes).padStart(2, '0');
    if (seconds) seconds.textContent = String(t.seconds).padStart(2, '0');
  }
  tick();
  return setInterval(tick, 1000);
}

// Reusable "Новий розділ відкрито ❤️" toast, shown on any page
function showUnlockToast(sectionId) {
  const node = (typeof CONTENT !== 'undefined' && CONTENT.mapNodes)
    ? CONTENT.mapNodes.find((n) => n.id === sectionId)
    : null;
  const label = node ? node.title : 'Новий розділ';

  const toast = document.createElement('div');
  toast.className = 'unlock-toast';
  toast.innerHTML = `<span class="unlock-toast-icon">❤️</span><span>Новий розділ відкрито: <strong>${label}</strong></span>`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// Utility: Format date in Ukrainian
function formatDateUkrainian(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('uk-UA', options);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StoryGame, game, completeQuest, findHiddenHeart };
}
