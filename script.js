'use strict';

const startDate = document.querySelector('#start-date');
let endDate = document.querySelector('#end-date');
const presetSelect = document.querySelectorAll('.preset');
const optionSelect = document.querySelector('#options-select');
const dimensionSelect = document.querySelector('#dimension-select');
const calculateButton = document.querySelector('#calculate-button');
const resultList = document.querySelector('#results-table');

startDate.addEventListener('change', startDateInput);
endDate.addEventListener('change', endDateInput);
calculateButton.addEventListener('click', calculateDates);
presetSelect.forEach(element => {
  element.addEventListener('click', (e) => presetButtons(e));
});

let startDateValue;
let endDateValue;
createListElement();

function getResultsFromLocalStorage() {
  return localStorage.getItem('results') !== null ? JSON.parse(localStorage.getItem('results')) : [];
}

function startDateInput() {
  endDate.min = startDate.value;
  if (startDate.value == '') {
    endDate.disabled = true;
    endDate.value = '';
  } else {
    endDate.disabled = false;
  }
  startDateValue = startDate.value;
  calculateButtonState();
}

function endDateInput() {
  endDateValue = endDate.value;
  calculateButtonState();
}

function calculateButtonState() {
  if (startDate.value == '' || endDate.value == '') {
    calculateButton.disabled = true;
  } else {
    calculateButton.disabled = false;
  }
}

function durationBetweenDates(startDate, endDate, dimension) {
  let timeDiffInSeconds = getTimeDiffInSeconds(startDate, endDate);

  switch (dimension) {
    case 'days':
      return Math.ceil(timeDiffInSeconds / (60 * 60 * 24)) + ' days';
    case 'hours':
      return Math.ceil(timeDiffInSeconds / (60 * 60)) + ' hours';
    case 'minutes':
      return Math.ceil(timeDiffInSeconds / 60) + ' minutes';
    case 'seconds':
      return Math.ceil(timeDiffInSeconds) + ' seconds';
  }
}

function getTimeDiffInSeconds(startDate, endDate) {
  let startDateValue = new Date(startDate);
  let endDateValue = new Date(endDate);

  let timeDiffInSeconds;
  let counter = 0;
  const currentDate = startDateValue;

  switch (optionSelect.value) {
    case 'weekdays':
      while (currentDate <= endDateValue) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
          counter++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      timeDiffInSeconds = counter * 86400;
      return timeDiffInSeconds;
    case 'weekends':
      while (currentDate <= endDateValue) {
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
          counter++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      timeDiffInSeconds = counter * 86400;
      return timeDiffInSeconds;
    default:
      timeDiffInSeconds = Math.abs(endDateValue.getTime() - startDateValue.getTime()) / 1000;
      return timeDiffInSeconds;
  }
}

function presetButtons(e) {
  if (startDate.value == '') {
    return;
  }
  let startDateValue = new Date(startDate.value);
  let endDateValue = new Date(endDate.value);
  let currentDate = startDateValue;

  switch (e.target.innerHTML) {
    case 'Тиждень':
      currentDate.setDate(currentDate.getDate() + 7);
      const day = String(currentDate.getDate()).padStart(2, '0');
      // Місяці в JavaScript нумеруються з 0 до 11, тому додаємо 1
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
      const year = currentDate.getFullYear();
      // Сформувати рядок з датою у форматі "рррр-мм-дд"
      let formattedDate = `${year}-${month}-${day}`;
      endDate.value = formattedDate;
      break;
    case 'Місяць':
      currentDate.setDate(currentDate.getDate() + 30);
      const day1 = String(currentDate.getDate()).padStart(2, '0');
      // Місяці в JavaScript нумеруються з 0 до 11, тому додаємо 1
      const month1 = String(currentDate.getMonth() + 1).padStart(2, '0'); 
      const year1 = currentDate.getFullYear();
      // Сформувати рядок з датою у форматі "рррр-мм-дд"
      let formattedDate1 = `${year1}-${month1}-${day1}`;
      endDate.value = formattedDate1; 
      break;
  }
  endDate.dispatchEvent(new Event('change'));
}

function calculateDates() {
  let result = durationBetweenDates(startDateValue, endDateValue, dimensionSelect.value);
  saveToLocalStorage(result);
  createListElement();
}

function createListElement() {
  resultList.getElementsByTagName('tbody')[0].innerHTML = '';
  let resultFromStorage = getResultsFromLocalStorage();
  resultFromStorage.forEach(result => {
    const tableRow = document.createElement('tr');
    const startDateLi = document.createElement('td');
    const endDateLi = document.createElement('td');
    const resultLi = document.createElement('td');

    startDateLi.appendChild(document.createTextNode(result.startDate));
    endDateLi.appendChild(document.createTextNode(result.endDate));
    resultLi.appendChild(document.createTextNode(result.result));
    tableRow.appendChild(startDateLi);
    tableRow.appendChild(endDateLi);
    tableRow.appendChild(resultLi);
    resultList.getElementsByTagName('tbody')[0].appendChild(tableRow);
  });
}

function saveToLocalStorage(result) {
  let entry = {
    "startDate": startDateValue,
    "endDate": endDateValue,
    "result": result,
  };
  // перевірити довжину масиву, якщо більше 10, видаляємо перший елемент масиву або останній
  let resultsStorage = getResultsFromLocalStorage();
  resultsStorage.push(entry);
  if (resultsStorage.length > 10) {
    resultsStorage.shift();
    localStorage.removeItem('results');    
  }
  localStorage.setItem('results', JSON.stringify(resultsStorage));
  console.log(resultsStorage);
}

// фукнціонал початкової кінцевої дати
// написати функцію обробник для опцій
// функція, яка буде створювати li та класти в локал сторедж
// функціонал який буде зберігати дані в локал сторедж
// функціонал з пресетами