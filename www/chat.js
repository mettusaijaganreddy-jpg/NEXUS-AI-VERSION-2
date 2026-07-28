// =====================================
// NEXUS 2.0
// chat.js
// =====================================

const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// =====================================
// SEND MESSAGE
// =====================================

async function sendMessage(){

    const message = messageInput.value.trim();

    if(message=="") return;

    // User Message
    chatBox.innerHTML += `
    <div class="userMessage">
        ${message}
    </div>
    `;

    // Save user message
    if(typeof saveMessage==="function"){

        saveMessage("user", message);

    }

    messageInput.value="";

    chatBox.scrollTop = chatBox.scrollHeight;

    // Thinking
    chatBox.innerHTML += `
    <div class="nexusMessage" id="thinking">
        Thinking...
    </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

    // Ask Ollama
    const reply = await askOllama(message);

    // Remove Thinking
    const thinking =
    document.getElementById("thinking");

    if(thinking){

        thinking.remove();

    }

    // AI Bubble
    const bubble =
    document.createElement("div");

    bubble.className =
    "nexusMessage";

    chatBox.appendChild(bubble);

    // Typing Animation
    await typeMessage(bubble, reply);

    // Save AI reply
    if(typeof saveMessage==="function"){

        saveMessage("assistant", reply);

    }

    // Save current chat
    if(typeof saveCurrentChat==="function"){

        saveCurrentChat();

    }

    chatBox.scrollTop =
    chatBox.scrollHeight;

    // Voice Reply
    if(
    localStorage.getItem("autoSpeak")!="false" &&
    window.voiceMode &&
    typeof window.speakText==="function"
){

    window.speakText(reply);

}

}

// =====================================
// NEW CHAT
// =====================================

function newChat(){

    if(typeof startNewChat==="function"){

        startNewChat();

    }

    chatBox.innerHTML="";

    messageInput.value="";

    if(typeof showChat==="function"){

        showChat();

    }

    console.log("🆕 New Chat Started");

}

// =====================================
// LOAD CHAT
// =====================================

function loadChat(messages){

    chatBox.innerHTML="";

    messages.forEach(msg=>{

        const bubble =
        document.createElement("div");

        bubble.className =
        msg.role==="user"
        ? "userMessage"
        : "nexusMessage";

        bubble.innerHTML =
        msg.content;

        chatBox.appendChild(bubble);

    });

    chatBox.scrollTop =
    chatBox.scrollHeight;

}

// =====================================
// BUTTON EVENTS
// =====================================

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown",function(e){

    if(e.key==="Enter"){

        sendMessage();

    }

});

// =====================================
// AI TYPING ANIMATION
// =====================================

async function typeMessage(element,text,speed=20){

    for(let i=0;i<=text.length;i++){

        element.innerHTML=
        text.substring(0,i)+
        `<span class="cursor">|</span>`;

        chatBox.scrollTop=
        chatBox.scrollHeight;

        await new Promise(resolve=>
            setTimeout(resolve,speed)
        );

    }

    element.innerHTML=text;

}