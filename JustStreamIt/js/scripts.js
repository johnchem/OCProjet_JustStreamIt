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

let myHeading = document.querySelector('h1');
myHeading.textContent = 'JustStreamIt';

document
    .getElementById("bestScoredMovie")
    .getElementsByClassName("card-title")
    .innerHTML = ["test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8"];