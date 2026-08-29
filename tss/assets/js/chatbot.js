// this is to import the conversational dataset
let conversationDataset = [];

// main constants, like usual
let engine = null;
let searchHistory = [];

// these you dont edit
// you also cannot change them in other codes. why you may ask?
// because they are the variables that connect the HTML to the JS
const chatArea = document.getElementById("chatArea"); // chat area, for messages
const searchInput = document.getElementById("searchInput"); // search bar, for user input
const searchBtn = document.getElementById("searchBtn"); // search button, for performing searches

// these 2 are kind of weird, because they do have a function in the json loading/handling,
// but they were also originally made for users loading their json files through the UI,
// which i did not think would end well later so i decided to remove the html element,
// but realized that i could not remove the actual logic without messing up the entire code.
const jsonFileInput = document.getElementById("jsonFileInput"); // json file, for connecting json file input
const fileLabel = document.getElementById("fileLabel"); // file label, for connecting the file label

// this loads the conversation model from the /convo-models/ folder
async function loadConversationModel(file) {
    try {
        const module = await import(file);

        conversationDataset = module.default;

        if (!Array.isArray(conversationDataset)) {
            throw new Error("Conversation model must export an array.");
        }

        console.log("Loaded conversation model:", file);
        console.log("Conversation entries:", conversationDataset.length);

    } catch (error) {
        console.error("Failed to load conversation model:", error);
        conversationDataset = [];
    }
}

// here we will detect conversational messages because we want a chatbot,
// not just a wikipedia bot lol
function detectConversation(query) {
    const normalized = query // this cleans the user query
        .toLowerCase() // makes everything lowercase
        .replace(/[!?.,]/g, "") // removes symbols that dont matter
        .trim(); // removing whitespace

    // matching system for response
    let bestMatch = null; // best match
    let bestScore = 0; // best score

    for (const entry of conversationDataset) { // entry is an object from the conversation dataset
        for (const input of entry.inputs) { // input is one possible user phrase

            // this is to detect exact matching
            if (normalized === input) { // if it detects and exact match, 
                return {
                    isConversation: true, // then is conversation is true
                    score: 1, // we add 1 so we use this
                    responses: entry.responses 
                };
            }

            // Contains phrase
            // if the entry contains a phrase that the user enters
            if (normalized.includes(input)) { // so if it includes it somewhere
                const score = input.length / normalized.length;
                // we do input length / normalized length
                if (score > bestScore) { // if the score is higher than best score
                    bestScore = score; // best score = score
                    bestMatch = entry; // best match = entry
                }
            }
        }
    }
    // this returns the response for the user
    return {
        isConversation: bestScore >= 0.35, // if the score is higher than 35%
        score: bestScore, // the best score
        responses: bestMatch?.responses || [] // this is the actual response
    };
}

// make a random response using the proper set
function randomResponse(responses) {
    // this makes it so if you type the same general input, WAI
    // will use a different response to remove the classic
    // repeating the same phrase over and over again
    return responses[Math.floor(Math.random() * responses.length)];
}

// this is a function to load the PreSplit Dataset. Do NOT confuse it with the search-engine.js
async function loadSearchEngine() {
    try {
        const response = await fetch("/free-models/wai2e-3k-mini.json"); // this loads the wai2e-mini model

       // if (!response.ok) { 
       //     throw new Error(`Failed to load wai2e-mini.json (${response.status})`);
       // }

       // i commented this part out because it kept throwing an error even when everything was
       // perfectly fine. I verified it adding a json array and testing in browser, and worked.

        const data = await response.json(); // this is to define that "data" is the json arrays

        if (!data.sentences || !Array.isArray(data.sentences)) {
            throw new Error("JSON must contain a 'sentences' array");
            // this is if your json file is corrupted or it isnt sentenized
        }

        engine = new EnhancedSearchEngine(data); // this is to create a new "conversation" (does shit for now)

        searchInput.disabled = false; // this is to disable user input (if you were testing on public grounds)
        searchBtn.disabled = false; // same as above, but disabled the search button instead

        chatArea.innerHTML = ""; // this is to initialize the area where innerHTML is added

        // all this does is just tells you how much sentences were found/loaded.
        // really only for if your in developement or a tester who needs to know
        // how many sentences are loaded (and/or if the new sentences are not loading)

        // i commented it out for now since it isnt that nessesary unless your indev

        // addAssistantMessage(`Loaded ${data.sentences.length} documents. Ready to search!`);

        searchInput.focus(); // this makes the search element active, so you can start typing away

    // this is for if the system catches an error during loadup
    } catch (error) { 
        console.error(error); // this sends the error to console

        // this tells you that there was an error loading the file/presplit
        addAssistantMessage(`Error loading search database: ${error.message}`);
    }
} // end function loadSearchEngine

