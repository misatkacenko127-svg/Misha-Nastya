/**
 * CHAPTERS - BEGINNING/START
 */

document.addEventListener('DOMContentLoaded', () => {
  const heroTitle = document.getElementById('heroTitle');
  const heroDate = document.getElementById('heroDate');
  const heroStory = document.getElementById('heroStory');
  const chapterMedia = document.getElementById('chapterMedia');
  const continueBtn = document.getElementById('continueBtn');

  /**
   * Render hero section (title, date, beginning story)
   */
  function renderHeroSection() {
    heroTitle.textContent = CONTENT.hero.title;
    heroDate.textContent = formatDateUkrainian(new Date('2025-08-10'));

    // Render story paragraphs with staggered animation
    const paragraphs = CONTENT.hero.story.split('\n\n');

    paragraphs.forEach((para, index) => {
      const p = document.createElement('p');
      p.className = 'story-paragraph';
      p.textContent = para;
      p.style.animationDelay = index * 0.2 + 's';

      heroStory.appendChild(p);
    });
  }

  /**
   * Render first month media gallery
   */
  function renderChapterMedia() {
    const firstMonth = CONTENT.months[0];

    if (!firstMonth) return;

    const header = document.createElement('h3');
    header.textContent = `${firstMonth.name} ${firstMonth.title}`;
    header.className = 'media-header';
    chapterMedia.appendChild(header);

    const description = document.createElement('p');
    description.className = 'media-description';
    description.textContent = firstMonth.description;
    chapterMedia.appendChild(description);

    // Use only the strongest still photos from August 2025; videos stay out of this quest.
    const gallery = document.createElement('div');
    gallery.className = 'chapter-gallery';

    const imageFiles = [
      '2.jpg',
      '4.jpg',
      '5.jpg',
      '6.jpg',
      '7.jpg',
      '8.jpg',
      '9.jpg',
      '10.jpg',
      '11.jpg',
      '12.jpg',
      '13.jpg'
    ];

    imageFiles.forEach((file, index) => {
      const img = document.createElement('img');
      img.className = 'gallery-img';
      img.src = `momentsaugust-2025/${file}`;
      img.alt = `Найкращі спогади, серпень 2025, фото ${index + 1}`;
      img.loading = 'lazy';

      img.addEventListener('click', () => {
        openLightbox(img.src);
      });

      gallery.appendChild(img);
    });

    chapterMedia.appendChild(gallery);
  }

  /**
   * Open lightbox for image viewing
   */
  function openLightbox(src) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';

    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Full size image';

    const close = document.createElement('button');
    close.className = 'lightbox-close';
    close.textContent = '✕';
    close.addEventListener('click', () => lightbox.remove());

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.remove();
    });

    lightbox.appendChild(img);
    lightbox.appendChild(close);

    document.body.appendChild(lightbox);

    // Fade in
    setTimeout(() => lightbox.classList.add('active'), 10);
  }

  /**
   * Continue button handler
   */
  continueBtn.addEventListener('click', () => {
    window.location.href = 'map.html';
  });

  /**
   * Format date in Ukrainian
   */
  function formatDateUkrainian(date) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return date.toLocaleDateString('uk-UA', options);
  }

  /**
   * Add hidden heart to chapter
   */
  function addHiddenHeartToChapter() {
    if (game.isHeartFound('heart-chapter')) return;

    const heart = document.createElement('div');
    heart.className = 'hidden-heart-chapter';
    heart.textContent = '♡';
    heart.style.position = 'fixed';
    heart.style.left = '15%';
    heart.style.top = '30%';
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
      const found = game.findHeart('heart-chapter');
      if (found) {
        heart.style.animation = 'heartPop 0.6s ease-out';
        setTimeout(() => heart.remove(), 600);
        document.dispatchEvent(new CustomEvent('heart-found', {detail: {heartId: 'heart-chapter'}}));
      }
    });

    document.body.appendChild(heart);
  }

  // Initialize
  renderHeroSection();
  renderChapterMedia();
  addHiddenHeartToChapter();
});
