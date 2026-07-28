
console.log("✅ SERVER.JS REACHED");

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

console.log("✅ SERVER FILE LOADED");

app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, "users.json");

function getUsers(){

    if(!fs.existsSync(USERS_FILE)){

        fs.writeFileSync(USERS_FILE,"[]");

    }

    return JSON.parse(fs.readFileSync(USERS_FILE));

}

function saveUsers(users){

    fs.writeFileSync(
        USERS_FILE,
        JSON.stringify(users,null,4)
    );

}

// ----------------------
// SIGN UP
// ----------------------

app.get("/health", (req, res) => {

    res.json({

        success:true,

        message:"Server is running"

    });

});

app.post("/signup", async(req,res)=>{

    const {username,email,password}=req.body;

    const users=getUsers();

    if(users.find(u=>u.email===email)){

        return res.json({

            success:false,

            message:"Email already exists."

        });

    }

    const hash=await bcrypt.hash(password,10);

    users.push({

        username,

        email,

        password:hash

    });

    saveUsers(users);

    res.json({

        success:true,

        message:"Account created!"

    });

});

// ----------------------
// LOGIN
// ----------------------

app.post("/login",async(req,res)=>{

    const {email,password}=req.body;

    const users=getUsers();

    const user=users.find(u=>u.email===email);

    if(!user){

        return res.json({

            success:false,

            message:"Account not found."

        });

    }

    const ok=await bcrypt.compare(password,user.password);

    if(!ok){

        return res.json({

            success:false,

            message:"Wrong password."

        });

    }

    res.json({

        success:true,

        username:user.username,

        email:user.email

    });

});

console.log("✅ CHANGE PASSWORD REACHING");

// ===============================
// CHANGE PASSWORD
// ===============================

app.post("/change-password", async(req,res)=>{

    console.log("✅ CHANGE PASSWORD ROUTE HIT");

    const {

        email,

        currentPassword,

        newPassword

    } = req.body;

    const users = getUsers();

    const user = users.find(

        u => u.email === email

    );

    if(!user){

        return res.json({

            success:false,

            message:"Account not found."

        });

    }

    const ok = await bcrypt.compare(

        currentPassword,

        user.password

    );

    if(!ok){

        return res.json({

            success:false,

            message:"Current password is incorrect."

        });

    }

    user.password = await bcrypt.hash(

        newPassword,

        10

    );

    saveUsers(users);

    res.json({

        success:true,

        message:"Password changed successfully."

    });

});

app.listen(PORT, HOST, ()=>{

    console.log(`🚀 Nexus Login Server Running at http://localhost:${PORT}`);

});