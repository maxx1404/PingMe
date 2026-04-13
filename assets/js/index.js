if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = '../html/login.html';
}

if (!localStorage.getItem('demoSeeded')) {
    localStorage.setItem('user_1234567890', JSON.stringify({
        name: 'Myself',
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

        const ts = document.createElement('span');
        ts.classList.add('timestamp');
        const d = new Date(msg.ts);
        ts.innerText = d.getHours() + ':' + d.getMinutes().toString().padStart(2, '0');
        

        if (msg.media) {
                if (msg.mediaType === 'image') {
                    bubble.innerHTML = `<img src="${msg.media}" style="max-width:220px;border-radius:8px;display:block;">`;
                } else if (msg.mediaType === 'video') {
                    bubble.innerHTML = `<video controls style="max-width:220px;border-radius:8px;display:block;">
                                            <source src="${msg.media}">
                                        </video>`;
                }
                if (msg.text) {
                    bubble.innerHTML += `<span>${msg.text}</span>`;
                }
            } else {
                bubble.innerText = msg.text;
            }

        bubble.appendChild(ts);

        messageArea.appendChild(bubble);
    });

    messageArea.scrollTop = messageArea.scrollHeight;
}



function setActiveIcon(wrapId) {
    document.querySelectorAll('.sidebar-icon-wrap img').forEach(el => {
        el.style.backgroundColor = '';
        el.style.filter = '';
    });
    const wrap = document.getElementById(wrapId);
    if (!wrap) return;
    const img = wrap.querySelector('img');
    img.style.backgroundColor = '#25d366';
    img.style.filter = 'brightness(10)';
    img.style.borderRadius = '50%';
    img.style.padding = '8px';
}

setActiveIcon('wrap-chat');

function loadContacts() {
    const chatList = document.getElementById('chatList');
    chatList.innerHTML = '';

            // Add "Myself" card at top
        const myselfDiv = document.createElement('div');
        myselfDiv.classList.add('chat');
        myselfDiv.setAttribute('data-phone', 'myself');
        myselfDiv.innerHTML = `
            <img class="profile-pic" src="${currentUserData.pic || '../imagess/user1pic.png'}">
            <div class="chat-info">
                <div class="chat-name">Myself</div>
                <div class="chat-message">Personal Own chat</div>
            </div>`;
        myselfDiv.addEventListener('click', function() {
            currentChatPhone = currentUserPhone;
            blankScreen.style.display = 'none';
            chatWindow.style.display = 'flex';
            document.getElementById('chatTitle').innerText = 'Myself';
            document.getElementById('profilePic').src = currentUserData.pic || '../imagess/user1pic.png';
            renderMessages(currentUserPhone);
        });
        chatList.appendChild(myselfDiv);

    const contacts = getMyContacts();

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

const themeToggle = document.getElementById('themeToggle');

// load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
        themeToggle.classList.replace('fa-moon', 'fa-sun');
    } else {
        themeToggle.classList.replace('fa-sun', 'fa-moon');
    }
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
        item.innerHTML = `<strong>${user.name || user.phone}</strong>`;

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

document.getElementById('attachment').addEventListener('click', function() {
    document.getElementById('mediaFileInput').click();
});


document.getElementById('mediaFileInput').addEventListener('change', function() {
    const file = this.files[0];
    if (!file || !currentChatPhone) return;

    const reader = new FileReader();
    reader.onload = function(e) {

        if (e.target.result.length > 1_000_000) {
        alert('File too large! Please pick a smaller image or video under 700KB.');
        return;
    }
        const msg = {
            from: currentUserPhone,
            to: currentChatPhone,
            text: '',
            media: e.target.result,
            mediaType: file.type.startsWith('image/') ? 'image' : 'video',
            ts: Date.now()
        };

        const messages = getMessages(currentChatPhone);
        messages.push(msg);
        saveMessages(currentChatPhone, messages);
        renderMessages(currentChatPhone);
    };
    reader.readAsDataURL(file);
    this.value = ''; // reset so same file can be sent again
});


// ─── GROUP HELPERS ───────────────────────────────────────────

function getGroups() {
    return JSON.parse(localStorage.getItem('groups')) || {};
}

function saveGroups(groups) {
    localStorage.setItem('groups', JSON.stringify(groups));
}

function getGroupMessages(groupId) {
    return JSON.parse(localStorage.getItem('conv_' + groupId)) || [];
}

function saveGroupMessages(groupId, messages) {
    localStorage.setItem('conv_' + groupId, JSON.stringify(messages));
}

function isGroupChat(phone) {
    return phone && phone.startsWith('group_');
}

function isAdmin(group) {
    return group.admins.includes(currentUserPhone);
}

// ─── LOAD GROUPS INTO SIDEBAR ────────────────────────────────

function loadGroups() {
    const groups = getGroups();
    Object.values(groups).forEach(group => {
        if (group.members.includes(currentUserPhone)) {
            addGroupToSidebar(group);
        }
    });
}

function addGroupToSidebar(group) {
    const chatList = document.getElementById('chatList');
    if (chatList.querySelector(`[data-phone="${group.id}"]`)) return;

    const chatDiv = document.createElement('div');
    chatDiv.classList.add('chat');
    chatDiv.setAttribute('data-phone', group.id);
    chatDiv.innerHTML = `
        <img class="profile-pic" src="${group.pic || '../imagess/user1pic.png'}">
        <div class="chat-info">
            <div class="chat-name">${group.name}</div>
            <div class="chat-message" id="preview_${group.id}"></div>
        </div>`;
    chatDiv.addEventListener('click', () => openGroupChat(group.id));
    chatList.appendChild(chatDiv);
}

// ─── OPEN GROUP CHAT ─────────────────────────────────────────

function openGroupChat(groupId) {
    const groups = getGroups();
    const group = groups[groupId];
    if (!group) return;

    currentChatPhone = groupId;
    blankScreen.style.display = 'none';
    chatWindow.style.display = 'flex';
    document.getElementById('chatTitle').innerText = group.name;
    document.getElementById('profilePic').src = group.pic || '../imagess/user1pic.png';

    renderGroupMessages(groupId);
}

function renderGroupMessages(groupId) {
    messageArea.innerHTML = '';
    const messages = getGroupMessages(groupId);
    let lastDate = null;

    messages.forEach(function(msg) {
        const msgDate = new Date(msg.ts).toLocaleDateString();
        if (msgDate !== lastDate) {
            const divider = document.createElement('div');
            divider.classList.add('date-divider');
            divider.innerText = msgDate === new Date().toLocaleDateString() ? 'Today' : msgDate;
            messageArea.appendChild(divider);
            lastDate = msgDate;
        }

        const bubble = document.createElement('div');
        const isMine = msg.from === currentUserPhone;
        bubble.classList.add(isMine ? 'sent-message' : 'recieved-message');

        const ts = document.createElement('span');
        ts.classList.add('timestamp');
        const d = new Date(msg.ts);
        ts.innerText = d.getHours() + ':' + d.getMinutes().toString().padStart(2, '0');

        // show sender name in group for received messages
        if (!isMine) {
            const senderName = document.createElement('div');
            senderName.style.cssText = 'font-size:11px;color:#25d366;font-weight:600;margin-bottom:2px;';
            const senderData = JSON.parse(localStorage.getItem('user_' + msg.from)) || {};
            senderName.innerText = senderData.name || msg.from;
            bubble.appendChild(senderName);
        }

        if (msg.media) {
            if (msg.mediaType === 'image') {
                bubble.innerHTML += `<img src="${msg.media}" style="max-width:220px;border-radius:8px;display:block;">`;
            } else {
                bubble.innerHTML += `<video controls style="max-width:220px;border-radius:8px;display:block;"><source src="${msg.media}"></video>`;
            }
        } else {
            const textNode = document.createElement('div');
            textNode.innerText = msg.text;
            bubble.appendChild(textNode);
        }

        bubble.appendChild(ts);
        messageArea.appendChild(bubble);
    });

    messageArea.scrollTop = messageArea.scrollHeight;
}

// ─── SEND MESSAGE IN GROUP ───────────────────────────────────
// Override sendBtn to handle both normal and group chats

sendBtn.removeEventListener('click', sendBtn._handler);
sendBtn._handler = function() {
    const text = messageInput.value.trim();
    if (!text || !currentChatPhone) return;

    if (isGroupChat(currentChatPhone)) {
        const msg = { from: currentUserPhone, text, ts: Date.now() };
        const messages = getGroupMessages(currentChatPhone);
        messages.push(msg);
        saveGroupMessages(currentChatPhone, messages);
        messageInput.value = '';
        renderGroupMessages(currentChatPhone);
    } else {
        const msg = { from: currentUserPhone, to: currentChatPhone, text, ts: Date.now() };
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
        messageInput.value = '';
        renderMessages(currentChatPhone);
    }
};
sendBtn.addEventListener('click', sendBtn._handler);



document.getElementById('newGroupBtn').addEventListener('click', function() {
    const modal = document.getElementById('createGroupModal');
    const list  = document.getElementById('groupMembersList');
    list.innerHTML = '';
    document.getElementById('groupNameInput').value = '';

    // list all contacts as checkboxes
    getMyContacts().forEach(phone => {
        const userData = JSON.parse(localStorage.getItem('user_' + phone)) || {};
        const item = document.createElement('div');
        item.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 0;';
        item.innerHTML = `
            <input type="checkbox" value="${phone}" id="chk_${phone}">
            <label for="chk_${phone}">${userData.name || phone}</label>`;
        list.appendChild(item);
    });

    modal.style.display = 'flex';
});

document.getElementById('cancelGroupBtn').addEventListener('click', function() {
    document.getElementById('createGroupModal').style.display = 'none';
});

document.getElementById('createGroupBtn').addEventListener('click', function() {
    const name = document.getElementById('groupNameInput').value.trim();
    if (!name) { alert('Please enter a group name.'); return; }

    const checked = [...document.querySelectorAll('#groupMembersList input:checked')].map(c => c.value);
    if (checked.length === 0) { alert('Please select at least one member.'); return; }

    const groupId = 'group_' + Date.now();
    const group = {
        id: groupId,
        name,
        pic: '',
        admins: [currentUserPhone],
        members: [currentUserPhone, ...checked],
        createdBy: currentUserPhone,
        ts: Date.now()
    };

    const groups = getGroups();
    groups[groupId] = group;
    saveGroups(groups);

    document.getElementById('createGroupModal').style.display = 'none';
    addGroupToSidebar(group);
    openGroupChat(groupId);
});

// ─── GROUP INFO PANEL ────────────────────────────────────────

let currentGroupId = null;

document.getElementById('profilePic').addEventListener('click', function() {
    if (!currentChatPhone) return;

    if (isGroupChat(currentChatPhone)) {
        openGroupInfo(currentChatPhone);
    } else {
        // existing contact info code
        const userData = JSON.parse(localStorage.getItem('user_' + currentChatPhone)) || {};
        otherProfilePic.src = userData.pic || '../imagess/user1pic.png';
        otherProfileName.textContent = userData.name || currentChatPhone;
        document.getElementById('otherProfileStatus').textContent = userData.status || 'Hey there!';
        otherProfilePanel.style.display = 'flex';
    }
}, true); // true = capture so it overrides the old listener

function openGroupInfo(groupId) {
    currentGroupId = groupId;
    const groups = getGroups();
    const group = groups[groupId];
    if (!group) return;

    const panel = document.getElementById('groupInfoPanel');
    document.getElementById('groupInfoPic').src = group.pic || '../imagess/user1pic.png';
    document.getElementById('groupInfoName').innerText = group.name;

    const amAdmin = isAdmin(group);

    // show admin-only controls
    document.getElementById('changeGroupPicBtn').style.display = amAdmin ? 'block' : 'none';
    document.getElementById('groupNameEditInput').style.display = amAdmin ? 'block' : 'none';
    document.getElementById('saveGroupNameBtn').style.display   = amAdmin ? 'block' : 'none';
    document.getElementById('addMemberBtn').style.display       = amAdmin ? 'block' : 'none';
    document.getElementById('groupNameEditInput').value = group.name;

    // render members list
    const membersDiv = document.getElementById('groupMembersDisplay');
    membersDiv.innerHTML = '';
    group.members.forEach(phone => {
        const u = JSON.parse(localStorage.getItem('user_' + phone)) || {};
        const isAdminMember = group.admins.includes(phone);
        const div = document.createElement('div');
        div.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 0;justify-content:space-between;';
        div.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;">
                <img src="${u.pic || '../imagess/user1pic.png'}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;">
                <span>${u.name || phone} ${isAdminMember ? '<span style="font-size:11px;color:#25d366">(admin)</span>' : ''}</span>
            </div>
            ${amAdmin && phone !== currentUserPhone ? `<button onclick="makeAdmin('${phone}')" style="font-size:11px;padding:4px 8px;border:none;border-radius:6px;background:#25d366;color:white;cursor:pointer">${isAdminMember ? 'Remove Admin' : 'Make Admin'}</button>` : ''}`;
        membersDiv.appendChild(div);
    });

    panel.style.display = 'flex';
}

document.getElementById('closeGroupInfo').addEventListener('click', function() {
    document.getElementById('groupInfoPanel').style.display = 'none';
});

// change group pic (admin only)
document.getElementById('changeGroupPicBtn').addEventListener('click', function() {
    document.getElementById('groupPicInput').click();
});

document.getElementById('groupPicInput').addEventListener('change', function() {
    const file = this.files[0];
    if (!file || !currentGroupId) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const groups = getGroups();
        groups[currentGroupId].pic = e.target.result;
        saveGroups(groups);
        document.getElementById('groupInfoPic').src = e.target.result;
        document.getElementById('profilePic').src   = e.target.result;
        // update sidebar pic
        const sidebarImg = document.querySelector(`[data-phone="${currentGroupId}"] .profile-pic`);
        if (sidebarImg) sidebarImg.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

// save group name (admin only)
document.getElementById('saveGroupNameBtn').addEventListener('click', function() {
    const newName = document.getElementById('groupNameEditInput').value.trim();
    if (!newName || !currentGroupId) return;
    const groups = getGroups();
    groups[currentGroupId].name = newName;
    saveGroups(groups);
    document.getElementById('groupInfoName').innerText = newName;
    document.getElementById('chatTitle').innerText = newName;
    const sidebarName = document.querySelector(`[data-phone="${currentGroupId}"] .chat-name`);
    if (sidebarName) sidebarName.innerText = newName;
    alert('Group name updated!');
});

// make/remove admin
function makeAdmin(phone) {
    const groups = getGroups();
    const group  = groups[currentGroupId];
    if (!group || !isAdmin(group)) return;
    if (group.admins.includes(phone)) {
        group.admins = group.admins.filter(a => a !== phone);
    } else {
        group.admins.push(phone);
    }
    saveGroups(groups);
    openGroupInfo(currentGroupId); // re-render
}

// add member (admin only)
document.getElementById('addMemberBtn').addEventListener('click', function() {
    const groups  = getGroups();
    const group   = groups[currentGroupId];
    const modal   = document.getElementById('addMemberModal');
    const list    = document.getElementById('addMemberList');
    list.innerHTML = '';

    // show contacts not already in group
    getMyContacts().forEach(phone => {
        if (group.members.includes(phone)) return;
        const u = JSON.parse(localStorage.getItem('user_' + phone)) || {};
        const item = document.createElement('div');
        item.classList.add('user-select-item');
        item.innerHTML = `<strong>${u.name || phone}</strong><span>${phone}</span>`;
        item.addEventListener('click', function() {
            group.members.push(phone);
            saveGroups(groups);
            modal.style.display = 'none';
            openGroupInfo(currentGroupId);
        });
        list.appendChild(item);
    });

    modal.style.display = 'flex';
});

document.getElementById('cancelAddMemberBtn').addEventListener('click', function() {
    document.getElementById('addMemberModal').style.display = 'none';
});

// leave group
document.getElementById('leaveGroupBtn').addEventListener('click', function() {
    if (!currentGroupId) return;
    if (!confirm('Leave this group?')) return;

    const groups = getGroups();
    const group  = groups[currentGroupId];
    group.members = group.members.filter(m => m !== currentUserPhone);
    group.admins  = group.admins.filter(a => a !== currentUserPhone);

    // if no admins left, make first member admin
    if (group.admins.length === 0 && group.members.length > 0) {
        group.admins.push(group.members[0]);
    }

    saveGroups(groups);
    document.getElementById('groupInfoPanel').style.display = 'none';

    // remove from sidebar
    const el = document.querySelector(`[data-phone="${currentGroupId}"]`);
    if (el) el.remove();

    currentChatPhone = '';
    chatWindow.style.display = 'none';
    blankScreen.style.display = 'flex';
});

// load groups on startup
loadGroups();