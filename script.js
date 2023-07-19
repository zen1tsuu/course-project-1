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
  startDate.max = endDate.value;
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
  if (startDate.value == "") {
    const curDate = new Date();
    let fmtDate = formatDate(curDate);
    startDate.value = fmtDate;
    startDate.dispatchEvent(new Event('change'));
  }
  let startDateValue = new Date(startDate.value);
  let endDateValue = new Date(endDate.value);
  let currentDate = startDateValue;

  switch (e.target.innerHTML) {
    case 'Тиждень':
      currentDate.setDate(currentDate.getDate() + 7);
      endDate.value = formatDate(currentDate);
      break;
    case 'Місяць':
      currentDate.setDate(currentDate.getDate() + 30);
      endDate.value = formatDate(currentDate);
      break;
  }
  endDate.dispatchEvent(new Event('change'));
}

function formatDate(date) {
  const day1 = String(date.getDate()).padStart(2, '0');
  const month1 = String(date.getMonth() + 1).padStart(2, '0');
  const year1 = date.getFullYear();
  return `${year1}-${month1}-${day1}`;
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
}

// фукнціонал початкової кінцевої дати
// написати функцію обробник для опцій
// функція, яка буде створювати li та класти в локал сторедж
// функціонал який буде зберігати дані в локал сторедж
// функціонал з пресетами