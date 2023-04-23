<template>
  <div class="input-boxes">
    <form @submit.prevent="callFirstFunction">
      <table>
        <tr>
          <td><input type="text" id="OriginBox" name="OriginBox" placeholder="Origin"></td>
          <td><input type="text" id="DestinationBox" name="DestinationBox" placeholder="Destination"></td>
          <td><button type="submit">Search</button></td>
        </tr>
      </table>
    </form>
  </div>

  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
  </head>


  <div id="open-div">
    <button id="open-button" @click="open">^</button>
  </div>
  <div id="top-bar-width">
    <button id="close-button" @click="close">v</button>
  </div>
  
  <div id="my-box">
    <div id="box1">
      <div id="box1innerOutter">
        <div id="box1inner">
          <!-- <p id="car-distance"></p>-->
          <!-- <p id="transit-distance"></p> -->
          <input type="text" id="toFrom" name="toFrom" value="Journey Name" placeholder="Enter A Name For Journey">
          <div class="inputLabelContainer">
              <div class="label" >Distance (Km):</div>
              <div><input id="distance" type="number"></div>
              <div class="label">Date:</div>
              <div><input id="date" type="date"></div>
              <div class="label">Emissions (Kg):</div>
              <div><input type="number" id="emissions"></div>
              <div class="label">Duration:</div>
              <div><input type="time" id="duration"></div>
          </div>

          <center>
          <div class="box1Buttons">
            <button id="log-route" type="submit" @click="logRoute">Log This Route</button>
            <button id="show-directions" type="submit" @click="hideLeftBox">Directions</button>
          </div>
          </center>

          </div>
            
          <div id="clone">
            <button id="cloneButton" @click="cloneButtonClose">
            <span>&#8722;</span>
            </button>
            <p>Make sure to select a mode of transprot.</p>
          </div>
        </div>

      </div>


        
        

    <div id="box2">



      <center>
        <div class="radioButtons">
    <div class="row1">
        

        
      <input label="Plane" type="radio" name="mode" value="Plane" id="planeButton">
      <input label="Car" type="radio" name="mode" value="Car" id="carButton">
      <input label="Transit" type="radio" name="mode" value="Transit" id="transitButton">
      <input label="Walk" type="radio" name="mode" value="Walk" id="walkButton">
    </div>
    
    
    
    <div class="row2" id="row2" style="display: flex;">
        <input type="radio" name="size" id="card" value="small_car">
        <label for="card">
            <i class="fas fa-car" aria-hidden="true" style="font-size: 2vw;"></i>
            <span>Small</span>
        </label>
        
        <input type="radio" name="size" id="cash" value="average_car">
        <label for="cash">
            <i class="fas fa-car" aria-hidden="true" style="font-size: 2.5vw;"></i>
            <span>Average</span>
        </label> 
        
        <input type="radio" name="size" id="other" value="large_car">
        <label for="other">
            <i class="fas fa-car" aria-hidden="true" style="font-size: 3vw;"></i>
            <span>Large</span>
        </label> 
        
        <input type="radio" name="size" id="test" value="custom">
        <label for="test">
            <i class="fas fa-keyboard" aria-hidden="true" style="font-size: 30px;"></i>
            <span>Custom</span>
        </label> 
    </div>
    
    
    
    <div class="row3" id="row3">
      <input label="Diesel" type="radio" name="fuleType" value="diesel">
      <input label="Petrol" type="radio" name="fuleType" value="petrol">
      <input label="Hybrid" type="radio" name="fuleType" value="hybrid">
      <input label="Eletric" type="radio" name="fuleType" value="electric">
    </div>
    </div>
        

        <form @submit.prevent="submitDvlaForm" id="reg-form">
          <tr>
                <td>
                  <input type="text" id="dvla-input" name="dvla-input" placeholder="BD51 SMR" maxlength="8"><br>
                </td>
                <td>
                  <button id="dvla-submit-button" type="submit" >Submit</button>
                </td>
          </tr>
          <tr>
            <td>
              <div id="dvlaError"><p></p></div>
            </td>
          </tr>
        </form>

      
      </center>

    </div>

        <div id="box3">
          <div class="chart">
        <div class="legend">
          <div class="legend-item">
          </div>
        </div>
        <div class="row">
          <div class="label">Selected</div>
          <div class="bar custom"></div>
          <div class="value"></div>
        </div>
        <div class="row">
          <div class="label">Car</div>
          <div class="bar car"></div>
          <div class="value"></div>
        </div>
        <div class="row">
          <div class="label">Transit</div>
          <div class="bar transit"></div>
          <div class="value"></div>
        </div>
        <div class="row">
          <div class="label">Walk‎ </div>
          <div class="bar walk"></div>
          <div class="value"></div>
        </div>
          <div class="scale-line"></div>
          <div class="scale">
                <div class="scale-tick"></div>
          <div class="scale-tick-label">0</div>
          <div class="scale-tick"></div>
          <div class="scale-tick-label">100</div>
          <div class="scale-tick"></div>
          <div class="scale-tick-label">200</div>
          <div class="scale-tick"></div>
          <div class="scale-tick-label">300</div>
          <div class="scale-tick"></div>
          <div class="scale-tick-label">400</div>
        </div>
      </div>

    </div>
  </div>


  <section id="map"></section>
</template>
  
<script>
//import co2 data calculation functions
import Swal from 'sweetalert2';
import * as dataCalcFunctions from "@/dataFunctions.js";
const axios = require('axios');
//import { toFormData } from "axios";

