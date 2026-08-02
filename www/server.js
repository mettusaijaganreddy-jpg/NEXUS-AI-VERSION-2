```javascript
// =====================================
// NEXUS 2.0
// SERVER.JS
// =====================================

console.log("✅ SERVER.JS REACHED");


// =====================================
// IMPORTS
// =====================================

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");


// =====================================
// SERVER CONFIG
// =====================================

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";


// =====================================
// DEBUG
// =====================================

console.log("__dirname =", __dirname);

console.log(
    "index.html =",
    path.join(__dirname, "index.html")
);

console.log(
    "Exists =",
    fs.existsSync(
        path.join(__dirname, "index.html")
    )
);

console.log("✅ SERVER FILE LOADED");


// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());

app.use(express.json());


// =====================================
// STATIC FILES
// =====================================

app.use(express.static(__dirname));


// =====================================
// HOME
// =====================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "index.html")
    );

});


// =====================================
// USERS DATABASE
// =====================================

const USERS_FILE =
    path.join(__dirname, "users.json");


// =====================================
// GET USERS
// =====================================

function getUsers(){

    if(!fs.existsSync(USERS_FILE)){

        fs.writeFileSync(
            USERS_FILE,
            "[]"
        );

    }

    try{

        return JSON.parse(
            fs.readFileSync(
                USERS_FILE,
                "utf8"
            )
        );

    }

    catch(error){

        console.error(
            "❌ USERS FILE ERROR:",
            error
        );

        return [];

    }

}


// =====================================
// SAVE USERS
// =====================================

function saveUsers(users){

    fs.writeFileSync(

        USERS_FILE,

        JSON.stringify(
            users,
            null,
            4
        )

    );

}


// =====================================
// HEALTH CHECK
// =====================================

app.get("/health", (req, res) => {

    res.json({

        success: true,

        message: "Nexus server is running."

    });

});


// =====================================
// OLLAMA CHAT
// =====================================

app.post("/chat", async (req, res) => {

    console.log("🤖 /chat ROUTE HIT");

    try{

        const {

            model,
            messages,
            stream,
            options

        } = req.body;


        // =====================================
        // DEFAULT MODEL
        // =====================================

        const selectedModel =
            model || "qwen2.5:3b";


        console.log(
            "🧠 Model:",
            selectedModel
        );


        // =====================================
        // SEND TO OLLAMA
        // =====================================

        const ollamaResponse = await fetch(

            "http://127.0.0.1:11434/api/chat",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    model: selectedModel,

                    messages:
                        messages || [],

                    stream:
                        stream ?? false,

                    options:
                        options || {}

                })

            }

        );


        // =====================================
        // OLLAMA ERROR
        // =====================================

        if(!ollamaResponse.ok){

            const errorText =
                await ollamaResponse.text();

            console.error(
                "❌ OLLAMA ERROR:",
                errorText
            );

            return res.status(
                ollamaResponse.status
            ).json({

                error:
                    "Ollama returned an error.",

                details:
                    errorText

            });

        }


        // =====================================
        // READ OLLAMA JSON
        // =====================================

        const data =
            await ollamaResponse.json();


        console.log(
            "✅ OLLAMA RESPONSE RECEIVED"
        );


        // =====================================
        // RETURN SIMPLE RESPONSE TO NEXUS
        // =====================================

        res.json({

            reply:
                data?.message?.content ||
                "I'm sorry, I couldn't generate a response."

        });

    }

    catch(error){

        console.error(
            "❌ CHAT SERVER ERROR:",
            error
        );

        res.status(500).json({

            error:
                "Unable to connect to Ollama.",

            details:
                error.message

        });

    }

});


// =====================================
// SIGN UP
// =====================================

app.post("/signup", async (req, res) => {

    try{

        const {

            username,
            email,
            password

        } = req.body;


        if(
            !username ||
            !email ||
            !password
        ){

            return res.json({

                success: false,

                message:
                    "Please fill in all fields."

            });

        }


        const users = getUsers();


        // =====================================
        // CHECK EMAIL
        // =====================================

        if(
            users.find(
                u =>
                    u.email.toLowerCase() ===
                    email.toLowerCase()
            )
        ){

            return res.json({

                success: false,

                message:
                    "Email already exists."

            });

        }


        // =====================================
        // HASH PASSWORD
        // =====================================

        const hash =
            await bcrypt.hash(
                password,
                10
            );


        // =====================================
        // SAVE USER
        // =====================================

        users.push({

            username,

            email,

            password: hash

        });


        saveUsers(users);


        res.json({

            success: true,

            message:
                "Account created!"

        });

    }

    catch(error){

        console.error(
            "❌ SIGNUP ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Signup failed."

        });

    }

});


// =====================================
// LOGIN
// =====================================

app.post("/login", async (req, res) => {

    try{

        const {

            email,
            password

        } = req.body;


        const users =
            getUsers();


        const user =
            users.find(

                u =>
                    u.email.toLowerCase() ===
                    email.toLowerCase()

            );


        if(!user){

            return res.json({

                success: false,

                message:
                    "Account not found."

            });

        }


        const ok =
            await bcrypt.compare(

                password,

                user.password

            );


        if(!ok){

            return res.json({

                success: false,

                message:
                    "Wrong password."

            });

        }


        res.json({

            success: true,

            username:
                user.username,

            email:
                user.email

        });

    }

    catch(error){

        console.error(
            "❌ LOGIN ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Login failed."

        });

    }

});


// =====================================
// CHANGE PASSWORD
// =====================================

app.post(
    "/change-password",
    async (req, res) => {

        try{

            const {

                email,
                currentPassword,
                newPassword

            } = req.body;


            const users =
                getUsers();


            const user =
                users.find(

                    u =>
                        u.email.toLowerCase() ===
                        email.toLowerCase()

                );


            if(!user){

                return res.json({

                    success: false,

                    message:
                        "Account not found."

                });

            }


            // =====================================
            // CHECK CURRENT PASSWORD
            // =====================================

            const ok =
                await bcrypt.compare(

                    currentPassword,

                    user.password

                );


            if(!ok){

                return res.json({

                    success: false,

                    message:
                        "Current password is incorrect."

                });

            }


            // =====================================
            // HASH NEW PASSWORD
            // =====================================

            user.password =
                await bcrypt.hash(

                    newPassword,

                    10

                );


            saveUsers(users);


            res.json({

                success: true,

                message:
                    "Password changed successfully."

            });

        }

        catch(error){

            console.error(
                "❌ PASSWORD ERROR:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Password change failed."

            });

        }

    }
);


// =====================================
// START SERVER
// =====================================

app.listen(

    PORT,

    HOST,

    () => {

        console.log("");
        console.log(
            "====================================="
        );
        console.log(
            "🚀 NEXUS 2.0 SERVER ONLINE"
        );
        console.log(
            "====================================="
        );

        console.log(
            `🌐 Local: http://localhost:${PORT}`
        );

        console.log(
            `📱 Network: http://192.168.0.5:${PORT}`
        );

        console.log(
            `🤖 Ollama: http://127.0.0.1:11434`
        );

        console.log(
            "====================================="
        );
        console.log("");

    }
);
```
