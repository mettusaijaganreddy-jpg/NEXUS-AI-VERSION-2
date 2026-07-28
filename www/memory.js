// =====================================
// NEXUS 2.0
// memory.js
// Memory V3
// =====================================

// =====================================
// Long-Term Memory
// =====================================

let nexusMemory = JSON.parse(

    localStorage.getItem("nexus_memory_v3")

) || {

    facts:{},

    projects:[],

    notes:[]

};

// =====================================
// Save Memory
// =====================================

function saveMemory(){

    localStorage.setItem(

        "nexus_memory_v3",

        JSON.stringify(nexusMemory)

    );

}

// =====================================
// Remember Fact
// =====================================

function rememberFact(key,value){

    nexusMemory.facts[key]=value;

    saveMemory();

}

// =====================================
// Recall Fact
// =====================================

function recallFact(key){

    return nexusMemory.facts[key];

}

// =====================================
// Add Project
// =====================================

function addProject(project){

    if(!nexusMemory.projects.includes(project)){

        nexusMemory.projects.push(project);

        saveMemory();

    }

}

// =====================================
// Add Note
// =====================================

function addNote(note){

    nexusMemory.notes.push(note);

    saveMemory();

}

// =====================================
// Build Memory Prompt
// =====================================

function buildMemoryPrompt(){

    let prompt="User Memory\n\n";

    for(const key in nexusMemory.facts){

        prompt+=`${key}: ${nexusMemory.facts[key]}\n`;

    }

    if(nexusMemory.projects.length){

        prompt+="\nProjects\n";

        nexusMemory.projects.forEach(project=>{

            prompt+="- "+project+"\n";

        });

    }

    if(nexusMemory.notes.length){

        prompt+="\nNotes\n";

        nexusMemory.notes.forEach(note=>{

            prompt+="- "+note+"\n";

        });

    }

    return prompt;

}

// =====================================
// Learn From Messages
// =====================================

function learnFromMessage(text){

    const lower=text.toLowerCase();

    // Name

    if(lower.includes("my name is")){

        const name=text.substring(

            lower.indexOf("my name is")+10

        ).trim();

        rememberFact("name",name);

    }

    // Favorite Color

    if(lower.includes("my favorite color is")){

        const color=text.substring(

            lower.indexOf("my favorite color is")+21

        ).trim();

        rememberFact("favoriteColor",color);

    }

    // Favorite Animal

    if(lower.includes("my favorite animal is")){

        const animal=text.substring(

            lower.indexOf("my favorite animal is")+22

        ).trim();

        rememberFact("favoriteAnimal",animal);

    }

    // Favorite Game

    if(lower.includes("my favorite game is")){

        const game=text.substring(

            lower.indexOf("my favorite game is")+20

        ).trim();

        rememberFact("favoriteGame",game);

    }

}

// =====================================
// Save Conversation History
// =====================================

function saveHistory(history){

    localStorage.setItem(

        "nexus_history",

        JSON.stringify(history.slice(1))

    );

}

// =====================================
// Load Conversation History
// =====================================

function loadHistory(history){

    const old=localStorage.getItem(

        "nexus_history"

    );

    if(!old) return;

    history.push(...JSON.parse(old));

}

// =====================================
// Clear Chat
// =====================================

function clearHistory(history){

    history.splice(1);

    localStorage.removeItem("nexus_history");

}