//tests to make sure functions importing properly
console.log("TEST", dataCalcFunctions.calculateVehicleCO2('average_car', 'diesel', 100))
console.log("TEST", dataCalcFunctions.calculatePublicTransportCO2('national_rail', 100))
console.log("TEST", dataCalcFunctions.calculateFlightCO2('long_haul_uk_average', 5000))



/* eslint-disable no-undef */
//import { removeDotSegments } from 'uri-js';
//import { removeDotSegments } from 'uri-js';
//import { setBlockTracking } from 'vue';
/* eslint-disable */


export default {
  name: 'MyComponent',
  data() {
    return { lat: "", lng: "", map: null, box: null,selected: "",}
  },
  props: {
    userID: {
      type: Number,
      required: true,
    }},
  
  async created() {
    console.log("ASDAKJSAKDKSADSADSALDSALK");

    console.log("ASDAKJSAKDKSADSADSALDSALK");


  },

  //"https://maps.googleapis.com/maps/api/js?key=AIzaSyA5K5yoDu6AnALOdV-VzcINZg1bKXH5-TA&libraries=places";

mounted() {
  let script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyA5K5yoDu6AnALOdV-VzcINZg1bKXH5-TA&libraries=places";

  document.body.appendChild(script);
  script.onload = () => {
    // Initialize Autocomplete objects for the input fields
    new google.maps.places.Autocomplete(document.getElementById("latBox"));
    new google.maps.places.Autocomplete(document.getElementById("lngBox"));
    new google.maps.places.Autocomplete(document.getElementById("OriginBox"));
    new google.maps.places.Autocomplete(document.getElementById("DestinationBox"));

    // Create a DirectionsService object
    let directionsService = new google.maps.DirectionsService();
    // Call the displayMap() method to display the map
    this.displayMap(53.400002, -2.983333, 10);

    var r2 = document.getElementById("row2")
    r2.style.display="none";
    var r3 = document.getElementById("row3")
    r3.style.display="none";

    global.mapStyle = [
                  {
                      "featureType": "all",
                      "elementType": "labels.text",
                      "stylers": [
                          {
                              "color": "#878787"
                          }
                      ]
                  },
                  {
                      "featureType": "all",
                      "elementType": "labels.text.stroke",
                      "stylers": [
                          {
                              "visibility": "off"
                          }
                      ]
                  },
                  {
                      "featureType": "landscape",
                      "elementType": "all",
                      "stylers": [
                          {
                              "color": "#f9f5ed"
                          }
                      ]
                  },
                  {
                      "featureType": "road.highway",
                      "elementType": "all",
                      "stylers": [
                          {
                              "color": "#f5f5f5"
                          }
                      ]
                  },
                  {
                      "featureType": "road.highway",
                      "elementType": "geometry.stroke",
                      "stylers": [
                          {
                              "color": "#c9c9c9"
                          }
                      ]
                  },
                  {
                      "featureType": "water",
                      "elementType": "all",
                      "stylers": [
                          {
                              "color": "#aee0f4"
                          }
                      ]
                  },
              ]

  };

    const radioButtons = document.querySelectorAll('.radioButtons input[type="radio"]');

    radioButtons.forEach(button => {
      button.addEventListener('change', () => {
        const row1Selected = document.querySelector('.row1 input[type="radio"]:checked');
        const row2Selected = document.querySelector('.row2 input[type="radio"]:checked');
        const row3Selected = document.querySelector('.row3 input[type="radio"]:checked');

        if (row1Selected && row1Selected.value === "Car") {
          global.vehcalType = "Car";
          document.querySelector('.row2').style.display = "flex";

        }else{
          document.querySelectorAll('.row2 input[type="radio"]').forEach(input => {input.checked = false;});
          document.querySelector('.row2').style.display = "none";
        }

        if (row2Selected && row2Selected.value !== "custom" && row1Selected.value === "Car") {
          document.querySelector('.row3').style.display = "flex";
          var regfrom = document.getElementById("reg-form")
          regfrom.style.display="none";

        }else if(row2Selected && row2Selected.value === "custom" && row1Selected.value === "Car"){
          document.querySelector('.row3').style.display = "none";
          document.querySelectorAll('.row3 input[type="radio"]').forEach(input => {input.checked = false;});
          var regfrom = document.getElementById("reg-form")
          regfrom.style.display="block";
          
          
        }

        if (row1Selected && row1Selected.value !== "Car") { // Add this condition
          document.querySelector('.row3').style.display = "none";
          document.querySelectorAll('.row3 input[type="radio"]').forEach(input => {input.checked = false;});
        }

        var outputArrayEmpty = {
          mode: "",
          carType: "",
          fuleType: "",
          validRegNumb: "",
        }; 

        if (row1Selected && row1Selected.value === "Plane") {
          global.vehcalType = "Plane";
          var regfrom = document.getElementById("reg-form")
          regfrom.style.display="none";

          var distanceDisplay = document.getElementById("distance");
          distanceDisplay.value = planeDistance.toFixed(0);

          var planeEmissions = planeDistance *0.19;
          var emissionsInput = document.getElementById("emissions");
          emissionsInput.value = planeEmissions.toFixed(0);

          const timeInHours = planeDistance / 750;
          const timeInMinutes = timeInHours * 60;
          var durationInput = document.getElementById("duration");
          const totalMinutes4 = Math.round(timeInMinutes);
          // Calculate the hours and minutes
          const hours1 = Math.floor(totalMinutes4 / 60);
          const minutes1 = totalMinutes4 % 60;
          // Format the time string as hh:mm
          const timeString1 = `${hours1.toString().padStart(2, '0')}:${minutes1.toString().padStart(2, '0')}`;
          durationInput.value = timeString1;

          //populates the custom bar in barchart
          var customAverageCo2PerKm = ((planeEmissions * 1000) / planeDistance).toFixed(0);
          var customValue = document.querySelector('.custom + .value');
          var customBar = document.querySelector('.custom');
          customBar.style.width = customAverageCo2PerKm + 'px';
          customValue.textContent = customAverageCo2PerKm + ' g/km';
          console.log("PLANE VALUE",customAverageCo2PerKm)

        }
        if (row1Selected && row1Selected.value === "Transit") {
          global.vehcalType = "Transit";
          var regfrom = document.getElementById("reg-form")
          regfrom.style.display="none";
          var outputArray = outputArrayEmpty
          outputArray.mode = row1Selected.value

          var durationInput = document.getElementById("duration");
          const totalMinutes = Math.round(durationInMinutes2);
          // Calculate the hours and minutes
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          // Format the time string as hh:mm
          const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          durationInput.value = timeString;

          var distanceDisplay = document.getElementById("distance");
          var transitDistance1 = parseFloat(transitDistance.replace("km", ""));
          distanceDisplay.value = transitDistance1;

          var emissionsInput = document.getElementById("emissions");
          emissionsInput.value = transitCo2Output.toFixed(3);

          const user_text = instructions_public_transport; 
          const box3ParagraphClone = document.querySelector('#clone p');
          box3ParagraphClone.innerHTML = user_text;

          //populates the custom bar in barchart
          var customAverageCo2PerKm = ((transitCo2Output*1000) / transitDistance1).toFixed(0);
          var customValue = document.querySelector('.custom + .value');
          var customBar = document.querySelector('.custom');
          customBar.style.width = customAverageCo2PerKm + 'px';
          customValue.textContent = customAverageCo2PerKm + ' g/km';
          console.log("TRANSIC VALUE",customAverageCo2PerKm)
          }
      
          if (row1Selected && row1Selected.value === "Walk") {
          global.vehcalType = "Walk";
          var regfrom = document.getElementById("reg-form")
          regfrom.style.display="none";


          var distanceNumberWalk = parseFloat(walkDistance.replace("km", ""));
          var distanceDisplay = document.getElementById("distance");
          distanceDisplay.value = distanceNumberWalk;

          var emissionsInput = document.getElementById("emissions");
          emissionsInput.value = 0;

          var durationInput = document.getElementById("duration");
          const totalMinutes3 = Math.round(durationInMinutes3);
          // Calculate the hours and minutes
          const hours1 = Math.floor(totalMinutes3 / 60);
          const minutes1 = totalMinutes3 % 60;
          // Format the time string as hh:mm
          const timeString1 = `${hours1.toString().padStart(2, '0')}:${minutes1.toString().padStart(2, '0')}`;
          durationInput.value = timeString1;

          const user_text_walk = instructions_walk; 
          const box3ParagraphClone = document.querySelector('#clone p');
          box3ParagraphClone.innerHTML = user_text_walk;

                    //populates the custom bar in barchart
          var customValue = document.querySelector('.custom + .value');
          var customBar = document.querySelector('.custom');
          customBar.style.width = 3 + 'px';
          customValue.textContent = 0 + ' g/km';
          console.log("WALK VALUE",0)
          
          }


        if (row1Selected && row2Selected && row3Selected && row1Selected.value === "Car") {
          var outputArray = {
                        mode: row1Selected.value,
                        carType: row2Selected.value,
                        fuleType: row3Selected.value,
                        validRegNumb: "",
                      };
          var distanceNumber = parseFloat(carDistance.replace("km", ""));
          var carCo2Output = dataCalcFunctions.calculateVehicleCO2(row2Selected.value, row3Selected.value, distanceNumber)
          
          var durationInput = document.getElementById("duration");
          const totalMinutes1 = Math.round(durationInMinutes1);
          // Calculate the hours and minutes
          const hours1 = Math.floor(totalMinutes1 / 60);
          const minutes1 = totalMinutes1 % 60;
          // Format the time string as hh:mm
          const timeString1 = `${hours1.toString().padStart(2, '0')}:${minutes1.toString().padStart(2, '0')}`;
          durationInput.value = timeString1;

          var distanceDisplay = document.getElementById("distance");
          distanceDisplay.value = distanceNumber;

          var emissionsInput = document.getElementById("emissions");
          emissionsInput.value = carCo2Output.toFixed(3);
          
          const user_text = instructions_car; 
          const box3ParagraphClone = document.querySelector('#clone p');
          box3ParagraphClone.innerHTML = user_text;

          //populates the custom bar in barchart
          var customAverageCo2PerKm = ((emissionsInput.value * 1000) / distanceDisplay.value).toFixed(0)
          var customValue = document.querySelector('.custom + .value');
          var customBar = document.querySelector('.custom');
          customBar.style.width = customAverageCo2PerKm + 'px';
          customValue.textContent = customAverageCo2PerKm + ' g/km';
          console.log(customAverageCo2PerKm)

        }

        console.log(outputArray)
        return(outputArray)

      });
    });
},
  
  methods: {
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
          styles:mapStyle
          //mapTypeId: 'satellite'
        });
        let marker = new google.maps.Marker({
          position: { lat: lat, lng: lng },
          map: map,
          title: 'Your Current Location'
        });
      };
    },
   
    showMessage(title, text, icon) {
      Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'OK'
      });
    },
   
    logRoute() {
    var typeLogValue = vehcalType;
    var journeyLogValue = document.getElementById("toFrom").value;
    var dateDDMMYYLogValue = document.getElementById("date").value;
    var timeHHMMLogValue = document.getElementById("duration").value;
    var distanceKmLogValue = document.getElementById("distance").value;
    var emissionsKgLogValue = document.getElementById("emissions").value;
    var startCordLogValue = originLatLng;
    var endCordLogValue = destLatLng;

    console.log("DATA LOGGED! ","Journey Mode: ",typeLogValue ,"Journey Name: ", journeyLogValue,"Journey date in DD/MM/YY: ", dateDDMMYYLogValue,"Journey Duration in HH:MM: ", timeHHMMLogValue,"Journey distance in km: ", distanceKmLogValue ,"Journey Emissions Total in Kg: ",emissionsKgLogValue);
    console.log("Start location: ",JSON.stringify(startCordLogValue),"End location: ", JSON.stringify(endCordLogValue));
    const journeyData = {
      userID: this.userID,
      journeyName: journeyLogValue,
      modeOfTransport: typeLogValue,
      journeyDate: dateDDMMYYLogValue,
      startPoint: JSON.stringify(startCordLogValue),
      endPoint: JSON.stringify(endCordLogValue),
      co2Output: emissionsKgLogValue,
      distance: distanceKmLogValue,
      duration: timeHHMMLogValue
  };

    axios.post('https://carbonjourneyplanner.onrender.com//users/addJourney', journeyData)
      .then((response) => {
        console.log(response.data);
        this.showMessage('Success!', response.data.message, 'success');
      })
      .catch((error) => {
        this.showMessage('Oh no!', "There was a problem creating a journey, try later", 'error');
        console.error(error);
      });
  
  },

    async submitDvlaForm(outputArray){

      var dvlaErrorElement = document.getElementById('dvlaError');
      var regNumber = document.getElementById('dvla-input').value;

      try {
        //AA19SRN
        const response = await axios.get('https://carbonjourneyplanner.onrender.com/co2emissions/'+regNumber);
        const regPlateco2Data = response.data.co2Emissions;
        console.log(regPlateco2Data)

        var distanceNumber = parseFloat(carDistance.replace("km", ""));
        
        var durationInput = document.getElementById("duration");
        const totalMinutes1 = Math.round(durationInMinutes1);
        // Calculate the hours and minutes
        const hours1 = Math.floor(totalMinutes1 / 60);
        const minutes1 = totalMinutes1 % 60;
        // Format the time string as hh:mm
        const timeString1 = `${hours1.toString().padStart(2, '0')}:${minutes1.toString().padStart(2, '0')}`;
        durationInput.value = timeString1;

        var distanceDisplay = document.getElementById("distance");
        distanceDisplay.value = distanceNumber;

        const user_text = instructions_car; 
        const box3ParagraphClone = document.querySelector('#clone p');
        box3ParagraphClone.innerHTML = user_text;

        var emissionsInput = document.getElementById("emissions");
        emissionsInput.value = (distanceNumber *(regPlateco2Data/1000)).toFixed(3);

        var customValue = document.querySelector('.custom + .value');
        var customBar = document.querySelector('.custom');
        customBar.style.width = regPlateco2Data + 'px';
        customValue.textContent = regPlateco2Data + ' g/km';

        var dvlaInputText = document.getElementById('dvla-input');
        dvlaInputText.value = '';


     
      } catch{
          var dvlaErrorString = (`${regNumber} is not a valid UK number plate.`);
        console.log(dvlaErrorString);
        var dvlaInputText = document.getElementById('dvla-input');
        dvlaInputText.value = '';
        dvlaErrorElement.textContent = dvlaErrorString;
        dvlaErrorElement.classList.remove('fade-out'); // remove the fade-out class if it was applied before
        
        // var emissionsInput = document.getElementById("emissions");
        // emissionsInput.value = (0);

        // after 3 seconds, apply the fade-out class to the error message
        setTimeout(() => {
          dvlaErrorElement.classList.add('fade-out');
        }, 2000);
      }
    },

    barChartUpdate(first,second,third,fourth){
      var customEmissions = first;
      var carEmissions = second;
      var transitEmissions = third;
      var walkEmissions = fourth;

      /*var customBar = document.querySelector('.custom');
      customBar.style.width = carEmissions + 'px';
      customValue.textContent = carEmissions + ' g/km';*/

      var carBar = document.querySelector('.car');
      var transitBar = document.querySelector('.transit');
      var walkBar = document.querySelector('.walk');

      var carValue = document.querySelector('.car + .value');
      var transitValue = document.querySelector('.transit + .value');
      var walkValue = document.querySelector('.walk + .value');
      
      carBar.style.width = carEmissions + 'px';
      transitBar.style.width = transitEmissions + 'px';
      walkBar.style.width = walkEmissions + 'px';

      carValue.textContent = carEmissions.toFixed(0) + ' g/km';
      transitValue.textContent = transitEmissions + ' g/km';
      walkValue.textContent = 0 + ' g/km';
      

    },
    
    callFirstFunction() {
  // call the first function
    this.submitForm();

    // call the second function after 5 seconds
    setTimeout(() => {
      this.callingBarChart();
    }, 2500);
    },

    async submitForm() {
      //sets date to todays date
      const today = new Date().toISOString().substr(0, 10);
      document.getElementById("date").value = today;

      //sets elements for the re-open box and button
      this.opendiv = document.getElementById('open-div');
      this.openButton = document.getElementById('open-button');
      //sets elements for the main box and button
      this.box = document.getElementById('my-box');
      this.closeButton = document.getElementById('close-button');
      this.box.style.display = 'block';
      this.closeButton.style.display = 'block';
      //when submit button pressed hides the open box and button from bottom if already displayed
      this.opendiv.style.display = 'none';
      this.openButton.style.display = 'none';

      let origin = document.getElementById("OriginBox").value;
      let destination = document.getElementById("DestinationBox").value;

      //sets the journey name to be origin > destination by defult
      document.getElementById("toFrom").value = (origin+" → "+destination)

      


      if (origin && destination) {
        // Convert origin and destination addresses to coordinates
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: origin }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            global.originLatLng = results[0].geometry.location;
            console.log(originLatLng)
            geocoder.geocode({ address: destination }, async function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                global.destLatLng = results[0].geometry.location;

                // Display the map with the origin and destination locations
                let map = new google.maps.Map(document.getElementById("map"), {
                  zoom: 8,
                  center: originLatLng,
                  mapTypeControl: false,
                  styles:mapStyle
                });
                let marker1 = new google.maps.Marker({
                  position: originLatLng,
                  map: map
                });
                let marker2 = new google.maps.Marker({
                  position: destLatLng,
                  map: map
                });

                // Sets options for the route line graphics //car
                let lineOptions = {
                  strokeColor: "#ffaa1c",
                  strokeOpacity: 1,
                  strokeWeight: 4,
                  clickable: true,
                };

                let lineOptions2 = { 
                  strokeColor: "#ffe733",
                  strokeOpacity: 1,
                  strokeWeight: 4,
                };

                let lineOptions3 = { 
                    strokeColor: "#6197d7",
                    strokeOpacity: 1,
                    strokeWeight: 4,
                };

                //directionsDisplay.addListener("click", function(event) {
                // do something when polyline is clicked
                // directionsDisplay.setOptions({strokeColor: "red"})
                //});

                // Calculate and display the route
                let directionsService1 = new google.maps.DirectionsService();
                let directionsDisplay1 = new google.maps.DirectionsRenderer({ polylineOptions: lineOptions });

                let directionsService2 = new google.maps.DirectionsService();
                let directionsDisplay2 = new google.maps.DirectionsRenderer({ polylineOptions: lineOptions2 });

                let directionsService3 = new google.maps.DirectionsService();
                let directionsDisplay3 = new google.maps.DirectionsRenderer({ polylineOptions: lineOptions3 });


                let request1 = {
                  origin: originLatLng,
                  destination: destLatLng,
                  travelMode: google.maps.TravelMode.DRIVING,
                  unitSystem: google.maps.UnitSystem.METRIC
                };

                let request2 = {
                  origin: originLatLng,
                  destination: destLatLng,
                  travelMode: google.maps.TravelMode.TRANSIT,
                  unitSystem: google.maps.UnitSystem.METRIC
                };

                let request3 = {
                  origin: originLatLng,
                  destination: destLatLng,
                  travelMode: google.maps.TravelMode.WALKING,
                  unitSystem: google.maps.UnitSystem.METRIC
                };                
                
                //TRANSIT
                directionsService2.route(request2, function (result, status) {
                  if (status == google.maps.DirectionsStatus.OK) {
                    // get the steps of the route
                    var steps = result.routes[0].legs[0].steps;
                    global.instructions_public_transport = "Public Transport Directions: <br>";

                    
                    global.transitCo2Output = 0;
                    // loop through the steps and log the instructions, distance, and travel mode of each leg
                    for (var i = 0; i < steps.length; i++) {
                      var legDistance = steps[i].distance.text;
                      var legDistanceValue = steps[i].distance.value;
                      var travelMode = steps[i].travel_mode;
                      if (travelMode === 'TRANSIT') {
                        var transitType = steps[i].transit.line.vehicle.type;
                        //console.log("Leg " + (i+1) + " distance: " + legDistance + " (travel mode: " + transitType + ")");
                        transitCo2Output = transitCo2Output + dataCalcFunctions.calculatePublicTransportCO2(transitType ,(legDistanceValue/1000))
                      } else {
                        //console.log("Leg " + (i+1) + " distance: " + legDistance + " (travel mode: " + travelMode + ")");
                      }
                      //console.log("Public transport directions", steps[i].instructions);
                      instructions_public_transport += (i+1)+ ") " + steps[i].instructions + "<br>";

                    }
                    console.log("Transport emissions total) = ", transitCo2Output)


                    directionsDisplay2.setDirections(result);
                    directionsDisplay2.setMap(map);

                    var durationInSeconds2 = result.routes[0].legs[0].duration.value;
                    global.durationInMinutes2 = durationInSeconds2 / 60;
                    console.log("transitDistance (transport total time) = ", durationInMinutes2)

                    //get route length for public transport
                    global.transitDistance = result.routes[0].legs[0].distance.text
                    console.log("transitDistance (transit total) = ", transitDistance)

                    var textOutputTransit = "Public Transport Distance: " + transitDistance
                  
                    const transitDistanceNumber = parseFloat(transitDistance.replace("km", ""));
                    global.transitDistanceNumber1 = transitDistanceNumber;
                    global.transitCo2Average = (transitCo2Output * 1000) / transitDistanceNumber
                    console.log("transit co2 / distance=",(transitCo2Average))
                    console.log(transitDistanceNumber)
                    console.log(transitCo2Output)

                    //barChartUpdate(0, 138.4, transitCo2Average, 3);


                  } else {
                    console.log("Directions request failed: " + status);
                  }
                });
                
                //CAR
                directionsService1.route(request1, function (result, status) {
                  if (status == google.maps.DirectionsStatus.OK) {
                    // get the steps of the route
                    var steps = result.routes[0].legs[0].steps;
                    global.instructions_car = "Car Directions: <br>";

                    // loop through the steps and log the instructions
                    for (var i = 0; i < steps.length; i++) {
                    console.log("Car directions",steps[i].instructions);
                    instructions_car += (i+1)+ ") " + steps[i].instructions + "<br>";
                    }

                    directionsDisplay1.setDirections(result);
                    directionsDisplay1.setMap(map);

                    //get route length for car
                    global.carDistance = result.routes[0].legs[0].distance.text
                    console.log("carDistance (car total) = ", carDistance)
                    var textOutputCar = "Distance: " + carDistance
                  
                    var durationInSeconds1 = result.routes[0].legs[0].duration.value;
                    global.durationInMinutes1 = durationInSeconds1 / 60;
                    console.log("carDistance (car total time) = ", durationInMinutes1)



                    //updates the empty paragraph with car distance text and calculated value
                    //var myCarDistanceElementCar = document.getElementById("car-distance")
                    //myCarDistanceElementCar.innerHTML = textOutputCar

                    console.log("transit co2 / distance=",(138.4))

                  } else {
                    console.log("Directions request failed: " + status);
                  }
                });

                //WALK ------------------------------------------------------
                directionsService3.route(request3, function (result, status) {
                  if (status == google.maps.DirectionsStatus.OK) {
                    // get the steps of the route
                    var steps = result.routes[0].legs[0].steps;
                    global.instructions_walk = "Walk Directions: <br>";

                    // loop through the steps and log the instructions
                    for (var i = 0; i < steps.length; i++) {
                    //console.log("Walk directions",steps[i].instructions);
                    instructions_walk += (i+1)+ ") " + steps[i].instructions + "<br>";
                    }


                    directionsDisplay3.setDirections(result);
                    directionsDisplay3.setMap(map);

                    //get route length for walking
                    global.walkDistance = result.routes[0].legs[0].distance.text
                    console.log("walkDistance (walk total) = ", walkDistance)
                  
                    var durationInSeconds3 = result.routes[0].legs[0].duration.value;
                    global.durationInMinutes3 = durationInSeconds3 / 60;
                    console.log("walkDistance (walk total time) = ", durationInMinutes3)



                  } else {
                    console.log("Directions request failed: " + status);
                  }
                });

              // --- PLANE --- //


              const dataOrigin = {
                latitude: global.originLatLng.lat(),
                longitude: global.originLatLng.lng()
              };

              const dataDest = {
                latitude: global.destLatLng.lat(),
                longitude: global.destLatLng.lng()
              };

              const config = {
                headers: {
                  'Content-Type': 'application/json'
                }
              };
              try {

                await axios.post("https://carbonjourneyplanner.onrender.com/getNearestAirport", dataOrigin, config)
                  .then((response) => {
                    console.log(response.data);
                    global.closestAirportOriginLat = (response.data.lat);
                    global.closestAirportOriginLg = (response.data.lng);
  
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              } catch(e) {

              }
              try {
                await axios.post("https://carbonjourneyplanner.onrender.com/getNearestAirport", dataDest, config)
                .then((response) => {
                  console.log(response.data);
                  global.closestAirportDestLat = (response.data.lat);
                  global.closestAirportDestLg = (response.data.lng);
                })
                .catch((error) => {
                  
                  console.error(error);
                });

              } catch(e) {
                console.log(e)
              }

              //PLOT PLANE ROUTE
              setTimeout(() => {
              if (transitDistanceNumber1 > 350){

              
                  var originAirport = {lat:closestAirportOriginLat, lng:closestAirportOriginLg}; 
                  var destinationAirport = {lat:closestAirportDestLat, lng:closestAirportDestLg};

                  // Latitude and Longitude of the first location
                  const lat1 = closestAirportOriginLat;
                  const lon1 = closestAirportOriginLg;

                  // Latitude and Longitude of the second location
                  const lat2 = closestAirportDestLat;
                  const lon2 = closestAirportDestLg;

                  // Convert degrees to radians
                  const deg2rad = (deg) => deg * (Math.PI/180);

                  // Calculate distance in kilometers
                  const R = 6371; // Radius of the earth in km
                  const dLat = deg2rad(lat2-lat1);
                  const dLon = deg2rad(lon2-lon1);
                  const a =
                    Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
                  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                  global.planeDistance = R * c;

                  console.log(planeDistance); // Output: 4158.627012222793 km
                  
                  //Define the path between the origin and destination points
                  var path = [originAirport, destinationAirport];
                    
                    // Draw a Polyline between the origin and destination points
                    //let currentMap = new google.maps.Map(document.getElementById("map"))
                    var polyline = new google.maps.Polyline({
                      path: path,
                      geodesic: true,
                      strokeColor: "red",
                      strokeOpacity: 1.0,
                      strokeWeight: 2,
                    });

                    polyline.setMap(map);

                    const bounds = new google.maps.LatLngBounds();
                    bounds.extend(originAirport);
                    bounds.extend(destinationAirport);
                    map.fitBounds(bounds);
                  };}, 1500);



              } else {
                console.log("Geocode failed for destination address: " + status);
              }
            });
          } else {
            console.log("Geocode failed for origin address: " + status);
          }

        });
        
      }

       // this.test();

      
      //console.log("TEST", transitCo2Average)
      
      

    },

    callingBarChart(){
      this.barChartUpdate(0, 170, transitCo2Average.toFixed(0), 3);

    },


    hideLeftBox(){
      var leftBox = document.getElementById("box1inner")
      leftBox.style.display="none";
      var clone = document.getElementById("clone")
      clone.style.display="block";
    },


    close() {
      //hides the main box when close button pressed
      this.box.style.display = 'none';
      this.closeButton.style.display = "none";

      //when close button pressed shows the re-open box and button at bottom of page
      this.opendiv.style.display = 'block';
      this.openButton.style.display = 'block';
    },

    open() {
      //when open button pressed hides the open box and button
      this.opendiv.style.display = 'none';
      this.openButton.style.display = 'none';

      //when open button pressed shows the main box
      this.box.style.display = 'block';
      this.closeButton.style.display = "block";
    },

    cloneButtonClose(){
      var clone = document.getElementById("clone")
      clone.style.display="none";
      var leftBox = document.getElementById("box1inner")
      leftBox.style.display="block";

    },


  }

}
</script>
  
