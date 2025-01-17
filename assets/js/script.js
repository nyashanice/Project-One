var quoteApi = 'https://api.goprogram.ai/inspiration';
var quoteElement = document.getElementById('quote-box');
var calendarContainerEl = document.getElementById('calendar-container');
var dayNamesEl = document.getElementById('day-names');
var dayRowContainerEl = document.getElementById('day-row-container');
var daysContainer = document.getElementById('days');
var currentMonth = document.getElementById('month')
var navText = document.getElementById('navText');
var createEventEl = document.getElementById('createEvent');
var cancelEventEl = document.getElementById('cancelEvent');
var eventTxtEl = document.getElementById('eventTitle');
var radioBtnsEl = document.getElementById('formOptions');
var notesEl = document.getElementById('notes');
var leftArrow = document.getElementById('left-arrow');
var rightArrow = document.getElementById('right-arrow');

var monthIndex = dayjs().get('month')


// api call and population of html elements to display quote of the day
function getQuote() {
    fetch(quoteApi)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            var author = data.author;
            var quote = data.quote;
            var authorEl = document.createElement('p');
            var quoteEl = document.createElement('p');


            authorEl.textContent = author;
            quoteEl.textContent = quote;
            quoteElement.appendChild(quoteEl);
            quoteElement.appendChild(authorEl);
        })
}

function previousMonth() {
    monthIndex--;
    if (monthIndex < 0) {
        monthIndex = 11;
    }

    displayMonth();
}

function nextMonth() {
    monthIndex++;
    if (monthIndex > 11) {
        monthIndex = 0;
    }

    displayMonth();
}

function displayMonth() {
    // updates text content of the month name
    currentMonth.textContent = dayjs().set('month', monthIndex).format('MMMM');

    clearMonth();
}

function clearMonth() {
    while (dayRowContainerEl.hasChildNodes()) {
        dayRowContainerEl.removeChild(dayRowContainerEl.firstChild)
    }
    makeDays();
}


// makes elements based on the number of days in the current month
function makeDays() {
    currentMonth.textContent = dayjs().set('month', monthIndex).format('MMMM');
    var daysInCurrentMonth = dayjs().daysInMonth(); //returns number of days in current month
    var currentMonthFirstDay = dayjs().set('month', monthIndex).startOf('month').get('d'); //returns day of week as index
    var daysInPrevMonth = dayjs().set('month', monthIndex).startOf('month').subtract(1, 'month').daysInMonth(); // returns number of days in previous month
    var nextMonthFirstDay = dayjs().set('month', monthIndex).startOf('month').add(1, 'month').get('d'); //returns day of week as index

    // make days of previous month
    for (var x = currentMonthFirstDay; x > 0; x--) {
        var button = document.createElement('button');
        var year = dayjs().set('month', monthIndex).subtract(1, 'month').format('YYYY');
        var month = dayjs().set('month', monthIndex).subtract(1, 'month').format('MM');
        var day = (daysInPrevMonth - x);
        var date = year + '-' + month + '-' + day;

        button.setAttribute('class', 'btn btnOne text-secondary d-flex text-start pt-2 h-100');
        button.setAttribute('data-date', date);
        button.textContent = day;
        dayRowContainerEl.appendChild(button);
    }

    // make days of current month
    for (var y = 0; y < daysInCurrentMonth; y++) {
        var button = document.createElement('button');
        var pTag = document.createElement('p');
        var year = dayjs().set('month', monthIndex).format('YYYY');
        var month = dayjs().set('month', monthIndex).format('MM');
        var day = y + 1;
        var dayString = '0' + day.toString();
        var date = year + '-' + month + '-' + dayString.slice(-2);

        button.setAttribute('class', 'btn btnOne d-flex text-start p-0 h-100')
        button.setAttribute('data-date', date);
        pTag.setAttribute('class', 'm-2')
        pTag.textContent = day;
        button.appendChild(pTag);
        dayRowContainerEl.appendChild(button);

        // Checks for todays date and adds an id to change color
        // var today = dayjs().format('2023-01-02');
        var today = dayjs().format('YYYY-MM-DD');
        if (today === date) {
            // console.log('yes')
            pTag.setAttribute('id', 'currentDay');
            pTag.setAttribute('class', 'm-0')
        }
    }

    // make days of next month
    for (var z = 1; z <= 7 - nextMonthFirstDay; z++) {
        var button = document.createElement('button');
        var year = dayjs().set('month', monthIndex).add(1, 'month').format('YYYY');
        var month = dayjs().set('month', monthIndex).add(1, 'month').format('MM');
        var dayString = '0' + z.toString();
        var date = year + '-' + month + '-' + dayString.slice(-2);

        button.setAttribute('class', 'btn btnOne text-secondary d-flex text-start pt-2 h-100');
        button.textContent = z;
        button.setAttribute('data-date', date);
        dayRowContainerEl.appendChild(button);
    }
}

