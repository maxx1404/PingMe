if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = '../html/login.html';
}


let viewQueue = [];
let viewIndex = 0;
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

            const timeAgo = Math.floor((now - status.ts) / 60000);
            const timeStr = timeAgo < 60 ? timeAgo + ' min ago' : Math.floor(timeAgo / 60) + ' hr ago';

            item.innerHTML = `
                <div class='status-avatar'>
                    <img src="${currentUserData.pic || '../imagess/default.png'}">
                </div>
                <div class='status-info'>
                    <div class='status-name'>${status.name}</div>
                    <div class='status-time'>${timeStr}</div>
                </div>`;

            item.addEventListener('click', () => {
                currentStatusIndex = statusArray.indexOf(status);
                viewStatus(status);
            });

            statusList.appendChild(item);
        });
    });
}



const themeToggle = document.getElementById('themeToggle');

// load saved theme on page load
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


function viewStatus(status) {
    const statuses = getStatuses();
    if (currentUserPhone !== status.phone) {
        (statuses[status.phone] || []).forEach(s => {
            if (s.id === status.id && !s.seenBy.includes(currentUserPhone)) {
                s.seenBy.push(currentUserPhone);
            }
        });
        saveStatuses(statuses);
    }

    const area = document.getElementById('statusViewArea');
    const timeAgo = Math.floor((Date.now() - status.ts) / 60000);
    const timeStr = timeAgo < 60 ? timeAgo + ' min ago' : Math.floor(timeAgo / 60) + ' hr ago';

    let mediaHTML = '';
    if (status.type === 'text') {
        mediaHTML = `<div class='status-text' style="background:${status.bgColor||'#128C7E'};padding:20px;border-radius:8px;color:#fff;font-size:20px;">${status.text}</div>`;
    } else if (status.type === 'image') {
        mediaHTML = `<img src='${status.media}' style='max-width:100%;border-radius:8px;'>`;
    } else if (status.type === 'video') {
        mediaHTML = `<video controls style="max-width:100%;border-radius:8px;"><source src="${status.media}" type="video/mp4"></video>`;
    }

    area.innerHTML = `
        <div class='status-view-card'>
            <p class='status-view-name'>${status.name}</p>
            <p class='status-view-time'>${timeStr}</p>
            ${currentUserPhone === status.phone ? `<p class='status-view-seen'>👁 Seen by ${status.seenBy.length}</p>` : ''}
            ${mediaHTML}
        </div>`;

    if (status.type === 'video') {
        area.querySelector('video').onended = () => nextStatus();
    } else {
        animateSegment(0, 7000, () => nextStatus());
    }
}

function nextStatus() {
    currentStatusIndex++;
    if (currentStatusIndex >= statusArray.length) {
        document.getElementById('statusViewArea').innerHTML = `
            <i class='fa-solid fa-circle-half-stroke' style="font-size:60px;color:seagreen"></i>
            <h2>Click on a status to view it</h2>`;
        return;
    }
    viewStatus(statusArray[currentStatusIndex]);
}



document.getElementById('postStatusBtn').addEventListener('click', postStatuses);

loadStatuses();