<style>
#map {
  position: absolute;
  top: 56px;
  left: 0%;
  bottom: 0%;
  right: 0%;
  background: rgb(255, 255, 255);
  z-index: 1;
}

.input-boxes {
  z-index: 2;
  position: relative;
  display: inline;
  float: left;
  width: 400px;
}

/* Style the form container */
.input {
  margin: auto;
  width: 30%;
  padding: 5px;
  background-color: #fff;
  border-radius: 5px;
}

/* Style the input boxes */
input[type=text] {
  width: 100%;
  padding: 10px 10px;
  margin: 0px 0;
  box-sizing: border-box;
  border: none;
  border-radius: 4px;
  font-size: 16px;
}

/* Style for when input box clicked*/
input[type="text"]:focus {
  outline: none;
}

button[type="submit"]:focus {
  outline: none;
}

/* Style the submit button */
button[type=submit] {
  background: #4caf50;
  color: white;
  padding: 10px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 0 10px rgb(0 0 0 / 10%);
}



/* Change the background color of the submit button on hover */
button[type=submit]:hover {
  background: #3e8e41;
  transition: all 0.5s;
}

button[type=transport] {
  background: #f2f2f2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 0 10px rgb(0 0 0 / 10%);
  padding: 6px 10px;
  margin-left: 5px;
  width: 80px;
}

