document.addEventListener('DOMContentLoaded', () => {
  const stage1 = document.getElementById('stage-1');
  const stage2 = document.getElementById('stage-2');
  const stage3 = document.getElementById('stage-3');
  const statusBox = document.getElementById('statusBox');
  const completionActions = document.getElementById('completionActions');
  const reactionOverlay = document.getElementById('reactionOverlay');
  const reactionText = document.getElementById('reactionText');
  const completionOverlay = document.getElementById('completionOverlay');
  const wristBtn = document.getElementById('wristBtn');
  const wristHint = document.getElementById('wristHint');

  if (!stage1 || !stage2 || !stage3 || !statusBox || !completionActions) return;

  let currentStage = 1;
  const correctHeart = 5;
  let wristEscaping = true; // 2Wrist убегает, пока не нажали неправильный вариант

  const markStatus = (text) => {
    statusBox.textContent = text;
  };

  // ===== ЭТАП 1 (не меняем) =====
  const hearts = document.querySelectorAll('.heart-item');
  hearts.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (index === correctHeart) {
        item.classList.add('correct');
        markStatus('Правильно! ♡ Рухаємось далі…');
        setTimeout(() => {
          stage1.classList.add('hidden');
          stage2.classList.remove('hidden');
          currentStage = 2;
        }, 500);
      } else {
        markStatus('Не зовсім так… спробуй ще раз.');
      }
    });
  });

  // ===== ЭТАП 2 — Хто найкращий репер? =====
  const rapperOptions = document.querySelectorAll('#rapperAnswers .answer-option');

  // Функция: переместить 2Wrist в случайное место в пределах viewport
  function moveWristAway() {
    if (!wristBtn) return;
    const btnRect = wristBtn.getBoundingClientRect();
    const btnW = btnRect.width;
    const btnH = btnRect.height;
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const pad = isTouchDevice ? 28 : 16;

    let vw = window.innerWidth;
    let vh = window.innerHeight;
    if (document.documentElement.clientWidth > vw) vw = document.documentElement.clientWidth;
    if (document.documentElement.clientHeight > vh) vh = document.documentElement.clientHeight;

    const maxX = Math.max(pad, vw - btnW - pad);
    const maxY = Math.max(pad, vh - btnH - pad);

    const x = pad + Math.random() * (maxX - pad);
    const y = pad + Math.random() * (maxY - pad);

    const rot = (Math.random() - 0.5) * 30;
    const scale = isTouchDevice ? 1.1 : (0.9 + Math.random() * 0.25);

    wristBtn.style.position = 'fixed';
    wristBtn.style.left = x + 'px';
    wristBtn.style.top = y + 'px';
    wristBtn.style.zIndex = '4000';
    wristBtn.style.transform = `rotate(${rot}deg) scale(${scale})`;
    wristBtn.style.transition = 'left 0.35s cubic-bezier(0.2, 0.8, 0.3, 1.2), top 0.35s cubic-bezier(0.2, 0.8, 0.3, 1.2), transform 0.35s ease';
  }

  // Показать текст на весь экран (overlay)
  function showReaction(text, duration, onDone) {
    if (!reactionOverlay || !reactionText) {
      if (onDone) onDone();
      return;
    }
    reactionText.textContent = text;
    reactionOverlay.classList.remove('hidden');
    // Перезапуск анимации
    reactionText.style.animation = 'none';
    void reactionText.offsetWidth;
    reactionText.style.animation = 'reactionPop 0.7s cubic-bezier(0.2, 0.8, 0.3, 1.2) both';

    setTimeout(() => {
      reactionOverlay.classList.add('hidden');
      if (onDone) onDone();
    }, duration);
  }

  // 2Wrist убегает при попытке нажатия
  if (wristBtn) {
    wristBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (wristEscaping) {
        moveWristAway();
        markStatus('Хм… спробуй ще раз 😏');
      } else {
        handleCorrectWrist();
      }
    });

    wristBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (wristEscaping) {
        moveWristAway();
        markStatus('Хм… спробуй ще раз 😏');
      } else {
        handleCorrectWrist();
      }
    }, { passive: false });
  }

  // Обработка выбора MORGENSHTERN или NEXTIME
  rapperOptions.forEach((option) => {
    option.addEventListener('click', () => {
      const answer = option.dataset.answer;
      if (answer === '2wrist') return; // обрабатывается отдельно

      // Неправильный ответ
      option.classList.add('wrong');
      markStatus('Хм…');

      setTimeout(() => {
        // Скрыть вопрос и варианты
        stage2.classList.add('hidden');
        // Показать «Панятно...» на 5 секунд
        showReaction('Панятно...', 5000, () => {
          // Затем показать «Та лааадно...» на 2.5 секунды
          showReaction('Та лааадно...', 2500, () => {
            // Вернуть этап 2, 2Wrist больше не убегает
            stage2.classList.remove('hidden');
            wristEscaping = false;
            if (wristBtn) {
              wristBtn.style.position = '';
              wristBtn.style.left = '';
              wristBtn.style.top = '';
              wristBtn.style.zIndex = '';
              wristBtn.style.transform = '';
              wristBtn.style.transition = '';
            }
            if (wristHint) wristHint.classList.remove('hidden');
            markStatus('Тепер обери правильно 😌');
          });
        });
      }, 400);
    });
  });

  // Правильный ответ — 2Wrist
  function handleCorrectWrist() {
    // Показать «♡ Правильно!»
    showReaction('♡ Правильно!', 2000, () => {
      // Перейти к третьему заданию
      stage2.classList.add('hidden');
      stage3.classList.remove('hidden');
      currentStage = 3;
      markStatus('Ти знаєш, хто найкращий! 🥹');
    });
  }

  // ===== ЭТАП 3 (не меняем) =====
  const collectHearts = document.querySelectorAll('.collect-heart');
  let collected = 0;

  collectHearts.forEach((heart) => {
    heart.addEventListener('click', () => {
      if (heart.classList.contains('collected')) return;

      heart.classList.add('collected');
      heart.textContent = '❤';
      collected += 1;

      if (collected === collectHearts.length) {
        markStatus('Ти пройшла весь квест! ♡');
        // Показать красивый экран завершения
        if (completionOverlay) {
          completionOverlay.classList.remove('hidden');
          setTimeout(() => {
            completionOverlay.classList.add('hidden');
            completionActions.classList.remove('hidden');
            localStorage.setItem('questCompleted', 'true');
          }, 3500);
        } else {
          completionActions.classList.remove('hidden');
          localStorage.setItem('questCompleted', 'true');
        }
      } else {
        markStatus(`Надзвичайно! Зібрано ${collected} з ${collectHearts.length} сердець.`);
      }
    });
  });
});