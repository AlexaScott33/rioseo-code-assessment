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
  let closesAt;


  // set currDay to the element at index in weekArr
  for(let i=0; i < weekArr.length; i++) {
    if (day === i) {
      currDay = weekArr[i];
    }
  }

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
        <img src="assets/phone-icon.png">123-456-7890
        <button
          class="get-directions">Directions
        </button>
        <button
          class="get-more-info"
          data-name="${truck.name}"
          data-address="${truck.address}"
          data-city="${truck.city}"
          data-state="${truck.state}"
          data-postal_code="${truck.state}"
          data-monday-open="${truck.monday_open}"
          data-monday-close="${truck.monday_close}"
          data-tuesday-open="${truck.tuesday_open}"
          data-tuesday-close="${truck.tuesday_close}"
          data-wednesday-open="${truck.wednesday_open}"
          data-wednesday-close="${truck.wednesday_close}"
          data-thursday-open="${truck.thursday_open}"
          data-thursday-close="${truck.thursday_close}"
          data-friday-open="${truck.friday_open}"
          data-friday-close="${truck.friday_close}"
          data-saturday-open="${truck.saturday_open}"
          data-saturday-close="${truck.saturday_close}"
          data-sunday-open="${truck.sunday_open}"
          data-sunday-close="${truck.sunday_close}"
          >More Info</button>
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
function handleCardClick() {
  $('.truck-locator-list').on('click', '.truck-locator-element', function(event) {
    event.preventDefault();
    console.log('clicking li');
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

// this function will:
// 
function handleMoreInfoClick() {
  $('.truck-locator-list').on('click', '.get-more-info', function(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('clicking more info!!');

    let $this = $(this);

    const address = `${$this.data('address')} <br/> ${$this.data('city')}, ${$this.data('state')} ${$this.data('postal_code')}`;
    const mondaySched = `${$this.data('monday-open')} - ${$this.data('monday-close')}`;
    const tuesdaySched = `${$this.data('tuesday-open')} - ${$this.data('tuesday-close')}`;
    const wednesdaySched = `${$this.data('wednesday-open')} - ${$this.data('wednesday-close')}`;
    const thursdaySched = `${$this.data('thursday-open')} - ${$this.data('thursday-close')}`;
    const fridaySched = `${$this.data('friday-open')} - ${$this.data('friday-close')}`;
    const saturdaySched = `${$this.data('saturday-open')} - ${$this.data('saturday-close')}`;
    const sundaySched = `${$this.data('sunday-open')} - ${$this.data('sunday-close')}`;
    $('.truck-name').html($this.data('name'));
    $('.truck-address').html(address);
    $('.truck-phone').html('123-456-7890');
    //get lat and long
    $('.truck-directions').attr('href', 'https://www.google.com/maps/place/@32.8054529,-117.1452966,17z/data=!3m1!4b1!4m5!3m4!1s0x80dbffd923fc55c9:0xf468775abe2e618!8m2!3d32.8054484!4d-117.1431079');
    $('.monday span' ).html(mondaySched);
    $('.tuesday span' ).html(tuesdaySched);
    $('.wednesday span' ).html(wednesdaySched);
    $('.thursday span' ).html(thursdaySched);
    $('.friday span' ).html(fridaySched);
    $('.saturday span' ).html(saturdaySched);
    $('.sunday span' ).html(sundaySched);

    $('.more-info-wrap').removeClass('hidden');

  });
}

function handleMoreInfoCardClose() {
  $('.close-card').on('click', function(event) {
    event.preventDefault();
    console.log('clicking close button');
    $('.more-info-wrap').addClass('hidden');
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
  handleMoreInfoClick();
  handleMoreInfoCardClose();
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


// https://www.google.com/maps/place/8563+Glenhaven+St,+San+Diego,+CA+92123/@32.8054529,-117.1452966,17z/data=!3m1!4b1!4m5!3m4!1s0x80dbffd923fc55c9:0xf468775abe2e618!8m2!3d32.8054484!4d-117.1431079