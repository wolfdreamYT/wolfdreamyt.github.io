const posts = [
  {
    title: "3D Piano Visualizer",
    date: "2026-01-01",
    content: "We are working on a 3D piano video..."
  },
  {
    title: "Minecraft?",
    date: "2026-??-??",
    content: "WolfStudios may be working on a minecraft project...Come back soon?"
  }
];

const postContainer = document.getElementById("posts");

posts.forEach(post => {
  const div = document.createElement("div");
  div.className = "post";
  div.innerHTML = `
    <div class="post-title">${post.title}</div>
    <div class="post-date">${post.date}</div>
    <p>${post.content}</p>
  `;
  postContainer.appendChild(div);
});
