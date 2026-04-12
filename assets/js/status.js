if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = '../html/login.html';
}

let statusArray = [];
let currentStatusIndex = 0;
const currentUserPhone = localStorage.getItem('currentUserPhone');
const currentUserData = JSON.parse(localStorage.getItem('user_' + currentUserPhone)) || {};

const sidebarPic = document.getElementById('sidebarPic');
if (sidebarPic && currentUserData.pic) {
    sidebarPic.src = currentUserData.pic;
}

function getStatuses() {
    return JSON.parse(localStorage.getItem('statuses')) || {};
    
    }

function saveStatuses(statuses) {
    localStorage.setItem('statuses', JSON.stringify(statuses));

}

function postStatuses() {
    const fileInput = document.getElementById('statusMediaInput');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const mediaData = e.target.result;
            const statuses = getStatuses();
            statuses[currentUserPhone] = statuses[currentUserPhone] || [];
            statuses[currentUserPhone].push({
                id: Date.now(),
                name: currentUserData.name,
                phone: currentUserData.phone,
                type: file ? (file.type.startsWith('image/') ? 'image' : 'video') : 'text',
                media: mediaData || null,
                text: '',
                ts: Date.now(),
                seenBy: []

            });
            saveStatuses(statuses);
            document.getElementById('statusMediaInput').value = '';
            document.getElementById('myCurrentStatus').innerText = 'You posted a media status';
            loadStatuses();
            alert('Media status updated successfully!');
        };
        reader.readAsDataURL(file);
    } else {
        const statusInput = document.getElementById('statusTextInput').value.trim();
        if (!statusInput) { alert('Please enter a status message.'); return; }

    const statuses = getStatuses();

        statuses[currentUserPhone] = statuses[currentUserPhone] || [];

        statuses[currentUserPhone].push({
            id: Date.now(),
            name: currentUserData.name,
            phone: currentUserPhone,
            type: "text",
            media: null,
            text: statusInput,
            ts: Date.now(),
            seenBy: []
        });

        saveStatuses(statuses); 
    document.getElementById('statusTextInput').value = '';
    document.getElementById('myCurrentStatus').innerText = statusInput;
    loadStatuses();
    alert('Status updated successfully!');
}
}

function loadStatuses() {
    statusArray = [];
    const statusList = document.getElementById('statusList');
    statusList.innerHTML = '';

    const statuses = getStatuses();
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    Object.values(statuses).forEach(userStatuses => {
        userStatuses.forEach(status => {
            if (now - status.ts > twentyFourHours) return;
            statusArray.push(status);

        const item = document.createElement('div');
        item.classList.add('status-item');
        
        const timeAgo = Math.floor((now - status.ts) / (60 * 1000));
        const timeStr = timeAgo < 60 ? timeAgo + ' minutes ago' : Math.floor(timeAgo / 60) + ' hours ago';

        item.innerHTML = `
        <div class='status-avatar'>
            <img src=" ${currentUserData.pic || '../images/default.png'}">
        </div>
        <div class='status-info'>
        <div class='status-name'>${status.name}</div>
        <div class='status-time'>${timeStr}</div>
        </div>
        `;

        item.addEventListener('click', function() {
            currentStatusIndex = statusArray.indexOf(status);
            viewStatus(statusArray[currentStatusIndex]);
        });

        statusList.appendChild(item);

        });
    });
}

function viewStatus(status) {
    const statuses = getStatuses();
    statuses[status.phone].forEach(s => {
        if(s.id === status.id && !s.seenBy.includes(currentUserPhone)) {
            s.seenBy.push(currentUserPhone);
        }
    });
    saveStatuses(statuses);

    const area=document.getElementById('statusViewArea');
    const timeAgo = Math.floor((Date.now() - status.ts) / (60 * 1000));
    const timeStr = timeAgo < 60 ? timeAgo + ' minutes ago' : Math.floor(timeAgo / 60) + ' hours ago';
    let mediaHTML = '';
    if (status.type === 'text') {
        mediaHTML = `div class='status-text'>${status.text}</div>`;
    }
    else if(status.type === 'image') {
        mediaHTML = `<img src='${status.media}' class='status-view-media'>`;
    }
    else  if(status.type ==='video') {
        mediaHTML = `<video controls class="status-view-media"> <source src="${status.media}" type="video/mp4"> </video>`;
    }
    area.innerHTML = `
    <div class='status-view-card'>
    <p class='status-view-name'>${status.name}</p>
    <p class='status-view-text'>${status.text}</p>
    <p class='status-view-time'>${timeStr}</p>
    <p class='status-view-seen'>Seen by ${status.seenBy.length}</p>
    </div>
    `;


    if (status.type === 'video') {
        const video = area.querySelector('video');
        video.onended = () => {
            nextStatus();
        };
    } else {
    setTimeout(() => {
        nextStatus();
    },70000);
}}

function nextStatus() {
    currentStatusIndex++;

    if (currentStatusIndex >= statusArray.length) {
        document.getElementById('statusViewArea').innerHTML = '';
        return;
    }
    viewStatus(statusArray[currentStatusIndex]);
}
document.getElementById('postStatusBtn').addEventListener('click', postStatuses);

loadStatuses();
