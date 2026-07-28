const API = "http://localhost:3000";

function showSignup(){

    loginForm.style.display="none";
    signupForm.style.display="block";

}

function showLogin(){

    signupForm.style.display="none";
    loginForm.style.display="block";

}

// ======================
// SIGN UP
// ======================

async function signup(){

    const username =
    signupUsername.value;

    const email =
    signupEmail.value;

    const password =
    signupPassword.value;

    const response = await fetch(

        API+"/signup",

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                username,

                email,

                password

            })

        }

    );

    const data =
    await response.json();

    alert(data.message || "Account Created!");

    if(data.success){

        showLogin();

    }

}

// ======================
// LOGIN
// ======================

async function login(){

    const email =
    loginEmail.value;

    const password =
    loginPassword.value;

    const response = await fetch(

        API+"/login",

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                email,

                password

            })

        }

    );

    const data =
    await response.json();

    if(data.success){

        localStorage.setItem(

            "nexusUser",

            JSON.stringify(data)

        );

        window.location="index.html";

    }
    else{

        alert(data.message);

    }

}

// =====================================
// LOGOUT
// =====================================

function logout(){

    if(!confirm("Are you sure you want to logout?")){

        return;

    }

    // Remove saved login
    localStorage.removeItem("nexusUser");

    // Go back to login page
    window.location.href = "login.html";

}