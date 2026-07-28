// =====================================
// NEXUS 2.0
// history.js
// Part 1
// =====================================

// All saved chats
let savedChats =
JSON.parse(localStorage.getItem("nexus_history")) || [];

// Current chat
let currentChat = {

    id: Date.now(),

    title: "New Chat",

    messages: [],

    created: new Date().toLocaleString()

};

// =====================================
// SAVE MESSAGE
// =====================================

function saveMessage(role, text){

    currentChat.messages.push({

        role: role,

        content: text

    });

}

// =====================================
// SAVE CHAT
// =====================================

function saveCurrentChat(){

    // Don't save empty chats
    const userMessages =
    currentChat.messages.filter(m=>m.role==="user");

    if(userMessages.length===0){

        return;

    }

    // First user message becomes title
    currentChat.title =
    userMessages[0].content.substring(0,30);

    // Replace old copy if already exists
    const index =
    savedChats.findIndex(c=>c.id===currentChat.id);

    if(index>=0){

        savedChats[index]=currentChat;

    }
    else{

        savedChats.unshift(currentChat);

    }

    localStorage.setItem(

        "nexus_history",

        JSON.stringify(savedChats)

    );

}

// =====================================
// START NEW CHAT
// =====================================

function startNewChat(){

    // Save previous chat first
    saveCurrentChat();

    currentChat={

        id:Date.now(),

        title:"New Chat",

        messages:[],

        created:new Date().toLocaleString()

    };

}

// =====================================
// NEXUS 2.0
// history.js
// Part 2
// =====================================

// =====================================
// SHOW HISTORY PAGE
// =====================================

function showHistory(){

    const historyPage =
    document.getElementById("historyPage");

    const historyList =
    document.getElementById("historyList");

    historyPage.style.display = "block";

    loadHistoryList();

}

// =====================================
// CLOSE HISTORY
// =====================================

function closeHistory(){

    document.getElementById("historyPage").style.display =
    "none";

}

// =====================================
// LOAD HISTORY LIST
// =====================================

function loadHistoryList(){

    const historyList =
    document.getElementById("historyList");

    historyList.innerHTML = "";

    savedChats =
    JSON.parse(
        localStorage.getItem("nexus_history")
    ) || [];

    if(savedChats.length===0){

        historyList.innerHTML =
        `
        <div class="historyEmpty">

            No chats yet.

        </div>
        `;

        return;

    }

    savedChats.forEach(chat=>{

        const item =
        document.createElement("div");

        item.className="historyItem";

        item.innerHTML=`

<div class="historyTop">

    <h3>${chat.title}</h3>

    <div>

        <button
        class="pinBtn">

        📌

        </button>

        <button
        class="renameBtn">

        ✏

        </button>

        <button
        class="deleteChatBtn">

        🗑

        </button>

    </div>

</div>

<small>${chat.created}</small>

`;

        item.onclick=()=>{

            openChat(chat.id);

        };

        item.querySelector(".deleteChatBtn").onclick=(e)=>{

    e.stopPropagation();

    deleteChat(chat.id);

};

item.querySelector(".renameBtn").onclick=(e)=>{

    e.stopPropagation();

    renameChat(chat.id);

};

item.querySelector(".pinBtn").onclick=(e)=>{

    e.stopPropagation();

    pinChat(chat.id);

};

        item
        .querySelector(".deleteChatBtn")
        .onclick=(e)=>{

            e.stopPropagation();

            deleteChat(chat.id);

        };

        historyList.appendChild(item);

    });

}

// =====================================
// OPEN CHAT
// =====================================

function openChat(chatId){

    const chat =
    savedChats.find(c => c.id === chatId);

    console.log(chat);

    if(!chat) return;

    currentChat = chat;

    // Clear current chat
    chatBox.innerHTML = "";

    // Rebuild chat
    chat.messages.forEach(message => {

        const bubble =
        document.createElement("div");

        if(message.role === "user"){

            bubble.className = "userMessage";

        }
        else{

            bubble.className = "nexusMessage";

        }

        bubble.innerHTML = message.content;

        chatBox.appendChild(bubble);

    });

    chatBox.scrollTop = chatBox.scrollHeight;

    // Close History
    closeHistory();

    // Open Chat Page
    if(typeof showChat === "function"){

        showChat();

    }
    else{

        document.getElementById("chatPage").style.display =
        "block";

    }

}

// =====================================
// DELETE CHAT
// =====================================

function deleteChat(chatId){

    if(!confirm("Delete this chat?")){

        return;

    }

    savedChats = savedChats.filter(chat => chat.id !== chatId);

    localStorage.setItem(

        "nexus_history",

        JSON.stringify(savedChats)

    );

    loadHistoryList();

}



// =====================================
// DELETE ALL HISTORY
// =====================================

function deleteAllHistory(){

    if(!confirm("Delete ALL chat history?")){

        return;

    }

    savedChats = [];

    localStorage.removeItem("nexus_history");

    loadHistoryList();

}

// =====================================
// SEARCH HISTORY
// =====================================

function searchHistory(){

    const search =
    document
    .getElementById("historySearch")
    .value
    .toLowerCase();

    const items =
    document.querySelectorAll(".historyItem");

    items.forEach(item=>{

        if(item.innerText.toLowerCase().includes(search)){

            item.style.display="block";

        }
        else{

            item.style.display="none";

        }

    });

}



// =====================================
// RENAME CHAT
// =====================================

function renameChat(chatId){

    const chat =
    savedChats.find(c=>c.id===chatId);

    if(!chat) return;

    const name =
    prompt("New chat name:",chat.title);

    if(!name) return;

    chat.title=name;

    localStorage.setItem(

        "nexus_history",

        JSON.stringify(savedChats)

    );

    loadHistoryList();

}



// =====================================
// PIN CHAT
// =====================================

function pinChat(chatId){

    const index =
    savedChats.findIndex(c=>c.id===chatId);

    if(index==-1) return;

    const chat =
    savedChats.splice(index,1)[0];

    savedChats.unshift(chat);

    localStorage.setItem(

        "nexus_history",

        JSON.stringify(savedChats)

    );

    loadHistoryList();

}

