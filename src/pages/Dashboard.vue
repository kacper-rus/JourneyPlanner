<template>
  <a class="dashboard-item" @click="currTab = 'Tab1'">Individual</a>
  <a class="dashboard-item" @click="currTab = 'Tab2'">Group</a>
  <div class="container" v-if="currTab=='Tab1'">

    <!-- <div>
    <datepicker v-model="fromDate" placeholder="From"></datepicker>
    <datepicker v-model="toDate" placeholder="To"></datepicker>
    <button @click="logDates">Log Dates</button>
  </div>


  <div v-for="(journey, index) in this.filteredDatabyDate" :key="index">
      <p>Journey ID: {{ journey.journeyID }}</p>
      <p>User ID: {{ journey.userID }}</p>
      <p>Start: {{ journey.starPoint }}</p>
      <p>Destination: {{ journey.endPoint }}</p>
      <p>Distance: {{ journey.distance }}</p>
      <p>Date: {{ journey.journeyDate }}</p>
      <hr>
    </div> -->

    <div class="speedometer-title">
      <h2>User Feedback Scale</h2>
    </div>

    <vue-speedometer 
      :width="500"
      :needleHeightRatio="0.7"
      :value="this.loggedUserData.distance && this.loggedUserData.co2Output ? (this.loggedUserData.co2Output / this.loggedUserData.distance).toFixed(2)*100 : 0"
      :segmentColors='["limegreen", "yellowgreen", "gold", "orange", "tomato"]'
      currentValueText="CO2 Output"
      :customSegmentLabels='[
        {
          text: "Very Good",
          position: "INSIDE",
          color: "#555",
          fontSize: "15px",
        },
        {
          text: "Good",
          position: "INSIDE",
          color: "#555",
          fontSize: "15px",
        },
        {
          text: "Ok",
          position: "INSIDE",
          color: "#555",
          fontSize: "15px",
        },
        {
          text: "Bad",
          position: "INSIDE",
          color: "#555",
          fontSize: "15px",
        },
        {
          text: "Very Bad",
          position: "INSIDE",
          color: "#555",
          fontSize: "15px",
        },
      ]'
      :ringWidth="47"
      :needleTransitionDuration="3333"
      needleTransition="easeElastic"
      needleColor="steelblue"
      textColor="steelblue"
    />

    <div class="globalRanking-table-title">
      <h2>Global Ranking Table</h2>
    </div>

    <table class="globalRankingTable">
    <thead>
      <tr>
        <th>Rank</th>
        <th>User ID</th>
        <th>CO2 Output</th>
      </tr>
    </thead>
    <tbody>
      <!-- Display the entries, sorted by CO2 score in ascending order -->
      <tr v-for="(entry, index) in journeyArray" :key="index" v-bind:class="{ 'highlight-row': entry.userID === highlightUserID }">
        <td>{{ index + 1 }}</td>
        <td>{{ entry.userID }}</td>
        <td>{{ entry.co2Output }}</td>
      </tr>
    </tbody>
    </table>

    <div class="individual-statistics-title">
      <h2>User Statistical Readings</h2>
    </div>

    <div class="statistics-container">
      <div class="statistic">
        <h4>Average CO2 Output Per Journey</h4>
        <p>15</p>
      </div>
      <div class="statistic">
        <h4>Total CO2 Output</h4>
        <p>{{ this.loggedUserData.co2Output?  this.loggedUserData.co2Output: 0}}</p>
      </div>
      <div class="statistic">
        <h4>Most Common Mode of Transport</h4>
        <p>Car</p>
      </div>
      <div class="statistic">
        <h4>Least Common Mode of Transport</h4>
        <p>Train</p>
      </div>
    </div>

    <div class="statistics-container">
      <div class="statistic">
        <h4>Average CO2 Output Per Mile</h4>
        <p>4</p>
      </div>
      <div class="statistic">
        <h4>Average Journey Length</h4>
        <p>30 Miles</p>
      </div>
      <div class="statistic">
        <h4>Total Journey Count</h4>
        <p>{{ Object.keys(this.loggedUserJourneys).length? Object.keys(this.loggedUserJourneys).length: 0  }}</p>
      </div>
      <div class="statistic">
        <h4>Total Distance Travelled</h4>
        <p>300 Miles</p>
      </div>
    </div>

  </div>
  <div class="container" v-else>
    <div class="groupRanking-table-title">
      <h2>Group Ranking Table</h2>
    </div>

    <table class="groupRankingTable">
    <thead>
      <tr>
        <th>Rank</th>
        <th>User ID</th>
        <th>Username</th>
        <th>CO2 Output</th>
      </tr>
    </thead>
    <tbody>
      <!-- Display the entries, sorted by CO2 score in ascending order -->
      <tr v-for="(entry, index) in cumulativeGroupJourneys" :key="index" v-bind:class="{ 'highlight-row': entry.userID === highlightUserID }">
        <td>{{ index + 1 }}</td>
        <td>{{ entry.userID }}</td>
        <td>{{ entry.username }}</td>
        <td>{{ entry.co2Output }}</td>
      </tr>
    </tbody>
    </table>

    <div class="group-statistics-title">
      <h2>Group Statistical Readings</h2>
    </div>

    <div class="statistics-container">
      <div class="statistic">
        <h4>Average CO2 Output Per Member</h4>
        <p>{{ this.totalGroupCo2Output ? (this.totalGroupCo2Output/this.cumulativeGroupJourneys.length).toFixed(2) : 0}}</p>
      </div>
      <div class="statistic">
        <h4>Group Total CO2 Output</h4>
        <p>{{ this.totalGroupCo2Output? this.totalGroupCo2Output: 0 }}</p>
      </div>

      <div class="statistic">
        <h4>Group Total Distance Travelled</h4>
        <p>{{ this.totalGroupDistance? this.totalGroupDistance: 0 }} Km</p>
      </div>

    </div>

    <div class="statistics-container">
      <div class="statistic">
        <h4>Group Average CO2 Output Per Km</h4>
        <p>{{this.totalGroupCo2Output && this.totalGroupCo2Output? (this.totalGroupCo2Output / this.totalGroupDistance).toFixed(2): 0}}</p>
      </div>
      <div class="statistic">
        <h4>Average Journey Length</h4>
        <p>{{ (this.totalGroupDistance/this.loggedGroupJourneys.length).toFixed(2) }}</p>
      </div>
      <div class="statistic">
        <h4>Group Total Journey Count</h4>
        <p>{{this.loggedGroupJourneys.length? this.loggedGroupJourneys.length: 0}}</p>
      </div>
    </div>

  </div>
    


  <!-- <div class="bg-overlay"></div> -->
