<template>
  <div>
  <!-- CONFETTI CANVAS YIHAAAA -->
  <canvas ref="confetti" class="confetti-canvas"></canvas>
    <div v-if="this.loading">
      <p>Loading... (u gotta be patient)</p>
    </div>
    <div v-if="!loggedIn && !this.loading">
      <div>

        <h1 v-show="showRegisterForm">Create an account to join our <span id="eco-bold-green">eco-friendly</span> family! :)</h1>
        <h1 v-show="!showRegisterForm" >Login in to join our amazing <span id="eco-bold-green">eco-friendly</span> family! :)</h1>
        <div class="form-container">
          <div v-show="showRegisterForm" class="register-form">
          <form @submit.prevent="handleRegisterSubmit">
            <div v-if="registerErrorMsg" class="error-message">
              <p class="error-text">{{ registerErrorMsg }}</p>
            </div>
            <div v-if="registerSuccMsg" class="succ-message">
              <p class="succ-text">{{ registerSuccMsg }}</p>
            </div>
            <div>
              <label for="register-username">Username:</label>
              <input type="text" id="register-username" ref="registerUsernameInput" v-model="registerUsername" required>
            </div>
            <div>
              <label for="register-email">Email:</label>
              <input type="email" id="register-email" ref="registerEmailInput" v-model="registerEmail" required>
            </div>
            <div>
              <label for="register-password">Password:</label>
              <input type="password" id="register-password" ref="registerPasswordInput" v-model="registerPassword" required>
            </div>
            <button type="submit">Register</button>
            <button class="toggle-btn" @click="toggleShowRegisterForm">Already have an eco-friendly account?</button>
          </form>
        </div>
      <div v-show="!showRegisterForm" class="login-form" >
        <div v-if="loginErrorMsg" class="error-message">
          <p class="error-text">{{ loginErrorMsg }}</p>
        </div>
        <form @submit.prevent="handleLoginSubmit">
          <div>
            <label for="login-username">Username:</label>
            <input type="text" id="login-username" ref="loginUsernameInput" v-model="loginUsername" required>
          </div>
          <div>
            <label for="login-password">Password:</label>
            <input type="password" id="login-password" ref="loginPasswordInput" v-model="loginPassword" required>
          </div>
          <button type="submit">Login</button>
          <button class="toggle-btn" @click="toggleShowRegisterForm">Ready to register?</button>
        </form>

      </div>
    </div>
      </div>
    </div>
    <!-- Logout -->
    <div v-if="loggedIn">
      <p>Welcome back <b style="color: green; font-weight:600" >{{ username }}</b>! <br> Let's plan another eco-friendly journey! ;)</p>
      <p v-if="!groupName" >You don't belong to a <b style="color: green; font-weight:600" >Group</b>! <br></p>
      <p v-if="groupName" >You belong to the <b style="color: green; font-weight:600" >{{ groupName }}</b> Group</p>
      <button id="logout" @click="handleLogout">Logout</button>

      <!-- Groups content -->
      <h1>Eco-<b style="color: green; font-weight:600" >Groups</b>!</h1>
      <p>Wanna work in a team to make this world a better place? 
        By working in a team, you can make a real difference and create a brighter, cleaner, and more sustainable future. Join a <b style="color: green; font-weight:600" >Group</b> now and be part of the solution!</p>
  <!-- Create Group -->
  <div class="login-form">
        <p>Not yet in the <b style="color: green; font-weight:600" >Group</b>? <br> Create one!</p>
    <form @submit.prevent="createGroup">
      <input type="text" v-model="newGroupName" placeholder="Name of your new group" required>
      <button type="submit">Create a group!</button>
    </form>
    <p v-if="newGroupMessage">{{ newGroupMessage }}</p>
  </div>
  <!-- Join group -->
  <div class="login-form">
        <p>Wanna join a already existing <b style="color: green; font-weight:600" >Group</b>? <br> Join one!</p>
    <form @submit.prevent="joinGroup">
      <input type="text" v-model="joinGroupName" placeholder="Name of the group" required>
      <button type="submit">Join a group!</button>
    </form>
    <p v-if="joinGroupMessage">{{ joinGroupMessage }}</p>
  </div>
  <!-- Friend's table group -->
  <div class="globalRanking-table-title">
      <h2>Your <b style="color: green; font-weight:600" >Eco</b>-friends!</h2>
    </div>
    <br/>
    <div v-if="!groupName"><p>Join a group to see your friends!</p></div>
    <div v-if="groupName">
    <table class="globalRankingTable" >
    <thead>
      <tr>
        <th>Rank</th>
        <th>Nickname</th>
      </tr>
    </thead>
    <tbody>
      <!-- Display the entries, sorted by CO2 score in ascending order -->
      <tr v-for="(entry, index) in this.groupFriends" :key="index" v-bind:class="{ 'highlight-row': entry.userID === this.userID }">
        <td>{{ index + 1 }}</td>
        <td>{{ entry.username }}</td>
      </tr>
    </tbody>
    </table>
  </div>
  <!-- Leave group -->
  <div v-if="groupName">
    <h1>Leave your <b style="color: green; font-weight:600" >group</b> <br></h1>
    <button id="logout" @click="leaveGroup">Leave</button>
    <p>We sad to hear you want to leave. Hope to see you soon!</p>
    <p v-if="leaveGroupMessage">{{ leaveGroupMessage }}</p>
  </div>
  <!-- Change password content -->
  <h1>Change your green <b style="color: green; font-weight:600" >password</b></h1>
  <p>It takes <b style="color: green; font-weight:600" >zero</b> Co2 to change your password ;)<br> </p>
  <div class="login-form">
  <form @submit.prevent="handleChangePassword">
      <input type="password" placeholder="You new amazing password" id="change-password" ref="changePasswordInput" v-model="changePassword" required>
      <button type="submit">Change your password</button>
    </form>
  </div>

    </div>

  </div>
