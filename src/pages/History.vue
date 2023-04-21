<template>
  <div class="content-wrapper">
    <div class="container">
      <!-- Displays the date picker -->
      <div class="datepicker">
        <label style="font-weight: bold;">Filter by date:</label>
        <VueDatePicker v-model="date" :enable-time-picker="false" range></VueDatePicker>
      </div>
      <div v-if="isLoading" class="loading-wheel">
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
      </div>
      <div v-else-if="this.filteredJourneys.length">
        <div v-for="entry in filteredJourneys" :key="entry.JourneyId">
          <div class="history-entry">
            <label class="entry-date">{{ entry.date }}</label>
            <div class="history-entry-row" v-on:click="setActive(entry.id)">
              <div style="margin-right:10px">
                <div style="display: flex; align-items: baseline;"><p class="entry-s-text">Journey name:</p><p class="entry-l-text"> {{entry.journeyName}}</p></div>
                <!-- <p>{{entry.date}}</p> -->
              </div>
              <div >
                <div style="display: flex; align-items: baseline;"><p class="entry-s-text">CO2: </p><p class="entry-l-text"> {{entry.CO2Output}}kg</p></div>
                <div style="display: flex; align-items: baseline;"><p class="entry-s-text">Distance: </p><p class="entry-l-text"> {{entry.Distance}}km</p></div>
              </div>
              <div >
                <div style="text-align: right; width: 100%;">
                  <div style="display: flex; align-items: baseline;"><p class="entry-s-text">score </p><p class="entry-l-text" style="font-size:xx-large;"> {{ calculateScore(entry.CO2Output % entry.Distance) }}</p></div>
                </div>
              </div>
            </div>
            <div>
              <hr v-if="activeID == entry.id"/>
              <div class="history-entry-row" v-if="activeID == entry.id">
                <iframe
                  width="100%"
                  height="500"
                  frameborder="0" style="border:0; background-color: #E5E3DF;"
                  referrerpolicy="no-referrer-when-downgrade"
                  v-bind:src="'https://www.google.com/maps/embed/v1/directions?key=AIzaSyD3Se0UUiSx8PP5c7m4XGwSyLmZ_1dOw0I&origin=' + entry.Start + '&destination=' + entry.Destination"
                  allowfullscreen>
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="text-align:center; color:gray" v-else>
        <h2>Sorry, there are no registered journeys at this date</h2>
        <h3>Please head to the journey planner to plan your next journey</h3>
      </div>
    </div>
  </div>
