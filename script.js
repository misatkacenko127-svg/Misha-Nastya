document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  const startDate = new Date('2025-08-10T00:00:00');
  const daysCounter = document.getElementById('daysCounter');
  const currentYear = document.getElementById('currentYear');

  if (daysCounter) {
    const today = new Date();
    const diff = today.getTime() - startDate.getTime();
    const daysTogether = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    daysCounter.textContent = daysTogether.toLocaleString('uk-UA');
  }

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Live "days/hours/minutes/seconds together" counter (uses app.js helper)
  const liveDays = document.getElementById('liveDays');
  const liveHours = document.getElementById('liveHours');
  const liveMinutes = document.getElementById('liveMinutes');
  const liveSeconds = document.getElementById('liveSeconds');
  if (liveDays && typeof startLiveCounter === 'function') {
    startLiveCounter({ days: liveDays, hours: liveHours, minutes: liveMinutes, seconds: liveSeconds });
  }

  // Reveal-on-scroll with a robust fallback so content is never hidden on mobile.
  // threshold: 0 + rootMargin ensures tall sections (like the months timeline)
  // are detected as soon as any part enters the viewport, even on small screens.
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

  // Fallback: if IntersectionObserver is unavailable or never fires (e.g. on some
  // mobile browsers), make sure every reveal element becomes visible so content
  // is never lost — even if JavaScript partially fails.
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
  } else {
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((element) => {
        element.classList.add('visible');
      });
    }, 2500);
  }

  const reasonCards = document.querySelectorAll('.reason-card');
  reasonCards.forEach((card) => {
    card.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');
      reasonCards.forEach((item) => item.classList.remove('open'));
      if (!isOpen) card.classList.add('open');
    });
  });

  if (page === 'memories') {
    // Реальные фотографии из папки memories/
    const photoFiles = [
      'photo_2026-08-19_10-03-39.jpg',
      'photo_2026-08-19_10-03-54.jpg',
      'photo_2026-08-19_10-03-58.jpg',
      'photo_2026-08-19_10-04-08.jpg',
      'photo_2026-08-19_10-04-12.jpg',
      'photo_2026-08-19_10-04-18.jpg',
      'photo_2026-08-19_10-04-26.jpg',
      'photo_2026-08-19_10-09-51.jpg',
      'photo_2026-08-19_10-10-01.jpg',
      'photo_2026-08-19_10-10-08.jpg',
      'photo_2026-08-19_10-10-14.jpg',
      'photo_2026-08-19_10-10-16.jpg',
      'photo_2026-08-19_10-10-19.jpg',
      'photo_2026-08-19_10-10-23.jpg',
      'photo_2026-08-19_10-10-27.jpg',
      'photo_2026-08-19_10-10-30.jpg',
      'photo_2026-08-19_10-10-33.jpg',
      'photo_2026-08-19_10-16-54.jpg',
      'photo_2026-08-19_10-17-02.jpg',
      'photo_2026-08-19_10-17-05.jpg',
      'photo_2026-08-19_10-17-07.jpg',
      'photo_2026-08-19_10-17-09.jpg',
      'photo_2026-08-19_10-17-12.jpg',
      'photo_2026-08-19_10-17-15.jpg',
      'photo_2026-08-19_10-17-17.jpg',
      'photo_2026-08-19_10-17-19.jpg',
      'photo_2026-08-19_10-17-23.jpg',
      'photo_2026-08-19_10-17-26.jpg',
      'photo_2026-08-19_10-17-29.jpg',
      'photo_2026-08-19_10-17-32.jpg',
      'photo_2026-08-19_10-17-35.jpg',
      'photo_2026-08-19_10-17-37.jpg',
      'photo_2026-08-19_10-17-39.jpg',
      'photo_2026-08-19_10-17-42.jpg',
      'photo_2026-08-19_10-17-44.jpg',
      'photo_2026-08-19_10-17-46.jpg',
      'photo_2026-08-19_10-17-48.jpg',
      'photo_2026-08-19_10-17-51.jpg',
      'photo_2026-08-19_10-17-53.jpg',
      'photo_2026-08-19_10-17-56.jpg',
      'photo_2026-08-19_10-17-58.jpg',
      'photo_2026-08-19_10-18-01.jpg',
      'photo_2026-08-19_10-18-03.jpg',
      'photo_2026-08-19_10-18-06.jpg',
      'photo_2026-08-19_10-18-08.jpg',
      'photo_2026-08-19_10-18-10.jpg',
      'photo_2026-08-19_10-18-13.jpg',
      'photo_2026-08-19_10-18-16.jpg',
      'photo_2026-08-19_10-18-18.jpg',
      'photo_2026-08-19_10-18-20.jpg',
      'photo_2026-08-19_10-18-23.jpg',
      'photo_2026-08-19_10-18-26.jpg',
      'photo_2026-08-19_10-18-28.jpg',
      'photo_2026-08-19_10-18-30.jpg',
      'photo_2026-08-19_10-18-33.jpg',
      'photo_2026-08-19_10-18-36.jpg',
      'photo_2026-08-19_10-18-38.jpg',
      'photo_2026-08-19_10-18-41.jpg',
      'photo_2026-08-19_10-18-43.jpg',
      'photo_2026-08-19_10-18-46.jpg',
      'photo_2026-08-19_10-18-49.jpg',
      'photo_2026-08-19_10-18-52.jpg',
      'photo_2026-08-19_10-18-54.jpg',
      'photo_2026-08-19_10-20-35.jpg',
      'photo_2026-08-19_10-20-37.jpg',
      'photo_2026-08-19_10-20-40.jpg',
      'photo_2026-08-19_10-20-43.jpg',
      'photo_2026-08-19_10-20-46.jpg',
      'photo_2026-08-19_10-20-49.jpg',
      'photo_2026-08-19_10-20-51.jpg',
      'photo_2026-08-19_10-20-54.jpg',
      'photo_2026-08-19_10-20-56.jpg',
      'photo_2026-08-19_10-20-59.jpg',
      'photo_2026-08-19_10-23-40.jpg',
      'photo_2026-08-19_10-23-43.jpg',
      'photo_2026-08-19_10-23-45.jpg',
      'photo_2026-08-19_10-23-47.jpg',
      'photo_2026-08-19_10-23-50.jpg',
      'photo_2026-08-19_10-23-52.jpg',
      'photo_2026-08-19_10-23-55.jpg',
      'photo_2026-08-19_10-23-57.jpg',
      'photo_2026-08-19_10-24-05.jpg',
      'photo_2026-08-19_10-24-08.jpg',
      'photo_2026-08-19_10-24-10.jpg',
      'photo_2026-08-19_10-24-13.jpg',
      'photo_2026-08-19_10-24-17.jpg',
      'photo_2026-08-19_10-24-19.jpg',
      'photo_2026-08-19_10-24-21.jpg',
      'photo_2026-08-19_10-24-24.jpg',
      'photo_2026-08-19_10-24-26.jpg',
      'photo_2026-08-19_10-24-28.jpg'
    ];

    // Реальные видео из папки memories/
    const videoFiles = [
      'IMG_6254.mp4',
      'IMG_6462.MOV',
      'IMG_6500.MOV',
      'IMG_6556.MOV',
      'IMG_6557.MOV',
      'IMG_6624.MOV',
      'IMG_6742.MOV',
      'IMG_6779.MOV',
      'IMG_6792.MP4',
      'IMG_7265.MP4',
      'IMG_7279.MOV',
      'IMG_7343.MOV',
      'IMG_8666.MOV'
    ];

    const galleryGrid = document.getElementById('galleryGrid');
    const lockedState = document.getElementById('lockedState');
    const galleryState = document.getElementById('galleryState');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const videoGrid = document.getElementById('videoGrid');
    const memVideoModal = document.getElementById('videoModal');
    const memModalVideo = document.getElementById('modalVideo');
    const memVideoModalClose = document.querySelector('.video-modal-close');

    const isQuestCompleted = localStorage.getItem('questCompleted') === 'true';

    if (!isQuestCompleted) {
      galleryState.classList.add('hidden');
      if (lockedState) {
        lockedState.classList.remove('hidden');
      }
      return;
    }

    if (lockedState) lockedState.classList.add('hidden');
    galleryState.classList.remove('hidden');

    // Floating hearts для романтичного настроения
    function createFloatingHearts() {
      const heartsCount = 8;
      for (let i = 0; i < heartsCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = '♡';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDelay = `${Math.random() * 4}s`;
        heart.style.animationDuration = `${6 + Math.random() * 4}s`;
        heart.style.fontSize = `${1 + Math.random() * 1.5}rem`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 12000);
      }
    }
    createFloatingHearts();

    let activeIndex = 0;

    // Строим фотоальбом
    const photoData = photoFiles.map((file, i) => ({
      src: `memories/${file}`,
      caption: `Наш спогад ${i + 1}`
    }));

    photoData.forEach((photo, index) => {
      const card = document.createElement('article');
      card.className = 'memory-card';
      card.style.animationDelay = `${index * 40}ms`;
      card.innerHTML = `
        <img src="${photo.src}" alt="${photo.caption}" loading="lazy" />
        <span class="caption">${photo.caption}</span>
      `;
      card.addEventListener('click', () => {
        activeIndex = index;
        openLightbox(photo.src, photo.caption);
      });
      galleryGrid.appendChild(card);
    });

    function openLightbox(src, alt) {
      lightboxImage.src = src;
      lightboxImage.alt = alt;
      lightbox.classList.add('open');
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
    }

    function moveLightbox(step) {
      const total = photoData.length;
      activeIndex = (activeIndex + step + total) % total;
      const photo = photoData[activeIndex];
      openLightbox(photo.src, photo.caption);
    }

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => moveLightbox(-1));
    nextBtn.addEventListener('click', () => moveLightbox(1));
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
      if (!lightbox.classList.contains('open')) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowRight') moveLightbox(1);
      if (event.key === 'ArrowLeft') moveLightbox(-1);
    });

    // Видео галерея
    function openMemVideoModal(videoSrc) {
      if (!memVideoModal || !memModalVideo) return;
      memModalVideo.src = videoSrc;
      memVideoModal.classList.add('open');
      memModalVideo.play();
    }

    function closeMemVideoModal() {
      if (!memVideoModal || !memModalVideo) return;
      memVideoModal.classList.remove('open');
      memModalVideo.pause();
      memModalVideo.currentTime = 0;
      memModalVideo.src = '';
    }

    if (memVideoModalClose) memVideoModalClose.addEventListener('click', closeMemVideoModal);
    if (memVideoModal) {
      memVideoModal.addEventListener('click', (event) => {
        if (event.target === memVideoModal) closeMemVideoModal();
      });
    }
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && memVideoModal && memVideoModal.classList.contains('open')) {
        closeMemVideoModal();
      }
    });

    if (videoGrid) {
      videoFiles.forEach((file, index) => {
        const path = `memories/${file}`;
        const card = document.createElement('div');
        card.className = 'video-item memory-video-card';
        card.style.animationDelay = `${index * 60}ms`;

        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;
        video.loop = true;
        const source = document.createElement('source');
        source.src = path;
        video.appendChild(source);
        card.appendChild(video);

        const overlay = document.createElement('div');
        overlay.className = 'video-item-overlay';
        overlay.innerHTML = '<div class="play-icon">▶</div>';
        card.appendChild(overlay);

        card.addEventListener('click', () => openMemVideoModal(path));
        videoGrid.appendChild(card);
      });
    }
  }

  // August 2025 Interactive Moments Feature
  const augustToggleBtn = document.getElementById('augustToggleBtn');
  const augustGallery = document.getElementById('augustGallery');
  const augustVideoGrid = document.getElementById('augustVideoGrid');
  const videoModal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const videoModalClose = document.querySelector('.video-modal-close');
  const photoModal = document.getElementById('photoModal');
  const modalPhoto = document.getElementById('modalPhoto');
  const photoModalClose = document.querySelector('.photo-modal-close');

  function openPhotoModal(photoSrc, photoAlt) {
    if (!photoModal || !modalPhoto) return;
    modalPhoto.src = photoSrc;
    modalPhoto.alt = photoAlt || 'Велике фото зі спогадів';
    photoModal.classList.add('open');
  }

  function closePhotoModal() {
    if (!photoModal || !modalPhoto) return;
    photoModal.classList.remove('open');
    modalPhoto.src = '';
  }

  if (photoModalClose) photoModalClose.addEventListener('click', closePhotoModal);
  if (photoModal) {
    photoModal.addEventListener('click', (event) => {
      if (event.target === photoModal) closePhotoModal();
    });
  }

  document.querySelectorAll('.reason-media img').forEach((image) => {
    image.addEventListener('click', () => openPhotoModal(image.src, image.alt));
  });

  if (augustToggleBtn) {
    // All August 2025 media uses the same gallery behavior as other months.
    const augustMediaFiles = [
      'https://files.catbox.moe/tajgld.MOV',
      'https://files.catbox.moe/ogm3nc.jpg',
      'https://files.catbox.moe/x7dboj.jpg',
      'https://files.catbox.moe/wuykic.jpg',
      'https://files.catbox.moe/23b3f6.jpg',
      'https://files.catbox.moe/vfhu1n.jpg',
      'https://files.catbox.moe/ni25n2.MOV',
      'https://files.catbox.moe/xpivu1.jpg',
      'https://files.catbox.moe/w2jpzc.jpg',
      'https://files.catbox.moe/gagu11.jpg',
      'https://files.catbox.moe/sk23i5.jpg',
      'https://files.catbox.moe/mjhwrt.jpg'
    ];

    // Populate video gallery
    function populateAugustGallery() {
      augustVideoGrid.innerHTML = '';
      augustMediaFiles.forEach((file, index) => {
        augustVideoGrid.appendChild(
          createMediaCard(file, null, null, index)
        );
      });
    }

    // Open video modal
    function openVideoModal(videoSrc) {
      modalVideo.src = videoSrc;
      videoModal.classList.add('open');
      modalVideo.play();
    }

    // Close video modal
    function closeVideoModal() {
      videoModal.classList.remove('open');
      modalVideo.pause();
      modalVideo.currentTime = 0;
      modalVideo.src = '';
    }

    // Create heart particles
    function createHeartParticles() {
      const heartsCount = 6;
      const buttonRect = augustToggleBtn.getBoundingClientRect();
      const centerX = buttonRect.left + buttonRect.width / 2;
      const centerY = buttonRect.top + buttonRect.height / 2;

      for (let i = 0; i < heartsCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.textContent = '♡';
        heart.style.left = centerX + 'px';
        heart.style.top = centerY + 'px';

        // Random angle and distance
        const angle = (i / heartsCount) * Math.PI * 2;
        const distance = 60;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        heart.style.setProperty('--tx', tx + 'px');
        heart.style.setProperty('--ty', ty + 'px');
        heart.style.animation = `heartFloat 1.2s ease-out forwards`;
        heart.style.color = 'var(--rose)';

        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 1200);
      }
    }

    // Toggle gallery visibility
    function toggleGallery() {
      const isOpen = augustGallery.style.display !== 'none';

      if (isOpen) {
        augustGallery.style.display = 'none';
        augustToggleBtn.classList.remove('active');
      } else {
        if (augustVideoGrid.innerHTML === '') {
          populateAugustGallery();
        }
        augustGallery.style.display = 'block';
        augustToggleBtn.classList.add('active');
        createHeartParticles();
      }
    }

    // Event listeners
    augustToggleBtn.addEventListener('click', toggleGallery);

    // Video modal close button
    if (videoModalClose) {
      videoModalClose.addEventListener('click', closeVideoModal);
    }

    // Close modal by clicking outside
    videoModal.addEventListener('click', (event) => {
      if (event.target === videoModal) {
        closeVideoModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && videoModal.classList.contains('open')) {
        closeVideoModal();
      }
      if (event.key === 'Escape' && photoModal && photoModal.classList.contains('open')) {
        closePhotoModal();
      }
    });

    // Media galleries for every month after August 2025
    const monthMedia = {
      september: {
        folder: 'September',
        files: ['football.MOV', 'tiktok.MP4', 'zoo.MOV'],
        covers: ['images/1year 1.jpg']
      },
      october: {
        folder: 'october',
        files: ['cute.mp4', 'IMG_6778.MOV'],
        covers: ['images/наймиліша.jpg']
      },
      november: {
        folder: 'November',
        files: ['augsburg.mp4', 'Milota.MP4', 'tennis.MP4', 'tt.mp4'],
        covers: ['images/найулюбленіша.jpg']
      },
      december: {
        folder: 'december',
        files: ['krasa.MOV'],
        covers: ['december/happy.jpg'],
        photos: ['december/happy.jpg', 'december/year.jpg', 'december/new.jpg', 'december/trip.jpg']
      },
      january: {
        folder: 'january',
        files: ['stutgart.mp4'],
        covers: ['january/amzing.jpg'],
        photos: ['january/amzing.jpg', 'january/vau.jpg', 'january/viiibe.jpg']
      },
      february: {
        folder: 'february',
        files: ['celebration.MOV', 'super.mp4'],
        covers: ['images/найпрекрасніша.jpg']
      },
      march: {
        folder: 'March',
        files: ['so cute.mp4', 'work.MOV'],
        covers: ['images/посмішка.jpg']
      },
      april: {
        folder: 'April',
        files: [],
        covers: [],
        photos: ['April/mm.jpg', 'April/sexy.jpg', 'April/top.jpg', 'April/wow.jpg']
      },
      may: {
        folder: 'may',
        files: [],
        covers: [],
        photos: ['may/milano.jpg', 'may/milano 1.jpg', 'may/milano 2.jpg', 'may/sea.jpg', 'may/sea 1.jpg', 'may/unbelieveable.jpg']
      },
      june: {
        folder: 'juny',
        files: ['da.MOV'],
        covers: ['juny/so good.jpg'],
        photos: ['juny/so good.jpg', 'juny/thankkkuuu.jpg', 'juny/tttooop.jpg', 'juny/mmmm.jpg']
      },
      july: {
        folder: 'july',
        files: ['hb.MOV', 'milata.MOV', 'nice.MOV', 'oj vsyo.MOV'],
        covers: ['images/1year.jpg']
      }
    };

    function isVideoFile(file) {
      return /\.(mov|mp4|m4v|webm)$/i.test(file);
    }

    function createMediaCard(file, folder, cover, index) {
      const path = folder ? `${folder}/${file}` : file;
      const item = document.createElement('div');
      item.className = 'video-item month-media-item';

      if (isVideoFile(file)) {
        const video = document.createElement('video');
        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        video.loop = true;
        const source = document.createElement('source');
        source.src = path;
        video.appendChild(source);
        item.appendChild(video);
        item.addEventListener('click', () => openVideoModal(path));
      } else {
        const image = document.createElement('img');
        image.src = path;
        image.alt = 'Фото зі спогадів';
        item.appendChild(image);
        item.addEventListener('click', () => openPhotoModal(path, image.alt));
      }

      if (isVideoFile(file)) {
        const overlay = document.createElement('div');
        overlay.className = 'video-item-overlay';
        overlay.innerHTML = '<div class="play-icon">▶</div>';
        item.appendChild(overlay);
      }
      item.style.animationDelay = `${index * 80}ms`;
      return item;
    }

    function typeMessage(element, text) {
      let index = 0;
      element.textContent = '';
      const timer = setInterval(() => {
        element.textContent += text[index];
        index += 1;
        if (index >= text.length) clearInterval(timer);
      }, 82);
    }

    function addMonthGallery(item) {
      const monthKey = item.dataset.month;
      if (!monthKey || monthKey === 'august-2025' || item.querySelector('.month-gallery')) return;

      const toggle = document.createElement('button');
      toggle.className = 'moments-toggle-btn month-gallery-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-label', 'Показати фото та відео місяця');
      toggle.innerHTML = '<span class="btn-text">+</span>';

      const gallery = document.createElement('div');
      gallery.className = 'moments-gallery month-gallery';
      gallery.style.display = 'none';
      gallery.innerHTML = '<p class="moments-caption">Фото та відео цього місяця ♡</p><div class="video-grid month-video-grid"></div>';

      const grid = gallery.querySelector('.month-video-grid');
      const month = monthMedia[monthKey];

      if (month) {
        const media = [];
        month.files.forEach((file) => media.push({file, cover: month.covers[0], folder: month.folder}));
        (month.photos || []).forEach((file) => media.push({file, cover: file, folder: ''}));
        media.forEach(({file, cover, folder}, index) => {
          const mediaFolder = folder;
          grid.appendChild(createMediaCard(file, mediaFolder, cover, index));
        });
      }

      let typewriterStarted = false;
      const august2026Text = 'Ось і місяць, який зараз. Стільки крутих моментів було, так класно себе почували, тож давай будувати наші стосунки далі, записувати прекрасні моменти на камеру, щоб потім через 50 років сидіти в обіймах і передивлятися це все, показувати нашим внукам і внучкам! Я тебе безмежно сильно кохаю і хочу прожити з тобою до кінця життя, бо ти — найприємніше, що зі мною траплялося!';

      if (monthKey === 'august-2026') {
        gallery.innerHTML = `
          <p class="moments-caption">Наш рік разом ♡</p>
          <div class="august-2026-story">
            <p class="typewriter-message"></p>
          </div>
        `;
      }

      item.append(toggle, gallery);
      toggle.addEventListener('click', () => {
        const isOpen = gallery.style.display !== 'none';
        gallery.style.display = isOpen ? 'none' : 'block';
        toggle.classList.toggle('active', !isOpen);
        if (!isOpen) {
          createHeartParticles();
          if (monthKey === 'august-2026' && !typewriterStarted) {
            typewriterStarted = true;
            typeMessage(gallery.querySelector('.typewriter-message'), august2026Text);
          }
        }
      });
    }

    document.querySelectorAll('.timeline-item[data-month]').forEach(addMonthGallery);
  }

  // Carousel for reasons section
  const carousel = document.querySelector('.reasons-carousel');
  if (carousel) {
    const slides = document.querySelectorAll('.reason-slide');
    const dotsContainer = document.getElementById('carouselDots');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentSlide = 0;

    // Create dots
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Слайд ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    function updateSlide() {
      slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev');
        if (index === currentSlide) {
          slide.classList.add('active');
        } else if (index < currentSlide) {
          slide.classList.add('prev');
        }
      });

      // Update dots
      document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }

    function goToSlide(index) {
      currentSlide = (index + slides.length) % slides.length;
      updateSlide();
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!carousel.offsetParent) return; // Check if visible
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });

    // Auto-rotate carousel (optional)
    setInterval(() => {
      if (carousel.offsetParent) {
        nextSlide();
      }
    }, 6000);

    updateSlide();
  }
});
