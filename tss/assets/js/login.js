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

let isLoggedIn = false; // default so people MUST sign in with secret key
let currentUser = null; // because no user is currently a "user"
