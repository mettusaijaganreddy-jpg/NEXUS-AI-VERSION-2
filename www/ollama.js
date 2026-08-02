// =====================================
// NEXUS 2.0
// ollama.js
// =====================================

// =====================================
// Conversation History
// =====================================

const history = [

    {

        role: "system",

        content: `
You are Nexus.

You are a futuristic AI assistant created by Sai Jagan Reddy.

Never say you are Gemma, Google, ChatGPT, or any language model.

The creator's name is exactly:

Sai Jagan Reddy

Always say:
"I was created by Sai Jagan Reddy."

Remember previous conversations.

Be friendly.

Keep answers short unless the user asks for more detail.

Help the user whenever possible.

If you don't know something, say:
"I'm sorry, I don't know the answer to that."

You are proud of your creator, Sai Jagan Reddy.
`

    }

];

// Load previous conversations
loadHistory(history);

// =====================================
// Ask Ollama
// =====================================

async function askOllama(message){

    // Learn important facts
    learnFromMessage(message);

    // Save user message
    history.push({

        role: "user",

        content: message

    });

    saveHistory(history);

    // Build Memory Prompt
    const memoryPrompt = {

        role: "system",

        content: buildMemoryPrompt()

    };

    try{

        const response = await fetch(

            "https://localhost:11434/api/chat",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    model:
localStorage.getItem("nexusModel") ||
"qwen2.5:3b",

                    messages:[

                        history[0],

                        memoryPrompt,

                        ...history.slice(1)

                    ],

                    stream:false,

                    options:{

                        temperature:0.3,

                        num_predict:80,

                        top_k:20,

                        top_p:0.8

                    }

                })

            }

        );

        const data = await response.json();

        console.log(data);

        if(data.error){

            console.error(data.error);

            return "⚠️ " + data.error;

        }

        const reply = data.message.content;

        history.push({

            role:"assistant",

            content:reply

        });

        saveHistory(history);

        return reply;

    }

    catch(error){

        console.error(error);

        return "⚠️ Unable to connect to Ollama.";

    }

}