button[type=transport]:hover {
  background: #4caf50;
  transition: all 0.5s;
}

button[type=transport]:focus {
  outline: none;
  background-color: #4caf50;
}

#my-box {
  display: none;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 3;
  overflow: hidden;
  backdrop-filter: blur(5px);
}

#close-button {
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  border-radius: 1px, 1px, 1px, 1px;
  height: 20px;
  width: 50px;
  display: none;
  bottom: 30%;
  z-index: 4;
  position: fixed;
  border: none;
  cursor: pointer;
  position: fixed;
  left: 50%;
  transform: translate(-50%);
}

#box1 {
  width: 35%;
  padding-left: 1vw;
  padding-top: 1vh;
  float: right;
}

#transportMethodHidable {
  display: none;
}

#box2 {
  width: 30%;
  padding-top: 1vh;
  float: right;
}

#box3 {
  width: 35%;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  float: left;
  overflow: auto;
  height: 100%;
}

#reg-form {
  padding-top: 0px;
  display: none;
  width:100%;
  height:80px;
}
#reg-form tr,#reg-form td{
  width:100%;
}


#open-div {
  display: none;
  bottom: 0px;
  z-index: 4;
  position: absolute;
  border: none;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: 20px;
  width: 100%;
  left: 0px;
}

#open-button {
  display: none;
  bottom: 20px;
  z-index: 4;
  position: absolute;
  border: none;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  height: 20px;
  width: 50px;
  left: 49%;
}


.carTypeContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
}



.carTypeContainer button {

  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin: 0 10px;
  background-color: #ffffff;
}

button i {
  font-size: 24px;
}

.carTypeContainer button:focus {
  outline-color: #4caf50;
  outline-width: 3px;
  outline-style: solid;
  /* add this line */
}

.carTypeText {
  display: flex;
  justify-content: center;
  align-items: center;

}

.carTypeText #smallText {
  padding-left: 10px;
  padding-right: 25px;
}

.carTypeText #average {
  padding-right: 20px;
}

.carTypeText #large {
  padding-right: 20px;
}


/*radio button css*/
.radio-button-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 0px;
  margin-left: 0px;
}

#fuleType{
  display:none;
}


/*   ---------------new css  */

    .radioButtons {
      border-radius: 1px;
      position: relative;
      margin:0px;
    }

    .radioButtons input {
      text-align: center;
      appearance: none;
      cursor: pointer;
      border-radius: 4px;
      padding: 10px 10px 10px 10px;
      background: #ffffff;
      height: 25%;
      width: 25%;
      color: black;
      font-size: 15px;
      font-family: sans-serif;
      transition: all 0.1s;
      text-align: center;
    }

    .radioButtons input:checked{
      background: orange;
    }



    .radioButtons input::before {
      content: attr(label);
      text-align: center;
    }
    
    /* -----------------  */

    .row2{
      display:none;
    }
    
    .radioButtons .row2 input[type="radio"] {
      display: none;
    }
    
    .radioButtons .row2 label {
      box-sizing: border-box;
      height: 6vw;
      width: 6vw;
      margin: auto;
      margin-top:1vh;
      margin-bottom:1vh;
      border-radius: 50%;
      position: relative;
      color: black;
      transition: 0.05s;
      background-color: #fff;
      font-size: 15px;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      border:0px solid #f2f2f2;  
    }
    
    .radioButtons .row2 i {
      font-size: 60px;
    }
    
    .radioButtons .row2 label span {
      font-size: auto;
      margin-top: 0px;
    }
    
    .radioButtons .row2 input[type="radio"]:checked + label {
        border-color:orange;
        border-width:3px;
    }

    #planeButton:checked{
      background-color: #ED2938;
    }

    #carButton:checked{
      background-color: #FFAA1C;
    }

    #walkButton:checked{
      background-color: #6197d7;
    }

    #transitButton:checked{
      background-color: #ffe733;
    }

    #planeButton{
      border:3px solid #ED2938;
    }
    #carButton{
      border:3px solid #FFAA1C;
    }
    #transitButton{
      border:3px solid #ffe733;
    }
    #walkButton{
      border:3px solid #6197d7;
    }


    #dvla-submit-button{
      width: 100%;
    }

    #dvla-input {
      width: 100%;
      padding: 10px 10px;
      margin: 0px 0;
      box-sizing: border-box;
      border: none;
      border-radius: 4px;
      font-size: 16px;
    }


    #dvlaError{
      color:red;
    }

    .fade-out {
      opacity: 0;
      transition: opacity 1s ease-out;
    }

 
    
    input[type="date"]:focus {
      outline: none;
    }
    
    input[type="date"]:select{
      border:none;
    }

    #infoContainer {
      width:100%;

    }
    #infoContainer input{
      text-align: center;
    }

    #infoInputs input[type="date"]{
      height:15%;
      padding:10px;
      border-radius: 4px;
      border-color:transparent;
      background-color: transparent;
      margin-bottom: 3%;

    }

    /* right box */

  #infoLabels {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  #infoLabels label {
    margin-top:7%;
    margin-bottom: 5%;
    margin-right:10px;
  }

  #infoInputs {
    display: flex;
    flex-direction: column;
    float:left;
  }

  #infoInputs input {
    margin-bottom: 4px;
    height:15%;
    width:65%;
    background-color: transparent;
    
  }



  .inputLabelContainer {
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-gap: 5px;
  margin-top:15px;
  margin-bottom:15px;
  }

  .inputLabelContainer label{
    width:20%;
  }

  .inputLabelContainer input {
    padding: 5px;
    border-radius: 3px;
    border: none;
    width:95%;
    height:30px;
  }

  input#toFrom{
    text-align: center;
  }

