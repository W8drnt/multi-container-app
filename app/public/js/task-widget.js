/**
 * Tasks Widget - Handles all task management functionality
 * Follows the factory pattern for widget creation
 */

class TasksWidget {
  constructor(container) {
    this.container = container;
    this.tasks = JSON.parse(localStorage.getItem('bento-tasks')) || [];
    this.widgetId = 'tasks-widget';
    this.initialize();
  }

  initialize() {
    // Create the widget with factory pattern
    const taskWidget = this.createWidget();
    this.container.appendChild(taskWidget);
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Render initial tasks
    this.renderTasks();
  }

  createWidget() {
    return createWidgetElement({
      id: this.widgetId,
      title: 'Task Manager',
      emoji: '✅',
      content: this.generateContent(),
      cols: 4,
      rows: 2,
      theme: 'primary'
    });
  }

  generateContent() {
    return `
      <div class="tasks-container">
        <div class="tasks-list" id="tasksList"></div>
        <div class="task-add">
          <input type="text" class="task-input" id="newTaskInput" placeholder="Add a new task...">
          <button class="task-add-btn" id="addTaskBtn">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="task-stats">
          <span id="completedTasksCount">0</span> of <span id="totalTasksCount">0</span> tasks completed
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Add task button
    const addTaskBtn = document.getElementById('addTaskBtn');
    const newTaskInput = document.getElementById('newTaskInput');
    
    if (addTaskBtn && newTaskInput) {
      addTaskBtn.addEventListener('click', () => this.addTask());
      
      newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addTask();
        }
      });
    }

    // Delegate events for task interactions (complete, delete)
    const tasksList = document.getElementById('tasksList');
    if (tasksList) {
      tasksList.addEventListener('click', (e) => {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;
        
        const taskId = parseInt(taskItem.dataset.id);
        
        // Handle checkbox click
        if (e.target.classList.contains('task-checkbox') || e.target.closest('.task-checkbox')) {
          this.toggleTaskCompletion(taskId);
        }
        
        // Handle delete button click
        if (e.target.classList.contains('task-delete-btn') || e.target.closest('.task-delete-btn')) {
          this.deleteTask(taskId);
        }
      });
    }
  }

  addTask() {
    const newTaskInput = document.getElementById('newTaskInput');
    const taskText = newTaskInput.value.trim();
    
    if (taskText) {
      const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      this.tasks.push(newTask);
      this.saveTasks();
      this.renderTasks();
      
      // Reset input
      newTaskInput.value = '';
      
      // Add animation for the new task
      setTimeout(() => {
        const taskElement = document.querySelector(`[data-id="${newTask.id}"]`);
        if (taskElement) {
          taskElement.classList.add('task-item-enter');
        }
      }, 10);
    }
  }

  toggleTaskCompletion(taskId) {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
      // Toggle completion status
      this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
      
      // If completed, add completion timestamp
      if (this.tasks[taskIndex].completed) {
        this.tasks[taskIndex].completedAt = new Date().toISOString();
      } else {
        delete this.tasks[taskIndex].completedAt;
      }
      
      this.saveTasks();
      this.renderTasks();
    }
  }

  deleteTask(taskId) {
    // Add fade-out animation
    const taskElement = document.querySelector(`[data-id="${taskId}"]`);
    if (taskElement) {
      taskElement.classList.add('task-item-exit');
      
      // Remove after animation completes
      setTimeout(() => {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.renderTasks();
      }, 300);
    }
  }

  renderTasks() {
    const tasksList = document.getElementById('tasksList');
    if (!tasksList) return;
    
    // Sort tasks: incomplete first, then by creation date (newest first)
    const sortedTasks = [...this.tasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    tasksList.innerHTML = '';
    
    if (sortedTasks.length === 0) {
      tasksList.innerHTML = `
        <div class="empty-tasks">
          <div class="empty-tasks-icon">📝</div>
          <div class="empty-tasks-text">No tasks yet. Add one to get started!</div>
        </div>
      `;
    } else {
      sortedTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.dataset.id = task.id;
        
        taskElement.innerHTML = `
          <div class="task-checkbox">
            ${task.completed ? '<i class="fas fa-check"></i>' : ''}
          </div>
          <div class="task-content">${task.text}</div>
          <button class="task-delete-btn">
            <i class="fas fa-times"></i>
          </button>
        `;
        
        tasksList.appendChild(taskElement);
      });
    }
    
    // Update stats
    this.updateTaskStats();
  }

  updateTaskStats() {
    const completedTasksCount = document.getElementById('completedTasksCount');
    const totalTasksCount = document.getElementById('totalTasksCount');
    
    if (completedTasksCount && totalTasksCount) {
      const completed = this.tasks.filter(task => task.completed).length;
      completedTasksCount.textContent = completed;
      totalTasksCount.textContent = this.tasks.length;
    }
  }

  saveTasks() {
    localStorage.setItem('bento-tasks', JSON.stringify(this.tasks));
  }
}

// Initialize the tasks widget when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  const bentoContainer = document.getElementById('bentoContainer');
  if (bentoContainer) {
    new TasksWidget(bentoContainer);
  }
}); 