</template>

<script>
import axios from 'axios'
import ConfettiGenerator from 'confetti-js';
import Swal from 'sweetalert2';
export default {
  data() {
    return {
      registerUsername: '',
      registerEmail: '',
      registerPassword: '',
      loginUsername: '',
      loginPassword: '',
      changePassword: '',
      loggedIn: false,
      username: '',
      userID: null,
      message: "",
      loading: false,
      loginErrorMsg: "",
      registerErrorMsg: "",
      registerSuccMsg: "",
      showRegisterForm: true,
      newGroupName: '',
      newGroupMessage: '',
      joinGroupName: '',
      joinGroupMessage: '',
      inGroup: false,
      groupName: '',
      groupID: null,
      groupFriends: [],
      leaveGroupMessage: '',
    }
  },
  methods: {
    toggleShowRegisterForm() {
      this.showRegisterForm = !this.showRegisterForm;
    },
    handleRegisterSubmit() {
      if (this.registerPassword.length >= 6 && /[A-Z]/.test(this.registerPassword) && /\d/.test(this.registerPassword)) {
        console.log("Password meets requirements");
      } else {
        this.registerErrorMsg = "Oh no! You password is not secure enough! It must have at least 6 letters, 1 digit and 1 uppercase letter :)";
        this.registerPassword = '';
        return;
      }

      fetch('http://localhost:3000/users/register', {
        method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: this.registerUsername, email: this.registerEmail, password: this.registerPassword
        }),
      })
      .then(response => {
        console.log(response)
        if (response.ok) {
            return response.json().then(() => {
              // alert(`Registration successful. Username: ${data.message}`);
              this.registerEmail = '';
              this.registerPassword = '';
              this.registerUsername = '';
              this.registerErrorMsg = '';
              this.startConfetti();
              this.registerSuccMsg = "Congratulations! You are one step closer to safe the planet from Co2! :)"
            });
          }
          else {
              this.registerSuccMsg = '';
              this.registerErrorMsg = "Username already exists.";
              this.registerUsername = '';
          }

      })
      .catch(error => {
        alert(`Error: ${error.message}`);
      })

    },
     handleLoginSubmit() {

      
      fetch('https://kacper-ecojourney2.onrender.com:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: this.loginUsername, password: this.loginPassword
        }),
      })
      .then(response => {

        if (response.ok) {
          
          this.loggedIn = true
          this.username = this.loginUsername
          this.loginUsername = '';
          this.loginPassword = '';
          return response.json();
        } else {
          return response.json();
        }
      })
      .then( data => {
        this.loginErrorMsg = data.message;
        console.log(data)
        localStorage.setItem('token', data.token);
        console.log(localStorage.getItem('token'))
        this.$emit('checkLoggedInApp')
        console.log("6999")
        this.loginPassword = "";
        this.$router.push('/')
      })
      .catch(error => {
        console.log(error)
      })
    },
    handleChangePassword() {

      if (this.changePassword.length >= 6 && /[A-Z]/.test(this.changePassword) && /\d/.test(this.changePassword)) {
        console.log("Password meets requirements");
      } else {
        let errorMsg = "You password is not secure enough! It must have at least 6 letters, 1 digit and 1 uppercase letter :)";
        this.showMessage('Oh no!', errorMsg, 'warning');
        this.changePassword = '';
        return;
      }

      fetch('http://localhost:3000/users/changePassword', {
        method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userID: this.userID, password: this.changePassword
        }),
      })
      .then(response => {
        console.log(response)
        if (response.ok) {
            return response.json().then((data) => {
              console.log(data)
              this.startConfetti();
              this.showMessage('Success!', "Your password has been successfully changed!", 'success');
              this.changePassword = '';
              // this.registerSuccMsg = "Congratulations! You are one step closer to safe the planet from Co2! :)"
            });
          }
          else {
            return response.json().then((data) => {
              this.showMessage('Oh no!', data.message, 'error');
              console.log(data)
              this.changePassword = '';
              // this.registerSuccMsg = "Congratulations! You are one step closer to safe the planet from Co2! :)"
            });
          }

      })
      .catch(error => {
        alert(`Error: ${error.message}`);
      })

    },
    handleLogout() {
      this.$emit('handleLogoutApp')
      // Clear the session and update the UI
      fetch("http://localhost:3000/users/logout", {
        method: "POST",
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            localStorage.removeItem('token');
            this.loggedIn = false;
            this.username = "";
            this.loginErrorMsg = "";
            this.registerErrorMsg = "";
            // console.log(this.$refs)
            // this.$refs.loginUsernameInput.value = '';
            // alert(this.$refs.loginPasswordInput.value)
            // this.$refs.loginPasswordInput.value = '';
            // alert(this.$refs.loginPasswordInput.value)
          }
        })
        .catch((error) => {
          alert("error")
          console.log(error);
        });
    },
    async checkLoggedIn() {


    const token = localStorage.getItem('token');
    if (!token) {
      this.message = 'Authentication failed: Missing token';
      return;
    } else {
      try {
    const response = await fetch('http://localhost:3000/api/protected', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      alert("Auth failed")
    } else {
      const data = await response.json();
      this.username = data.username;
      this.userID = data.userID;
      this.loggedIn = true;
      console.log(data)
    }

  } catch (error) {
    console.log(error.message);
  } }

      // // Check if the user is already logged in
      // await fetch("http://localhost:3000/users/checkLoggedIn", {
      //   method: "GET",
      //   credentials: "include",
      // })
      //   .then((response) => {
      //     console.log(response)
      //     if (response.ok) {
      //       this.loggedIn = true;
      //       this.$emit('updateLogged', this.loggedIn)
      //       return response.json();
      //     }
      //   })
      //   .then((data) => {
      //     console.log(data)
      //     console.log("username: "+data.username)
      //     this.username = data.username;
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    },
    async createGroup() {
      await fetch('http://localhost:3000/getGroups')
        .then(response => response.json())
        .then(async groups => {

          const exists = groups.some(group => group.groupName === this.newGroupName.trim())
          if (exists) {
            // this.newGroupMessage = 'Group name already exists.'
            this.showMessage('Try again!', 'Group name already exists.', 'warning');
            this.newGroupName = ''
          } else {
            // Code to create the group goes here

        await fetch('http://localhost:3000/createGroup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          newGroupName: this.newGroupName.trim()
        }),
      })
      .then(response => {

        if (response.ok) {
          this.newGroupMessage = 'Group '+this.newGroupName+' created successfully!'
          this.showMessage('Success! Group created!', this.newGroupMessage, 'success');
          this.newGroupName = ''
          this.startConfetti();
          return response.json();
        } else {
          this.newGroupMessage = 'An error occured. Try again later!'
          this.newGroupName = ''
          return response.json();
        }
      })
      .then(data => {
        console.log(data)
        this.newGroupMessage = data.message
      })
      .catch(error => {
        this.newGroupMessage = 'An error occured. Try again later!'
        this.newGroupName = ''
        console.log(error)
      })

            
          }
        })
    },
    async joinGroup() {
      console.log(this.username)
      await fetch('http://localhost:3000/getGroups')
        .then(response => response.json())
        .then(async groups => {
          console.log(groups)
          const exists = groups.some(group => group.groupName === this.joinGroupName)
          if (exists) {
          const groupToJoinID = groups.find(group => group.groupName === this.joinGroupName).groupID
          console.log(groupToJoinID)
          console.log(this.username)

      await fetch('http://localhost:3000/joinGroup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          groupID: groupToJoinID, username: this.username
        }),
      })
      .then(async response => {

        if (response.ok) {
          this.groupID = groupToJoinID;
          this.joinGroupMessage = 'You joined \''+this.joinGroupName+"' group!"
          this.showMessage('Success!', this.joinGroupMessage, 'success');
          this.groupName = this.joinGroupName;
          this.startConfetti();
          this.joinGroupName = ''
          const response2 = await axios.get('http://localhost:3000/users');
          const usersArray = await response2.data;
          const groupFriends = await usersArray.filter(obj => obj.groupID == this.groupID);
          this.groupFriends = groupFriends;
          console.log(response2)
          console.log(usersArray)
          console.log(groupFriends)
          return response.json();
        } else {
          return response.json();
        }
      })
      .then(data => {
        console.log(data)
        if (data.error) {
          this.joinGroupMessage = data.error;
        }

      })
      .catch(error => {
        this.joinGroupMessage = 'An error occured. Try again later!'
        this.joinGroupMessage = ''
        console.log(error)
      })

          } else {
            // Code to create the group goes here
            this.joinGroupMessage = "'"+this.joinGroupName+"' group doesn't exist"
            this.joinGroupName = ''
          }
        })
    },
    async leaveGroup() {
    try {
      const response = await axios.delete(`http://localhost:3000/joinGroup/${this.userID}`);
      console.log(response.data); // Handle the response data here
      this.leaveGroupMessage = response.data.message
      this.groupID = null;
      this.groupName = '';
      this.showMessage('You left your group!', 'Your eco-friends will miss you :(', 'warning');
    } catch (error) {
      console.error(error); // Handle the error here
      this.showMessage('Something went wrong', 'Try again later', 'error');
    }
    },
    startConfetti() {
      document.querySelector('.confetti-canvas').style.display = 'block';
      const confetti = new ConfettiGenerator({
        target: this.$refs.confetti,
        max: 80,
        size: 1,
        animate: true,
        props: ['circle', 'square', 'triangle', 'line'],
        colors: [[255, 0, 0], [0, 255, 0], [0, 0, 255]],
        clock: 25,
      });
      confetti.render();
      setTimeout(() => {
        confetti.clear();
        document.querySelector('.confetti-canvas').style.display = 'none';
      }, 2000);
    },
    showMessage(title, text, icon) {
      Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'OK'
      });
    },
  },
  async created() {

    this.loading = true;
    await this.checkLoggedIn();
    this.loading = false;
    console.log("this.loggedIn: "+this.loggedIn)
    console.log("this.username: "+this.username)
    this.loginErrorMsg = "";


    const response = await axios.get('http://localhost:3000/users');
    const usersArray = await response.data;
    const user = await usersArray.find(obj => obj.username == this.username);
    this.groupID = user.groupID
    if (this.groupID) {
      const groupFriends = await usersArray.filter(obj => obj.groupID == this.groupID);
      this.groupFriends = groupFriends;
      console.log(groupFriends)
    }
    this.userID = user.userID
  //   const userData = {
  //     "groupID": this.groupID,
  //     "userID":this.userID
  // }
  //   this.$emit('updateUserID', userData)
    if (this.groupID) {
      const response2 = await axios.get('http://localhost:3000/getGroups');
      const groupsArray = await response2.data;
      console.log(groupsArray)
      console.log(this.groupID)
      const groupName = await groupsArray.find(obj => obj.groupID == this.groupID).groupName;
      console.log(groupName)

      this.groupName = groupName     
    }

    

  },
}
</script>