.box1Buttons {
  display: flex;
  justify-content: center;
}

.box1Buttons button {
  margin-right: 5px;
  width: 50%;
  box-sizing: border-box;
}

#box1inner{
  margin-right:10px;
}

#clone button{
  background-color: transparent;
  border: 3px solid black;
  float:right;

}

#clone{
  overflow: auto;
  bottom: 0;
  left: 0;
  width: 100%;
  height:200px;
  display:none;
}


/* BAR CHART CSS*/
        .chart {
            padding: 0px 10px 10px 10px;
        }

        .bar {
            height: 35px;
            background-color: green;
            transition: width 0.5s ease-out;
        }

        .label {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
            margin-right:10px;
            margin-left:0px;
            min-width: 55px
        }

        .row {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        }

        .value {
            font-size: 18px;
            text-align: center;
            margin-left: 10px;
            color: #333;
            min-width: 30px;
        }

        .axis {
            position: absolute;
            bottom: 30px;
            left: 50px;
            width: 500px;
            height: 1px;
            background-color: #333;
            transform: rotate(-90deg);
            transform-origin: left top;
        }


        .y-axis-label {
            position: absolute;
            font-size: 14px;
            font-weight: bold;
            color: #333;
            transform: translate(150%, -150%);
        }

        .scale {
            position: absolute;
            bottom: 30px;
            left: 80px;
            width: 400px;
            display: flex;
      top:85%;
      justify-content: space-between;   
    }

    .scale-label {
        font-size: 20px;
        color: #333;
    }

    .scale-tick {
        width: 2px;
        height: 5px;
        background-color: #333;
    
    }
    
    .scale-line{
        height:2px;
      width:88.5%;
      background-color:#333;
          margin-left:12%;
      transform: translate(2px, 3px);

    }

    .scale-tick-label {
        font-size: 18px;
        color: #333;
        transform: translate(-38px, 5px);
    }
  
    .custom{
      background-color: #b7b7b7;
    }

    .car{
      background-color: orange;
    }
    .transit{
      background-color: yellow;
    }
    .walk{
      background-color: #6197d7;
    }
</style>
