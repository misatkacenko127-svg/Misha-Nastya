(function () {
  'use strict';

  console.log("=== ANNIVERSARY.JS LOADED ===");

  var ANNIVERSARY_TEST_MODE = true;

  var anniversaryContent = {
    date: '14 вересня 2026',
    title: '400',
    subtitle: 'днів',
    intro: '400 днів, як я став по-справжнім щасливим.',
    memoriesTitle: 'Давай знову трохи згадаємо.',
    finalTitle: 'Кохана...',
    finalText: 'вийди, будь ласочка, на 5 хвилин))'
  };

  var photos = [
    '400/1.1.jpg',
    '400/1.2.jpg',
    '400/1.3.jpg',
    '400/1.4.jpg',
    '400/1.5.jpg',
    '400/1.6.jpg',
    '400/1.7.jpg',
    '400/1.8.jpg',
    '400/2.0.jpg',
    '400/2.1.jpg',
    '400/2.2.jpg',
    '400/2.3.jpg',
    '400/2.4.jpg',
    '400/2.5.jpg',
    '400/2.6.jpg',
    '400/2.7.jpg'
  ];

  var anniversaryMusic = null;
  try {
    var audio = document.createElement('audio');
    audio.id = 'anniversaryMusic';
    audio.preload = 'auto';
    audio.loop = true;
    var source = document.createElement('source');
    source.src = 'music/schastye.mp3';
    source.type = 'audio/mpeg';
    audio.appendChild(source);
    document.body.appendChild(audio);
    anniversaryMusic = audio;
  } catch (e) {
    anniversaryMusic = null;
  }

  function delay(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  /* ===== ПЕРЕВІРКА ДАТИ ===== */

  if (!ANNIVERSARY_TEST_MODE) {
    var now = new Date();
    if (now.getMonth() !== 8 || now.getDate() !== 14) {
      return;
    }
  }

  /* ===== ЗАПОВНЕННЯ ТЕКСТІВ ===== */

  function setText(selector, text) {
    var el = document.querySelector(selector);
    if (el) el.textContent = text;
  }

  setText('.anniversary-date', anniversaryContent.date);
  setText('.anniversary-number', anniversaryContent.title);
  setText('.anniversary-subtitle', anniversaryContent.subtitle);
  setText('.anniversary-intro', anniversaryContent.intro);
  setText('.anniversary-memories-title', anniversaryContent.memoriesTitle);
  setText('.anniversary-final-title', anniversaryContent.finalTitle);
  setText('.anniversary-final-text', anniversaryContent.finalText);

  /* ===== ЕЛЕМЕНТИ ===== */

  var overlay = document.getElementById('anniversaryOverlay');
  var screen1 = document.getElementById('anniversaryScreen1');
  var screen2 = document.getElementById('anniversaryScreen2');
  var screen3 = document.getElementById('anniversaryScreen3');

  if (!overlay || !screen1 || !screen2 || !screen3) return;

  var photoLeft = document.getElementById('anniversaryPhotoLeft');
  var photoRight = document.getElementById('anniversaryPhotoRight');
  var counter = document.getElementById('anniversaryCounter');
  var continueBtn = document.getElementById('anniversaryContinue');

  /* ===== ДОПОМІЖНІ ФУНКЦІЇ ===== */

  function showScreen(screen) {
    var screens = [screen1, screen2, screen3];
    screens.forEach(function (s) {
      s.classList.remove('active');
    });
    requestAnimationFrame(function () {
      screen.classList.add('active');
    });
  }

  function updateCounter(index) {
    if (!counter) return;
    var total = photos.length;
    var num = String(index + 1).padStart(2, '0');
    counter.textContent = num + ' / ' + (total < 100 ? '0' : '') + total;
  }

  /* ===== ЕКРАН 1 ===== */

  if (continueBtn) {
    continueBtn.addEventListener('click', function () {
      screen1.style.opacity = '0';
      screen1.style.visibility = 'hidden';
      screen1.style.transition = 'opacity 0.6s ease, visibility 0s 0.6s';

      setTimeout(function () {
        showScreen(screen2);
        try {
          if (anniversaryMusic) {
            anniversaryMusic.play();
          }
        } catch (e) {
          // Browser blocked autoplay - continue silently
        }
        startCrossfade();
      }, 600);
    });
  }

  /* ===== ЕКРАН 2: CROSSFADE SLIDESHOW ===== */

  var crossfadeTimer = null;
  var slideshowCycles = 0;
  var currentIndex = 0;
  var PHOTO_DISPLAY_TIME = 4500;
  var TOTAL_PAIRS = Math.ceil(photos.length / 2);
  var shownPairs = 0;

  function startCrossfade() {
    console.log('[400 DAYS] START CROSSFADE');
    currentIndex = 0;
    slideshowCycles = 0;
    shownPairs = 0;

    updateCounter(0);
    showPhotoPair(photoLeft, photoRight, currentIndex, currentIndex + 1);

    crossfadeTimer = setInterval(function () {
      currentIndex = (currentIndex + 2) % photos.length;
      shownPairs++;

      if (shownPairs >= TOTAL_PAIRS) {
        clearInterval(crossfadeTimer);
        crossfadeTimer = null;
        setTimeout(goToFinal, 1500);
        return;
      }

      if (currentIndex === 0) {
        slideshowCycles++;
        console.log('[400 DAYS] CROSSFADE CYCLE', slideshowCycles);
      }

      updateCounter(currentIndex);
      showPhotoPair(photoLeft, photoRight, currentIndex, currentIndex + 1);
    }, PHOTO_DISPLAY_TIME);
  }

  function stopCrossfade() {
    if (crossfadeTimer) {
      clearInterval(crossfadeTimer);
      crossfadeTimer = null;
    }
  }

  function showPhotoPair(leftContainer, rightContainer, leftIdx, rightIdx) {
    if (leftIdx >= photos.length) leftIdx = 0;
    if (rightIdx >= photos.length) rightIdx = 0;

    crossfadeTransition(leftContainer, photos[leftIdx]);
    crossfadeTransition(rightContainer, photos[rightIdx]);
  }

  function crossfadeTransition(container, photoSrc) {
    var existing = container.querySelector('img');

    var img = new Image();
    img.src = photoSrc;
    img.alt = 'Спогад';
    img.style.cssText = 'opacity:0;transform:scale(0.92) translate(20px,0);filter:blur(8px);transition:opacity 1.5s ease 0.3s,transform 1.5s ease 0.3s,filter 1.5s ease 0.3s;width:100%;height:100%;object-fit:contain;display:block;border-radius:4px;box-shadow:0 20px 60px rgba(0,0,0,0.35);border:1px solid rgba(255,249,246,0.08);';

    if (existing) {
      existing.style.cssText = 'opacity:0;transform:scale(0.95) translate(-15px,0);filter:blur(4px);transition:opacity 1.2s ease,transform 1.2s ease,filter 1.2s ease;width:100%;height:100%;object-fit:contain;display:block;border-radius:4px;';
      var oldRef = existing;
      setTimeout(function () {
        if (oldRef.parentNode === container) {
          container.removeChild(oldRef);
        }
      }, 1400);
    }

    container.appendChild(img);

    setTimeout(function () {
      requestAnimationFrame(function () {
        img.style.opacity = '1';
        img.style.transform = 'scale(1) translate(0,0)';
        img.style.filter = 'blur(0)';
      });
    }, 300);
  }

  /* ===== ЕКРАН 3: FINAL ===== */

  function goToFinal() {
    stopCrossfade();
    if (screen2) {
      screen2.style.opacity = '0';
      screen2.style.visibility = 'hidden';
      screen2.style.transition = 'opacity 1s ease, visibility 0s 1s';
    }
    setTimeout(function () {
      showScreen(screen3);
    }, 1000);
  }

  /* ===== ЗАПУСК ===== */

  function activateAnniversaryExperience() {
    console.log('[400 DAYS] activating first screen');

    overlay.classList.add('active');

    overlay.style.opacity = '1';
    overlay.style.visibility = 'visible';
    overlay.style.pointerEvents = 'auto';

    screen1.classList.add('active');

    screen1.style.opacity = '1';
    screen1.style.visibility = 'visible';
    screen1.style.display = 'flex';

    console.log('[400 DAYS] first screen activated');
  }

  function startAnniversary() {
    requestAnimationFrame(function () {
      activateAnniversaryExperience();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAnniversary);
  } else {
    startAnniversary();
  }

  setTimeout(function () {
    if (!overlay.classList.contains('active')) {
      console.log('[400 DAYS] fallback activation');
      activateAnniversaryExperience();
    }
  }, 1500);
})();
