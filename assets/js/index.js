
const profilePanel = document.getElementById("profilePanel");
const closeProfile = document.getElementById("closeProfile");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const profileNameInput = document.getElementById("profileNameInput");
const profileStatusInput = document.getElementById("profileStatusInput");
const profilePanelPic = document.getElementById("profilePanelPic");
const changePhotoBtn = document.getElementById("changePhotoBtn");
const profileImageInput = document.getElementById("profileImageInput");
const myProfilePic = document.querySelector(".sidebar .profile-pic");

let currentChat = '';

const sendBtn = document.getElementById("sendBtn");

const messageInput = document.getElementById("messageInput");

const messageArea = document.getElementById("messageArea");

const chats = document.querySelectorAll(".chat");
const chatTitle = document.getElementById("chatTitle");
const profilepic = document.getElementById('profilePic');
messageArea.scrollTop = messageArea.scrollHeight;

const chatPlaceholder = document.getElementById("chatPlaceholder");

const chatWindow = document.getElementById("chatWindow");
const blankScreen = document.getElementById("blankScreen");

blankScreen.style.display = "flex";
chatWindow.style.display = "none";

const defaultChats = {
    "Aarav Sharma": `<div class="recieved-message">Hey! Late night coding again?<span class="timestamp">11:30</span></div>
                    <div class="sent-message">Haha yeah can't stop <span class="timestamp">11:31</span></div>
                    <div class="recieved-message">Same bro, hackathon prep <span class="timestamp">11:32</span></div>`,
    "Vivaan Patel": `<div class="recieved-message">Beach vibes were insane today <span class="timestamp">6:00</span></div>
                    <div class="sent-message">No way you went without me!! <span class="timestamp">6:01</span></div>
                    <div class="recieved-message">Next time I promise <span class="timestamp">6:02</span></div>`,
    "Aditya Verma": `<div class="recieved-message">New gym PR today! <span class="timestamp">7:00</span></div>
                    <div class="sent-message">Beast mode activated! <span class="timestamp">7:01</span></div>
                    <div class="recieved-message">Come join me tomorrow! <span class="timestamp">7:02</span></div>`,
    "Ishaan Gupta": `<div class="recieved-message">Birthday celebration was madness <span class="timestamp">8:00</span></div>
                    <div class="sent-message">Best night ever!! <span class="timestamp">8:01</span></div>`,
    "Arjun Mehta": `<div class="recieved-message">Coffee + rain = perfect combo <span class="timestamp">9:00</span></div>
                    <div class="sent-message">Facts, best feeling ever <span class="timestamp">9:01</span></div>
                    <div class="recieved-message">Come over? <span class="timestamp">9:02</span></div>`,
    "Reyansh Singh": `<div class="recieved-message">Exam week survival mode ON <span class="timestamp">10:00</span></div>
                    <div class="sent-message">We got this!! <span class="timestamp">10:01</span></div>`,
    "Krishna Rao": `<div class="recieved-message">Roadtrip was unreal <span class="timestamp">3:00</span></div>
                    <div class="sent-message">When's the next one?? <span class="timestamp">3:01</span></div>
                    <div class="recieved-message">Next month for sure! <span class="timestamp">3:02</span></div>`,
    "Kabir Malhotra": `<div class="recieved-message">Finally watched Oppenheimer <span class="timestamp">4:00</span></div>
                    <div class="sent-message">Took you long enough <span class="timestamp">4:01</span></div>`,
    "Rohan Desai": `<div class="recieved-message">Mess food review dropping soon <span class="timestamp">1:00</span></div>
                    <div class="sent-message">Finally someone's doing it <span class="timestamp">1:01</span></div>
                    <div class="recieved-message">Subscribe to my channel <span class="timestamp">1:02</span></div>`,
    "Aryan Nair": `<div class="recieved-message">Hackathon mode ON <span class="timestamp">2:00</span></div>
                    <div class="recieved-message">AI/ML obviously <span class="timestamp">2:02</span></div>`,
};

let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || defaultChats;
let savedHistory = JSON.parse(localStorage.getItem('chatHistory'));
if (savedHistory) {
    chatHistory = savedHistory;
}

if (localStorage.getItem('profileName')) profileNameInput.value = localStorage.getItem('profileName');
if (localStorage.getItem('profileStatus')) profileStatusInput.value = localStorage.getItem('profileStatus');
if (localStorage.getItem('profilePic')) {
    profilePanelPic.src = localStorage.getItem('profilePic');
    myProfilePic.src = localStorage.getItem('profilePic');
}


