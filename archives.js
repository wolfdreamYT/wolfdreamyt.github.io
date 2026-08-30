let allSongs = [];

const listEl = document.getElementById('archive-list');
const loadingEl = document.getElementById('loading-state');
const emptyEl = document.getElementById('empty-state');
const searchEl = document.getElementById('search');
const sortEl = document.getElementById('sort-by');
const genreEl = document.getElementById('filter-genre');
const countEl = document.getElementById('entry-count');
const spanEl = document.getElementById('entry-span');

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function renderEntries(songs) {
  if (songs.length === 0) {
    listEl.innerHTML = '';
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;

  listEl.innerHTML = songs.map((song, i) => {
    const condClass = `condition-${(song.condition || '').replace(/\s+/g, '')}`;
    const hasTracklist = Array.isArray(song.tracklist) && song.tracklist.length > 0;

    const coverInner = song.cover
      ? `<img src="${escapeHtml(song.cover)}" alt="${escapeHtml(song.album || song.title)} cover" loading="lazy" onerror="this.parentElement.classList.add('cover-fallback'); this.remove();">`
      : '';

    const tracklistHtml = hasTracklist ? `
      <div class="tracklist" id="tracklist-${i}" hidden>
        <ol>
          ${song.tracklist.map(t => `
            <li>
              <span class="track-num">${escapeHtml(t.number)}</span>
              <span class="track-title">${escapeHtml(t.title)}</span>
              <span class="track-duration">${escapeHtml(t.duration || '')}</span>
            </li>
          `).join('')}
        </ol>
      </div>
    ` : '';

    return `
      <article class="entry ${hasTracklist ? 'is-expandable' : ''}" data-index="${i}">
        <div class="entry-row" ${hasTracklist ? `role="button" tabindex="0" aria-expanded="false" aria-controls="tracklist-${i}"` : ''}>
          <div class="entry-swatch" style="background:${escapeHtml(song.coverColor || '#8a3324')}">${coverInner}</div>
          <div class="entry-main">
            <h2 class="entry-title">${escapeHtml(song.title)}</h2>
            <p class="entry-artist">${escapeHtml(song.artist)}${song.album ? ` - ${escapeHtml(song.album)}` : ''}</p>
            <div class="entry-meta">
              ${song.year ? `<span>${escapeHtml(song.year)}</span>` : ''}
              ${song.genre ? `<span>${escapeHtml(song.genre)}</span>` : ''}
              ${song.duration ? `<span>${escapeHtml(song.duration)}</span>` : ''}
            </div>
            ${song.notes ? `<p class="entry-notes">${escapeHtml(song.notes)}</p>` : ''}
          </div>
          <div class="entry-side">
            ${song.catalogNumber ? `<span class="catalog-num">${escapeHtml(song.catalogNumber)}</span>` : ''}
            ${song.condition ? `<span class="condition-tag ${condClass}">${escapeHtml(song.condition)}</span>` : ''}
            ${hasTracklist ? `<span class="expand-arrow">▾</span>` : ''}
          </div>
        </div>
        ${tracklistHtml}
      </article>
    `;
  }).join('');

  // Wire up expand/collapse
  listEl.querySelectorAll('.entry.is-expandable .entry-row').forEach(row => {
    const toggle = () => {
      const article = row.closest('.entry');
      const panel = article.querySelector('.tracklist');
      const isOpen = !panel.hidden;
      panel.hidden = isOpen;
      row.setAttribute('aria-expanded', String(!isOpen));
      article.classList.toggle('is-open', !isOpen);
    };
    row.addEventListener('click', toggle);
    row.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}

function populateGenres(songs) {
  const genres = [...new Set(songs.map(s => s.genre).filter(Boolean))].sort();
  genreEl.innerHTML = '<option value="">All Genres</option>' +
    genres.map(g => `<option value="${escapeHtml(g)}">${escapeHtml(g)}</option>`).join('');
}

function updateMeta(songs) {
  countEl.textContent = `${songs.length} ${songs.length === 1 ? 'entry' : 'entries'}`;
  const years = songs.map(s => s.year).filter(Boolean);
  if (years.length) {
    const min = Math.min(...years), max = Math.max(...years);
    spanEl.textContent = min === max ? `${min}` : `${min}–${max}`;
  } else {
    spanEl.textContent = '';
  }
}

function applyFilters() {
  const query = searchEl.value.trim().toLowerCase();
  const genre = genreEl.value;
  const sortBy = sortEl.value;

  let filtered = allSongs.filter(song => {
    const matchesQuery = !query || [song.title, song.artist, song.album]
      .some(field => (field || '').toLowerCase().includes(query));
    const matchesGenre = !genre || song.genre === genre;
    return matchesQuery && matchesGenre;
  });

  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'title': return (a.title || '').localeCompare(b.title || '');
      case 'year-desc': return (b.year || 0) - (a.year || 0);
      case 'year-asc': return (a.year || 0) - (b.year || 0);
      case 'genre': return (a.genre || '').localeCompare(b.genre || '');
      case 'artist':
      default: return (a.artist || '').localeCompare(b.artist || '');
    }
  });

  renderEntries(filtered);
}

async function loadArchive() {
  try {
    const res = await fetch('songs.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allSongs = await res.json();
    loadingEl.hidden = true;
    populateGenres(allSongs);
    updateMeta(allSongs);
    applyFilters();
  } catch (err) {
    loadingEl.textContent = `Couldn't load the ledger (${err.message}). Check that songs.json sits next to index.html.`;
  }
}

searchEl.addEventListener('input', applyFilters);
sortEl.addEventListener('change', applyFilters);
genreEl.addEventListener('change', applyFilters);

loadArchive();
