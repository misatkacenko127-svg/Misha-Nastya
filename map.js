/**
 * INTERACTIVE MAP LOGIC
 * Generates and manages the story map nodes
 */

document.addEventListener('DOMContentLoaded', () => {
  const mapCanvas = document.getElementById('mapCanvas');
  const daysTogether = document.getElementById('daysTogether');
  const questsCompleted = document.getElementById('questsCompleted');
  const heartsFound = document.getElementById('heartsFound');
  const sectionsProgressLabel = document.getElementById('sectionsProgressLabel');
  const sectionsProgressFill = document.getElementById('sectionsProgressFill');

  // Update stats
  daysTogether.textContent = getDaysTogether();
  questsCompleted.textContent = `${game.progress.completedQuests.length}/5`;
  heartsFound.textContent = `${game.getFoundHeartsCount()}/5`;

  /**
   * Update the "X / 7 розділів відкрито" progress bar
   */
  function updateSectionsProgress() {
    if (!sectionsProgressLabel || !sectionsProgressFill) return;
    const total = CONTENT.mapNodes.length;
    const unlocked = CONTENT.mapNodes.filter((node) => game.isSectionUnlocked(node.id)).length;
    sectionsProgressLabel.textContent = `${unlocked} / ${total} розділів відкрито`;
    sectionsProgressFill.style.width = `${(unlocked / total) * 100}%`;
  }

  updateSectionsProgress();
  document.addEventListener('section-unlocked', updateSectionsProgress);
  document.addEventListener('heart-found', updateSectionsProgress);

  /**
   * Position nodes in a circular pattern around the center
   */
  function calculateNodePositions(nodes) {
    const positions = [];
    const centerX = 50;
    const centerY = 50;
    const radius = 28;
    const count = nodes.length;

    // Special positioning for 7 nodes
    nodes.forEach((node, index) => {
      let angle;
      if (count === 7) {
        // Center node (beginning)
        if (index === 0) {
          angle = 0;
          positions.push({
            x: centerX,
            y: centerY,
            radius: 0
          });
        } else {
          // 6 nodes in circle
          angle = (index - 1) * (360 / 6) * (Math.PI / 180);
          positions.push({
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
            radius: 3
          });
        }
      }
    });

    return positions;
  }

  /**
   * Create a map node element
   */
  function createNodeElement(node, position) {
    const nodeEl = document.createElement('div');
    nodeEl.className = 'map-node';
    nodeEl.dataset.nodeId = node.id;

    const isLocked = !game.isSectionUnlocked(node.id);

    nodeEl.classList.add(isLocked ? 'locked' : 'unlocked');
    if (node.id === 'secret' && game.getFoundHeartsCount() > 0) {
      nodeEl.classList.add('hint-available');
    }
    if (node.id === 'beginning') {
      nodeEl.classList.add('heart-node');
    }

    nodeEl.style.left = position.x + '%';
    nodeEl.style.top = position.y + '%';

    // Create SVG circle for glow effect
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('class', 'node-glow');

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '45');

    svg.appendChild(circle);
    nodeEl.appendChild(svg);

    // Node content
    const content = document.createElement('div');
    content.className = 'node-content';

    const icon = document.createElement('span');
    icon.className = 'node-icon';
    icon.textContent = node.icon;

    const title = document.createElement('p');
    title.className = 'node-title';
    title.textContent = node.title;

    const description = document.createElement('p');
    description.className = 'node-description';
    description.textContent = node.description;

    if (isLocked) {
      const lockIcon = document.createElement('span');
      lockIcon.className = 'lock-icon';
      lockIcon.textContent = '🔒';
      content.appendChild(lockIcon);
    } else {
      content.appendChild(icon);
    }

    content.appendChild(title);
    content.appendChild(description);
    nodeEl.appendChild(content);

    // Click handler
    if (!isLocked) {
      nodeEl.addEventListener('click', () => {
        if (node.id === 'beginning') {
          playBeginningTransition(() => navigateToNode(node.id));
        } else {
          navigateToNode(node.id);
        }
      });
    } else {
      nodeEl.addEventListener('click', () => {
        showLockedMessage(node);
      });
    }

    return nodeEl;
  }

  /**
   * Cinematic fade transition shown before opening the "Початок" chapter
   */
  function playBeginningTransition(onDone) {
    const overlay = document.createElement('div');
    overlay.className = 'cinematic-transition';
    overlay.innerHTML = '<p class="cinematic-line"></p>';
    document.body.appendChild(overlay);

    const line = overlay.querySelector('.cinematic-line');
    const messages = ['Пам’ятаєш, з чого все почалося…', '10 серпня 2025 року'];

    requestAnimationFrame(() => overlay.classList.add('visible'));

    let step = 0;
    function showNext() {
      line.style.opacity = 0;
      setTimeout(() => {
        line.textContent = messages[step];
        line.style.opacity = 1;
        step += 1;
        if (step < messages.length) {
          setTimeout(showNext, 1400);
        } else {
          setTimeout(onDone, 1200);
        }
      }, 250);
    }
    setTimeout(showNext, 350);
  }

  /**
   * Draw connecting lines between nodes
   */
  function drawConnections(nodes, positions) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'connections-svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');

    // Draw lines from center to all other nodes
    nodes.forEach((node, index) => {
      if (index === 0) return; // Skip center node

      const fromPos = positions[0]; // Center
      const toPos = positions[index];

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', fromPos.x);
      line.setAttribute('y1', fromPos.y);
      line.setAttribute('x2', toPos.x);
      line.setAttribute('y2', toPos.y);
      line.setAttribute('class', nodes[index].locked ? 'line-locked' : 'line-unlocked');

      svg.appendChild(line);
    });

    mapCanvas.insertBefore(svg, mapCanvas.firstChild);
  }

  /**
   * Navigate to a node/section
   */
  function navigateToNode(nodeId) {
    const routeMap = {
      beginning: 'chapters.html?chapter=beginning',
      memories: 'memories.html',
      quests: 'quests.html',
      music: 'music.html',
      letters: 'letters.html',
      secret: 'secret.html',
      future: 'future.html'
    };

    const route = routeMap[nodeId];
    if (route) {
      window.location.href = route;
    }
  }

  /**
   * Show message for locked node
   */
  function showLockedMessage(node) {
    const message = document.createElement('div');
    message.className = 'locked-message';

    let text = `<strong>${node.title}</strong> ще заблоковано.`;

    const nodeInfo = CONTENT.mapNodes.find(n => n.id === node.id);
    if (nodeInfo && nodeInfo.requiredQuests && nodeInfo.requiredQuests.length > 0) {
      text += `<p>Виконай квести, щоб відкрити.</p>`;
    }

    message.innerHTML = text;
    mapCanvas.appendChild(message);

    setTimeout(() => {
      message.remove();
    }, 2000);
  }

  /**
   * Render the entire map
   */
  function renderMap() {
    mapCanvas.innerHTML = '';

    const positions = calculateNodePositions(CONTENT.mapNodes);

    // Draw connections first (behind nodes)
    drawConnections(CONTENT.mapNodes, positions);

    // Create nodes
    CONTENT.mapNodes.forEach((node, index) => {
      const nodeEl = createNodeElement(node, positions[index]);
      mapCanvas.appendChild(nodeEl);
    });

    // Add animation class
    setTimeout(() => {
      document.querySelectorAll('.map-node').forEach((node, index) => {
        setTimeout(() => {
          node.classList.add('visible');
        }, index * 100);
      });
    }, 100);
  }

  /**
   * Listen for section unlocks
   */
  document.addEventListener('section-unlocked', (e) => {
    const { sectionId } = e.detail;
    const nodeEl = document.querySelector(`[data-node-id="${sectionId}"]`);

    if (nodeEl) {
      nodeEl.classList.remove('locked');
      nodeEl.classList.add('unlocked');

      // Show unlock animation
      nodeEl.classList.add('newly-unlocked');
      setTimeout(() => {
        nodeEl.classList.remove('newly-unlocked');
      }, 1000);
    }

    // Update stats
    questsCompleted.textContent = `${game.progress.completedQuests.length}/5`;
    heartsFound.textContent = `${game.getFoundHeartsCount()}/5`;
  });

  /**
   * Listen for heart found
   */
  document.addEventListener('heart-found', (e) => {
    const { found } = e.detail;
    heartsFound.textContent = `${found}/5`;

    if (found === 5) {
      const secretNode = document.querySelector('[data-node-id="secret"]');
      if (secretNode) {
        secretNode.classList.add('unlocked');
        secretNode.classList.add('newly-unlocked');
      }
    }
  });

  // Initial render
  renderMap();

  // Add particles effect
  addMapParticles();

  // Add hidden heart
  addHiddenHeartToMap();
});

