if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = '../html/login.html';
}

if (!localStorage.getItem('demoSeeded')) {
    localStorage.setItem('user_1234567890', JSON.stringify({
        name: 'PingMe',
        phone: '1234567890',
        password: 'admin',
        status: 'Your friendly bot',
        pic: ''
    }));
    localStorage.setItem('demoSeeded', 'true');
}

const currentUserPhone = localStorage.getItem('currentUserPhone');

let currentUserData = JSON.parse(localStorage.getItem('user_' + currentUserPhone)) || {};

function getLastMessage(phone) {
    const messages = getMessages(phone);
    if (messages.length === 0) return '';
    const lastMsg = messages[messages.length - 1];
    const prefix = lastMsg.from === currentUserPhone ? 'You: ' : '';
    return prefix + lastMsg.text;
}

function saveCurrentUser() {
    localStorage.setItem('user_' + currentUserPhone, JSON.stringify(currentUserData));
}

function getMyContacts() {
    return currentUserData.contacts || [];
}
function saveMyContacts(contacts) {
    currentUserData.contacts = contacts;
    saveCurrentUser();
}

function convKey(phoneA, phoneB) {
    return 'conv_' + [phoneA, phoneB].sort().join('_');
}

function getMessages(otherPhone) {
    return JSON.parse(localStorage.getItem(convKey(currentUserPhone, otherPhone))) || [];
}

function saveMessages(otherPhone, messages) {
    localStorage.setItem(convKey(currentUserPhone, otherPhone), JSON.stringify(messages));
}

const profilePanel      = document.getElementById("profilePanel");
const closeProfile      = document.getElementById("closeProfile");
const saveProfileBtn    = document.getElementById("saveProfileBtn");
const profileNameInput  = document.getElementById("profileNameInput");
const profileStatusInput= document.getElementById("profileStatusInput");
const profilePanelPic   = document.getElementById("profilePanelPic");
const changePhotoBtn    = document.getElementById("changePhotoBtn");
const profileImageInput = document.getElementById("profileImageInput");
const myProfilePic      = document.querySelector(".sidebar .profile-pic");

const sendBtn       = document.getElementById("sendBtn");
const messageInput  = document.getElementById("messageInput");
const messageArea   = document.getElementById("messageArea");
const chatTitle     = document.getElementById("chatTitle");
const profilepic    = document.getElementById('profilePic');
const chatWindow    = document.getElementById("chatWindow");
const blankScreen   = document.getElementById("blankScreen");

const otherProfilePanel  = document.getElementById("otherProfilePanel");
const closeOtherProfile  = document.getElementById("closeOtherProfile");
const otherProfilePic    = document.getElementById("otherProfilePic");
const otherProfileName   = document.getElementById("otherProfileName");

const openMsgSearch  = document.getElementById("openMsgSearch");
const closeMsgSearch = document.getElementById("closeMsgSearch");
const msgSearchBar   = document.getElementById("msgSearchBar");
const msgSearchInput = document.getElementById("msgSearchInput");

let currentChatPhone = ''; 

blankScreen.style.display = "flex";
chatWindow.style.display = "none";

profileNameInput.value   = currentUserData.name   || '';
profileStatusInput.value = currentUserData.status || 'Hey there! I am using PingMe';
if (currentUserData.pic) {
    profilePanelPic.src = currentUserData.pic;
    myProfilePic.src    = currentUserData.pic;
}

function renderMessages(otherPhone) {
    messageArea.innerHTML = '';
    const messages = getMessages(otherPhone);

    let lastDate = null;
    messages.forEach(function(msg) {
        const msgDate = new Date(msg.ts).toLocaleDateString();
        if (msgDate !== lastDate) {
            const divider = document.createElement('div');
            divider.classList.add('date-divider');
            const today = new Date().toLocaleDateString();
            divider.innerText = msgDate === today ? 'Today' : msgDate;
            messageArea.appendChild(divider);
            lastDate = msgDate;
        }

        const bubble = document.createElement('div');
        const isMine = msg.from === currentUserPhone;
        bubble.classList.add(isMine ? 'sent-message' : 'recieved-message');
        bubble.innerText = msg.text;

        const ts = document.createElement('span');
        ts.classList.add('timestamp');
        const d = new Date(msg.ts);
        ts.innerText = d.getHours() + ':' + d.getMinutes().toString().padStart(2, '0');
        bubble.appendChild(ts);

        messageArea.appendChild(bubble);
    });

    messageArea.scrollTop = messageArea.scrollHeight;
}

function loadContacts() {
    const chatList = document.getElementById('chatList');
    chatList.innerHTML = '';

    const contacts = getMyContacts();
    const pingMePhone = '1234567890';
    if (!contacts.find(c => c === pingMePhone)) {
        contacts.unshift(pingMePhone);
        saveMyContacts(contacts);
    }

    contacts.forEach(function(phone) {
        addContactToSidebar(phone);
    });
}

