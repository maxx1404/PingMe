if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = '../html/login.html';
}

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
    const statusInput = document.getElementById('statusTextInput').value.trim();
    if (!statusInput) { alert('Please enter a status message.'); return; }

    const statuses = getStatuses();
    statuses[currentUserPhone] = {
        name: currentUserData.name,
        phone: currentUserData.phone,
        text: statusInput,
        ts: Date.now()
    };
    saveStatuses(statuses);
    document.getElementById('statusTextInput').value = '';
    document.getElementById('myCurrentStatus').innerText = statusInput;
    loadStatuses();
    alert('Status updated successfully!');
}

function loadStatuses() {
    const statusList = document.getElementById('statusList');
    statusList.innerHTML = '';
    const statuses = getStatuses();
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    Object.values(statuses).forEach(function(status) {
        if (now -status.ts > twentyFourHours) return;

        if(status.phone == currentUserPhone) {
            document.getElementById('myCurrentStatus').innerText = status.text; 
            return;
        }

        const item = document.createElement('div');
        item.classList.add('status-item');
        
        const timeAgo = Math.floor((now - status.ts) / (60 * 1000));
        const timeStr = timeAgo < 60 ? timeAgo + ' minutes ago' : Math.floor(timeAgo / 60) + ' hours ago';

        item.innerHTML = `
        <div class='status-avatar'>
        <i class='fa-solid fa-circle-half-stroke'></i>
        </div>
        <div class='status-info'>
        <div class='status-name'>${status.name}</div>
        <div class='status-time'>${timeStr}</div>
        </div>
        `;

        item.addEventListener('click', function() {
            viewStatus(status);
        });

        statusList.appendChild(item);

        });
    }

function viewStatus(status) {
    const area=document.getElementById('statusViewArea');
    const timeAgo = Math.floor((Date.now() - status.ts) / (60 * 1000));
    const timeStr = timeAgo < 60 ? timeAgo + ' minutes ago' : Math.floor(timeAgo / 60) + ' hours ago';
    
    area.innerHTML = `
    <div class='status-view-card'>
    <p class='status-view-name'>${status.name}</p>
    <p class='status-view-text'>${status.text}</p>
    <p class='status-view-time'>${timeStr}</p>
    </div>
    `;
}

document.getElementById('postStatusBtn').addEventListener('click', postStatuses);

loadStatuses();
