fetch("./user.json")
    .then(response => response.json())
    .then(data => {
        document.getElementById("username").textContent = data.username;
    })
    .catch(error => {
        console.error("Failed to load username:", error);
    });