document.addEventListener("DOMContentLoaded", async () => {
    const roomsDropdown = document.getElementById('rooms');
    
    // Fetch available rooms from the server using Axios
    try {
      const response = await axios.get('/api/rooms');
      const rooms = response.data;
  
      // Clear the current options except for the default option
      roomsDropdown.innerHTML = '<option value="">--Select Room--</option>';
  
      // Populate the dropdown with rooms
      rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.roomName;
        option.textContent = room.roomName;
        roomsDropdown.appendChild(option);
      });
    } 
    
    catch (error) {
      console.error('Error fetching rooms:', error);
    }
 });


 document.getElementById('joinBtn').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const selectedRoom = document.getElementById('rooms').value;
  const nameError = document.getElementById('nameError');
  const roomError = document.getElementById('roomError');

  // Clear previous error messages
  nameError.style.display = 'none';
  nameError.textContent = '';

  roomError.style.display = 'none';
  roomError.textContent = '';

  // Validate user input
  if (!username) {
      nameError.style.display = 'block'; // Show the error message
      nameError.textContent = 'Please enter your name.';
      return; // Stop form submission
  }

  if (!selectedRoom) {
      roomError.style.display = 'block'; // Show the error message
      roomError.textContent = 'Please choose a room or create one.';
      return;
  }

  try {
      // Send the user and room details to the server
      const response = await axios.post('/api/joinRoom', { username, selectedRoom });

      // Redirect to the chat page after successful join
      if (response.status === 200) {
          window.location.href = `/chat.html?room=${selectedRoom}&user=${username}`;
      }
  } catch (error) {
      console.error('Error joining the room:', error);
      roomError.style.display = 'block';
      roomError.textContent = 'Failed to join the room. Please try again.';
  }
});

document.getElementById('createRoomBtn').addEventListener('click', async () => {
  const newRoom = document.getElementById('newRoom').value;
  const username = document.getElementById('username').value;
  const roomError = document.getElementById('roomError');
  const roomSuccess = document.getElementById('roomSuccess');
  const roomsDropdown = document.getElementById('rooms');

  // Clear previous messages
  roomError.style.display = 'none';
  roomSuccess.style.display = 'none';
  roomError.textContent = '';
  roomSuccess.textContent = '';

  // Validate username and room name
  if (!username) {
      roomError.style.display = 'block';
      roomError.textContent = 'Please enter your name before creating a room.';
      return;
  }

  if (!newRoom) {
      roomError.style.display = 'block';
      roomError.textContent = 'Please enter a room name.';
      return;
  }

  try {
      // Send data to the server to create the room
      const response = await axios.post('/api/createRoom', {username, newRoom });

      if (response.status === 200) {
          // Show success message
          roomSuccess.style.display = 'block';
          roomSuccess.textContent = 'Room created successfully!';

          // Add the new room to the dropdown list
          const option = document.createElement('option');
          option.value = newRoom;
          option.textContent = newRoom;
          roomsDropdown.appendChild(option);

          // Clear the input field after success
          document.getElementById('newRoom').value = '';
      }
  } catch (error) {
      console.error('Error creating room:', error);
      roomError.style.display = 'block';
      roomError.textContent = 'Room creation failed. Please try again.';
  }
});


