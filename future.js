/**
 * FUTURE SECTION - TIMELINE OF YEARS
 */

document.addEventListener('DOMContentLoaded', () => {
  const timelineFuture = document.getElementById('timelineFuture');
  const futureMessage = document.getElementById('futureMessage');

  /**
   * Render future years timeline
   */
  function renderFutureTimeline() {
    timelineFuture.innerHTML = '';

    CONTENT.futureYears.forEach((year, index) => {
      const block = document.createElement('div');
      block.className = 'future-year-block';
      block.style.animationDelay = index * 0.15 + 's';

      const yearLabel = document.createElement('div');
      yearLabel.className = 'year-label';
      yearLabel.textContent = year.year;

      const yearText = document.createElement('p');
      yearText.className = 'year-text';
      yearText.textContent = year.text;

      block.appendChild(yearLabel);
      block.appendChild(yearText);

      timelineFuture.appendChild(block);
    });

    // Animate message after timeline
    setTimeout(() => {
      futureMessage.classList.add('visible');
    }, CONTENT.futureYears.length * 150 + 300);
  }

  // Initial render
  renderFutureTimeline();
  addHiddenHeartToFuture();

  // Add keyboard event for final screen
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && futureMessage.classList.contains('visible')) {
      goToFinalScreen();
    }
  });

  // Also add a button to go to final screen
  const finalScreenBtn = document.createElement('button');
  finalScreenBtn.className = 'final-screen-btn';
  finalScreenBtn.textContent = 'Завершення...';

  futureMessage.appendChild(finalScreenBtn);

  finalScreenBtn.addEventListener('click', goToFinalScreen);
});

/**
 * Navigate to final screen
 */
function goToFinalScreen() {
  window.location.href = 'ending.html';
}

/**
 * Add hidden heart to future page
 */
function addHiddenHeartToFuture() {
  if (game.isHeartFound('heart-future')) return;

  const heart = document.createElement('div');
  heart.className = 'hidden-heart-future';
  heart.textContent = '♡';
  heart.style.position = 'fixed';
  heart.style.left = '50%';
  heart.style.top = '25%';
  heart.style.cursor = 'pointer';
  heart.style.fontSize = '1.5rem';
  heart.style.opacity = '0.08';
  heart.style.transition = 'all 0.3s ease';
  heart.style.transform = 'translateX(-50%)';
  heart.style.zIndex = '100';

  heart.addEventListener('mouseenter', () => {
    heart.style.opacity = '0.4';
    heart.style.transform = 'translateX(-50%) scale(1.2)';
  });

  heart.addEventListener('mouseleave', () => {
    heart.style.opacity = '0.08';
    heart.style.transform = 'translateX(-50%) scale(1)';
  });

  heart.addEventListener('click', () => {
    const found = game.findHeart('heart-future');
    if (found) {
      heart.style.animation = 'heartPop 0.6s ease-out';
      setTimeout(() => heart.remove(), 600);
      document.dispatchEvent(new CustomEvent('heart-found', {detail: {heartId: 'heart-future'}}));
    }
  });

  document.body.appendChild(heart);
}