sendBtn.addEventListener("click", function() {

    chatHistory[currentChat] = messageArea.innerHTML;
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

    if (!messageArea.querySelector('.date-divider')) {
    const dateDivider = document.createElement('div');
    dateDivider.classList.add('date-divider');
    dateDivider.innerText = 'Today';
    messageArea.appendChild(dateDivider);
}
    let messageText = messageInput.value;
    if (messageText.trim() === "") {
        return;
    }
    console.log(messageText);

    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let time = hours + ":" + minutes;
    const newMessage = document.createElement("div");
    const timestamp = document.createElement("span");
    timestamp.classList.add("timestamp");
    timestamp.innerText = time;
    newMessage.classList.add("sent-message");
    newMessage.innerText = messageText;
    newMessage.appendChild(timestamp);
    messageArea.appendChild(newMessage);
    messageArea.scrollTop = messageArea.scrollHeight;
    messageInput.value = "";

    chatHistory[currentChat] = messageArea.innerHTML;
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
});

messageInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendBtn.click();
    }
});

chats.forEach(function(chat) {
    chat.addEventListener('click', function(){
        let chatname = chat.querySelector(".chat-name").innerText;

        if (currentChat) {
            chatHistory[currentChat] = messageArea.innerHTML;
        }

        blankScreen.style.display = "none";
        chatWindow.style.display = "flex";
        chatTitle.innerText = chatname;
        profilepic.src = chat.querySelector(".profile-pic").src;
        
        messageArea.innerHTML = chatHistory[chatname] || "";
    
        currentChat = chatname;
        
        messageArea.scrollTop = messageArea.scrollHeight;
    });
});
 



myProfilePic.addEventListener("click", function() {
    profilePanel.style.display = "flex";
});

closeProfile.addEventListener("click", function() {
    profilePanel.style.display = "none";
});

changePhotoBtn.addEventListener("click", function() {
    profileImageInput.click();
});  

profileImageInput.addEventListener("change", function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePanelPic.src = e.target.result;
            myProfilePic.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

saveProfileBtn.addEventListener("click", function() {


    localStorage.setItem("profileName", profileNameInput.value);
    localStorage.setItem("profileStatus", profileStatusInput.value);
    localStorage.setItem("profilePic", profilePanelPic.src);
        alert("Profile saved! Name: " + profileNameInput.value);
    profilePanel.style.display = "none";
});


const otherProfilePanel = document.getElementById("otherProfilePanel");
const closeOtherProfile = document.getElementById("closeOtherProfile");
const otherProfilePic = document.getElementById("otherProfilePic");
const otherProfileName = document.getElementById("otherProfileName");

document.getElementById("profilePic").addEventListener("click", function() {
    otherProfilePic.src = this.src;
    otherProfileName.textContent = chatTitle.innerText;
    otherProfilePanel.style.display = "flex";
});

document.getElementById("chatTitle").addEventListener("click", function() {
    const currentName = this.innerText;
    const input = document.createElement("input");
    input.value = currentName;
    input.style.fontSize = "20px";
    input.style.fontWeight = "bold";
    input.style.border = "none";
    input.style.outline = "none";
    input.style.background = "transparent";
    this.replaceWith(input);
    input.focus();

    function saveName() {
        const newName = input.value.trim() || currentName;
        
        
        if (newName !== currentName) {
            chatHistory[newName] = chatHistory[currentName];
            delete chatHistory[currentName];
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        }

        chats.forEach(function(chat) {
            if (chat.querySelector(".chat-name").innerText === currentName) {
                chat.querySelector(".chat-name").innerText = newName;
            }
        });

        const span = document.createElement("span");
        span.id = "chatTitle";
        span.className = "chat-title";
        span.innerText = newName;
        input.replaceWith(span);
        currentChat = newName;
    }

    input.addEventListener("blur", saveName);
    input.addEventListener("keydown", function(e) {
        if (e.key === "Enter") saveName();
    });
});

closeOtherProfile.addEventListener("click", function() {
    otherProfilePanel.style.display = "none";
});




document.getElementById("contactSearch").addEventListener("input", function() {
    let searchText = this.value.toLowerCase();
    chats.forEach(function(chat) {
        let name = chat.querySelector(".chat-name").innerText.toLowerCase();
        if (name.includes(searchText)) {
            chat.style.display = "flex";
        } else {
            chat.style.display = "none";
        }
    });
});

const openMsgSearch = document.getElementById("openMsgSearch");
const closeMsgSearch = document.getElementById("closeMsgSearch");
const msgSearchBar = document.getElementById("msgSearchBar");
const msgSearchInput = document.getElementById("msgSearchInput");

openMsgSearch.addEventListener("click", function() {
    msgSearchBar.style.display = "flex";
    msgSearchInput.focus();
});

closeMsgSearch.addEventListener("click", function() {
    msgSearchBar.style.display = "none";
    msgSearchInput.value = "";
    document.querySelectorAll(".sent-message, .recieved-message").forEach(function(msg) {
        msg.style.background = "";
    });
});

msgSearchInput.addEventListener("input", function() {
    let searchText = this.value.toLowerCase();
    document.querySelectorAll(".sent-message, .recieved-message").forEach(function(msg) {
        let text = msg.innerText.toLowerCase();
        if (searchText !== "" && text.includes(searchText)) {
            msg.style.background = "yellow";
            msg.scrollIntoView({ behavior: "smooth" });
        } else {
            msg.style.background = "";
        }
    });
});



document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '../html/signup.html';
});