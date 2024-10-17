


const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.getElementById('messageContainer');
const notificationSound = document.getElementById('notificationSound');

const append = (message, position, time) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', position);

    const messageContent = document.createElement('span');
    messageContent.innerText = message;

    const timeElement = document.createElement('div');
    timeElement.classList.add('time');
    timeElement.innerText = time; 

    messageElement.appendChild(messageContent);
    messageElement.appendChild(timeElement);
    messageContainer.append(messageElement);

    
    messageContainer.scrollTop = messageContainer.scrollHeight;
};

const name = prompt("Enter your name to join");
if (name) {
    socket.emit('new-user-joined', name);
} else {
    alert("Name is required to join the chat!");
}

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'left', '');
    notificationSound.play(); 
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left', data.time);
    notificationSound.play(); 
});

socket.on('user-left', name => {
    append(`${name} left the chat`, 'left', '');
    notificationSound.play(); 
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    append(`You: ${message}`, 'right', time);
    socket.emit('send', message);
    messageInput.value = ''; 
});