</template>
    <script>
    /* eslint-disable */
    import { ref, reactive } from 'vue'
    import axios from 'axios'
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';
    
      export default {
        components: { VueDatePicker },
        data() {
          return {
            currTab: 'Overview',
            history:[{id: 1, date: "04/03/2023", Start: "Liverpool", Destination: "London", Distance: 73, CO2Output: 1320},
            {id: 2, date: "04/04/2023", Start: "Manchester", Destination: "Southampton", Distance: 127, CO2Output: 2030},
            {id: 3, date: "04/05/2023", Start: "Gloucester", Destination: "City of Westminster", Distance: 148, CO2Output: 2630},
            {id: 4, date: "04/06/2023", Start: "Birmingham", Destination: "Durham", Distance: 345, CO2Output: 1570},
            {id: 5, date: "04/07/2023", Start: "Lancaster", Destination: "Plymouth", Distance: 64, CO2Output: 2780},
            {id: 6, date: "04/08/2023", Start: "Sheffield", Destination: "Chichester", Distance: 20, CO2Output: 1780},
            {id: 7, date: "04/09/2023", Start: "Leeds", Destination: "Oxford", Distance: 128, CO2Output: 2360},],
            filteredHistory: [],
            // history: [],
            date: '',
            from: '',
            to: '',
            miles: '',
            co2: '',
            activeID: 0,
            lat: "", 
            lng: "", 
            map: null, 
            box: null,
            date: null,
            isLoading: true,
          }
        },
        props: {
          userID: {
            type: Number,
            required: true,
          },
        },
    
        methods: {
          test(){
            this.displayMap()
          },
          setActive(id) {
            if (this.activeID == id) {
              this.activeID = 0
            } else {
              this.activeID = id
            }
          },
          displayMap(lat, lng, z){
          // Load Google Maps JavaScript API
          let script = document.createElement("script");
          script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyA5K5yoDu6AnALOdV-VzcINZg1bKXH5-TA";
          document.body.appendChild(script);
          // Call the function to create the map after the Google Maps JavaScript API is loaded
          script.onload = () => {
            // Create a new map instance
            this.map = new google.maps.Map(document.getElementById("map"), {
              center: { lat: lat, lng: lng },
              zoom: z,
              mapTypeControl: false,
              disableDefaultUI: true,
              styles:[{
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#76aee3"
                },
                {
                    "saturation": 38
                },
                {
                    "lightness": -11
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#8dc749"
                },
                {
                    "saturation": -47
                },
                {
                    "lightness": -17
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#c6e3a4"
                },
                {
                    "saturation": 17
                },
                {
                    "lightness": -2
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#cccccc"
                },
                {
                    "saturation": -100
                },
                {
                    "lightness": 13
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#5f5855"
                },
                {
                    "saturation": 6
                },
                {
                    "lightness": -31
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#ffffff"
                },
                {
                    "saturation": -100
                },
                {
                    "lightness": 100
                },
                {
                    "visibility": "simplified"
                }
            ]
              }],
              //mapTypeId: 'satellite'
            });
            let marker = new google.maps.Marker({
              position: { lat: lat, lng: lng },
              map: map,
              title: 'Your Current Location'
            });
          };
        
        },
          calculateScore(input){
            if(input <= 0){
              return 100;
            }else if(input >= 1000){
              return 0;
            }else{
              const slope = -1;
              const yIntercept = 100;
              input = slope * input + yIntercept
              if (input < 0) {
                input = 0
              }
              return Math.round(input);
            }
          }
        },
    
        async mounted(){
          console.log("HELLO")
          console.log(this.userID)
          try {
              await axios.get('https://carbonjourneyplanner.onrender.com/getJourneys')
          .then(response => {
            console.log("HELLOO")
            console.log(response.data)
  
  
            let modifiedJourneyArray = response.data.map(journey => {
              return {
                  id: journey.journeyID,
                  userID: journey.userID,
                  journeyName: journey.journeyName,
                  date: journey.journeyDate,
                  Start: `${JSON.parse(journey.startPoint).lat}, ${JSON.parse(journey.startPoint).lng}`,
                  Destination: `${JSON.parse(journey.endPoint).lat}, ${JSON.parse(journey.endPoint).lng}`,
                  Distance: journey.distance,
                  CO2Output: journey.co2Output
              }
              });
              console.log(modifiedJourneyArray)
              modifiedJourneyArray = modifiedJourneyArray.filter(x => x.userID == this.userID)
              modifiedJourneyArray.sort((a, b) => b.id - a.id);
            this.history = modifiedJourneyArray
            this.filteredHistory = modifiedJourneyArray
            console.log(modifiedJourneyArray)
          })
  
          } catch(e) {
              console.log(e)
          } finally {
              this.isLoading = false;
          }
  
          // ?userID='+this.userID.userID 
          //let directionsService = new google.maps.DirectionsService();
    
          // this.displayMap(53.400002, -2.983333, 10);
          // // Check if the PlacesService library is loaded
          // if (typeof google === 'object' && typeof google.maps === 'object' && typeof google.maps.places === 'object') {
          //   // Initialize the Autocomplete widget
          //   new google.maps.places.Autocomplete(document.getElementById("OriginBox"));
          //   new google.maps.places.Autocomplete(document.getElementById("DestinationBox"));
          // } else {
          //   // Load the Maps JavaScript API and initialize the Autocomplete widget after it's loaded
          //   let script = document.createElement("script");
          //   script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyA5K5yoDu6AnALOdV-VzcINZg1bKXH5-TA&libraries=places";
          //   document.body.appendChild(script);
          //   script.onload = () => {
          //     new google.maps.places.Autocomplete(document.getElementById("latBox"));
          //     new google.maps.places.Autocomplete(document.getElementById("lngBox"));
          //   };
          // }
          
        },
        computed: {
        filteredJourneys() {
          const byDate = (item) => {
            const itemDate = new Date(item.date);
            return (
              itemDate >= new Date(this.date[0]) &&
              itemDate <= new Date(this.date[1])
            );
          };
    
          if(this.date != null){
            console.log(this.date)
            console.log
            console.log(this.history.filter(s => new Date(s.date) >= this.date))
            return this.history
              .filter(byDate);
          }else{
            return this.history
          }
          
        },
      },
      }
    </script>
    <style scoped>
    .history-entry{
      /* Curved box with green top border and box shadow */
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }
    
    .history-entry-row{
      display:flex;
      justify-content: space-between;
    }
    
    .entry-date{
      width: 100%;
      color:gray;
      font-size: 12px;
    }
    
    .entry-s-text{
      font-size:small;
      margin-right: 3px;
    }
    
    .entry-l-text{
      font-size:large; 
      font-weight: bold;
    }
    .datepicker {
      width: 40%;
      margin: auto;
      padding: 25px;
    }
    .loading-wheel {
    display: flex;
    justify-content: center;
    align-items: center;
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
    
    