function addContactToSidebar(phone) {
    const chatList = document.getElementById('chatList');

    if (chatList.querySelector(`[data-phone="${phone}"]`)) return;

    const userData = JSON.parse(localStorage.getItem('user_' + phone)) || {};
    const name = userData.name || phone;
    const pic  = userData.pic  || '../imagess/user1pic.png';

    const chatDiv = document.createElement('div');
    chatDiv.classList.add('chat');
    chatDiv.setAttribute('data-phone', phone);
    chatDiv.innerHTML = `
        <img class="profile-pic" src="${pic}">
        <div class="chat-info">
            <div class="chat-name">${name}</div>
            <div class="chat-message" id="preview_${phone}">${getLastMessage(phone)}</div>
        </div>
    `;

    chatDiv.addEventListener('click', function() {
        openChat(phone);
    });

    chatList.appendChild(chatDiv);
}

function openChat(phone) {
    const userData = JSON.parse(localStorage.getItem('user_' + phone)) || {};
    const name = userData.name || phone;
    const pic  = userData.pic  || '../imagess/user1pic.png';

    currentChatPhone = phone;

    blankScreen.style.display = "none";
    chatWindow.style.display  = "flex";

    document.getElementById("chatTitle").innerText = name;
    profilepic.src = pic;

    renderMessages(phone);
}

sendBtn.addEventListener("click", function() {
    const text = messageInput.value.trim();
    if (!text || !currentChatPhone) return;

    const msg = {
        from: currentUserPhone,
        to:   currentChatPhone,
        text: text,
        ts:   Date.now()
    };

    const messages = getMessages(currentChatPhone);
    messages.push(msg);
    saveMessages(currentChatPhone, messages);

    const receiverData = JSON.parse(localStorage.getItem('user_' + currentChatPhone)) || {};
    let receiverContacts = receiverData.contacts || [];
    if (!receiverContacts.find(c => c === currentUserPhone)) {
        receiverContacts.push(currentUserPhone);
        receiverData.contacts = receiverContacts;
        localStorage.setItem('user_' + currentChatPhone, JSON.stringify(receiverData));
    }

    messageInput.value = "";
    renderMessages(currentChatPhone);

    const preview = document.querySelector('[data-phone="${currentChatPhone}"] .chat-message');
    if (preview) preview.innerText = "You: " + text;
});

messageInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") sendBtn.click();
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
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        profilePanelPic.src = e.target.result;
        myProfilePic.src    = e.target.result;
    };
    reader.readAsDataURL(file);
});

saveProfileBtn.addEventListener("click", function() {
    currentUserData.name   = profileNameInput.value.trim() || currentUserData.name;
    currentUserData.status = profileStatusInput.value.trim();
    currentUserData.pic    = profilePanelPic.src;
    saveCurrentUser();

    if (currentChatPhone) {
        const el = document.querySelector(`[data-phone="${currentUserPhone}"] .chat-name`);
        if (el) el.innerText = currentUserData.name;
    }

    alert("Profile saved!");
    profilePanel.style.display = "none";
});

document.getElementById("profilePic").addEventListener("click", function() {
    if (!currentChatPhone) return;
    const userData = JSON.parse(localStorage.getItem('user_' + currentChatPhone)) || {};
    otherProfilePic.src = userData.pic || '../imagess/user1pic.png';
    otherProfileName.textContent = userData.name || currentChatPhone;
    document.getElementById("otherProfileStatus").textContent = userData.status || 'Hey there! I am using PingMe';
    otherProfilePanel.style.display = "flex";
});

closeOtherProfile.addEventListener("click", function() {
    otherProfilePanel.style.display = "none";
});

document.getElementById("contactSearch").addEventListener("input", function() {
    const q = this.value.toLowerCase();
    document.querySelectorAll('.chat').forEach(function(chat) {
        const name = chat.querySelector(".chat-name").innerText.toLowerCase();
        chat.style.display = name.includes(q) ? "flex" : "none";
    });
});

openMsgSearch.addEventListener("click", function() {
    msgSearchBar.style.display = "inline-flex";
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
    const q = this.value.toLowerCase();
    document.querySelectorAll(".sent-message, .recieved-message").forEach(function(msg) {
        const text = msg.innerText.toLowerCase();
        if (q && text.includes(q)) {
            msg.style.background = "yellow";
            msg.scrollIntoView({ behavior: "smooth" });
        } else {
            msg.style.background = "";
        }
    });
});

document.getElementById('newChatBtn').addEventListener('click', function() {
    const modal    = document.getElementById('addContactModal');
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';

    const myContacts = getMyContacts();

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key.startsWith('user_')) continue;

        const user = JSON.parse(localStorage.getItem(key));
        if (!user || user.phone === currentUserPhone) continue;

        const item = document.createElement('div');
        item.classList.add('user-select-item');
        item.innerHTML = `<strong>${user.name || user.phone}</strong><span>${user.phone}</span>`;

        item.addEventListener('click', function() {
            if (!myContacts.find(c => c === user.phone)) {
                myContacts.push(user.phone);
                saveMyContacts(myContacts);
                addContactToSidebar(user.phone);
            }
            modal.style.display = 'none';
        });

        usersList.appendChild(item);
    }

    modal.style.display = 'flex';
});

document.getElementById('cancelContactBtn').addEventListener('click', function() {
    document.getElementById('addContactModal').style.display = 'none';
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUserPhone');
    window.location.href = '../html/login.html';
});

loadContacts();