// i should probably put this above, but i am afraid that
// there may be another constant that uses this, so
// i would keep this here if i were you.
const modelSelect = document.getElementById("FreeModelSelect");
const proModelSelect = document.getElementById("ProModelSelect");

// this loads the model you selected
async function loadModel(file) {
    try {
        searchBtn.disabled = true; // this temporarily disables search system
        searchInput.disabled = true; // same as above, but for button

        addAssistantMessage(`Loading ${file}...`); // this tells you it is loading the model you chose

        const response = await fetch(file); // this is to initialize the response

        // this is for if your file did not load (so !response = something did not work)
        if (!response.ok) {
            throw new Error(`Could not load ${file}`); // this throws the error in your face for you to see
        }

        const data = await response.json(); // this initializes the data it receives from the model

        // this tells you if your "sentences": part in the json model is corrupt
        if (!data.sentences || !Array.isArray(data.sentences)) {
            throw new Error("JSON must contain a 'sentences' array"); // this means json is corrupted/empty
        }

        // Create a new search engine using this model
        engine = new EnhancedSearchEngine(data);

        searchInput.disabled = false; // once everything is finished, disable this
        searchBtn.disabled = false; // just like above, disable this once your clear

        // this tells you that it loaded the new data/model and how many documents it loaded
        // also mostly for developement, so i commented it out for now

       // addAssistantMessage(`Loaded ${data.sentences.length.toLocaleString()} documents`);

        searchInput.focus(); // this makes the search element active, so you can start typing away

    // this is to catch the errors during the loadModel(file)
    } catch (error) {
        console.error(error); // this sends the errors to console

        // we disable this to ensure user/tester cannot use the
        // model and get a bunch of errors and confusing stuff
        searchBtn.disabled = true; // this disables search button
        searchInput.disabled = true; // this disables search input

        // this tells the user that the model failed, with the error message
        addAssistantMessage(`Failed to load model: ${error.message}`);
    }
} // end function loadModel(file)