<style scoped>
@import url('https://cdn.jsdelivr.net/npm/sweetalert2@10.16.6/dist/sweetalert2.min.css');
  body {
    background-color: #fff;
    color: #333;
    font-family: Arial, sans-serif;
  }

  h1 {
    text-align: center;
    margin-top: 40px;
    margin-bottom: 20px;
    font-size: 28px;
  }

  .form-container {
    display: flex;
    justify-content: center;
    margin: 0 auto;
    max-width: 800px;
  }

  .register-form,
  .login-form {
    flex-basis: 45%;
    margin: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
  }

  input[type="text"],
  input[type="email"],
  input[type="password"] {
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: none;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    font-size: 16px;
  }

  button[type="submit"] {
    display: block;
    width: 100%;
    padding: 10px;
    margin-top: 20px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  }

  button[type="submit"]:hover {
    background-color: #3e8e41;
  }

  p {
    text-align: center;
    margin-top: 20px;
    font-size: 18px;
  }
  #logout {
  display: block;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #f44336;
  border: none;
  border-radius: 4px;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: auto;
}

#logout:hover {
  background-color: #d32f2f;
}
.error-message {
    background-color: #f8d7da;
    border: 1px solid black;
    border-radius: 12px;
    color: #721c24;
    margin-bottom: 5px;
}

.error-text {
  font-weight: bold;
  font-size: 15px;
}
.confetti-canvas {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.succ-message {
    background-color: #62de7f;
    border: 1px solid black;
    border-radius: 12px;
    color: #1f4124;
    margin-bottom: 5px;
}

.succ-text {
  font-weight: bold;
  font-size: 15px;
}
.content-wrapper{
  position: static;
  width: 100%;
  top: 0;
  padding-top: 90px  !important;
  height: 100vh;
  overflow: auto;

}
#eco-bold-green{
  font-weight: bold;
  color: green;
}
.toggle-btn {

  color: #4d962b; 
  background-color: transparent; 
  border: none; 
  display: block;
  margin: 0 auto;
}
.toggle-btn:hover {

text-decoration: underline; 
cursor: pointer;
}
.register-form[data-v-15717af5], .login-form[data-v-15717af5] {
    width: 50%;
    margin: auto;
    margin-top: 2rem;
}
p {
  width: 70%;
  margin: auto;
}
body {
  overflow-y: scroll;
}
.globalRankingTable {
  margin-top: 20px;
  border-collapse: collapse;
  width: 50%;
  margin: 1rem auto;
}

.globalRankingTable th, .globalRankingTable td {
  padding: 8px;
  text-align: center;
  border: 1px solid #ddd;
}

.globalRankingTable th {
  background-color: lightblue
}

.globalRankingTable .highlight-row td {
  background-color: #bbffc0;
}

.globalRanking-table-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  margin-bottom: -5px;
}

.globalRanking-table-title h2 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 0;
}
</style>