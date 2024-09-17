// Initialize Socket.io connection
const socket = io();

// Get username and room from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('user');
const room = urlParams.get('room');

// Update room and username in the header
document.getElementById('roomName').textContent = room;
document.getElementById('userName').textContent = username;

// Emit 'joinRoom' event when the user joins
socket.emit('joinRoom', { username, room });

// Listen for messages from the server
socket.on('message', (msg) => {
    displayMessage(msg);
});

// Function to display chat messages in the chat box
function displayMessage({ username: sender, message }) {
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('div');

    if (sender === 'System') {
        messageElement.classList.add('system-message');
    } else if (sender === username) {
        messageElement.classList.add('my-message');
    } else {
        messageElement.classList.add('other-message');
    }

    if(sender==='System')
        messageElement.textContent = `${message}`;
    else  
        messageElement.textContent = `${sender}: ${message}`;
    chatBox.appendChild(messageElement);

    // Scroll chat box to the latest message
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Listen for user submission of messages
document.getElementById('sendMessage').addEventListener('click', () => {
    const message = document.getElementById('messageInput').value;
    if (message.trim()) {
        socket.emit('chatMessage', { room, username, message });
        document.getElementById('messageInput').value = ''; // Clear input
    }
});

// Listen for member list update from the server
socket.on('updateMembers', (members) => {
    const memberList = document.getElementById('memberList');
    memberList.innerHTML = ''; // Clear the list
    members.forEach(member => {
        const memberItem = document.createElement('div');
        memberItem.classList.add('member-box'); 
        memberItem.textContent = member;
        memberList.appendChild(memberItem);
    });
});