// this Handles the JSON files and the data inside them
jsonFileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];  // pick the first file the user picks/default
    if (!file) return; // if no file is loaded, then just return blank

    try {
        const text = await file.text(); // this is to initialize and get the file text
        const data = JSON.parse(text); // this initializes the parser for the JSON

        // if the data structure, like usual, is corrupted or not properly formatted,
        // then give the user a nice juicy error message to tell them they screwed up.
        if (!data.sentences || !Array.isArray(data.sentences)) {
            throw new Error("JSON must contain a 'sentences' array");
        }
        // please ensure the data is formatted like this:
        //  {
        //      "sentences": [
        //          {
        //              "id": 1,
        //              "text": "Euler's number e is approximately 2.718281828459045, fundamental to exponential functions.",
        //              "keywords": ["euler", "number", "e", "mathematics", "exponential"],
        //              "dates_times": null,
        //              "topic_genre": "mathematics"
        //          }, (only add a , if there is more sentence arrays below)
        //      ]
        //  }

        // this is for loading the engine for the new model you selected
        // its pretty useful if you want to refresh the "brain"
        engine = new EnhancedSearchEngine(data);
        
        // this enables the searching features after everything is setup properly
        searchInput.disabled = false; // this enables the search bar
        searchBtn.disabled = false; // this enables the search button
        jsonFileInput.disabled = true; // this enables the JSON input (fossilized feature)
        fileLabel.style.opacity = "0.6"; // this is to edit opacity for a element that is gone
        fileLabel.style.cursor = "not-allowed"; // also for the depracated element, but for curser

        // please note that the json file system is now mostly for handling the
        // sentenized data, not for uploading the json from your end.
        // that is a feature i tested around with but realized that it wasnt that simple,
        // so i removed the html element but not the js function because i think
        // that function also has something to do with the actual handling of the json.

        chatArea.innerHTML = ""; // this initializes the chat area for the new model
        addAssistantMessage(`Loaded ${data.sentences.length} documents. Ready to search!`);
        // this tells the dev/user that the model loaded properly and your good to go
        searchInput.focus(); // this makes it so you can start typing without needing 
                            // to select the search bar manually.

    // this is for if your having a bad day, and god is just not on your side today.
    } catch (error) {
        addAssistantMessage(`Error loading file: ${error.message}`); // error loading the model file
    } // it will tell you in the error message, so kind of useful.
});

// this part handles the search mechanism
searchBtn.addEventListener("click", performSearch); // this is to perform the search when
                                                    // you press the search button
searchInput.addEventListener("keypress", (e) => { // this is to watch for a keypress (abc123enter/etc)
    if (e.key === "Enter" && !searchBtn.disabled) { // this is to look for the enter key being pressed
        performSearch(); // this is the function to perform the search with the user input
    }
});

// this is the function to perform the search, as called above
function performSearch() {
    const query = searchInput.value.trim(); // this is to take the user input and append it to query variable
    if (!query || !engine) return; // this is for if the user did not input anything

    addUserMessage(query); // this adds the user message to query variable
    searchHistory.push({ query, timestamp: new Date() }); // this adds the query to the history

    // Detect conversational intent first
    const conversation = detectConversation(query);

    // if the conversation is a conversation
    if (conversation.isConversation) {
        const response = randomResponse(conversation.responses);

        setTimeout(() => {
            addAssistantMessage(response);
        }, 100);

        searchInput.value = "";
        searchInput.focus();

        return;
    }

    // this part shows the "loading" state, mostly for fun
    const loadingId = `loading-${Date.now()}`; // initialize the ID for the message
    // this adds the loading message in HTML directly, sending it to chatArea through innerHTML
    chatArea.innerHTML += `<div id="${loadingId}" class="message assistant">
        <div class="message-bubble loading">Searching... </div>
    </div>`;
    chatArea.scrollTop = chatArea.scrollHeight; // this automatically scrolls you to the bottom
                                                // of the chat area so you can see the response

    // this performs the search, but has a small delay due to the UI
    setTimeout(() => {
        try {
            const results = engine.search(query, 50, 5, 0.2, false);
            
            // this removes the loading message indicator
            const loadingEl = document.getElementById(loadingId);
            if (loadingEl) loadingEl.remove();

            // this is for if the results from the search engine return null
            if (results.length === 0) { // result lengths are usually counted as sentence IDs/numbers
                addAssistantMessage("No results found.");
            } else { // if results return successfully
                displaySearchResults(results); // this displays the search results in html
            }
        
        // this is for if you get any errors from the search engine
        } catch (error) {
            const loadingEl = document.getElementById(loadingId);
            if (loadingEl) loadingEl.remove();
            addAssistantMessage(`Error during search: ${error.message}`);
        }
    }, 100); // this is a timeout since you want to atleast see the "searching"

    searchInput.value = ""; // this sets the search input empty since you already sent the message
    searchInput.focus(); // this makes it so you can start typing right away again
}

