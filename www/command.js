// ======================================
// NEXUS 2.0
// commands.js
// ======================================

function runCommand(message){

    message = message.toLowerCase().trim();

    // Help
    if(message === "help"){

        addMessage("Nexus",
        "Commands:<br>• help<br>• clear chat<br>• open voice mode<br>• about",
        "ai");

        return true;
    }

    if(message === "who created you"){

    addMessage(
        "Nexus",
        "I was created by Sai Jagan Reddy.",
        "ai"
    );

    return true;
}

    // About
    if(message === "about"){

        addMessage("Nexus",
        "I am Nexus 2.0, created by Sunny.",
        "ai");

        return true;
    }

    // Clear Chat
    if(message === "clear chat"){

        chat.innerHTML =
        "<p><b>Nexus:</b> Chat cleared.</p>";

        return true;
    }

    // Voice Mode (placeholder)
    if(message === "open voice mode"){

        addMessage("Nexus",
        "Voice mode is coming soon!",
        "ai");

        return true;
    }

    return false;

}