// ==========================================
// URL INDEX
// ==========================================

const urlIndex = {
    "chat": "https://wolfstudios.ca/chat.html",
    "browser": "https://wolfstudios.ca/browser.html",
    "archon": "https://wolfstudios.ca/archon-learn.html",
    "media": "https://wolfstudios.ca/media.html",
    "ancient": "https://wolfstudios.ca/project-ancient.html",
    "library": "https://wolfstudios.ca/library/librarian.html"
};

// ==========================================
// ELEMENTS
// ==========================================

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const results = document.getElementById("results");

// ==========================================
// LEVENSHTEIN DISTANCE
// ==========================================

function levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

// ==========================================
// SIMILARITY
// ==========================================

function similarity(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();

    if (a === b) {
        return 1;
    }

    const distance = levenshtein(a, b);
    return 1 - (distance / Math.max(a.length, b.length));
}

// ==========================================
// SCORE AN ENTRY
// ==========================================

function scoreEntry(query, name, url) {
    query = query.toLowerCase().trim();
    name = name.toLowerCase();
    const queryWords = query.split(/\s+/);
    let score = 0;

    for (const word of queryWords) {

        // Exact name match
        if (name === word) {
            score += 100;
        }

        // Name contains search word
        if (name.includes(word)) {
            score += 60;
        }

        // URL contains search word
        if (url.toLowerCase().includes(word)) {
            score += 40;
        }

        // Fuzzy matching against the name
        const similarityScore = similarity(word, name);

        score += similarityScore * 50;
        
        // Also compare against individual name words
        const nameWords = name.split(/[\s._-]+/);

        for (const nameWord of nameWords) {
            const fuzzy = similarity(word, nameWord);

            if (fuzzy > 0.5) {
                score += fuzzy * 75;
            }
        }
    }

    // Bonus when all query words appear somewhere
    const allWordsMatch = queryWords.every(word => name.includes(word) || url.toLowerCase().includes(word));

    if (allWordsMatch) { score += 100; }
    return score;
}


// ==========================================
// SEARCH
// ==========================================

function search(query) {

    query = query.trim();

    if (!query) {
        results.innerHTML = "";
        return;
    }

    const scoredResults = [];

    for (const [name, url] of Object.entries(urlIndex)) {
        const score = scoreEntry(query, name, url);
        scoredResults.push({ name, url, score});
    }

    // Highest score first
    scoredResults.sort((a, b) => b.score - a.score);
    displayResults(scoredResults);
}

// ==========================================
// DISPLAY RESULTS
// ==========================================

function displayResults(items) {

    results.innerHTML = "";
    // Only show reasonably relevant results
    const filtered = items.filter(item => item.score > 20);
    if (filtered.length === 0) {
        results.innerHTML = `
            <div class="no-results">
                No matching websites found.
            </div>
        `;
        return;
    }

    // Limit results
    filtered.slice(0, 10).forEach(item => {
        const element = document.createElement("div");
        element.className = "result";

        element.innerHTML = `
            <div class="result-name">${escapeHTML(item.name)}</div>
            <div class="result-url">${escapeHTML(item.url)}</div>
            <div class="result-score">Match score: ${item.score.toFixed(1)}</div>

            <div class="result-buttons">
                <button onclick="copyURL('${escapeAttribute(item.url)}', this)">Copy URL</button>
                <button class="go-button"onclick="window.location.href='${escapeAttribute(item.url)}'">Go to</button>
            </div>
        `;
        results.appendChild(element);
    });
}


// ==========================================
// COPY URL
// ==========================================

const copy = document.getElementById("copyBtn");

async function copyURL(url, button) {
    try {
        await navigator.clipboard.writeText(url);
        button.textContent = "Copied!";
        setTimeout(() => {
            button.textContent = "Copy URL";
        }, 1500);

    } catch (error) {
        console.error(error);
        button.textContent = "Failed!";
        setTimeout(() => {
            button.textContent = "Copy URL";
        }, 1500);
    }
}

// ==========================================
// BASIC HTML SAFETY
// ==========================================

function escapeHTML(text) {

    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function escapeAttribute(text) {
    return text
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'");
}

// ==========================================
// EVENTS
// ==========================================

searchButton.addEventListener("click", () => {
    search(searchInput.value);
});

searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        search(searchInput.value);
    }
});

searchInput.addEventListener("input", () => {
    search(searchInput.value);
});
