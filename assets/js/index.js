if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = '../html/login.html';
}

if (!localStorage.getItem('demoSeeded')) {
    const demoUsers = [
        { name: 'PingMe', phone: '1234567890', password: 'admin' },
    ];
    demoUsers.forEach(function(user) {
        localStorage.setItem('user_' + user.phone, JSON.stringify(user));
    });
    localStorage.setItem('demoSeeded', 'true');
}

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
};


let currentUserPhone = localStorage.getItem('currentUserPhone');
let chatHistory = JSON.parse(localStorage.getItem('chatHistory_'+ currentUserPhone)) || defaultChats;


if (localStorage.getItem('profileName')) profileNameInput.value = localStorage.getItem('profileName');
if (localStorage.getItem('profileStatus')) profileStatusInput.value = localStorage.getItem('profileStatus');
if (localStorage.getItem('profilePic')) {
    profilePanelPic.src = localStorage.getItem('profilePic');
    myProfilePic.src = localStorage.getItem('profilePic');
}


sendBtn.addEventListener("click", function() {

    chatHistory[currentChat] = messageArea.innerHTML;
    localStorage.setItem('chatHistory_' + currentUserPhone, JSON.stringify(chatHistory));
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
    localStorage.setItem('chatHistory_' + currentUserPhone, JSON.stringify(chatHistory));

    let contacts = JSON.parse(localStorage.getItem('contacts_' + currentUserPhone)) || [];
    let contact = contacts.find(c => c.name === currentChat);
    if (contact) {
        let receiverPhone = contact.phone;
    
    let receiverHistory = JSON.parse(localStorage.getItem('chatHistory_' + receiverPhone)) || {};
    let currentUserData = JSON.parse(localStorage.getItem('user_' + currentUserPhone));
    let myName = currentUserData ? currentUserData.name : currentUserPhone;
    receiverHistory[myName] = messageArea.innerHTML;
    localStorage.setItem('chatHistory_' + receiverPhone, JSON.stringify(receiverHistory));

    let receiverContacts = JSON.parse(localStorage.getItem('contacts_' + receiverPhone)) || [];
    if (!receiverContacts.find(c => c.phone === currentUserPhone)) {
        receiverContacts.push({ 
            name: myName, 
            phone: currentUserPhone 
        });
        localStorage.setItem('contacts_' + receiverPhone, JSON.stringify(receiverContacts));
    }
}

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
            localStorage.setItem('chatHistory_' + currentUserPhone, JSON.stringify(chatHistory));           }

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


function loadContacts() {
    const chatList = document.getElementById('chatList');
    chatList.innerHTML = '';
    let contacts = JSON.parse(localStorage.getItem('contacts_' + currentUserPhone)) || [];
    contacts.forEach(function(contact) {
        addContactToList(contact.name, contact.phone);
    });
}

function addContactToList(name, phone) {
    const chatList = document.getElementById('chatList');
    const chatDiv = document.createElement('div');
    chatDiv.classList.add('chat');
    chatDiv.innerHTML = `
        <img class="profile-pic" src="../imagess/user1pic.png">
        <div class="chat-info">
            <div class="chat-name">${name}</div>
            <div class="chat-message">${phone}</div>
        </div>
    `;
    chatDiv.addEventListener('click', function() {
        if (currentChat) {
            chatHistory[currentChat] = messageArea.innerHTML;
            localStorage.setItem('chatHistory_' + currentUserPhone, JSON.stringify(chatHistory));
        }
        blankScreen.style.display = "none";
        chatWindow.style.display = "flex";
        chatTitle.innerText = name;
        profilepic.src = '../imagess/user1pic.png';
        messageArea.innerHTML = chatHistory[name] || "";
        currentChat = name;
        messageArea.scrollTop = messageArea.scrollHeight;
    });
    chatList.appendChild(chatDiv);
}

document.getElementById('newChatBtn').addEventListener('click', function() {
    const modal = document.getElementById('addContactModal');
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';

    let contacts = JSON.parse(localStorage.getItem('contacts_' + currentUserPhone)) || [];

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.startsWith('user_')) {
            let user = JSON.parse(localStorage.getItem(key));
            if (user.phone !== currentUserPhone) {
                const item = document.createElement('div');
                item.classList.add('user-select-item');
                item.innerHTML = `<strong>${user.name}</strong><span>${user.phone}</span>`;
                item.addEventListener('click', function() {
                    if (!contacts.find(c => c.phone === user.phone)) {
                        contacts.push({ name: user.name, phone: user.phone });
                        localStorage.setItem('contacts_' + currentUserPhone, JSON.stringify(contacts));
                        addContactToList(user.name, user.phone);
                    }
                    modal.style.display = 'none';
                });
                usersList.appendChild(item);
            }
        }
    }
    modal.style.display = 'flex';
});

document.getElementById('cancelContactBtn').addEventListener('click', function() {
    document.getElementById('addContactModal').style.display = 'none';
    document.getElementById('newContactName').value = '';
    document.getElementById('newContactPhone').value = '';
});

document.getElementById('addContactBtn').addEventListener('click', function() {
    const name = document.getElementById('newContactName').value.trim();
    const phone = document.getElementById('newContactPhone').value.trim();

    if (!name || !phone) { alert('Please fill in both fields!'); return; }
    if (!/^\d{10}$/.test(phone)) { alert('Enter valid 10 digit number!'); return; }

    let contacts = JSON.parse(localStorage.getItem('contacts_' + currentUserPhone)) || [];
    if (contacts.find(c => c.phone === phone)) { alert('Contact already exists!'); return; }

    contacts.push({ name: name, phone: phone });
    localStorage.setItem('contacts_' + currentUserPhone, JSON.stringify(contacts));
    addContactToList(name, phone);

    document.getElementById('addContactModal').style.display = 'none';
    document.getElementById('newContactName').value = '';
    document.getElementById('newContactPhone').value = '';

    let theirContacts = JSON.parse(localStorage.getItem('contacts_' + phone)) || [];
    if (!theirContacts.find(c => c.phone === currentUserPhone)) {
        theirContacts.push({ 
            name: currentUserPhone, 
            phone: currentUserPhone 
        });
        localStorage.setItem('contacts_' + phone, JSON.stringify(theirContacts));
    }
});

loadContacts();