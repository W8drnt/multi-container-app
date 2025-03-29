/**
 * Task Completion Celebration
 * Provides visual feedback when tasks are completed
 */

class TaskCompletionCelebration {
  constructor() {
    this.initialize();
  }

  initialize() {
    // Set up event delegation for task completions
    document.addEventListener('click', this.handleTaskClick.bind(this));
  }

  handleTaskClick(event) {
    // Check if a task checkbox was clicked
    const checkbox = event.target.closest('.task-checkbox');
    if (!checkbox) return;
    
    const taskItem = checkbox.closest('.task-item');
    if (!taskItem) return;
    
    // Only celebrate if the task is being completed (not uncompleted)
    if (!taskItem.classList.contains('completed')) {
      // Add completion class for the animation
      taskItem.classList.add('completed');
      
      // Create completion effect
      this.createCompletionEffect(taskItem);
      
      // Create confetti effect
      this.createConfetti(taskItem);
      
      // Create sound effect (if enabled)
      this.playCompletionSound();
    }
  }

  createCompletionEffect(taskItem) {
    // Create the completion pulse effect
    const effectElement = document.createElement('div');
    effectElement.className = 'task-completion-effect';
    taskItem.appendChild(effectElement);
    
    // Remove the effect element after animation completes
    setTimeout(() => {
      if (effectElement.parentNode) {
        effectElement.parentNode.removeChild(effectElement);
      }
    }, 800);
  }

  createConfetti(taskItem) {
    const rect = taskItem.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create multiple confetti pieces
    const colors = [
      'var(--primary-color)',
      'var(--secondary-color)',
      'var(--accent-color)',
      '#4CC9F0',
      '#F72585'
    ];
    
    const shapes = ['square', 'circle', 'triangle'];
    
    // Create confetti container if it doesn't exist
    let confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) {
      confettiContainer = document.createElement('div');
      confettiContainer.id = 'confetti-container';
      confettiContainer.style.position = 'fixed';
      confettiContainer.style.top = '0';
      confettiContainer.style.left = '0';
      confettiContainer.style.width = '100%';
      confettiContainer.style.height = '100%';
      confettiContainer.style.pointerEvents = 'none';
      confettiContainer.style.zIndex = '9999';
      document.body.appendChild(confettiContainer);
    }
    
    // Create 20 confetti pieces
    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div');
      confetti.className = `confetti ${shapes[Math.floor(Math.random() * shapes.length)]}`;
      
      // Randomize appearance
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${centerX}px`;
      confetti.style.top = `${centerY}px`;
      confetti.style.position = 'absolute';
      confetti.style.transform = 'translate(-50%, -50%)';
      
      // Add to container
      confettiContainer.appendChild(confetti);
      
      // Animate with custom styles
      const angle = Math.random() * Math.PI * 2;
      const velocity = 2 + Math.random() * 4;
      const size = Math.floor(Math.random() * 6) + 5;
      const distance = 50 + Math.random() * 60;
      
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      
      // Use Web Animation API for better performance
      confetti.animate([
        { 
          transform: 'translate(-50%, -50%) scale(0)',
          opacity: 1
        },
        {
          transform: `translate(
            calc(-50% + ${Math.cos(angle) * distance}px), 
            calc(-50% + ${Math.sin(angle) * distance}px)
          ) scale(1) rotate(${Math.random() * 360}deg)`,
          opacity: 0
        }
      ], {
        duration: 800 + Math.random() * 400,
        easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
      });
      
      // Remove confetti after animation
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 1200);
    }
    
    // Remove the container if empty
    setTimeout(() => {
      if (confettiContainer && confettiContainer.childElementCount === 0) {
        document.body.removeChild(confettiContainer);
      }
    }, 2000);
  }

  playCompletionSound() {
    // Check if sounds are enabled in user preferences
    const soundsEnabled = localStorage.getItem('bento-sounds-enabled') !== 'false';
    
    if (soundsEnabled) {
      // Create audio element
      const audio = new Audio();
      audio.volume = 0.3;
      
      // Randomly choose between different completion sounds
      const sounds = [
        'data:audio/mp3;base64,SUQzAwAAAABDRlRSVAAAAAIAAABUUEUxAAAAEgAAAFRoZSBTb3VuZCBEZXNpZ25lcgAA',
        'data:audio/mp3;base64,SUQzAwAAAABDRlRSVAAAAAIAAABUUEUxAAAAEgAAAFRoZSBTb3VuZCBEZXNpZ25lcgAA'
      ];
      
      audio.src = sounds[Math.floor(Math.random() * sounds.length)];
      audio.play().catch(err => {
        // Silently fail - browser might block autoplay
        console.log('Sound playback was prevented by the browser');
      });
    }
  }
}

// Initialize the celebration effects when document is ready
document.addEventListener('DOMContentLoaded', () => {
  new TaskCompletionCelebration();
}); 