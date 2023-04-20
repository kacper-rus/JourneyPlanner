<template>
  
  <div class="buttons-container">
    <a class="dashboard-item button-individual" @click="currTab = 'Tab1'; createChart()">Individual</a>
    <a class="dashboard-item button-group" :class="{ disabled: isTab2Disabled }" @click="currTab = 'Tab2'" :style="{ color: tab2Color }">Group</a>
  </div>
  <div class="container" v-if="currTab=='Tab1'">

    <div class="speedometer-title">
      <h2>User Feedback Scale</h2>
    </div>

    <vue-speedometer 
      :width="500"
      :needleHeightRatio="0.7"
      :value="convertToSpeedometer((journeyArray[0].co2Output/journeyArray[0].distance).toFixed(2) ? (journeyArray[0].co2Output/journeyArray[0].distance).toFixed(2) : 0)"
      :segmentColors='["limegreen", "yellowgreen", "gold", "orange", "tomato"]'
      currentValueText="CO2 Output per Km (kg)"
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

    <div v-if="isLoading" class="loading-wheel">
    <div class="loading-dot"></div>
    <div class="loading-dot"></div>
    <div class="loading-dot"></div>
    </div>
    
    <table class="globalRankingTable" v-else>
    <thead>
      <tr>
        <th>Rank</th>
        <th>Username</th>
        <th>CO2 Output per Km (kg)</th>
      </tr>
    </thead>
    <tbody>
      <!-- Display the entries, sorted by CO2 score in ascending order -->
      <tr v-for="(entry, index) in journeyArray" :key="index" v-bind:class="{ 'highlight-row': entry.userID === highlightUserID }">
        <td>{{ index + 1 }}</td>
        <td>{{ entry.username }}</td>
        <td>{{ (entry.co2Output/entry.distance).toFixed(2) }}</td>
      </tr>
    </tbody>
    </table>

    <div class="individual-statistics-title">
      <h2>User Statistical Readings</h2>
    </div>

    <div class="statistics-container">
      <div class="statistic">
        <h4>Average CO2 Output</h4>
        <p>{{ this.loggedUserData.co2Output && Object.keys(this.loggedUserJourneys).length ? (this.loggedUserData.co2Output / Object.keys(this.loggedUserJourneys).length).toFixed(2) : 0 }} Kg</p>
      </div>
      <div class="statistic">
        <h4>Total CO2 Output</h4>
        <p>{{ this.loggedUserData.co2Output?  this.loggedUserData.co2Output: 0}} Kg</p>
      </div>
      <div class="statistic">
        <h4>Total Distance Travelled</h4>
        <p>{{ this.loggedUserData.distance?  this.loggedUserData.distance: 0}} Km</p>
      </div>
    </div>

    <div class="statistics-container">
      <div class="statistic">
        <h4>Average CO2 Output Per Km</h4>
        <p>{{ this.loggedUserData.distance && this.loggedUserData.co2Output ? (this.loggedUserData.co2Output / this.loggedUserData.distance).toFixed(2) : 0 }} Kg</p>
      </div>
      <div class="statistic">
        <h4>Average Journey Length</h4>
        <p>{{ this.loggedUserData.distance && Object.keys(this.loggedUserJourneys).length ? (this.loggedUserData.distance / Object.keys(this.loggedUserJourneys).length).toFixed(2) : 0 }} Km</p>
      </div>
      <div class="statistic">
        <h4>Total Journey Count</h4>
        <p>{{ Object.keys(this.loggedUserJourneys).length? Object.keys(this.loggedUserJourneys).length: 0  }}</p>
      </div>
    </div>

    <div class="doughnut-chart-title">
      <h2>Mode of Transport Usage</h2>
    </div>

    <div class="chart-container">
        <canvas id="myChart2"></canvas>
    </div>
    
  </div>

  
  <div class="container" v-if="currTab=='Tab2'">
    <div class="groupRanking-table-title">
      <h2>Group Ranking Table</h2>
    </div>

    <table class="groupRankingTable">
    <thead>
      <tr>
        <th>Rank</th>
        <th>Username</th>
        <th>CO2 Output per Km (kg)</th>
      </tr>
    </thead>
    <tbody>
      <!-- Display the entries, sorted by CO2 score in ascending order -->
      <tr v-for="(entry, index) in cumulativeGroupJourneys" :key="index" v-bind:class="{ 'highlight-row': entry.userID === highlightUserID }">
        <td>{{ index + 1 }}</td>
        <td>{{ entry.username }}</td>
        <td>{{ (entry.co2Output/entry.distance).toFixed(2) }}</td>
      </tr>
    </tbody>
    </table>

    <div class="group-statistics-title">
      <h2>Group Statistical Readings</h2>
    </div>
    <div class="statistics-container">
      <div class="statistic">
        <h4>Average CO2 Output Per Member</h4>
        <p>{{ this.totalGroupCo2Output ? (this.totalGroupCo2Output/this.cumulativeGroupJourneys.length).toFixed(2) : 0}} Kg</p>
      </div>
      <div class="statistic">
        <h4>Group Total CO2 Output</h4>
        <p>{{ this.totalGroupCo2Output? this.totalGroupCo2Output: 0 }} Kg</p>
      </div>

      <div class="statistic">
        <h4>Group Total Distance Travelled</h4>
        <p>{{ this.totalGroupDistance? this.totalGroupDistance: 0 }} Km</p>
      </div>

    </div>

    <div class="statistics-container">
      <div class="statistic">
        <h4>Group Average CO2 Output Per Km</h4>
        <p>{{this.totalGroupCo2Output && this.totalGroupCo2Output? (this.totalGroupCo2Output / this.totalGroupDistance).toFixed(2): 0}} Kg</p>
      </div>
      <div class="statistic">
        <h4>Average Journey Length</h4>
        <p>{{ (this.totalGroupDistance/this.loggedGroupJourneys.length).toFixed(2) }} Km</p>
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
      journeyArray: [{id: 2, date: "04/04/2023", Start: "Manchester", Destination: "Southampton", distance: 127, co2Output: 22}],
      highlightUserID: null,
      loggedUserData: {userID: 4, co2Output: 305, distance: 490},
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
      isLoading: true,
      uniqueModesOfTransport: [],
      modeOfTransportCounts: {},
    };
  },
  computed: {
    isTab2Disabled() {
      return this.groupID === null;
    },
    tab2Color() {
      return this.isTab2Disabled ? 'grey' : '';
    },
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
    },
    convertToSpeedometer(value) {
      console.log(value)
    /*
    Converts a value from 0 to 0.5 to a value from 0 to 1000, where 0 is very good and 1000 is very bad.
    */
    if (value <= 0) {
      return 0;
    } else if (value >= 0.5) {
      return 1000;
    } else {
      console.log(Math.floor(value * 2000))
      return Math.floor(value * 2000);
    }
  },

  createChart() {

  setTimeout(() => {
    let xValues2 = this.uniqueModesOfTransport;
  let yValues2 = this.modeOfTransportCounts;
  let doughnutColors2 = ["#b91d47", "#1e7145", "#00aba9", ];
  new Chart("myChart2", {
    type: "doughnut",
    data: {
      labels: xValues2,
      datasets: [{
        backgroundColor: doughnutColors2,
        data: yValues2
      }]
    },
    options: {
      title: {
        display: false,
        text: "Carbon Emissions",
        fontSize: 30 
      },
      legend: {
        labels: {
          fontSize: 20,
          fontStyle: "bold",
          fontColor: "black"
        }
      },
      plugins: {
        legend: {
          labels: {
            fontSize: 25,
            fontStyle: "bold",
            fontColor: "black"
          }
        }
      }
    }
  });
  }, 500)

    }
  },

  async created() {

    try {
    const token = localStorage.getItem('token');
    const response = await fetch('https://carbonjourneyplanner.onrender.com/api/protected', {
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
    const response = await axios.get('https://carbonjourneyplanner.onrender.com/getJourneys');
    const journeyArray = response.data;
    console.log(journeyArray)
    // Data to the Piles
    const uniqueModesOfTransport = journeyArray
    .filter(journey => journey.userID === this.userID) // filter journeys for userID = 1
    .map(journey => journey.modeOfTransport) // extract modeOfTransport values
    .filter((modeOfTransport, index, self) => self.indexOf(modeOfTransport) === index); // get unique values

    console.log(uniqueModesOfTransport);
    this.uniqueModesOfTransport = uniqueModesOfTransport;


    const modeOfTransportCounts = journeyArray
    .filter(journey => journey.userID === this.userID) // filter journeys for userID = 1
    .reduce((counts, journey) => {
      const modeOfTransport = journey.modeOfTransport;
      counts[modeOfTransport] = (counts[modeOfTransport] || 0) + 1;
      return counts;
    }, {});

    const countArray = Object.values(modeOfTransportCounts);
    this.modeOfTransportCounts = countArray
    console.log(countArray);

     this.loggedUserJourneys =  journeyArray.filter(obj => obj.userID === this.highlightUserID);

    let usersResult = await axios.get('https://carbonjourneyplanner.onrender.com/users');
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
      console.log(journeyArray)
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

  result = result.sort((a, b) => (a.co2Output/a.distance) - (b.co2Output/b.distance));
  let foundUser = result.find(x => x.userID == this.userID)
  this.loggedUserData = foundUser
  console.log(this.loggedUserData)

  this.journeyArray = result;
console.log(this.journeyArray)
this.journeyArray.forEach(journeyObj => {
  const userObj = usersData.find(user => user.userID === journeyObj.userID);
  if (userObj) {
    journeyObj.username = userObj.username;
  }
});
console.log(this.journeyArray)
  

  } catch (error) {
    console.error(error);
  } finally {
      this.isLoading = false;
    }


    console.log(this.uniqueModesOfTransport)
    console.log(this.modeOfTransportCounts)
    this.createChart()
},

  mounted() {


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
.loading-wheel {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
}

.loading-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 0 8px;
  background-color: #333;
  animation: loading-animation 0.8s ease-in-out infinite;
}

.loading-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dot:nth-child(3) {
  animation-delay: 0.4s;
}
.button-individual, .button-group {
  background-color: #28a745;
  font-size: 20px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 106px;
  display: flex;
  justify-content: center;
  color: white; /* added this line */
}

.button-individual:hover, .button-group:hover {
  background-color: darkgreen;
}

.button-individual,
  .button-group {
    color: white !important;
  }
.buttons-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.disabled {
  pointer-events: none;
  background-color: grey;
  opacity: 0.8;
}

.chart-container {
  width: 85%;
}

#myChart2 .chart-title {
  font-size: 24px;
}

#myChart2 .segment-name {
  font-size: 100px;
}

.doughnut-chart-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 15px;
}

.doughnut-chart-title h2 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 0;
}

@keyframes loading-animation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
