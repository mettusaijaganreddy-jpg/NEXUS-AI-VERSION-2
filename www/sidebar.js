// =====================================
// SIDEBAR
// =====================================

const homeBtn = document.getElementById("homeBtn");
const chatBtn = document.getElementById("chatBtn");

const homePage = document.getElementById("homePage");
const chatPage = document.getElementById("chatPage");

homeBtn.onclick = function(){

    homePage.style.display = "block";

    chatPage.style.display = "none";

};

chatBtn.onclick = function(){

    homePage.style.display = "none";

    chatPage.style.display = "block";

};