</template>
<script>
/* eslint-disable */ 
import axios from 'axios'
import VueSpeedometer from "vue-speedometer"
import Datepicker from 'vue3-datepicker'
export default {
  components: { VueSpeedometer, Datepicker },

  data() {
    return {
      // journes data, example: [{UserID: 1, CO2Output: 200}]
      journeyArray: [],
      highlightUserID: null,
      loggedUserData: null,
      loggedUserJourneys: [],
      filteredDatabyDate: [],
      currTab: 'Tab1',
      fromDate: null,
      toDate: null,
      groupID: null,
      userID: null,
      loggedGroupData: [],
      loggedGroupJourneys: [],
      cumulativeGroupJourneys: [],
      totalGroupCo2Output: 0,
      totalGroupDistance: 0,
    };
  },
  methods: {
    logDates() {
      this.filteredDatabyDate = this.loggedUserJourneys.filter((journey) => {
          const journeyDate = new Date(journey.journeyDate);
          console.log(journeyDate)
          return journeyDate >= this.fromDate && journeyDate <= this.toDate;
        })
        
      console.log(this.filteredDatabyDate)
      console.log("From Date: "+this.fromDate)
      console.log("From Date: "+this.toDate)
    }
  },

  async created() {

    try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/protected', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        alert("Auth failed")
      } else {
        const data = await response.json();
        this.userID = data.userID;
        console.log("I'm in dashboard userID: "+ this.userID)
      }

      } catch (error) {
      console.log(error.message);
      } 


    console.log(this.userID)
    this.highlightUserID = this.userID
    this.groupID = "1";

    try {
    const response = await axios.get('http://localhost:3000/getJourneys');
    const journeyArray = response.data;
    console.log(journeyArray)
    // Data to the Piles
     this.loggedUserJourneys =  journeyArray.filter(obj => obj.userID === this.highlightUserID);

    let usersResult = await axios.get('http://localhost:3000/users');
    const usersData = usersResult.data;
    console.log(usersData)
    this.loggedGroupJourneys =  usersData.filter(obj => obj.groupID === this.groupID);
    let userData =  usersData.filter(obj => obj.userID === this.userID);
    this.groupID = userData[0].groupID
    console.log(this.groupID)
    console.log(this.loggedGroupJourneys)
    let groupUsers =  usersData.filter(obj => obj.groupID === this.groupID);
    console.log(groupUsers)
// Here start group table
const filteredJourneys = journeyArray.filter(journey => {
  const user = usersData.find(user => user.userID === journey.userID);
  return user && user.groupID === this.groupID;
});
this.loggedGroupJourneys = filteredJourneys;
console.log(this.loggedGroupJourneys)
this.cumulativeGroupJourneys = filteredJourneys.reduce( (acc, obj) => {
    const index = acc.findIndex(item => item.userID === obj.userID);
    if (index === -1) {
      acc.push({ userID: obj.userID, co2Output: obj.co2Output, distance: obj.distance});
    } else {
      acc[index].co2Output += obj.co2Output;
      acc[index].distance += obj.distance;
    }
    return acc;
  }, [])

  
  console.log(this.cumulativeGroupJourneys)
  this.cumulativeGroupJourneys.forEach((journey) => {
  const user = usersData.find((user) => user.userID === journey.userID);
  if (user) {
    journey.username = user.username;
  }
});
console.log(this.cumulativeGroupJourneys)
let totalCo2Output = 0;

for (let i = 0; i < this.cumulativeGroupJourneys.length; i++) {
  totalCo2Output += this.cumulativeGroupJourneys[i].co2Output;
}

let totalDistance = 0;

for (let i = 0; i < this.cumulativeGroupJourneys.length; i++) {
  totalDistance += this.cumulativeGroupJourneys[i].distance;
}
this.totalGroupDistance = totalDistance
this.totalGroupCo2Output = totalCo2Output
console.log(this.totalGroupCo2Output)



      this.filteredDatabyDate = this.loggedUserJourneys
    // Just adds CO2 output where userID is the same
  let result = journeyArray.reduce((acc, obj) => {
    const index = acc.findIndex(item => item.userID === obj.userID);
    if (index === -1) {
      acc.push({ userID: obj.userID, co2Output: obj.co2Output, distance: obj.distance});
    } else {
      acc[index].co2Output += obj.co2Output;
      acc[index].distance += obj.distance;
    }
    return acc;
  }, [])

  console.log(result)
  //

  result = result.sort((a, b) => a.co2Output - b.co2Output);
  let foundUser = result.find(x => x.userID == this.userID)
  this.loggedUserData = foundUser
  console.log(this.loggedUserData)

  this.journeyArray = result;

  } catch (error) {
    console.error(error);
  }
},

  mounted() {
    
 console.log("try to dieeeee")
}}
</script>

