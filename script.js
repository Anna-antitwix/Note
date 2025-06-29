if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  updateIconsForTheme();
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateIconsForTheme();
}

function updateIconsForTheme() {
  const isDark = document.body.classList.contains('dark');
  const iconMap = {
    "світло.jpg": "темно.jpg",
    "редагувати.png": "редагувати-темно.png",
    "колір.png": "колір-темно.png",
    "архів.png": "архів-темно.png",
    "видалити.png": "видалити-темно.png",
    "скачати.png": "скачати-темно.png",
    "закріпити.png": "закріпити-темно.png"
  };

  document.querySelectorAll('.sidebar img').forEach(img => {
    const src = img.getAttribute('src').split('/').pop();
    if (isDark && iconMap[src]) {
      img.setAttribute('src', iconMap[src]);
    } else {
      const original = Object.keys(iconMap).find(key => iconMap[key] === src);
      if (original) img.setAttribute('src', original);
    }
  });
}

// --- Керування нотатками ---

// Завантажуємо нотатки з localStorage
function loadNotes() {
  const savedNotes = JSON.parse(localStorage.getItem('notes') );
  savedNotes.forEach(note => createNote(note.title, note.content, note.color));
}

// Зберігаємо нотатки в localStorage
function saveNotes() {
  const notes = [];
  document.querySelectorAll('.note').forEach(noteEl => {
    const title = noteEl.querySelector('.note-title').textContent;
    const content = Array.from(noteEl.querySelectorAll('li')).map(li => li.textContent);
    const color = noteEl.style.backgroundColor;
    notes.push({ title, content, color });
  });
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Створюємо нотатку (в DOM)
function createNote(title, content, color) {
  const notesContainer = document.getElementById('notesContainer');
  const note = document.createElement('div');
  note.className = 'note';
  note.style.backgroundColor = color;
  note.style.color = '#000';

  // Розбиваємо контент по рядках, якщо він переданий як текст
  if (typeof content === 'string') {
    content = content.split('\n').filter(line => line.trim() !== '');
  }

  note.innerHTML = `
    <div class="note-title" style="font-weight:bold; margin-bottom:4px;">${title}</div>
    <ul>${content.map(c => `<li>${c}</li>`).join('')}</ul>
  `;
  notesContainer.appendChild(note);
}

// Додаємо нову нотатку через кнопку
document.getElementById('addNoteBtn').addEventListener('click', () => {
  const titleInput = document.getElementById('noteTitle');
  const contentInput = document.getElementById('noteContent');
  const colorInput = document.getElementById('noteColor');

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const color = colorInput.value;

  if (!title && !content) {
    alert('Введіть заголовок або текст нотатки');
    return;
  }

  createNote(title, content, color);

  // Очищаємо поля
  titleInput.value = '';
  contentInput.value = '';
  colorInput.value = '#ffffff';

  saveNotes();
});

// Пошук нотаток у реальному часі
document.getElementById('searchInput').addEventListener('input', function (e) {
  const query = e.target.value.toLowerCase();
  const notes = document.querySelectorAll('.note');

  notes.forEach(note => {
    const title = note.querySelector('.note-title')?.textContent.toLowerCase();
    const content = note.textContent.toLowerCase();
    const matches = title.includes(query) || content.includes(query);
    note.style.display = matches ? 'flex' : 'none';
  });
});

// При завантаженні сторінки — відновлюємо нотатки
window.addEventListener('load', () => {
  loadNotes();
});