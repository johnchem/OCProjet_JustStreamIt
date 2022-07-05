/* let var1 = 42;
const salutation = "C'est le ${var1} hello world !";
console.log(salutation);

class Book {
    constructor(title, author, pages) {
        this.title = title;
        this.author = author;
        this.pages = pages;
    }
}
*/


let json_data =
{
    "tutu": {
        "id": 9,
        "url": "http://127.0.0.1:8000/api/v1/titles/9",
        "title": "Miss Jerry"
    },
    "toto": {
        "id": 574,
        "url": "http://127.0.0.1:8000/api/v1/titles/574",
        "title": "The Story of the Kelly Gang"
    }
};

/*
var json_file = '{
"id": 9,
    "url": "http://127.0.0.1:8000/api/v1/titles/9",
        "title": "Miss Jerry"}';
*/
var data = JSON.parse(json_data);

console.log(data.tutu);

/*
const data = (function () {
    const json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "../mock_data.json",
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json
})();
*/

let myHeading = document.querySelector('h1');
myHeading.textContent = 'JustStreamIt';