/* global $ */
'use strict';

$(document).ready(function() {
  $.ajax({
    method: 'GET',
    url: 'https://my.api.mockaroo.com/locations.json?key=a45f1200',
    dataType: 'json'
  }).success(function (response) {
    // work with response data here
    // $('.truck-locator-list').html(response);
    render(response);
    // console.log(response);
  });

  // DEMO
  $('.map').attr('src', 'https://maps.googleapis.com/maps/api/staticmap?center=32.823943,-117.150259&zoom=13&scale=2&size=200x300&maptype=roadmap&format=png&visual_refresh=true&markers=size:small%7Ccolor:0xff0000%7Clabel:1%7C32.823943,-117.150259');
});

function render(res) {
  const storeList = generateTruckLocatorList(res);
  $('.truck-locator-list').html(storeList);
}

function generateTruckLocatorList(list) {
    const currDate = new Date();
    console.log(currDate);
  const listItems = list.map(truck => `
      <li key=${truck.id} class="truck-locator-element">
        ${truck.name}
      </li>`);
  const newList = listItems.join('');
  console.log(newList);
  return newList;
}