<style scoped>
.charts-container {
  display: flex;
  justify-content: space-between;
  margin: 50px 0;
}

.chart-box {
  border: 1px solid #ccc;
  padding: 20px;
  flex-basis: calc(33.33% - 20px);
  box-sizing: border-box;
}

.bg-overlay{
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.4;
  z-index: -1;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f2f2f2;
  padding-top: 20px;
  padding-bottom: 35px;
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 30px;
}

.col-lg-4 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.speedometer-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 5px;
}

.speedometer-title h2 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 0;
}

.groupRankingTable {
  margin-top: 20px;
  border-collapse: collapse;
  width: 50%;
  margin-bottom: 30px;
}

.groupRankingTable th, .groupRankingTable td {
  padding: 8px;
  text-align: center;
  border: 1px solid #ddd;
}

.groupRankingTable th {
  background-color: lightblue
}

.groupRankingTable .highlight-row td {
  background-color: yellow;
}

.groupRanking-table-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 5px;
}

.groupRanking-table-title h2 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 0;
}

.globalRankingTable {
  margin-top: 20px;
  border-collapse: collapse;
  width: 50%;
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
  background-color: yellow;
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

.group-statistics-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: -5px;
}

.group-statistics-title h2 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 0;
}

.individual-statistics-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  margin-bottom: -15px;
}

.individual-statistics-title h2 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 0;
}

.statistics-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
}

.statistic {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 150px;
  margin: 20px;
  background-color: lightgreen;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border: 4px solid black;
}

.statistic h4 {
  margin-top: 10px;
  margin-bottom: 5px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.statistic p {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

.statistics-container .statistic {
  padding: 20px;
  align-items: center;
}

</style>
