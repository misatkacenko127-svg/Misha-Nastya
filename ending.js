/**
 * ENDING SCREEN - FINAL CINEMATIC SEQUENCE
 */

document.addEventListener('DOMContentLoaded', () => {
  const endingText = document.getElementById('endingText');
  const signatureNames = document.getElementById('signatureNames');
  const signatureDate = document.getElementById('signatureDate');
  const restartBtn = document.getElementById('restartBtn');

  /**
   * Show ending sequence with timed reveals
   */
  function showEnding() {
    // CONTENT.finalScreen is an object with line1/line2/line3, not a string.
    const final = CONTENT.finalScreen || {};
    const finalTexts = [
      final.line1 || 'Ми вже написали 372 дні.',
      final.line2 || 'Але це тільки перший розділ.',
      final.line3 || 'Далі — тільки разом.'
    ];

    // First text — "372 дні"
    setTimeout(() => {
      const p1 = document.createElement('p');
      p1.className = 'ending-days';
      p1.textContent = finalTexts[0];
      endingText.appendChild(p1);
      p1.classList.add('visible');
    }, 1000);

    // Second text - story intro
    setTimeout(() => {
      const p2 = document.createElement('p');
      p2.className = 'ending-intro';
      p2.textContent = finalTexts[1];
      endingText.appendChild(p2);
      p2.classList.add('visible');
    }, 3000);

    // Third text - ending line
    setTimeout(() => {
      const p3 = document.createElement('p');
      p3.className = 'ending-final';
      p3.textContent = finalTexts[2];
      endingText.appendChild(p3);
      p3.classList.add('visible');
    }, 5500);

    // Signature
    setTimeout(() => {
      signatureNames.textContent = final.ending ? final.ending.split('\n')[0] : 'Міша ❤️ Настя';
      signatureDate.textContent = final.ending ? final.ending.split('\n')[1] : '10.08.2025 — ∞';
      signatureNames.classList.add('visible');
      signatureDate.classList.add('visible');
    }, 7500);

    // Show restart button
    setTimeout(() => {
      restartBtn.classList.add('visible');
    }, 8500);
  }

  /**
   * Restart the story
   */
  restartBtn.addEventListener('click', () => {
    // Clear all progress
    localStorage.removeItem('misha_nastya_progress');
    localStorage.removeItem('misha_nastya_found_hearts');

    // Go back to home
    window.location.href = 'index.html';
  });

  /**
   * Generate starfield
   */
  function createStarfield() {
    const starsContainer = document.querySelector('.stars');
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 2 + 's';
      star.style.setProperty('--duration', Math.random() * 3 + 2 + 's');

      starsContainer.appendChild(star);
    }
  }

  // Initialize
  createStarfield();
  showEnding();
});
