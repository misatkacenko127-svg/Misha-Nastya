/**
 * QUEST SYSTEM - 5 STAGES
 */

document.addEventListener('DOMContentLoaded', () => {
  const questGrid = document.getElementById('questGrid');
  const questModal = document.getElementById('questModal');
  const questContent = document.getElementById('questContent');
  const questModalClose = document.querySelector('.quest-modal-close');
  const questProgress = document.getElementById('questProgress');
  const progressText = document.getElementById('progressText');
  const footerText = document.getElementById('footerText');

  let currentQuestIndex = 0;
  let currentQuestionIndex = 0;

  /**
   * Render quest cards
   */
  function renderQuests() {
    questGrid.innerHTML = '';

    CONTENT.quests.forEach((quest, index) => {
      const isCompleted = game.isQuestCompleted(quest.id);

      const card = document.createElement('div');
      card.className = `quest-card ${isCompleted ? 'completed' : ''}`;

      const badge = document.createElement('div');
      badge.className = 'quest-badge';
      badge.innerHTML = `${index + 1}/5`;

      const icon = document.createElement('div');
      icon.className = 'quest-icon';
      icon.textContent = quest.icon;

      const title = document.createElement('h3');
      title.textContent = quest.title;

      const description = document.createElement('p');
      description.textContent = quest.description;

      const status = document.createElement('div');
      status.className = 'quest-status';
      status.textContent = isCompleted ? '✓ Завершено' : 'Розпочати';

      card.appendChild(badge);
      card.appendChild(icon);
      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(status);

      if (!isCompleted) {
        card.addEventListener('click', () => {
          startQuest(index);
        });
      }

      questGrid.appendChild(card);
    });

    updateProgress();
  }

  /**
   * Update progress bar
   */
  function updateProgress() {
    const completed = game.progress.completedQuests.length;
    const percentage = (completed / 5) * 100;

    questProgress.style.width = percentage + '%';
    progressText.textContent = `${completed}/5 завершено`;

    if (completed === 5) {
      footerText.textContent =
        'Вітаємо! Ти розблокував всі розділи історії! ✨';
    }
  }

  /**
   * Start a quest
   */
  function startQuest(questIndex) {
    currentQuestIndex = questIndex;
    currentQuestionIndex = 0;
    const quest = CONTENT.quests[questIndex];

    showQuestModal(quest);
  }

  /**
   * Show quest modal with current question
   */
  function showQuestModal(quest) {
    questContent.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'quest-modal-header';

    const qNumber = document.createElement('p');
    qNumber.className = 'quest-number';
    qNumber.textContent = `Квест ${currentQuestIndex + 1} з 5`;

    const qTitle = document.createElement('h2');
    qTitle.textContent = quest.title;

    header.appendChild(qNumber);
    header.appendChild(qTitle);
    questContent.appendChild(header);

    if (quest.id === 'quest1') {
      showQuestion1();
    } else if (quest.id === 'quest2') {
      showQuestion2();
    } else if (quest.id === 'quest3') {
      showQuestion3();
    } else if (quest.id === 'quest4') {
      showQuestion4();
    } else if (quest.id === 'quest5') {
      showQuestion5();
    }

    questModal.style.display = 'flex';
  }

  /**
   * QUEST 1: Multiple choice questions
   */
  function showQuestion1() {
    const quest = CONTENT.quests[0];
    if (!quest.questions || currentQuestionIndex >= quest.questions.length) {
      completeCurrentQuest();
      return;
    }

    const question = quest.questions[currentQuestionIndex];
    const container = document.createElement('div');
    container.className = 'quest-question';

    const questionText = document.createElement('p');
    questionText.className = 'question-text';
    questionText.textContent = question.text;

    container.appendChild(questionText);

    const options = document.createElement('div');
    options.className = 'question-options';

    const shuffled = [...question.options].sort(() => Math.random() - 0.5);

    shuffled.forEach(option => {
      const button = document.createElement('button');
      button.className = 'option-btn';
      button.textContent = option;

      button.addEventListener('click', () => {
        if (option === question.correct) {
          button.classList.add('correct');
          setTimeout(() => {
            currentQuestionIndex++;
            showQuestion1();
          }, 600);
        } else {
          button.classList.add('wrong');
          setTimeout(() => {
            button.classList.remove('wrong');
          }, 400);
        }
      });

      options.appendChild(button);
    });

    container.appendChild(options);
    questContent.appendChild(container);
  }

  /**
   * QUEST 2: Find the heart
   */
  function showQuestion2() {
    const container = document.createElement('div');
    container.className = 'quest-find-heart';

    const instruction = document.createElement('p');
    instruction.className = 'instruction';
    instruction.textContent = 'Знайди ховане серце на зображенні!';

    container.appendChild(instruction);

    const imageArea = document.createElement('div');
    imageArea.className = 'image-area';
    imageArea.style.backgroundImage =
      "url('images/1year.jpg')";

    const hidden = document.createElement('div');
    hidden.className = 'hidden-heart';
    hidden.textContent = '♡';
    hidden.style.left = Math.random() * 80 + 10 + '%';
    hidden.style.top = Math.random() * 80 + 10 + '%';

    hidden.addEventListener('click', () => {
      hidden.classList.add('found');
      setTimeout(() => {
        completeCurrentQuest();
      }, 600);
    });

    imageArea.appendChild(hidden);
    container.appendChild(imageArea);

    questContent.appendChild(container);
  }

  /**
   * QUEST 3: Arrange in order
   */
  function showQuestion3() {
    const container = document.createElement('div');
    container.className = 'quest-arrange';

    const instruction = document.createElement('p');
    instruction.className = 'instruction';
    instruction.textContent =
      'Розташуй фото в правильному хронологічному порядку';

    container.appendChild(instruction);

    const months = CONTENT.months.slice(0, 6);
    const shuffled = [...months].sort(() => Math.random() - 0.5);

    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'arrange-items';

    shuffled.forEach((month, index) => {
      const item = document.createElement('div');
      item.className = 'arrange-item';
      item.draggable = true;
      item.dataset.index = CONTENT.months.indexOf(month);
      item.textContent = `${month.icon} ${month.name}`;

      itemsContainer.appendChild(item);
    });

    container.appendChild(itemsContainer);

    const submitBtn = document.createElement('button');
    submitBtn.className = 'submit-btn';
    submitBtn.textContent = 'Перевірити порядок';

    submitBtn.addEventListener('click', () => {
      const items = itemsContainer.querySelectorAll('.arrange-item');
      let isCorrect = true;

      items.forEach((item, i) => {
        if (parseInt(item.dataset.index) !== i) {
          isCorrect = false;
        }
      });

      if (isCorrect) {
        completeCurrentQuest();
      } else {
        alert('Цей порядок не правильний. Спробуй ще раз! 😊');
      }
    });

    container.appendChild(submitBtn);
    questContent.appendChild(container);
  }

  /**
   * QUEST 4: Guess the song
   */
  function showQuestion4() {
    const container = document.createElement('div');
    container.className = 'quest-song';

    const instruction = document.createElement('p');
    instruction.className = 'instruction';
    instruction.textContent = 'Послухай фрагмент пісні і вгадай її';

    container.appendChild(instruction);

    const audioContainer = document.createElement('div');
    audioContainer.className = 'audio-player';

    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = CONTENT.music[Math.floor(Math.random() * 3)].src;

    audioContainer.appendChild(audio);
    container.appendChild(audioContainer);

    const options = document.createElement('div');
    options.className = 'song-options';

    const correctSong = CONTENT.music[0];
    const allSongs = [...CONTENT.music];

    allSongs.forEach(song => {
      const btn = document.createElement('button');
      btn.className = 'song-option';
      btn.textContent = song.title;

      btn.addEventListener('click', () => {
        if (song === correctSong) {
          btn.classList.add('correct');
          setTimeout(() => {
            completeCurrentQuest();
          }, 600);
        } else {
          btn.classList.add('wrong');
          setTimeout(() => {
            btn.classList.remove('wrong');
          }, 400);
        }
      });

      options.appendChild(btn);
    });

    container.appendChild(options);
    questContent.appendChild(container);
  }

  /**
   * QUEST 5: Final question
   */
  function showQuestion5() {
    const container = document.createElement('div');
    container.className = 'quest-final';

    const finalQuestion = CONTENT.quests[4].finalQuestion;

    const questionText = document.createElement('p');
    questionText.className = 'final-question-text';
    questionText.textContent = finalQuestion.text;

    container.appendChild(questionText);

    const options = document.createElement('div');
    options.className = 'final-options';

    finalQuestion.options.forEach(option => {
      const btn = document.createElement('button');
      btn.className = 'final-option';
      btn.textContent = option;

      btn.addEventListener('click', () => {
        if (option === finalQuestion.correct) {
          btn.classList.add('correct');
          setTimeout(() => {
            completeCurrentQuest();
          }, 800);
        } else {
          btn.classList.add('wrong');
          setTimeout(() => {
            btn.classList.remove('wrong');
          }, 400);
        }
      });

      options.appendChild(btn);
    });

    container.appendChild(options);
    questContent.appendChild(container);
  }

  /**
   * Complete current quest
   */
  function completeCurrentQuest() {
    const questId = CONTENT.quests[currentQuestIndex].id;
    game.completeQuest(questId);

    const celebrationMsg = document.createElement('div');
    celebrationMsg.className = 'celebration-message';

    if (currentQuestIndex === 4) {
      celebrationMsg.innerHTML = `
        <p class="celebration-text">✨ Вітаємо! ✨</p>
        <p>Ти виконав ВСІ квести!</p>
        <p>Усі розділи історії розблоковані! 🎉</p>
      `;
    } else {
      celebrationMsg.innerHTML = `
        <p class="celebration-text">🎉 Квест завершено! 🎉</p>
        <p>Наступний квест розблокований!</p>
      `;
    }

    questContent.innerHTML = '';
    questContent.appendChild(celebrationMsg);

    setTimeout(() => {
      questModal.style.display = 'none';
      renderQuests();
    }, 2000);
  }

  /**
   * Close modal
   */
  function closeModal() {
    questModal.style.display = 'none';
  }

  questModalClose.addEventListener('click', closeModal);
  questModal.addEventListener('click', e => {
    if (e.target === questModal) closeModal();
  });

  // Initial render
  renderQuests();
});
