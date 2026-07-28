// =====================================
// NEXUS 2.0
// VOICE SYSTEM
// =====================================


let recognition;
let listening = false;
let muted = false;


// =====================================
// STANDBY BUTTON
// =====================================

function toggleStandby(){

    if(window.voiceMode){

        // OFF

        window.voiceMode = false;


        try{

            if(recognition){

                recognition.stop();

            }

        }catch(e){}


        document.getElementById("standbyBtn").innerHTML =
            "Stand By: 🔴 OFF";


        console.log("Standby OFF");


    }
    else{


        // ON

        window.voiceMode = true;


        document.getElementById("standbyBtn").innerHTML =
            "Stand By: 🟢 ON";


        if(window.startVoiceRecognition){

            window.startVoiceRecognition();

        }


        console.log("Standby ON");

    }

}



// =====================================
// STOP EVERYTHING
// =====================================

function stopVoice(){

    window.voiceMode = false;


    try{

        if(recognition){

            recognition.stop();

        }

    }catch(e){}


    speechSynthesis.cancel();


    hideOrb();


    document.getElementById("standbyBtn").innerHTML =
        "Stand By: 🔴 OFF";


    console.log("🛑 Nexus Voice OFF");

}



// =====================================
// START VOICE
// =====================================

function voice(){


    showOrb();


    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;



    if(!SpeechRecognition){

        alert(
        "Speech Recognition is not supported in this browser."
        );

        return;

    }



    recognition = new SpeechRecognition();


    recognition.lang = "en-IN";

    recognition.continuous = true;

    recognition.interimResults = false;



    window.voiceMode = true;

    window.nexusSpeaking = false;



    document.getElementById("standbyBtn").innerHTML =
        "Stand By: 🟢 ON";




    // =================================
    // WHEN MIC STARTS
    // =================================

    recognition.onstart = () => {

        listening = true;

        console.log("🎤 Voice Started");

    };




    // =================================
    // WHEN MIC ENDS
    // =================================

    recognition.onend = () => {


        listening = false;


        console.log("🎤 Voice Ended");



        if(
            window.voiceMode &&
            !muted &&
            !window.nexusSpeaking
        ){

            setTimeout(
                startVoiceRecognition,
                100
            );

        }


    };




    // =================================
    // ERROR
    // =================================

    recognition.onerror = (e)=>{


        listening = false;


        console.log(
            "🎤 Voice Error:",
            e.error
        );


    };




    // =================================
    // HEARD TEXT
    // =================================

    recognition.onresult = (event)=>{

    const text =
    event.results[
        event.results.length - 1
    ][0].transcript;


    console.log("🎤 Heard:", text);


    const input =
    document.getElementById("messageInput");


    if(input){

        input.value = text;

        sendMessage();

    }

};




    // =================================
    // START LISTENING
    // =================================

    function startVoiceRecognition(){


        if(listening) return;


        if(!window.voiceMode) return;



        try{

            recognition.start();


        }
        catch(e){

            console.log(
                "Already Listening"
            );

        }

    }




    // =================================
    // ORB
    // =================================

    function hideOrb(){

    document
    .getElementById("nexusOrb")
    .classList.remove("show");


    document
    .getElementById("nexusOrbPanel")
    .style.display = "none";

}



    function showOrb(){

    document
    .getElementById("nexusOrbPanel")
    .style.display = "flex";


    document
    .getElementById("nexusOrb")
    .classList.add("show");

}




    // =================================
    // SPEAK
    // =================================

    function speakText(text){


        if(!text) return;



        speechSynthesis.cancel();



        window.nexusSpeaking = true;



        try{

            recognition.stop();

        }catch(e){}




        const speech =
        new SpeechSynthesisUtterance(text);



        speech.lang = "en-US";

        speech.rate = 1;

        speech.pitch = 1;

        speech.volume = 1;




        speech.onstart = ()=>{


            console.log(
                "🗣️ Nexus Speaking"
            );


        };




        speech.onend = ()=>{


            console.log(
                "✅ Nexus Speech Finished"
            );



            window.nexusSpeaking = false;



            if(
                window.voiceMode &&
                !muted
            ){

                setTimeout(
                    startVoiceRecognition,
                    100
                );

            }


        };



        speech.onerror = ()=>{


            window.nexusSpeaking = false;


        };



        speechSynthesis.speak(speech);


    }




    // GLOBAL ACCESS

    window.startVoiceRecognition =
        startVoiceRecognition;


    window.speakText =
        speakText;


    window.hideOrb =
        hideOrb;


    window.showOrb =
        showOrb;



    // START

    startVoiceRecognition();


}