/**
 * Add floating particles to map
 */
function addMapParticles() {
  const canvas = document.getElementById('mapCanvas');
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'map-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 2 + 's';
    particle.textContent = '♡';

    canvas.appendChild(particle);
  }
}

/**
 * Add hidden heart to map
 */
function addHiddenHeartToMap() {
  if (game.isHeartFound('heart-map')) return;

  const canvas = document.getElementById('mapCanvas');
  const heart = document.createElement('div');
  heart.className = 'hidden-heart';
  heart.textContent = '♡';
  heart.style.position = 'absolute';
  heart.style.left = '75%';
  heart.style.top = '65%';
  heart.style.cursor = 'pointer';
  heart.style.fontSize = '1.5rem';
  heart.style.opacity = '0.08';
  heart.style.transition = 'all 0.3s ease';
  heart.style.transform = 'translate(-50%, -50%)';
  heart.dataset.heartId = 'heart-map';

  heart.addEventListener('mouseenter', () => {
    heart.style.opacity = '0.4';
    heart.style.transform = 'translate(-50%, -50%) scale(1.2)';
  });

  heart.addEventListener('mouseleave', () => {
    heart.style.opacity = '0.08';
    heart.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  heart.addEventListener('click', (e) => {
    e.stopPropagation();
    const found = game.findHeart('heart-map');
    if (found) {
      heart.style.animation = 'heartPop 0.6s ease-out';
      setTimeout(() => heart.remove(), 600);
      document.dispatchEvent(new CustomEvent('heart-found', {detail: {heartId: 'heart-map'}}));
    }
  });

  canvas.appendChild(heart);
}
