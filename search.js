function doSearch() {

  let text = document.getElementById("searchBox").value;

  let sectionMatch = text.match(/\((\d+)\)/);
  let urlMatch = text.match(/URL\s*(\d+)-(\d+)/i);

  if (!sectionMatch) {
    alert("No section");
    return;
  }

  let sectionNum = parseInt(sectionMatch[1]);

  let start = 1;
  let end = 999;

  if (urlMatch) {
    start = parseInt(urlMatch[1]);
    end = parseInt(urlMatch[2]);
  }

  let section = SOURCES[sectionNum];

  let results = document.getElementById("results");
  results.innerHTML = "";

  if (!section) {
    results.innerHTML = "Section not found";
    return;
  }

  for (let i = start - 1; i < end; i++) {

    if (!section.urls[i]) continue;

    let card = document.createElement("div");

    card.className =
      "bg-gray-800 p-3 rounded border border-gray-600";

    card.innerHTML = `
      <a href="${section.urls[i].link}"
         target="_blank"
         class="text-blue-400 hover:underline">

        ${i + 1}. ${section.urls[i].title}

      </a>
    `;

    results.appendChild(card);
  }

}