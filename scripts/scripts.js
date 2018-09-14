/* global $ */
'use strict';

$(document).ready(function() {
  $.ajax({
    method: 'GET',
    url: 'https://my.api.mockaroo.com/locations.json?key=a45f1200',
    dataType: 'json'
  }).success(function (response) {
    render(response);
    // console.log(response);
  });
    
  bindEventListeners();

  // functionality for mobile view
  if ($(window).width() <= 480) {

    $('.nav-container').addClass('hidden');
    $('.header-container').addClass('hidden');
    $('.mobile-nav').removeClass('hidden');
    $('.mobile-button').removeClass('hidden');
    $('.map-wrap').addClass('hidden');
    
    // listens for a click on the truck locator card
    // hides the list and shows map
    $('.truck-locator-list').on('click', '.truck-locator-element', function() {

      $('.list-wrap').addClass('hidden');
      $('.map-wrap').removeClass('hidden');

      $('.show-map').addClass('orange-background');
      $('.show-map').removeClass('orange-font');
      $('.show-list').addClass('orange-font');
      $('.show-list').removeClass('orange-background');
    });

    // listens for a click on the more info button
    // hides the list and shows the map with overlay of details
    $('.truck-locator-list').on('click', '.get-more-info', function(event) {

      $('.list-wrap').addClass('hidden');
      $('.map-wrap').removeClass('hidden');

      $('.show-map').addClass('orange-background');
      $('.show-map').removeClass('orange-font');
      $('.show-list').addClass('orange-font');
      $('.show-list').removeClass('orange-background');
    });
  }
});


function render(res) {
  const storeList = generateTruckLocatorList(res);
  $('.truck-locator-list').html(storeList);
}

// this function:
// dynamically generates the truck locator list
function generateTruckLocatorList(list) {
  const weekArr = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  // get current date
  const currDate = new Date();

  // returns a number 0-6 where 0 is sunday
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

  // maps over the response creating a new array of list elements for each truck
  const listItems = list.map(truck => {
    // gets the current day's closing time
    // sets closesAt to that value
    // generates display message
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
          <div class="list-header">
            <h5 class="list-truck-name">${truck.name}</h5>
            <p class="list-miles">0.5miles</p>
          </div>
          <p class="list-truck-address">${truck.address}</p>
          <p class="list-truck-city">${truck.city}, ${truck.state} ${truck.postal_code}</p>
          <p class="list-display-message">${displayStatusMessage}</p>
        <img src="assets/phone-icon.png">
        <p class="list-phone">123-456-7890</p>
        <div>
          <a
            class="get-directions" href="https://www.google.com/maps/dir/${truck.latitude},${truck.longitude}" target="_blank"
            data-latitude="${truck.latitude}"
            data-longitude="${truck.longitude}"
            >DIRECTIONS
          </a>
          <button
            class="get-more-info"
            data-name="${truck.name}"
            data-url="${truck.url}"
            data-address="${truck.address}"
            data-city="${truck.city}"
            data-state="${truck.state}"
            data-postal-code="${truck.postal_code}"
            data-latitude="${truck.latitude}"
            data-longitude="${truck.longitude}"
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
            >MORE INFO
          </button>
        </div>
      </li>`
    );
  });
  const newList = listItems.join('');
  return newList;
}

// this function:
// listens for a click of the location card
// gets the lat/long points for that truck
// places the lat/long into google static map
// removes the hidden class from map
// adds hidden class to initial-grey-display div
function handleCardClick() {
  $('.truck-locator-list').on('click', '.truck-locator-element', function() {
    // console.log('clicking li');

    let $this = $(this);

    const truckLatitude = $this.data('latitude');
    const truckLongitude = $this.data('longitude');
    // console.log(truckLatitude);
    // console.log(truckLongitude);

    $('.map').attr('src', `https://maps.googleapis.com/maps/api/staticmap?center=${truckLatitude},${truckLongitude}&zoom=13&scale=2&size=200x300&maptype=roadmap&format=png&visual_refresh=true&markers=size:small%7Ccolor:0xff0000%7Clabel:1%7C${truckLatitude},${truckLongitude}`);
    $('.map').removeClass('hidden');
    $('.initial-grey-display').addClass('hidden');
  });
}

// this function:
// listens for a click of the more info button
// gets all the data for that specific truck
// sets data to respected html element
// removes the hidden class from .more-info-wrap
function handleMoreInfoClick() {
  $('.truck-locator-list').on('click', '.get-more-info', function(event) {
    event.preventDefault();
    event.stopPropagation();
    // console.log('clicking more info button');

    let $this = $(this);

    const truckLatitude = $this.data('latitude');
    const truckLongitude = $this.data('longitude');
    const truckUrl = $this.data('url');
    // console.log(truckUrl);
    const address = `${$this.data('address')} <br/> ${$this.data('city')}, ${$this.data('state')} ${$this.data('postal-code')}`;
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
    $('.truck-directions').attr('href', `https://www.google.com/maps/dir/${truckLatitude},${truckLongitude}`);
    $('.monday .schedule' ).html(mondaySched);
    $('.tuesday .schedule' ).html(tuesdaySched);
    $('.wednesday .schedule' ).html(wednesdaySched);
    $('.thursday .schedule' ).html(thursdaySched);
    $('.friday .schedule' ).html(fridaySched);
    $('.saturday .schedule' ).html(saturdaySched);
    $('.sunday .schedule' ).html(sundaySched);
    $('.view-full-details').attr('href', `${truckUrl}`);

    $('.more-info-wrap').removeClass('hidden');
  });
}

// this function:
// listens for a click of the close button
// adds hidden class to .more-info-wrap
function handleMoreInfoCardClose() {
  $('.close-card').on('click', function(event) {
    event.preventDefault();
    // console.log('clicking close button');

    $('.more-info-wrap').addClass('hidden');
  });
}

// this function:
// listens for a click on the list button on mobile device
// hides the map and shows the list
// changes color of background and font for both buttons
function handleMobileListClick() {
  $('.show-list').on('click', function(event) {
    event.preventDefault();
    // console.log('list');

    $('.map-wrap').addClass('hidden');
    $('.list-wrap').removeClass('hidden');

    $('.show-list').addClass('orange-background');
    $('.show-list').removeClass('orange-font');
    $('.show-map').addClass('orange-font');
    $('.show-map').removeClass('orange-background');
  });
}

// this function:
// listens for a click on the map button on mobile device
// hides the list and shows the map
// changes color of background and font for both buttons
function handleMobileMapClick() {
  $('.show-map').on('click', function(event) {
    event.preventDefault();
    // console.log('map');

    $('.list-wrap').addClass('hidden');
    $('.map-wrap').removeClass('hidden');

    $('.show-map').addClass('orange-background');
    $('.show-map').removeClass('orange-font');
    $('.show-list').addClass('orange-font');
    $('.show-list').removeClass('orange-background');
  });
}



function bindEventListeners() {
  handleCardClick();
  handleMoreInfoClick();
  handleMoreInfoCardClose();
  handleMobileListClick();
  handleMobileMapClick();
}