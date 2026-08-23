/**
 * SECRET ROOM - HIDDEN HEARTS
 */

document.addEventListener('DOMContentLoaded', () => {
  const secretIntro = document.getElementById('secretIntro');
  const secretContent = document.getElementById('secretContent');
  const foundCount = document.getElementById('foundCount');
  const heartsStatus = document.getElementById('heartsStatus');

  /**
   * Update heart counter
   */
  function updateHeartCounter() {
    const count = game.getFoundHeartsCount();
    foundCount.textContent = count;

    if (count === 5) {
      secretIntro.style.display = 'none';
      secretContent.style.display = 'block';
    }
  }

  /**
   * Setup hidden hearts throughout the page
   */
  function setupHiddenHearts() {
    const detector = document.getElementById('hiddenHeartsDetector');

    // Create invisible clickable hearts at strategic locations
    const hearts = [
      { id: 'heart-secret-1', x: 15, y: 20 },
      { id: 'heart-secret-2', x: 75, y: 35 },
      { id: 'heart-secret-3', x: 50, y: 60 },
      { id: 'heart-secret-4', x: 25, y: 80 },
      { id: 'heart-secret-5', x: 85, y: 75 }
    ];

    hearts.forEach((heart, index) => {
      if (!game.isHeartFound(heart.id)) {
        const el = document.createElement('div');
        el.className = 'secret-hidden-heart';
        el.style.left = heart.x + '%';
        el.style.top = heart.y + '%';
        el.style.animationDelay = index * 0.2 + 's';

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          findHeart(heart.id, el);
        });

        // Show faint hint on hover
        el.addEventListener('mouseenter', () => {
          el.classList.add('hint');
        });

        el.addEventListener('mouseleave', () => {
          el.classList.remove('hint');
        });

        detector.appendChild(el);
      }
    });
  }

  /**
   * Find a heart
   */
  function findHeart(heartId, element) {
    const found = game.findHeart(heartId);

    if (found) {
      element.classList.add('found');
      showHeartFoundAnimation(element);

      setTimeout(() => {
        element.style.pointerEvents = 'none';
        element.style.opacity = '0.2';
      }, 300);

      updateHeartCounter();

      // Confetti-like effect
      createHeartConfetti(element);
    }
  }

  /**
   * Show animation when heart is found
   */
  function showHeartFoundAnimation(element) {
    const rect = element.getBoundingClientRect();
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = '♡';
    heart.style.left = rect.left + 'px';
    heart.style.top = rect.top + 'px';

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1000);
  }

  /**
   * Create heart confetti particles
   */
  function createHeartConfetti(element) {
    const rect = element.getBoundingClientRect();
    const count = 6;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'heart-particle';
      particle.textContent = '♡';
      particle.style.left = rect.left + rect.width / 2 + 'px';
      particle.style.top = rect.top + rect.height / 2 + 'px';

      const angle = (i / count) * Math.PI * 2;
      const distance = 60;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');

      document.body.appendChild(particle);

      setTimeout(() => particle.remove(), 1000);
    }
  }

  /**
   * Listen for heart found events from other pages
   */
  document.addEventListener('heart-found', (e) => {
    updateHeartCounter();
  });

  // Initial setup
  updateHeartCounter();
  setupHiddenHearts();

  // Add keyboard hint
  console.log(
    '%cШукай прховане серце щоб розблокувати цю кімнату! 💕',
    'color: #d68a8a; font-size: 14px; font-weight: bold;'
  );
});
