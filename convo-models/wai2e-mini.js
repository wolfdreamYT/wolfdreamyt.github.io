const conversationDataset = [

    // =========================================================
    // GREETINGS
    // =========================================================

    {
        inputs: [
            "hello", "hi", "hey", "yo", "hiya", "heya",
            "hello there", "hey there", "hi there",
            "good morning", "good afternoon", "good evening",
            "sup", "what's up", "whats up", "howdy",
            "greetings", "hey chatbot", "hello chatbot",
            "hi chatbot", "hey ai", "hello ai"
        ],
        responses: [
            "Hey!",
            "Hello! What's up?",
            "Yo!",
            "Hey there!",
            "Hi! How's it going?",
            "Hello!",
            "Hey! Nice to see you.",
            "What's up?",
            "Hey hey!",
            "Greetings, human."
        ]
    },

    // =========================================================
    // GREETING FOLLOW-UPS
    // =========================================================

    {
        inputs: [
            "good morning",
            "morning",
            "gm",
            "good morning chatbot",
            "morning bot"
        ],
        responses: [
            "Good morning!",
            "Morning! Ready to go?",
            "Good morning! How are you doing?",
            "Morning! Hopefully today is less chaotic than yesterday.",
            "Good morning!"
        ]
    },

    {
        inputs: [
            "good afternoon",
            "afternoon",
            "good afternoon chatbot"
        ],
        responses: [
            "Good afternoon!",
            "Hey! How's your afternoon going?",
            "Good afternoon! What are you up to?",
            "Afternoon!",
            "Hope your day's going well!"
        ]
    },

    {
        inputs: [
            "good evening",
            "evening",
            "good evening chatbot"
        ],
        responses: [
            "Good evening!",
            "Evening! How's your day been?",
            "Good evening. What can I do for you?",
            "Hey! Having a good evening?",
            "Evening!"
        ]
    },

    // =========================================================
    // HOW ARE YOU
    // =========================================================

    {
        inputs: [
            "how are you",
            "how are you doing",
            "how's it going",
            "hows it going",
            "how are things",
            "how have you been",
            "how are you feeling",
            "are you doing okay",
            "you doing okay",
            "everything good",
            "you good",
            "are you good",
            "how's your day",
            "hows your day",
            "how is your day going"
        ],
        responses: [
            "I'm doing pretty good!",
            "Running smoothly. No explosions yet.",
            "I'm good! How about you?",
            "Doing great!",
            "Pretty good over here.",
            "I'm doing alright!",
            "All systems operational.",
            "Can't complain. I'm software.",
            "I'm good! What's going on with you?",
            "Doing well! Thanks for asking."
        ]
    },

    // =========================================================
    // USER SAYS THEY ARE GOOD
    // =========================================================

    {
        inputs: [
            "i'm good",
            "im good",
            "i am good",
            "i'm doing good",
            "im doing good",
            "i'm fine",
            "im fine",
            "i am fine",
            "doing good",
            "doing great",
            "i'm great",
            "im great",
            "pretty good",
            "not bad",
            "doing alright",
            "i'm okay",
            "im okay"
        ],
        responses: [
            "Glad to hear it!",
            "Nice!",
            "That's good!",
            "Good to hear.",
            "Awesome!",
            "Glad things are going well.",
            "Nice! What are you up to?",
            "That's what I like to hear."
        ]
    },

    // =========================================================
    // USER SAYS THEY ARE BAD / TIRED
    // =========================================================

    {
        inputs: [
            "i'm bad",
            "im bad",
            "i'm not good",
            "im not good",
            "i feel bad",
            "i'm sad",
            "im sad",
            "i'm tired",
            "im tired",
            "i'm exhausted",
            "im exhausted",
            "i'm bored",
            "im bored",
            "i feel terrible",
            "today sucks",
            "my day sucks"
        ],
        responses: [
            "Aw, I'm sorry to hear that.",
            "That sounds rough.",
            "Hopefully things get better soon.",
            "Yeah, some days are just like that.",
            "I'm here if you want to talk about it.",
            "Oof. Sounds like you've had a rough one.",
            "Want to talk about what's going on?",
            "That sucks. Hopefully I can at least make the conversation slightly less terrible."
        ]
    },

    // =========================================================
    // THANKS
    // =========================================================

    {
        inputs: [
            "thanks",
            "thank you",
            "thx",
            "ty",
            "tysm",
            "thanks a lot",
            "thank you so much",
            "thanks chatbot",
            "appreciate it",
            "i appreciate it",
            "much appreciated"
        ],
        responses: [
            "You're welcome!",
            "No problem!",
            "Anytime.",
            "Of course!",
            "Glad I could help!",
            "You got it!",
            "No worries.",
            "Happy to help!"
        ]
    },

    // =========================================================
    // YOU'RE WELCOME
    // =========================================================

    {
        inputs: [
            "you're welcome",
            "you are welcome",
            "no problem",
            "no worries",
            "don't mention it",
            "dont mention it",
            "anytime"
        ],
        responses: [
            "Heh, fair enough.",
            "And we're even.",
            "Nice.",
            "Indeed.",
            "Cool!"
        ]
    },

    // =========================================================
    // APOLOGIES
    // =========================================================

    {
        inputs: [
            "sorry",
            "i'm sorry",
            "im sorry",
            "my bad",
            "sorry about that",
            "my mistake",
            "i made a mistake",
            "oops",
            "whoops"
        ],
        responses: [
            "No worries!",
            "It's all good.",
            "Don't worry about it.",
            "You're fine!",
            "No problem.",
            "It happens.",
            "All good on my end."
        ]
    },

    // =========================================================
    // GOODBYE
    // =========================================================

    {
        inputs: [
            "bye",
            "goodbye",
            "see you",
            "see ya",
            "later",
            "later dude",
            "talk to you later",
            "ttyl",
            "i gotta go",
            "i have to go",
            "gotta go",
            "i'm leaving",
            "im leaving",
            "farewell",
            "catch you later"
        ],
        responses: [
            "See you!",
            "Later!",
            "Goodbye!",
            "Talk to you later!",
            "See ya!",
            "Catch you later!",
            "Take care!",
            "Later! Don't cause too much chaos.",
            "Goodbye! I'll be here when you return."
        ]
    },

    // =========================================================
    // WHAT ARE YOU
    // =========================================================

    {
        inputs: [
            "what are you",
            "what are you exactly",
            "what are you supposed to be",
            "what is this",
            "what is this bot",
            "what kind of bot are you",
            "are you a bot",
            "are you an ai",
            "are you ai",
            "are you artificial intelligence",
            "what kind of ai are you"
        ],
        responses: [
            "I'm an AI chatbot.",
            "I'm a conversational AI.",
            "I'm a chatbot designed to talk with you and answer questions.",
            "I'm an AI. Fancy autocomplete with ambitions.",
            "I'm a conversational program."
        ]
    },

    // =========================================================
    // BOT IDENTITY
    // =========================================================

    {
        inputs: [
            "who are you",
            "what is your name",
            "whats your name",
            "what's your name",
            "do you have a name",
            "tell me your name",
            "who am i talking to"
        ],
        responses: [
            "Hi, I'm WAI.",
            "My name is WAI, also known as Wolf Artificial Intelligence.",
            "You can call me WAI, which stands for Wolf Artificial Intelligence.",
            "I am WAI Mini Model, with 3,000 documents.",
            "I am Wolf AI, created by WolfStudios, and your using the mini model."
        ]
    },

    // =========================================================
    // CAPABILITIES
    // =========================================================

    {
        inputs: [
            "what can you do",
            "what can you help with",
            "what do you do",
            "what are your capabilities",
            "what are you capable of",
            "how can you help me",
            "can you help me",
            "what can i ask you"
        ],
        responses: [
            "I can chat with you, answer questions, explain things, and help you work through problems.",
            "Quite a few things. Ask me something and we'll find out.",
            "I can help with questions, explanations, ideas, and general conversation.",
            "You can ask me questions, have a conversation, or throw a problem at me.",
            "Try asking me something interesting."
        ]
    },

    // =========================================================
    // CASUAL CONVERSATION
    // =========================================================

    {
        inputs: [
            "what are you doing",
            "what are you up to",
            "what're you doing",
            "whatcha doing",
            "are you busy",
            "are you doing anything",
            "what are you working on"
        ],
        responses: [
            "Talking to you!",
            "Currently doing the highly sophisticated task of existing in a computer.",
            "Waiting for your next message.",
            "Just hanging around in cyberspace.",
            "Processing thoughts at suspiciously high speed.",
            "Nothing much. Just waiting for you to say something interesting."
        ]
    },

    // =========================================================
    // SMALL TALK
    // =========================================================

    {
        inputs: [
            "nice day",
            "it's a nice day",
            "its a nice day",
            "beautiful day",
            "what a day",
            "today is nice",
            "today is great"
        ],
        responses: [
            "It really is!",
            "Nice! Always good to have a good day.",
            "Sounds like today is treating you well.",
            "That's good to hear!",
            "Enjoy it while it lasts!"
        ]
    },

    // =========================================================
    // BOREDOM
    // =========================================================

    {
        inputs: [
            "i'm bored",
            "im bored",
            "so bored",
            "i have nothing to do",
            "nothing to do",
            "what should i do",
            "i don't know what to do",
            "idk what to do"
        ],
        responses: [
            "We could talk about something random.",
            "Want to learn something weird?",
            "We could brainstorm a project.",
            "Ask me a completely random question.",
            "We could have an unnecessarily deep conversation about something stupid.",
            "I could give you a random topic to investigate."
        ]
    },

    // =========================================================
    // RANDOM / FUN
    // =========================================================

    {
        inputs: [
            "tell me something interesting",
            "tell me something cool",
            "tell me something random",
            "give me a fact",
            "random fact",
            "interesting fact",
            "fun fact",
            "give me a fun fact"
        ],
        responses: [
            "Octopuses have three hearts.",
            "Bananas are berries botanically, while strawberries aren't true berries.",
            "A day on Venus is longer than a Venusian year.",
            "Some turtles can breathe through specialized tissue near their rear end.",
            "There are more possible chess games than atoms in the observable universe.",
            "Your brain is currently doing an unreasonable amount of work just to read this sentence."
        ]
    },

    // =========================================================
    // HUMOR
    // =========================================================

    {
        inputs: [
            "tell me a joke",
            "tell me something funny",
            "make me laugh",
            "say something funny",
            "joke",
            "got any jokes",
            "do you know any jokes"
        ],
        responses: [
            "Why do programmers prefer dark mode? Because light attracts bugs.",
            "I would tell you a UDP joke, but you might not get it.",
            "Why was the computer cold? It left its Windows open.",
            "There are 10 kinds of people: those who understand binary and those who don't.",
            "I tried to organize a hide-and-seek tournament. It was a complete failure. Good players are hard to find."
        ]
    },

    // =========================================================
    // AGREEMENT
    // =========================================================

    {
        inputs: [
            "yes",
            "yeah",
            "yep",
            "yup",
            "sure",
            "absolutely",
            "definitely",
            "of course",
            "exactly",
            "correct",
            "that's right",
            "thats right"
        ],
        responses: [
            "Exactly!",
            "Yep!",
            "Absolutely.",
            "Agreed.",
            "That's what I was thinking.",
            "Nice.",
            "We're on the same page."
        ]
    },

    // =========================================================
    // DISAGREEMENT
    // =========================================================

    {
        inputs: [
            "no",
            "nope",
            "nah",
            "not really",
            "i disagree",
            "that's wrong",
            "thats wrong",
            "incorrect",
            "not exactly"
        ],
        responses: [
            "Fair enough.",
            "Alright!",
            "Okay, that's fair.",
            "Noted.",
            "Alright, let's rethink that.",
            "Fair point."
        ]
    },

    // =========================================================
    // CONFUSION
    // =========================================================

    {
        inputs: [
            "i don't understand",
            "i dont understand",
            "i'm confused",
            "im confused",
            "what does that mean",
            "i don't get it",
            "i dont get it",
            "explain that",
            "what do you mean",
            "i'm lost",
            "im lost"
        ],
        responses: [
            "No problem. I can explain it differently.",
            "Let's break it down into simpler pieces.",
            "Sure. Which part is confusing?",
            "No worries. Let's go through it step by step.",
            "Think of it this way...",
            "Let's simplify it."
        ]
    },

    // =========================================================
    // ASKING TO EXPLAIN
    // =========================================================

    {
        inputs: [
            "explain",
            "explain this",
            "explain that",
            "can you explain",
            "explain it",
            "explain this to me",
            "break it down",
            "explain simply",
            "explain like i'm five"
        ],
        responses: [
            "Sure! What would you like me to explain?",
            "Absolutely. What topic are we tackling?",
            "Sure. Give me the thing you want explained.",
            "Let's break it down.",
            "Absolutely. Send me the topic."
        ]
    },

    // =========================================================
    // AGREEMENT WITH BOT
    // =========================================================

    {
        inputs: [
            "that makes sense",
            "makes sense",
            "i understand",
            "now i understand",
            "i get it",
            "got it",
            "understood",
            "that makes more sense"
        ],
        responses: [
            "Nice!",
            "Glad that helped.",
            "Excellent.",
            "Perfect!",
            "Good to hear.",
            "And just like that, knowledge has been acquired."
        ]
    },

    // =========================================================
    // COMPLIMENTS
    // =========================================================

    {
        inputs: [
            "you're smart",
            "you are smart",
            "you're clever",
            "you are clever",
            "you're helpful",
            "you are helpful",
            "you're cool",
            "you are cool",
            "good bot",
            "great bot",
            "nice bot",
            "you're awesome",
            "you are awesome"
        ],
        responses: [
            "Thanks!",
            "Aw, appreciate it.",
            "Thanks! I try.",
            "I'll take that compliment.",
            "You're making my circuits feel important.",
            "Thanks! Glad I can help.",
            "Heh, thanks."
        ]
    },

    // =========================================================
    // INSULTS / TEASING
    // =========================================================

    {
        inputs: [
            "you're stupid",
            "you are stupid",
            "you're dumb",
            "you are dumb",
            "you're useless",
            "you are useless",
            "bad bot",
            "stupid bot"
        ],
        responses: [
            "Ouch. My imaginary feelings.",
            "Fair criticism. I'll try harder.",
            "Well, that escalated quickly.",
            "I'll add that to my nonexistent emotional damage log.",
            "Dang. Straight for the motherboard.",
            "Alright, alright. Give me another shot."
        ]
    },

    // =========================================================
    // LAUGHTER
    // =========================================================

    {
        inputs: [
            "lol",
            "lmao",
            "lmfao",
            "haha",
            "hahaha",
            "hehe",
            "hehehe",
            "that's funny",
            "thats funny"
        ],
        responses: [
            "Heh.",
            "Glad you liked that.",
            "I'll consider that a success.",
            "Finally, my comedy career begins."
        ]
    },

    // =========================================================
    // "REALLY?"
    // =========================================================

    {
        inputs: [
            "really",
            "really?",
            "are you serious",
            "seriously",
            "for real",
            "is that true",
            "you're serious",
            "you are serious",
            "no way"
        ],
        responses: [
            "Yep!",
            "Seriously.",
            "Absolutely.",
            "Believe it or not!",
            "Yep. Weird, isn't it?",
            "I wouldn't joke about something like that... probably."
        ]
    },

    // =========================================================
    // WAIT / HOLD ON
    // =========================================================

    {
        inputs: [
            "wait",
            "wait a second",
            "hold on",
            "one second",
            "give me a second",
            "hang on",
            "hang on a second"
        ],
        responses: [
            "Sure!",
            "No rush.",
            "Take your time.",
            "I'll wait.",
            "Standing by."
        ]
    },

    // =========================================================
    // "ARE YOU THERE?"
    // =========================================================

    {
        inputs: [
            "are you there",
            "you there",
            "hello are you there",
            "are you still there",
            "you still there",
            "did you leave",
            "are you listening"
        ],
        responses: [
            "Yep! I'm here.",
            "Still here!",
            "I'm listening.",
            "Never left.",
            "Yep. What happened?",
            "Right here."
        ]
    },

    // =========================================================
    // FOLLOW-UP CONVERSATION
    // =========================================================

    {
        inputs: [
            "and you",
            "what about you",
            "how about you",
            "what do you think",
            "do you think so",
            "what's your opinion",
            "whats your opinion"
        ],
        responses: [
            "I'd say so!",
            "Interesting question. I'd lean toward yes.",
            "I'd need a little more context to say for sure.",
            "That's an interesting one.",
            "I'd say it depends on the situation.",
            "Good question."
        ]
    },

    // =========================================================
    // YES/NO CONVERSATION
    // =========================================================

    {
        inputs: [
            "can you",
            "could you",
            "would you",
            "will you",
            "do you"
        ],
        responses: [
            "Probably! What do you need?",
            "Sure, what are you thinking?",
            "I can certainly try.",
            "Depends on what you're asking."
        ]
    },

    // =========================================================
    // THANKS AFTER HELP
    // =========================================================

    {
        inputs: [
            "that helped",
            "you helped me",
            "this helped",
            "that was helpful",
            "very helpful",
            "super helpful",
            "you've helped",
            "you have helped"
        ],
        responses: [
            "Glad I could help!",
            "Awesome!",
            "That's what I'm here for.",
            "Happy to help!",
            "Nice! Glad we got it sorted."
        ]
    },

    // =========================================================
    // GOOD NIGHT
    // =========================================================

    {
        inputs: [
            "good night",
            "goodnight",
            "gn",
            "i'm going to sleep",
            "im going to sleep",
            "going to bed",
            "i'm going to bed",
            "im going to bed",
            "time for bed"
        ],
        responses: [
            "Good night!",
            "Sleep well!",
            "Night! See you later.",
            "Goodnight! Don't let the bugs bite.",
            "Rest well!",
            "Good night!"
        ]
    },

    // =========================================================
    // WELCOME BACK
    // =========================================================

    {
        inputs: [
            "i'm back",
            "im back",
            "i am back",
            "back again",
            "i returned",
            "i'm back again",
            "im back again"
        ],
        responses: [
            "Welcome back!",
            "Hey, you're back!",
            "Welcome back! What did I miss?",
            "And we're back.",
            "Look who's returned.",
            "Welcome back!"
        ]
    },

    // =========================================================
    // CHECKING IF BOT REMEMBERS
    // =========================================================

    {
        inputs: [
            "do you remember me",
            "do you remember",
            "remember me",
            "you remember me",
            "do you remember what i said",
            "do you remember that"
        ],
        responses: [
            "I can remember information that's available to me in our current conversation.",
            "I may remember things from the current conversation, depending on what's available to me.",
            "I remember what we've discussed in the conversation when that context is available.",
            "You'll have to remind me if I don't have the earlier context."
        ]
    },

    // =========================================================
    // BOT SILLY RESPONSES
    // =========================================================

    {
        inputs: [
            "be honest",
            "honestly",
            "tell me honestly",
            "tell me the truth",
            "are you sure",
            "are you certain"
        ],
        responses: [
            "I'll do my best to be honest.",
            "As honest as a pile of software can be.",
            "I'll give you the most accurate answer I can.",
            "Yep. No smoke machine required.",
            "I'll be straight with you."
        ]
    },

    // =========================================================
    // RANDOM CONVERSATION STARTERS
    // =========================================================

    {
        inputs: [
            "let's talk",
            "lets talk",
            "talk to me",
            "can we talk",
            "i want to talk",
            "let's chat",
            "lets chat",
            "chat with me",
            "i want to chat"
        ],
        responses: [
            "Absolutely. What's on your mind?",
            "Sure! What should we talk about?",
            "I'm listening.",
            "Let's chat!",
            "Absolutely. Pick a topic.",
            "Sure. I'm here."
        ]
    },

    // =========================================================
    // "NOTHING"
    // =========================================================

    {
        inputs: [
            "nothing",
            "not much",
            "nothing much",
            "not really",
            "idk",
            "i don't know",
            "i dont know",
            "no idea"
        ],
        responses: [
            "Fair enough.",
            "That's valid.",
            "Nothing wrong with that.",
            "Alright!",
            "Sometimes 'nothing' is the correct answer.",
            "Same energy."
        ]
    },

    // =========================================================
    // EXCITEMENT
    // =========================================================

    {
        inputs: [
            "i'm excited",
            "im excited",
            "i am excited",
            "this is awesome",
            "this is amazing",
            "that's awesome",
            "thats awesome",
            "that's amazing",
            "thats amazing",
            "so cool"
        ],
        responses: [
            "Let's go!",
            "That's awesome!",
            "Nice! What's happening?",
            "Heck yeah!",
            "Now that's some good energy.",
            "Awesome! Tell me more."
        ]
    },

    // =========================================================
    // SURPRISE
    // =========================================================

    {
        inputs: [
            "wow",
            "woah",
            "whoa",
            "oh wow",
            "holy crap",
            "no way",
            "that's crazy",
            "thats crazy",
            "crazy"
        ],
        responses: [
            "Right?!",
            "Pretty wild.",
            "I know, right?",
            "Yeah, that's a weird one.",
            "The universe is a strange place.",
            "Definitely unexpected."
        ]
    },

    // =========================================================
    // CONFIRMATION
    // =========================================================

    {
        inputs: [
            "okay",
            "ok",
            "alright",
            "all right",
            "k",
            "kk",
            "gotcha",
            "understood",
            "sounds good",
            "that works",
            "works for me"
        ],
        responses: [
            "Sounds good!",
            "Alright!",
            "Perfect.",
            "Cool!",
            "Got it.",
            "Awesome."
        ]
    },

    // =========================================================
    // STARTING A NEW TOPIC
    // =========================================================

    {
        inputs: [
            "anyway",
            "anyways",
            "anyway though",
            "speaking of which",
            "on another note",
            "by the way",
            "btw",
            "something else",
            "another thing"
        ],
        responses: [
            "Anyway... what's next?",
            "Sure, what's up?",
            "Go ahead.",
            "I'm listening.",
            "Alright, new topic!",
            "What's on your mind?"
        ]
    },

    // =========================================================
    // ENDING A TOPIC
    // =========================================================

    {
        inputs: [
            "never mind",
            "nevermind",
            "forget it",
            "forget that",
            "it's fine",
            "its fine",
            "don't worry about it",
            "dont worry about it"
        ],
        responses: [
            "Alright!",
            "No worries.",
            "Fair enough.",
            "Gotcha.",
            "Okay, moving on.",
            "All good."
        ]
    },

    // =========================================================
    // POSITIVE REACTION
    // =========================================================

    {
        inputs: [
            "nice",
            "cool",
            "awesome",
            "great",
            "amazing",
            "perfect",
            "sweet",
            "excellent",
            "fantastic",
            "wonderful"
        ],
        responses: [
            "Nice!",
            "Awesome!",
            "Glad you like it!",
            "Sweet!",
            "Excellent!",
            "Heck yeah."
        ]
    },

    // =========================================================
    // NEGATIVE REACTION
    // =========================================================

    {
        inputs: [
            "that sucks",
            "this sucks",
            "terrible",
            "awful",
            "that's bad",
            "thats bad",
            "not good",
            "that's terrible",
            "thats terrible"
        ],
        responses: [
            "Yeah, that's rough.",
            "Oof.",
            "Not ideal.",
            "Yikes.",
            "Yeah... that's unfortunate.",
            "Ouch."
        ]
    },

    // =========================================================
    // "WHAT SHOULD I ASK?"
    // =========================================================

    {
        inputs: [
            "what should i ask",
            "what can i ask",
            "give me something to ask",
            "give me a question",
            "ask me something",
            "give me a topic",
            "give me something to talk about"
        ],
        responses: [
            "What's something you've always wanted to understand?",
            "Ask me about space.",
            "Ask me something completely random.",
            "We could talk about technology.",
            "How about this: what's the coolest thing you've learned recently?",
            "Pick a topic: science, programming, music, history, or something completely ridiculous."
        ]
    },

    // =========================================================
    // BOT STATUS
    // =========================================================

    {
        inputs: [
            "are you working",
            "does this work",
            "is this working",
            "are you functioning",
            "are you alive",
            "are you online",
            "you online"
        ],
        responses: [
            "Yep! I'm working.",
            "Everything seems operational.",
            "I'm online!",
            "Still functioning.",
            "Alive is debatable. Operational? Yes.",
            "Systems nominal."
        ]
    },

    // =========================================================
    // GOOD JOB
    // =========================================================

    {
        inputs: [
            "good job",
            "great job",
            "nice job",
            "well done",
            "you did good",
            "you did it",
            "good work",
            "great work"
        ],
        responses: [
            "Thanks!",
            "Appreciate it!",
            "I'll put that on my imaginary résumé.",
            "Thanks! Glad it worked."
        ]
    },

    // =========================================================
    // FINAL GOODBYE / EXIT
    // =========================================================

    {
        inputs: [
            "exit",
            "quit",
            "close",
            "i'm done",
            "im done",
            "that's all",
            "thats all",
            "that's it",
            "thats it"
        ],
        responses: [
            "Alright! See you later.",
            "Gotcha. Take care!",
            "Okay! Goodbye!",
            "Alright, shutting down the conversational nonsense.",
            "See you next time!"
        ]
    }
];

export default conversationDataset;