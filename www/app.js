// =====================================
// NEXUS 2.0
// app.js
// =====================================

// =====================================
// LOGIN CHECK
// =====================================

const user = JSON.parse(localStorage.getItem("nexusUser"));

// =====================================
// STARTUP
// =====================================

console.log("Nexus 2.0 Starting...");
console.log("Nexus Sidebar Loaded");

window.onload = function(){

    console.log("Nexus Loaded Successfully.");

    const savedTheme=
localStorage.getItem("nexusTheme");

if(savedTheme){

    document.body.className=savedTheme;

}

    const authBtn = document.getElementById("authBtn");

if(authBtn){

    if(user){

        authBtn.innerHTML = "🚪 Logout";

        authBtn.onclick = logout;

    }
    else{

        authBtn.innerHTML = "🔑 Login";

        authBtn.onclick = function(){

            window.location.href = "login.html";

        };

    }

}

    // Show logged in username
    const usernameDisplay =
    document.getElementById("usernameDisplay");

    if(usernameDisplay && user){

        usernameDisplay.innerHTML =
        "👤 " + user.username;

    }

};

// =====================================
// PAGE SYSTEM
// =====================================

function hideAllPages(){

    const home =
    document.getElementById("homePage");

    const chat =
    document.getElementById("chatPage");

    const about =
    document.getElementById("aboutPage");

    const history =
    document.getElementById("historyPage");

    const settings =
    document.getElementById("settingsPage");

    if(home)
        home.style.display = "none";

    if(chat)
        chat.style.display = "none";

    if(about)
        about.style.display = "none";

    if(history)
        history.style.display = "none";

    if(settings)
        settings.style.display = "none";

    const profile =
document.getElementById("profileSettingsPage");

if(profile)
    profile.style.display = "none";

}

// =====================================
// HOME
// =====================================

function showHome(){

    hideAllPages();

    document.getElementById("homePage").style.display="block";

}

// =====================================
// CHAT
// =====================================

function showChat(){

    hideAllPages();

    document.getElementById("chatPage").style.display="block";

}

// =====================================
// ABOUT
// =====================================

function showAbout(){

    hideAllPages();

    document.getElementById("aboutPage").style.display="block";

}

function closeAbout(){

    showHome();

}

// =====================================
// SETTINGS
// =====================================

function showSettings(){

    hideAllPages();

    document.getElementById("settingsPage").style.display = "block";

}

function closeSettings(){

    document.getElementById("settingsPage").style.display = "none";

    document.getElementById("homePage").style.display = "block";

}

// =====================================
// PROFILE SETTINGS
// =====================================


// OPEN PROFILE SETTINGS
function showProfileSettings(){

    hideAllPages();

    document.getElementById("profileSettingsPage").style.display = "block";


    const user = JSON.parse(
        localStorage.getItem("nexusUser")
    );


    if(user){

        document.getElementById("profileUsername").value =
        user.username || "";


        document.getElementById("profileEmail").value =
        user.email || "";

    }

}



// CLOSE PROFILE SETTINGS
function closeProfileSettings(){

    document.getElementById("profileSettingsPage").style.display =
    "none";


    document.getElementById("settingsPage").style.display =
    "block";

}



// SAVE PROFILE
function saveProfile(){

    let user = JSON.parse(
        localStorage.getItem("nexusUser")
    );


    // Safety check
    if(!user){

        user = {

            username:"",
            email:""

        };

    }



    const newUsername =
    document.getElementById("profileUsername").value.trim();



    const newEmail =
    document.getElementById("profileEmail").value.trim();



    if(newUsername){

        user.username = newUsername;

    }


    if(newEmail){

        user.email = newEmail;

    }



    // Save updated user
    localStorage.setItem(

        "nexusUser",

        JSON.stringify(user)

    );



    // Update dashboard name
    const usernameDisplay =
    document.getElementById("usernameDisplay");


    if(usernameDisplay){

        usernameDisplay.innerHTML =
        "👤 " + user.username;

    }



    alert("✅ Profile Updated!");

}

// =====================================
// APPEARANCE
// =====================================

function showAppearanceSettings(){

    hideAllPages();

    document.getElementById("appearanceSettingsPage").style.display="block";

}