// request location from user, get latitude and longitude, and convert it to a location in openweathermap api
function getLocation() {
    // if statement to determine whether geolocation is supported by the browser
    // if yes, request location from user
    // if the user does not allow location services, display weather for Atlanta by default
    if (navigator.geolocation) {
        // getCurrentPosition(success,error,options)
        //  returns a GeolocationPosition object
        // the function takes the GeolocationPosition object as its parameter
        navigator.geolocation.getCurrentPosition(getCoordinates, getDefault);
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
}

// displays weather for Atlanta, GA if location services disabled
function getDefault() {
    var url = 'https://api.openweathermap.org/data/2.5/weather?q=Atlanta&appid=1ff1b9e8930bbe84b844222ea3d5a398&units=imperial'
    fetch(url).then(function (response) {
        return response.json()

    }).then(function (data) {
        // console.log(data);
        var location = data.name;
        var high = data.main.temp_max;
        var low = data.main.temp_min;
        var icon = data.weather[0].icon;
        // console.log(icon);
        var navWeather = document.createElement('div');
        navWeather.textContent = location + ' ' + high + '°F' + ' / ' + low + '°F';
        var img = document.createElement('img');
        img.setAttribute('src', 'http://openweathermap.org/img/wn/' + icon + '@2x.png')
        // img.setAttribute('src', 'http://openweathermap.org/img/wn/02d@2x.png')
        img.setAttribute('style', 'width: 20%')
        navText.appendChild(navWeather);
        navText.appendChild(img);
    })
}

// function defines variables with latitude and longitude as their values
function getCoordinates(position) {
    // console.log('Latitude: ' + position.coords.latitude);
    // console.log('Longitude: ' + position.coords.longitude);
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    getWeather(lat, long);
}

// called in getCoordiantes, passess lat and long as its arguments
// calls openweathermap api using the coordinates generated with the getCurrentPosition method
// creates html elements and displays them on the page
function getWeather(lat, long) {
    var url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=1ff1b9e8930bbe84b844222ea3d5a398&units=imperial'
    fetch(url).then(function (response) {
        return response.json()
    }).then(function (data) {
        // console.log(data);
        var location = data.name;
        var high = data.main.temp_max;
        var low = data.main.temp_min;
        var icon = data.weather[0].icon;
        // console.log(icon);
        var navWeather = document.createElement('div');
        navWeather.textContent = location + ' ' + high + '°F' + ' / ' + low + '°F';
        var img = document.createElement('img');
        img.setAttribute('src', 'http://openweathermap.org/img/wn/' + icon + '@2x.png')
        // img.setAttribute('src', 'http://openweathermap.org/img/wn/02d@2x.png')
        img.setAttribute('style', 'width: 20%')
        navText.appendChild(navWeather);
        navText.appendChild(img);

    })
}

// makes pop-up menu visible
function addEventPopup(event) {
    // gets data-date attribute from target element
    var date = event.target.getAttribute('data-date');
    // console.log(date);

    // sets date as the event start date element value
    document.getElementById('startDate').removeAttribute('value');
    document.getElementById('startDate').setAttribute('value', date);

    var showPopup = document.getElementById('addEvent');
    if (showPopup.style.visibility == 'hidden') {
        showPopup.style.visibility = 'visible';
    } else {
        showPopup.style.visibility = 'hidden';
    }

}

// TODO: add local storage functionality
// create object based on the date clicked on and the options chosen by the user
function createEvent(event) {
    event.preventDefault();
    // console.log('initialize create event');
    // select children of radioBtnsEl by input tag
    var radioOptions = radioBtnsEl.getElementsByTagName('input');
    // get event title text
    var eventTxt = eventTxtEl.value;
    // console.log(eventTxt);
    // get category of event
    var category;
   
        for (var i = 0; i < radioOptions.length; i++) {
            if (radioOptions[i].checked) {
                category = radioOptions[i].value;
                // console.log(category);
            }
        }
    // get date
    var date = document.getElementById('startDate').value
    // console.log(date)
    
    createStorageObject(date,category,eventTxt);
    hideForm();
}
// create object to store event data and save it to local storage
function createStorageObject(date,category,eventTxt) {
    var storedObject = JSON.parse(localStorage.getItem(date));
    // console.log('stored object: ', storedObject);

    // set conditional to check if object exists
    if (!storedObject) {
        var indicatorEl = document.createElement('p');
        indicatorEl.setAttribute('id', 'sticky-note');
        var icon = document.createElement('i');
        icon.setAttribute('class', 'fa-solid fa-note-sticky')
        indicatorEl.appendChild(icon);
        document.querySelector(`[data-date="${date}"]`).appendChild(indicatorEl);
        // if object does not exist, create new object
        // create key and set value to event text
        storedObject = {};
        var newArr = [];
        newArr.push(eventTxt)
        storedObject[category] = newArr;
        // save object to local storage
        localStorage.setItem(date, JSON.stringify(storedObject));
        // console.log(JSON.parse(localStorage.getItem(date)));

        displaySideBar(date);
    } else if (!storedObject[category]) {
        // if user wants to create an event under a new category
        var newArr = [];
        newArr.push(eventTxt);
        storedObject[category] = newArr;
        localStorage.setItem(date, JSON.stringify(storedObject));
        // console.log(JSON.parse(localStorage.getItem(date)));

        displaySideBar(date);
    } else {
        // if user wants to add another event under an existing category
        existingArr = storedObject[category];
        // console.log('existing array in local storage: ', existingArr);
        existingArr.push(eventTxt);
        localStorage.setItem(date, JSON.stringify(storedObject));
        // console.log(JSON.parse(localStorage.getItem(date)));

        displaySideBar(date);
    }
}

function displayElements(event) {
     // get date to pass to displaySideBar
    var date = event.target.getAttribute('data-date')
    displaySideBar(date);
}

function displaySideBar(date) {
    clearItems();

    var storedObject = JSON.parse(localStorage.getItem(date));
    // console.log(storedObject)
    
    for (keys in storedObject) {
        var propertyValues = storedObject[keys]; //returns array
        // console.log('key: ', keys)
        // console.log('value ', propertyValues);

        for (var i = 0; i < propertyValues.length; i++) {
            var category = document.getElementById(keys + '-list');
            var liEl = document.createElement('li');

            liEl.setAttribute('id', 'note-items');
            liEl.textContent = propertyValues[i];
            category.appendChild(liEl);
        }
    }
}

function clearItems() {
    // var date = event.target.getAttribute('data-date');
    // var storedObject = JSON.parse(localStorage.getItem(date));

    var catArray = ['birthdays-list', 'holidays-list', 'personal-list', 'work-list', 'school-list', 'other-list']
    
    for (i of catArray) {
        var del = document.getElementById(i)
        while (del.hasChildNodes()) {
            del.removeChild(del.firstChild);
        }
    }
}

function cancelEvent() {
    // console.log('event cancelled')
    var hidePopup = document.getElementById('addEvent');
    hidePopup.style.visibility = 'hidden';
}

function hideForm() {
    var hidePopup = document.getElementById('addEvent');
    hidePopup.style.visibility = 'hidden';
}

function init() {
    getLocation();
    getQuote();
    makeDays();


    dayRowContainerEl.addEventListener('dblclick', addEventPopup);
    dayRowContainerEl.addEventListener('click', clearItems);
    dayRowContainerEl.addEventListener('click', displayElements);
    createEventEl.addEventListener('click', createEvent);
    cancelEventEl.addEventListener('click', cancelEvent);
    leftArrow.addEventListener('click', previousMonth);
    rightArrow.addEventListener('click', nextMonth);
}

init();