// i know, i know. the pasword system sucks and anyone who can use inspect element
// without having a heart attack will know how to find the password. i dont care,
// the code is mostly open source and this is just for the fun and a bit for
// "i want to feel somewhat secure" even though it does absolute shit against $1 hackers.

// main constants, dont worry about these (unless you get errors pointing to these liens)
const loginPanel = document.getElementById("loginPanel"); // connector for the login panel
const openLoginBtn = document.getElementById("openLoginBtn"); // connector for the open login ui button
const loginClose = document.getElementById("loginClose"); // connector for the close login ui button
const loginBtn = document.getElementById("loginBtn"); // connector for the login button
const loginStatus = document.getElementById("loginStatus"); // connector for the login status

//connector for the pro model selector (since it requires login.....mostly)
const proModelSelect = document.getElementById("proModelSelect");

let isLoggedIn = true; // default so people MUST sign in with secret key
let currentUser = null; // because no user is currently a "user"

loginBtn.addEventListener("click", () => { // same as the other ones above, on click event

    const username = document.getElementById("usernameInput").value; // this connects the html element to the JS below
    const password = document.getElementById("passwordInput").value; // this does the same, but for the password field

    if ( username === "test" && password === "test") { // horrible security, i know
        isLoggedIn = true; // this tells the code to allow the user who just spent 20 bucks to use decent models
        currentUser = username; // this barely matters, just is useful for the "hello, username" on greet
        loginStatus.textContent = "Logged in"; // this is to know if your logged in
        loginStatus.style.color = "#22ff00ff"; // for funzies
        proModelSelect.disabled = false; // this is to disable "pro" features
    } else { // this is for if your not authorized and/or you used the wrong credentials
        isLoggedIn = false; // this ensures you dont gain access just by any password
        currentUser = null; // default, like before
        loginStatus.textContent = "Invalid username or password."; // to ensure even the colorblind knows
        loginStatus.style.color = "#ff6b6b"; // this is for people who can see and interpret color
        proModelSelect.disabled = true; // like before, this disables the pro model select feature
    }
});