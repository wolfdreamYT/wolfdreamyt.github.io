const discord = document.getElementById("discordRedirect");
const youtube = document.getElementById("youtubeRedirect");
const chat = document.getElementById("chatRedirect");

discord.addEventListener("click", () => {
    window.location.href = "https://discord.wolfstudios.ca";
});

youtube.addEventListener("click", () => {
    window.location.href = "https://youtube.wolfstudios.ca";
});

chat.addEventListener("click", () => {
    window.location.href = "chat.html";
});