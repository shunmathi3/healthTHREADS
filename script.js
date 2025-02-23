function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  }
 
  function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
 


  function clearChat(chatKey) {
    if (confirm('Are you sure you want to clear all chat messages? This action cannot be undone.')) {
      saveData(chatKey, []);
      window.location.reload();
    }
  }
 
 
  function clearAllPosts() {
    if (confirm('Are you sure you want to clear all posts? This action cannot be undone.')) {
      saveData('posts', []);
      window.location.reload();
    }
  }
 
 
  function viewProfile(username) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser.role !== 'doctor') {
      alert('Only doctors can view patient profiles.');
      return;
    }
 
    const profileData = JSON.parse(localStorage.getItem('profileData')) || {};
    const patientProfile = profileData[username];
 
    if (patientProfile) {
      const profileDetails = `
        <h2>Patient Profile</h2>
        <p><strong>Name:</strong> ${patientProfile.name}</p>
        <p><strong>Age:</strong> ${patientProfile.age}</p>
        <p><strong>Gender:</strong> ${patientProfile.gender}</p>
        <p><strong>Medical History:</strong> ${patientProfile.medicalHistory}</p>
        <p><strong>Weight:</strong> ${patientProfile.weight}</p>
      `;
 
     
      const modal = document.getElementById('profile-modal');
      const modalContent = document.getElementById('modal-profile-details');
      modalContent.innerHTML = profileDetails;
      modal.style.display = 'flex';
 
      setTimeout(() => {
        modal.style.display = 'none';
      }, 10000);
 
     
      document.getElementById('close-modal').onclick = () => {
        modal.style.display = 'none';
      };
    } else {
      alert('Profile not found.');
    }
  }
 


  if (window.location.pathname.endsWith('login.html')) {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
 
      const role = document.getElementById('role').value;
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
 
   
      const users = getData('users');
 
     
      const user = users.find(
        (u) => u.username === username && u.password === password && u.role === role
      );
 
      if (user) {
       
        localStorage.setItem('currentUser', JSON.stringify({ role, username }));
       
        window.location.href = 'profile.html';
      } else {
       
        const newUser = { username, password, role };
        users.push(newUser);
        saveData('users', users);
 
       
        localStorage.setItem('currentUser', JSON.stringify({ role, username }));
       
        window.location.href = 'profile.html';
      }
    });
  }
 
 
  if (window.location.pathname.endsWith('profile.html')) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      window.location.href = 'login.html';
    }
 
    const profileForm = document.getElementById('profile-form');
    const profileDetails = document.getElementById('profile-details');
 
    if (currentUser.role === 'doctor') {
      document.getElementById('doctor-fields').style.display = 'block';
    } else if (currentUser.role === 'patient') {
      document.getElementById('patient-fields').style.display = 'block';
    }
 
   
    const profileData = JSON.parse(localStorage.getItem('profileData')) || {};
    const userProfile = profileData[currentUser.username] || {};
 
   
    if (currentUser.role === 'doctor') {
      document.getElementById('yearsExperience').value = userProfile.yearsExperience || '';
      document.getElementById('workplace').value = userProfile.workplace || '';
      document.getElementById('certifications').value = userProfile.certifications || '';
    } else if (currentUser.role === 'patient') {
      document.getElementById('age').value = userProfile.age || '';
      document.getElementById('gender').value = userProfile.gender || '';
      document.getElementById('medicalHistory').value = userProfile.medicalHistory || '';
      document.getElementById('weight').value = userProfile.weight || '';
    }
 
   
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
 
      if (currentUser.role === 'doctor') {
        profileData[currentUser.username] = {
          name: currentUser.username,
          yearsExperience: document.getElementById('yearsExperience').value,
          workplace: document.getElementById('workplace').value,
          certifications: document.getElementById('certifications').value,
        };
      } else if (currentUser.role === 'patient') {
        profileData[currentUser.username] = {
          name: currentUser.username,
          age: document.getElementById('age').value,
          gender: document.getElementById('gender').value,
          medicalHistory: document.getElementById('medicalHistory').value,
          weight: document.getElementById('weight').value,
        };
      }
 
     
      localStorage.setItem('profileData', JSON.stringify(profileData));
 
     
      window.location.href = 'index.html';
    });
 
   
    function displayProfile(username) {
      const profile = profileData[username];
      if (!profile) {
        profileDetails.innerHTML = '<p>No profile data found.</p>';
        return;
      }
 
      if (currentUser.role === 'doctor') {
        profileDetails.innerHTML = `
          <p><strong>Name:</strong> ${profile.name}</p>
          <p><strong>Years of Experience:</strong> ${profile.yearsExperience}</p>
          <p><strong>Workplace:</strong> ${profile.workplace}</p>
          <p><strong>Certifications:</strong> ${profile.certifications}</p>
        `;
      } else if (currentUser.role === 'patient') {
        profileDetails.innerHTML = `
          <p><strong>Name:</strong> ${profile.name}</p>
          <p><strong>Age:</strong> ${profile.age}</p>
          <p><strong>Gender:</strong> ${profile.gender}</p>
          <p><strong>Medical History:</strong> ${profile.medicalHistory}</p>
          <p><strong>Weight:</strong> ${profile.weight}</p>
        `;
      }
    }
 
   
    displayProfile(currentUser.username);
  }
 
 
  if (window.location.pathname.endsWith('index.html')) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      window.location.href = 'login.html';
    }
 
   
    document.getElementById('username').textContent = currentUser.username;
 
   
    const doctorChatButton = document.querySelector('nav button:nth-child(2)');
    if (currentUser.role === 'patient') {
      doctorChatButton.style.display = 'none';
    } else {
      doctorChatButton.style.display = 'inline-block';
    }
 
   
    const emergencyChatForm = document.getElementById('emergency-chat-form');
    const emergencyChat = document.getElementById('emergency-chat');
 
   
    const emergencyMessages = getData('emergencyChatMessages');
    emergencyMessages.forEach(message => {
      const messageDiv = document.createElement('div');
      messageDiv.innerHTML = `<strong><a href="#" onclick="viewProfile('${message.sender}')">${message.sender}</a>:</strong> ${message.text}`;
      emergencyChat.appendChild(messageDiv);
    });
 
    emergencyChatForm.addEventListener('submit', (e) => {
      e.preventDefault();
 
      const message = document.getElementById('emergency-message').value.trim();
      if (message) {
        const sender = currentUser.username;
        const emergencyMessages = getData('emergencyChatMessages');
        emergencyMessages.push({ sender, text: message });
        saveData('emergencyChatMessages', emergencyMessages);
 
       
        document.getElementById('emergency-message').value = '';
 
       
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = `<strong><a href="#" onclick="viewProfile('${sender}')">${sender}</a>:</strong> ${message}`;
        emergencyChat.appendChild(messageDiv);
      }
    });
 
   
    const doctorChatForm = document.getElementById('doctor-chat-form');
    const doctorChat = document.getElementById('doctor-chat');
 
   
    const doctorMessages = getData('doctorChatMessages');
    doctorMessages.forEach(message => {
      const messageDiv = document.createElement('div');
      messageDiv.innerHTML = `<strong><a href="#" onclick="viewProfile('${message.sender}')">${message.sender}</a>:</strong> ${message.text}`;
      doctorChat.appendChild(messageDiv);
    });
 
   
    doctorChatForm.addEventListener('submit', (e) => {
      e.preventDefault();
 
      const message = document.getElementById('doctor-message').value.trim();
      if (message) {
        const sender = currentUser.username;
        const doctorMessages = getData('doctorChatMessages');
        doctorMessages.push({ sender, text: message });
        saveData('doctorChatMessages', doctorMessages);
 
       
        document.getElementById('doctor-message').value = '';
 
     
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = `<strong><a href="#" onclick="viewProfile('${sender}')">${sender}</a>:</strong> ${message}`;
        doctorChat.appendChild(messageDiv);
      }
    });
 
   
    const postsList = document.getElementById('posts-list');
    const posts = getData('posts');
 
    posts.forEach((post, index) => {
      const postDiv = document.createElement('div');
      postDiv.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <p>By: ${post.author}</p>
        <div id="comments-${index}">
          <!-- Comments will be dynamically added here -->
        </div>
        <form id="comment-form-${index}" class="comment-form">
          <input type="text" id="comment-${index}" placeholder="Add a comment..." required>
          <button type="submit">Comment</button>
        </form>
        ${post.author === currentUser.username ? `<button onclick="deletePost(${index})">Delete Post</button>` : ''}
      `;
      postsList.appendChild(postDiv);
 
     
      const comments = post.comments || [];
      const commentsDiv = document.getElementById(`comments-${index}`);
      comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.textContent = `${comment.commenter}: ${comment.text}`;
        commentsDiv.appendChild(commentDiv);
      });
 
     
      const commentForm = document.getElementById(`comment-form-${index}`);
      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
 
        const comment = document.getElementById(`comment-${index}`).value.trim();
        if (comment) {
          const commenter = currentUser.username;
          posts[index].comments = posts[index].comments || [];
          posts[index].comments.push({ commenter, text: comment });
          saveData('posts', posts);
 
         
          document.getElementById(`comment-${index}`).value = '';
 
         
          const commentDiv = document.createElement('div');
          commentDiv.textContent = `${commenter}: ${comment}`;
          commentsDiv.appendChild(commentDiv);
        }
      });
    });
 
   
    const newPostForm = document.getElementById('new-post-form');
    newPostForm.addEventListener('submit', (e) => {
      e.preventDefault();
 
      const title = document.getElementById('title').value.trim();
      const content = document.getElementById('content').value.trim();
 
      if (title && content) {
        const newPost = {
          title,
          content,
          author: currentUser.username,
          comments: [],
        };
        posts.push(newPost);
        saveData('posts', posts);
 
       
        document.getElementById('title').value = '';
        document.getElementById('content').value = '';
 
       
        window.location.reload();
      }
    });
 
   
    function deletePost(index) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser) {
        alert('You must be logged in to delete posts.');
        return;
      }
 
      const posts = getData('posts');
      if (posts[index].author === currentUser.username) {
        posts.splice(index, 1);
        saveData('posts', posts);
        window.location.reload();
      } else {
        alert('You can only delete your own posts.');
      }
    }
 
    const navButtons = document.querySelectorAll('nav button');
    navButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabName = button.getAttribute('onclick').replace("showTab('", "").replace("')", "");
        showTab(tabName);
      });
    });
 
    showTab('community');
  }
 


  function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
      selectedTab.style.display = 'block';
    }
  }
 


  function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }
