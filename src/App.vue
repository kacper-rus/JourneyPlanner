<template>
  <header class="app-header">
    <nav class="navbar navbar-expand-sm navbar-dark" style="background-color:Transparent; color:white">
      <a class="navbar-brand" href="logo">LOGO</a>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item" ><router-link class="nav-link" to="/">Journey Planner <span class="sr-only">(current)</span></router-link></li>
        <li v-if="loggedIn" class="nav-item"><router-link class="nav-link" to="/dashboard">Dashboard</router-link></li>
        <li class="nav-item"><router-link class="nav-link" to="/login">{{logoutMsg}}</router-link></li>
      </ul>
    </nav>
  </header>
  
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <div class="content-wrapper">
    <router-view :loggedIn="loggedIn" :userID="userID" @handleLogoutApp="handleLogoutApp" @checkLoggedInApp="checkLoggedInApp"/>
  </div>
</template>

<script>
  /* eslint-disable */
import Dashboard from './pages/Dashboard.vue'
import JourneyPlanner from './pages/JourneyPlanner.vue'
import Login from './pages/Login.vue'

export default {
  name: 'App',
  components: {
    Dashboard,
    JourneyPlanner,
    Login
  },
  data() {
    return {
      logoutMsg: 'Register/Login',
      loggedIn: false, // initial value
      userID: null
    }
  },
  watch: {
  $route(to, from) {
    console.log("WATCH"+to.path)
    // this.checkLoggedInApp()
    if (to.path === '/dashboard') {
    }
  }
},
  methods: {
    async checkLoggedInApp() {
      console.log("checkLoggedInApp")
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Authentication failed: Missing token')
        return;
      } else {
        try {
      const response = await fetch('https://kacper-ecojourney2.onrender.com/api/protected', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        alert("Auth failed")
      } else {
        const data = await response.json();
        this.userID = data.userID;
        this.loggedIn = true;
        this.logoutMsg = "Profile"
        console.log("I'm in app userID: "+ this.userID)
      }

      } catch (error) {
      console.log(error.message);
      } }
      },
      handleLogoutApp() {
        console.log("handleLogoutApp")
        this.userID = null;
        this.loggedIn = false;
        this.logoutMsg = "Register/Login"
      },
    async checkToken() {
      if (localStorage.getItem('token')) {
        // this.loggedIn = true
        // this.logoutMsg = "Profile"
        await console.log(this.userID)
        await this.checkLoggedInApp();
        await console.log(this.userID)
        console.log("SDFHBHSDFBHSDFchechtoken")
      } else {
        this.$router.push('/login')
        console.log("SDFAUYHSDFUSDFUnext")
      }
    }
  },
  created() {
    console.log("created")
    this.checkToken();
  },
  routes: [
    {
      path: '/',
      name: 'JourneyPlanner',
      component: JourneyPlanner,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
  ]
}
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;

}

.content-wrapper{
  position: fixed;
  width: 100%;
  top: 0;
  padding-top: 58px;
  height: 100vh;
  overflow: auto;
}

.app-header{
  background: rgb(11, 40, 33);
  background:linear-gradient(90deg, rgb(99, 181, 143),rgb(24, 136, 4));
  position:sticky;
  z-index: 10;
  -webkit-box-shadow: 0px 0px 31px -10px #000000; 
box-shadow: 0px 0px 31px -10px #000000;
}
</style>
