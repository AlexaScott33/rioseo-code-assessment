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
    
//   handleDirectionClick();
  // DEMO
  $('.map').attr('src', 'https://maps.googleapis.com/maps/api/staticmap?center=32.823943,-117.150259&zoom=13&scale=2&size=200x300&maptype=roadmap&format=png&visual_refresh=true&markers=size:small%7Ccolor:0xff0000%7Clabel:1%7C32.823943,-117.150259');
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
      `<li key=${truck.id} class="truck-locator-element">
        Name: ${truck.name}
        Address: ${truck.address}
        City: ${truck.city} 
        State: ${truck.state}
        Zip: ${truck.postal_code}
        ${displayStatusMessage}
        <button 
            data-latitude="${truck.latitude}"
            data-longitude="${truck.longitude}"
            class="get-direction"
            >Directions
        </button>
        <button>More Info</button>
      </li>`
    );
  });
  const newList = listItems.join('');
  //   console.log(newList);
  return newList;
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




// function bindEventListeners() {
//   handleDirectionClick();
// }