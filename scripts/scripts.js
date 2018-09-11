/* global $ */
'use strict';

$(document).ready(function() {
  $.ajax({
    method: 'GET',
    url: 'https://my.api.mockaroo.com/locations.json?key=a45f1200',
    dataType: 'json'
  }).success(function (response) {
    // work with response data here
    render(response);
    // console.log(response);
  });
    
  bindEventListeners();
  // DEMO
  //   $('.map').attr('src', 'https://maps.googleapis.com/maps/api/staticmap?center=32.823943,-117.150259&zoom=13&scale=2&size=200x300&maptype=roadmap&format=png&visual_refresh=true&markers=size:small%7Ccolor:0xff0000%7Clabel:1%7C32.823943,-117.150259');
});

function render(res) {
  const storeList = generateTruckLocatorList(res);
  $('.truck-locator-list').html(storeList);
}

function generateTruckLocatorList(list) {
  const weekArr = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currDate = new Date();
  const day = currDate.getDay();
  let currDay;
  let displayStatusMessage;
  let opensAt;
  let closesAt;
  //   const time = currDate.getTime();
  //   console.log(time);

  console.log(day);
  console.log(currDate);

  // set currDay to the element at index in weekArr
  for(let i=0; i < weekArr.length; i++) {
    if (day === i) {
      currDay = weekArr[i];
    }
  }
  console.log(`Today is ${currDay}`);

  const listItems = list.map(truck => {
    // if (truck[`${currDay}_open`]) {
    //   opensAt = truck[`${currDay}_open`];
    //   console.log(`On ${currDay} this truck with id: ${truck.id} is opened at ${opensAt}`);
    // }
    if (truck[`${currDay}_close`]) {
      closesAt = truck[`${currDay}_close`];
      displayStatusMessage = `Open today until ${closesAt}`;
    } else {
      displayStatusMessage = 'Closed';
    }
    return (
      `<li 
          key=${truck.id} 
          class="truck-locator-element"
          data-latitude="${truck.latitude}"
          data-longitude="${truck.longitude}">
        Name: ${truck.name}
        Address: ${truck.address}
        City: ${truck.city} 
        State: ${truck.state}
        Zip: ${truck.postal_code}
        ${displayStatusMessage}
        <button
          class="get-direction">Directions
        </button>
        <button>More Info</button>
      </li>`
    );
  });
  const newList = listItems.join('');
  //   console.log(newList);
  return newList;
}

// this function will:
// listen for a click of the location card
// get the lat/long points for that truck
// place the lat/long into google static map
// remove the hidden class from map
// add hidden class to initial-grey-display div
function handleCardClick(latitude, longitude) {
  $('.truck-locator-list').on('click', '.truck-locator-element', function(event) {
    event.preventDefault();
    console.log('clicking');

    let $this = $(this);

    let truckLatitude = $this.attr('data-latitude');
    let truckLongitude = $this.attr('data-longitude');
    console.log(truckLatitude);
    console.log(truckLongitude);

    // $('.map').attr('src', `https://maps.googleapis.com/maps/api/staticmap?center=${truckLatitude},${truckLongitude}&zoom=13&scale=2&size=200x300&maptype=roadmap&format=png&visual_refresh=true&markers=size:small%7Ccolor:0xff0000%7Clabel:1%7C32.823943,-117.150259`);
    $('.map').attr('src', `https://maps.googleapis.com/maps/api/staticmap?center=${truckLatitude},${truckLongitude}&zoom=13&scale=2&size=200x300&maptype=roadmap&format=png&visual_refresh=true&markers=size:small%7Ccolor:0xff0000%7Clabel:1%7C${truckLatitude},${truckLongitude}`);
    $('.map').removeClass('hidden');
    $('.initial-grey-display').addClass('hidden');
  });
}


function handleDirectionClick(latitude, longitude) {
  $('.get-direction').on('click', function() {
    // event.preventDefault();
    console.log('clicking');
    let $this = $(this);

    console.log($this.attr('data-latitude'));
    console.log($this.attr('data-longitutde'));
  });
}



function bindEventListeners() {
  handleCardClick();
}




// hard coded data for when site goes down
// <li key="1" 
//                         class="truck-locator-element"
//                         data-latitude="41.0938"
//                         data-longitude="-85.0707">
//                             Name: Taco Truck 1
//                             Address: 8000 Some Street
//                             City: San Diego
//                             State: CA
//                             Zip: 92121
//                             Open until 9pm
//                             <button 
//                                 class="get-direction"
//                                 >Directions
//                             </button>
//                             <button class="get-more-info">More Info</button>
//                     </li>

//                     <li key="2" 
//                     class="truck-locator-element"
//                     data-latitude="32.823943"
//                     data-longitude="-117.150259">
//                         Name: Taco Truck 2
//                         Address: 9000 Some Street
//                         City: San Diego
//                         State: CA
//                         Zip: 92121
//                         Open until 10pm
//                         <button 
//                             class="get-direction"
//                             >Directions
//                         </button>
//                         <button class="get-more-info">More Info</button>
//                 </li>