// this is to display any search results found during the search
// it will display it in HTML using the innerHTML and will go to
// the chatArea
function displaySearchResults(results) {
    let resultHtml = `<div class="message assistant">
        <div class="message-bubble">
            Found ${results.length} result${results.length !== 1 ? 's' : ''}:
        </div>
    </div>`;

    // thiss adds the results to the chatArea
    chatArea.innerHTML += resultHtml;

    // this is the "card" for the search response
    // i cannot comment on this since it is an innerHTML,
    // but for most of you looking at this you can probably understand
    // what it does and how to modify it a bit
    results.forEach((result, index) => {
        const resultCard = `
            <div class="message assistant">
                <div class="message-bubble">
                    <div class="result-card">
                        <div>
                            <span class="score">#${index + 1} Score: ${result.score}</span>
                            ${result.topic ? `<span class="topic">${escapeHtml(result.topic)}</span>` : ""}
                        </div>
                        <div class="text">${escapeHtml(result.text)}</div>
                        <div class="similarity">
                            Semantic similarity: ${(result.semantic_similarity * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>
        `;
        chatArea.innerHTML += resultCard; // this adds the resultCard to chatArea through innerHTML
    });

    // this tells the user that it temporarily saved some context (practically useless)
    const contextNote = `<div class="message assistant">
        <div class="message-bubble" style="font-size: 12px; opacity: 0.8;">
            <strong>Context saved:</strong> Top results stored for follow-up queries
        </div>
    </div>`;
    chatArea.innerHTML += contextNote; // this is where it actually gets added

    // this automatically scrolls you to the bottom of the chat area to see all messages
    chatArea.scrollTop = chatArea.scrollHeight;
}

// this adds the user message bubble on the right side of the chat area
function addUserMessage(text) {
    const messageDiv = document.createElement("div"); // initialize messageDiv
    messageDiv.className = "message user"; // append a class name to the div
    messageDiv.innerHTML = `<div class="message-bubble">${escapeHtml(text)}</div>`; // this is the user message
    chatArea.appendChild(messageDiv); // this adds the message to the chat area
    chatArea.scrollTop = chatArea.scrollHeight; // this scrolls you to the bottom of the chat area
}

// this is to add the assistant/response message to chat area
function addAssistantMessage(text) {
    const messageDiv = document.createElement("div"); // initialize messageDiv
    messageDiv.className = "message assistant"; // append a class name to the div
    messageDiv.innerHTML = `<div class="message-bubble">${text}</div>`; // this is the response part
    chatArea.appendChild(messageDiv); // this adds the response to the chat area
    chatArea.scrollTop = chatArea.scrollHeight; // this scrolls you to the bottom of the chat area
}

// this is to somewhat format the text into something
// that doesnt corrupt the rest of the data
function escapeHtml(text) {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    };

    return String(text ?? "").replace(/[&<>"']/g, (m) => map[m]);
}

let username = "user";

// this is to detect if you changed the model
modelSelect.addEventListener("change", async () => {

    const selectedOption = modelSelect.options[modelSelect.selectedIndex];

    const selectedModel = selectedOption.value;
    const conversationModel = selectedOption.dataset.conversation;

    console.log("Search model:", selectedModel);
    console.log("Conversation model:", conversationModel);

    await loadConversationModel(conversationModel);
    await loadModel(selectedModel);
});

// this is for the pro models, which arent really that special.
// you do have to sign in, but its so easy to hack it that its more
// of a please than a you must.

// also, the pro models are not like gpt or claude. they are merely for
// more advanced work and things that may require something else rather than
// a dataset of factual information (e.g. math, thinking, coding, etc)

// this is to detect when a model is being loaded,
// so it can keep up
window.addEventListener("load", () => {
    addAssistantMessage("Welcome, ", username); // this is my attempt at the welcoming message
    loadSearchEngine(); // this loads the search engine model
    loadModel(modelSelect.value); // this loads the model you selected
    console.log(modelSelect.value);
});