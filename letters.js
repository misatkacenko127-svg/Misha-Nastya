/**
 * LETTERS/MAILBOX SYSTEM
 */

document.addEventListener('DOMContentLoaded', () => {
  const lettersGrid = document.getElementById('lettersGrid');
  const letterModal = document.getElementById('letterModal');
  const letterContent = document.getElementById('letterContent');
  const letterModalClose = document.querySelector('.letter-modal-close');

  /**
   * Render letters as envelopes
   */
  function renderLetters() {
    lettersGrid.innerHTML = '';

    CONTENT.letters.forEach((letter, index) => {
      const envelope = document.createElement('div');
      envelope.className = 'letter-envelope';
      envelope.style.animationDelay = index * 0.1 + 's';

      const front = document.createElement('div');
      front.className = 'envelope-front';

      const icon = document.createElement('span');
      icon.className = 'envelope-icon';
      icon.textContent = letter.icon;

      const title = document.createElement('p');
      title.className = 'envelope-title';
      title.textContent = letter.title;

      const number = document.createElement('span');
      number.className = 'letter-number';
      number.textContent = `Лист №${index + 1}`;

      front.appendChild(number);
      front.appendChild(icon);
      front.appendChild(title);

      envelope.appendChild(front);

      envelope.addEventListener('click', () => {
        openLetter(letter);
      });

      lettersGrid.appendChild(envelope);
    });
  }

  /**
   * Open a letter
   */
  function openLetter(letter) {
    letterContent.innerHTML = '';

    // Create letter paper
    const paper = document.createElement('div');
    paper.className = 'letter-paper';

    // Header
    const header = document.createElement('div');
    header.className = 'letter-header';

    const headerIcon = document.createElement('span');
    headerIcon.textContent = letter.icon;

    const headerTitle = document.createElement('h2');
    headerTitle.textContent = letter.title;

    header.appendChild(headerIcon);
    header.appendChild(headerTitle);

    paper.appendChild(header);

    // Content
    const content = document.createElement('div');
    content.className = 'letter-text';

    letter.text.split('\n\n').forEach((paragraph, index) => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      p.style.animationDelay = index * 0.15 + 's';
      p.classList.add('letter-paragraph');
      content.appendChild(p);
    });

    paper.appendChild(content);

    // Footer
    const footer = document.createElement('div');
    footer.className = 'letter-footer';
    footer.textContent = '❤️';

    paper.appendChild(footer);

    letterContent.appendChild(paper);

    // Show modal with animation
    letterModal.classList.add('open');
    letterModal.style.display = 'flex';
  }

  /**
   * Close letter
   */
  function closeLetter() {
    letterModal.classList.remove('open');
    setTimeout(() => {
      letterModal.style.display = 'none';
    }, 300);
  }

  letterModalClose.addEventListener('click', closeLetter);

  letterModal.addEventListener('click', (e) => {
    if (e.target === letterModal) {
      closeLetter();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && letterModal.style.display === 'flex') {
      closeLetter();
    }
  });

  /**
   * Add hidden heart to letters page
   */
  function addHiddenHeartToLetters() {
    if (game.isHeartFound('heart-letters')) return;

    const heart = document.createElement('div');
    heart.className = 'hidden-heart-letters';
    heart.textContent = '♡';
    heart.style.position = 'fixed';
    heart.style.left = '85%';
    heart.style.top = '20%';
    heart.style.cursor = 'pointer';
    heart.style.fontSize = '1.5rem';
    heart.style.opacity = '0.08';
    heart.style.transition = 'all 0.3s ease';
    heart.style.zIndex = '100';

    heart.addEventListener('mouseenter', () => {
      heart.style.opacity = '0.4';
      heart.style.transform = 'scale(1.2)';
    });

    heart.addEventListener('mouseleave', () => {
      heart.style.opacity = '0.08';
      heart.style.transform = 'scale(1)';
    });

    heart.addEventListener('click', () => {
      const found = game.findHeart('heart-letters');
      if (found) {
        heart.style.animation = 'heartPop 0.6s ease-out';
        setTimeout(() => heart.remove(), 600);
        document.dispatchEvent(new CustomEvent('heart-found', {detail: {heartId: 'heart-letters'}}));
      }
    });

    document.body.appendChild(heart);
  }

  // Initial render
  renderLetters();
  addHiddenHeartToLetters();
});
