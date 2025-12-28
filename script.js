  function showPage(pageId) {
    document.querySelectorAll('.doc-page').forEach(page => {
      page.classList.remove('active');
    });
    const selected = document.getElementById(pageId);
    if (selected) selected.classList.add('active');
  }

  const loadingFeatures = [
    "Initializing components...",
    "Loading documents...",
    "Fetching timeline data...",
    "Preparing user interface...",
    "Almost ready..."
  ];

  const newFeatures = [
    "Welcome",
    "Wolf Studios presents",
    "One Century",
    "Get ready..."
  ];

  const loadingText = document.getElementById('loading-text');
  const loadingFeatureDiv = document.getElementById('loading-feature');
  const carouselDiv = document.getElementById('carousel');
  const loadingScreen = document.getElementById('loading-screen');
  const mainContainer = document.getElementById('container');
  const bgMusic = document.getElementById('bg-music');

  function playMusic() {
    bgMusic.play().catch(() => {
      document.body.addEventListener('click', () => bgMusic.play(), { once: true });
    });
  }

  async function runLoadingSequence() {
    playMusic();
    for (const feature of loadingFeatures) {
      loadingFeatureDiv.textContent = feature;
      const delay = Math.random() * 3000; 
      await new Promise(res => setTimeout(res, delay));
    }
    loadingFeatureDiv.textContent = "Loading complete!";
    await new Promise(res => setTimeout(res, 1000)); 

    startCarousel();
  }

  function startCarousel() {
  let index = 0;
  loadingText.textContent = "Welcome, Mr. O'Donohue";
  loadingFeatureDiv.textContent = "";

  function showNextFeature() {
    carouselDiv.classList.remove('visible');
    setTimeout(() => {
      if (index >= newFeatures.length) {
        finishLoading();
        return;
      }
      carouselDiv.textContent = newFeatures[index];
      carouselDiv.classList.add('visible');
      index++;
      setTimeout(showNextFeature, 3000);
    }, 800); 
  }

  showNextFeature();
}

  function finishLoading() {
    bgMusic.pause();
    loadingScreen.style.display = 'none';
    mainContainer.style.display = 'flex'; 
  }

  window.onload = () => {
    runLoadingSequence();
  };
  
function showPage(pageId) {
    const pages = document.querySelectorAll('.doc-page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    const selected = document.getElementById(pageId);
    if (selected) {
        selected.classList.add('active');
    }
}

function showPage(pageId) {
    document.querySelectorAll('.doc-page').forEach(page => {
        page.classList.remove('active');
    });

    const selected = document.getElementById(pageId);
    if (selected) selected.classList.add('active');

    document.querySelectorAll('.time-step').forEach(step => {
        step.classList.remove('active');
    });

    const timeStep = document.getElementById('time-' + pageId);
    if (timeStep) timeStep.classList.add('active');
}

function showPage(pageId) {
    document.querySelectorAll('.doc-page').forEach(page => {
        page.classList.remove('active');
    });

    const selected = document.getElementById(pageId);
    if (selected) selected.classList.add('active');

    document.querySelectorAll('.time-step').forEach(step => {
        step.classList.remove('active');
    });

    const timeStep = document.getElementById('time-' + pageId);
    if (timeStep) {
        timeStep.classList.add('active');
        timeStep.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
}