function closeAppearanceSettings(){

    document.getElementById("appearanceSettingsPage").style.display="none";

    document.getElementById("settingsPage").style.display="block";

}

function setTheme(theme){

    localStorage.setItem("nexusTheme",theme);

    document.body.className=theme;

}

// =====================================
// LANGUAGE SETTINGS
// =====================================

function showLanguageSettings(){

    hideAllPages();

    document.getElementById("languageSettingsPage").style.display="block";

    const lang =
    localStorage.getItem("nexusLanguage") || "en";

    document.getElementById("languageSelect").value =
    lang;

}

function closeLanguageSettings(){

    document.getElementById("languageSettingsPage").style.display="none";

    document.getElementById("settingsPage").style.display="block";

}

function saveLanguage(){

    const lang =
    document.getElementById("languageSelect").value;

    localStorage.setItem(
        "nexusLanguage",
        lang
    );

    alert("✅ Language Saved!");

}

// =====================================
// MODEL SETTINGS
// =====================================

function showModelSettings(){

    hideAllPages();

    document.getElementById("modelSettingsPage").style.display="block";

    const model =
    localStorage.getItem("nexusModel") ||
    "qwen2.5:3b";

    document.getElementById("modelSelect").value =
    model;

}

function closeModelSettings(){

    document.getElementById("modelSettingsPage").style.display="none";

    document.getElementById("settingsPage").style.display="block";

}

function saveModel(){

    const model =
    document.getElementById("modelSelect").value;

    localStorage.setItem(

        "nexusModel",

        model

    );

    alert("✅ Model Changed!");

}

// =====================================
// SECURITY
// =====================================

function showSecuritySettings(){

    hideAllPages();

    document.getElementById("securitySettingsPage").style.display="block";

}

function closeSecuritySettings(){

    document.getElementById("securitySettingsPage").style.display="none";

    document.getElementById("settingsPage").style.display="block";

}

// =====================================
// CHANGE PASSWORD
// =====================================

async function changePassword(){

    const user = JSON.parse(

        localStorage.getItem("nexusUser")

    );

    if(!user){

        alert("Please login first.");

        return;

    }

    const currentPassword =

        document.getElementById("currentPassword").value;

    const newPassword =

        document.getElementById("newPassword").value;

    if(currentPassword=="" || newPassword==""){

        alert("Fill all fields.");

        return;

    }

    const response = await fetch(

        "http://localhost:3000/change-password",

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                email:user.email,

                currentPassword,

                newPassword

            })

        }

    );

    const data = await response.json();

    alert(data.message);

    if(data.success){

        document.getElementById("currentPassword").value="";

        document.getElementById("newPassword").value="";

    }

}

// =====================================
// AI PREFERENCES
// =====================================

function showAIPreferences(){

    hideAllPages();

    document.getElementById("aiPreferencesPage").style.display="block";

    document.getElementById("shortReplies").checked =
        localStorage.getItem("shortReplies")=="true";

    document.getElementById("autoSpeak").checked =
        localStorage.getItem("autoSpeak")!="false";

    document.getElementById("rememberChats").checked =
        localStorage.getItem("rememberChats")!="false";

}

function closeAIPreferences(){

    document.getElementById("aiPreferencesPage").style.display="none";

    document.getElementById("settingsPage").style.display="block";

}

function saveAIPreferences(){

    localStorage.setItem(
        "shortReplies",
        document.getElementById("shortReplies").checked
    );

    localStorage.setItem(
        "autoSpeak",
        document.getElementById("autoSpeak").checked
    );

    localStorage.setItem(
        "rememberChats",
        document.getElementById("rememberChats").checked
    );

    alert("✅ AI Preferences Saved!");

}

// =====================================
// HISTORY
// =====================================

function showHistory(){

    hideAllPages();

    document.getElementById("historyPage").style.display="block";

    if(typeof loadHistoryList==="function"){

        loadHistoryList();

    }

}

function closeHistory(){

    showHome();

}

// =====================================
// LOGOUT
// =====================================

function logout(){

    if(!confirm("Logout from Nexus?")){

        return;

    }

    localStorage.removeItem("nexusUser");

    window.location.href="login.html";

}