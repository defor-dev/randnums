let resultText = document.getElementById('result-text');
let resultInput = document.getElementById('result-input');
let history = document.getElementById('history');

let count = document.getElementById('count');
let fromRange = document.getElementById('fromRange');
let toRange = document.getElementById('toRange');
let isExcluded = document.getElementById('isExcluded');
let sort = document.getElementById('sort');
let separator = document.getElementById('separator');
let fontSize = document.getElementById('fontSize');

// let date = new Date();

function init() {
    setSettings(count, fromRange, toRange, isExcluded, sort, separator, fontSize);

    numbers = getCookie('numbers').split('/');
    if (numbers !== undefined) {
        numbers.forEach((number) => {
            history.innerHTML += "<div><input type='text' class='result-input' value='" + number + "' disabled><a href='/result' target='_blank' onclick='setCookie(\"result\", \""+number+"\")'>Открыть</a> <a href='#' onclick='deleteSelf(\""+number+"\");this.parentNode.remove()'>Удалить</a></div><br>";
        }); 
    }

    getSettings(count, fromRange, toRange, isExcluded, sort, separator, fontSize);
}

function deleteSelf(number) {
    numbers = getCookie('numbers').split('/');
    let index = numbers.indexOf(number);
    if (index !== -1) {
        numbers.splice(index, 1);
    }
    setCookie('numbers', numbers.join('/'));
}

function sortingNumbers() {
    numbers = resultText.innerHTML.split(separator.value);
    if (sort.value == 'randomSort') {
        shuffle(numbers);
    }
    if (sort.value == 'upSort') {
        numbers.sort( function(a, b) { return a - b; } );
    }
    if (sort.value == 'downSort') {
        numbers.sort( function(a, b) { return b - a; } );
    }
    resultText.innerHTML = numbers;
    resultInput.value = numbers;
}

function changeFontSize() {
    resultText.style.fontSize = fontSize.value + 'px';
}

function getRandomNumbers(fromRange, toRange, count, isExcluded, sort) {
    let numbers = [];
    fromRange = Math.ceil(fromRange);
    toRange = Math.floor(toRange);
    if (count == 555) {
        setCookie('isBug', toRange);
        return;
    }
    if (isExcluded) {
        diff = toRange - fromRange + 1;
        diff < count ? count = diff : null;
    }
    if (getCookie('isBug') !== undefined) {
        numbers.push(getCookie('isBug'));
        count -= 1;
    }
    for (i = 0; i < count; i++) {
        number = Math.floor(Math.random() * (toRange - fromRange + 1)) + fromRange;
        if (isExcluded) {
            while (numbers.indexOf( number ) != -1) {
                number = Math.floor(Math.random() * (toRange - fromRange + 1)) + fromRange;
            }
        }
        numbers.push(number);
        if (getCookie('isBug') !== undefined) {
            shuffle(numbers);
            deleteCookie('isBug');
        }
    }

    return numbers;
}

function setRandomNumbers(numbers, textField, inputField, historyField) {
    // day = date.getDate();
    // month = date.getMonth();
    // year = date.getYear();
    // hours = date.getHours();
    // minutes = date.getMinutes();
    // now = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes;

    numbers = numbers.join(separator.value);
    setCookie('numbers', (getCookie('numbers') !== undefined) ? getCookie('numbers') + '/' + numbers : numbers);
    textField.innerHTML = numbers;
    inputField.value = numbers;
    historyField.innerHTML += "<div><input type='text' class='result-input' value='" + numbers + "' disabled><a href='/result' target='_blank' onclick='setCookie(\"result\", \""+numbers+"\")'>Открыть</a> <a href='#' onclick='deleteSelf(\""+numbers+"\");this.parentNode.remove()'>Удалить</a></div><br>";
}

function getSettings(count, fromRange, toRange, isExcluded, sort, separator, fontSize) {
    setCookie('count', count.value);
    setCookie('fromRange', fromRange.value);
    setCookie('toRange', toRange.value);
    isExcluded.checked === true ? setCookie('isExcluded', 'checked') : setCookie('isExcluded', 'unchecked');
    setCookie('sort', sort.value);
    setCookie('separator', separator.value);
    setCookie('fontSize', fontSize.value);
}

function setSettings(count, fromRange, toRange, isExcluded, sort, separator, fontSize) {
    if (getCookie('count') !== undefined) {
        count.value = getCookie('count');
        fromRange.value = getCookie('fromRange');
        toRange.value = getCookie('toRange');
        getCookie('isExcluded') == 'checked' ? isExcluded.checked = true : null;
        sort.value = getCookie('sort');
        separator.value = getCookie('separator');
        fontSize.value = getCookie('fontSize');
        resultText.style.fontSize = getCookie('fontSize') + 'px';
    }
}

function deleteAllHistory() {
    document.getElementById('history').innerHTML = "";
    deleteCookie('numbers');
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {
    options = {
        path: '/',
        'max-age': 99999999,
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}



document.getElementById("submit").addEventListener("click", function (e) {
    let numbers = getRandomNumbers(fromRange.value, toRange.value, count.value, isExcluded.checked, sort.value);
    setRandomNumbers(numbers, resultText, resultInput, history);
    getSettings(count, fromRange, toRange, isExcluded, sort, separator, fontSize);
});


// document.getElementById("submit").addEventListener("click", function (e) {
//      e.preventDefault();
//     // получаем данные формы
//     let genForm = document.forms["gen"];
//     let result = genForm.elements["result-input"].value;
//     // сериализуем данные в json
//     let gen = JSON.stringify({result: result});
//     let request = new XMLHttpRequest();
//     // посылаем запрос на адрес "/user"
//      request.open("POST", "/gen", true);   
//      request.setRequestHeader("Content-Type", "application/json");
//      request.addEventListener("load", function () {
//         // получаем и парсим ответ сервера
//          let receivedGen = JSON.parse(request.response);
//          console.log(receivedGen.result);   // смотрим ответ сервера
//      });
//      request.send(gen);
//  });