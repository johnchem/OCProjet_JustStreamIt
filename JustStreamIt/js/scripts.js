class Carousel {
    /* Structure et element construit à partir du tutoriel de grafikart
    https://grafikart.fr/tutoriels/carrousel-javascript-87
    */

    /**
     * this callback type is called 'requestCallBack' and is displayed as a global symbol.
     * 
     * @callback moveCallBack
     * @param {number} index
     */

    /**
     * @param {HTMLElement} element
     * @param {Object} elementsToDisplay liste des données mettre dans le carousel 
     * @param {Object} options
     * @param {Object} [options.slidesToScroll=1] Nombre d'élément à faire défiler
     * @param {Object} [option.slidesVisible=1] Nombre d'élements visible dans un slide
     * @param {Boolean} [options.loop=false] doit-on boucler à la fin 
     */
    constructor(element, elementsToDisplay, options = {}) {
        let self = this
        self.element = element
        self.elementsToDisplay = elementsToDisplay
        self.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1,
            loop: false
        }, options)

        // récupération des éléments du carousel
        self.children = []
        self.elementsToDisplay.forEach((elementsToDisplay) =>
            self.children.push(self.createCarouselItem(elementsToDisplay)))

        //creation du div pour le carousel et le container
        let ratio = self.children.length / self.options.slidesVisible
        self.currentItem = 0
        self.root = createDivWithClass('carousel')

        // creation d'un container pour les elements visible
        self.container = createDivWithClass('carousel__container')
        self.container.style.width = (ratio * 100) + "%" // largeur du container pour les éléments visible

        // modification du HTML de la page
        self.root.appendChild(self.container)
        self.element.appendChild(self.root)
        self.moveCallBacks = []
        self.items = self.children.map(child => {
            let item = createDivWithClass('carousel__item')
            item.appendChild(child)
            self.container.appendChild(item)
            return item
        })
        this.setStyle()
        this.createNavigation()
        this.moveCallBacks.forEach(cb => cb(0))
    }

    /**
     * construction et activation de la modal
     * @param {url} url adresse de la page détaillé du film
     */
    async buildModal(url) {
        let modalContent = await this.getModalContent(url)

        //  blocs de la structures
        let header = createDivWithClass("modal-header")
        let body = createDivWithClass("modal-body")
        let footer = createDivWithClass("modal-footer")

        // titre et bouton fermeture
        let title = createDivWithClassAndContent("modale-title", modalContent["title"])
        let close_button = document.createElement("button")
        close_button.setAttribute("class", "modal-button close_button")
        header.appendChild(title)
        header.appendChild(close_button)

        // image et bouton lecture
        let picture = document.createElement("img")
        picture.setAttribute("src", modalContent["image_url"])
        picture.setAttribute("class", "modal-picture")

        let play_button = document.createElement("button")
        play_button.setAttribute("class", "modal-button play_button")
        let play_button_text = document.createElement("div")
        play_button_text.innerHTML = "Lecture"

        body.appendChild(picture)
        play_button.appendChild(play_button_text)
        body.appendChild(play_button)

        // creation des elements pour la table
        let genre_content = createDivWithClassAndContent("modal-champs title", "Genre : ")
        let genre_title = createDivWithClassAndContent("modal-champs info", modalContent["genres"])

        let date_published_content = createDivWithClassAndContent("modal-champs title", "Date de sortie : ")
        let date_published_title = createDivWithClassAndContent("modal-champs info", modalContent["date_published"])

        let avg_score_content = createDivWithClassAndContent("modal-champs title", "Score : ")
        let avg_score_title = createDivWithClassAndContent("modal-champs info", modalContent["avg_vote"])

        let imdb_score_content = createDivWithClassAndContent("modal-champs title", "Imdb : ")
        let imdb_score_title = createDivWithClassAndContent("modal-champs info", modalContent["imdb_score"])

        let directors_content = createDivWithClassAndContent("modal-champs title", "Réalisé par : ")
        let directors_title = createDivWithClassAndContent("modal-champs info", modalContent["directors"])

        let actors_content = createDivWithClassAndContent("modal-champs title", "Acteurs : ")
        let actors_title = createDivWithClassAndContent("modal-champs info", modalContent["actors"])

        let duration_content = createDivWithClassAndContent("modal-champs title", "Durée : ")
        let duration_title = createDivWithClassAndContent("modal-champs info", modalContent["duration"] + " min")

        let countries_content = createDivWithClassAndContent("modal-champs title", "Origine : ")
        let countries_title = createDivWithClassAndContent("modal-champs info", modalContent["countries"])

        let box_office_result_content = createDivWithClassAndContent("modal-champs title", "Résultats au Box Office : ")
        let box_office_result_title = createDivWithClassAndContent("modal-champs info", modalContent["worldwide_gross_income"])

        // ajout des elements à la table
        let table_content = [
            [genre_content, genre_title],
            [date_published_content, date_published_title],
            [avg_score_content, avg_score_title],
            [imdb_score_content, imdb_score_title],
            [directors_content, directors_title],
            [actors_content, actors_title],
            [duration_content, duration_title],
            [countries_content, countries_title],
            [box_office_result_content, box_office_result_title]
        ]
        let table = createTable(table_content)
        body.appendChild(table)

        // description du film
        let long_description = createDivWithClassAndContent("modal-champs info", modalContent["long_description"])
        body.appendChild(long_description)
        return [header, body, footer]
    }

    /**
     * @param {string} title
     * @param {string} url_image url pour la mignature de image
     * @returns {HTMLElement}
     */

    createCarouselItem(element) {
        let self = this
        let title = element.title
        let url_image = element.image_url
        let urlModalContent = element.url

        // cree un container pour un item du carousel
        let container = createDivWithClass("item")

        // cree la partie de l'image pour l'image
        let pictureContainer = createDivWithClass("card__img")
        let img = document.createElement('img')
        pictureContainer.appendChild(img)
        container.appendChild(pictureContainer)

        // cree la partie pour le titre
        let titleElement = createDivWithClass("card__title")
        titleElement.innerHTML = title
        container.appendChild(titleElement)

        // ajout de la fenêtre modal et ajout de l'image
        img.setAttribute('src', url_image)
        var modal_construct = Array(this.buildModal(urlModalContent))
        console.log(modal_construct)
        img.addEventListener("click", () => {
            // contruction de la modal
            let modal = document.getElementById("filmSheet")
            debugger
            for (let j = 0; j < 3; j++) {
                var modal_substructure = modal_construct[j]
                modal.appendChild(modal_substructure)
            }

            // activation de la modal
            modal.classList.toggle("active")
        }, false)

        return container
    }

    setStyle() {
        let ratio = this.items.length / this.options.slidesVisible
        this.container.style.width = (ratio * 100) + "%"
        this.items.forEach(item => item.style.width = ((100 / this.options.slidesVisible) / ratio) + "%")
    }

    /**
     * applique les bonnes dimensions aux éléments
     */
    createNavigation() {
        let nextButton = createDivWithClass("carousel__next")
        let prevButton = createDivWithClass("carousel__prev")

        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)

        nextButton.addEventListener('click', this.next.bind(this))
        prevButton.addEventListener('click', this.prev.bind(this))
        if (this.options.loop === true) {
            return
        }
        this.onMove(index => {
            if (index === 0) {
                prevButton.classList.add('carousel__prev--hidden')
            } else {
                prevButton.classList.remove('carousel__prev--hidden')
            }
            if (this.items[this.currentItem + this.options.slidesVisible] === undefined) {
                nextButton.classList.add('carousel__next--hidden')
            } else {
                nextButton.classList.remove('carousel__next--hidden')
            }

        })
    }

    /**
     * contrôle les actions de déplacemnt du carousel vers la droite
     */
    next() {
        this.goToItem(this.currentItem + this.options.slidesToScroll)
    }

    /**
     * contrôle les actions de déplacemnt du carousel vers la gauche
     */
    prev() {
        this.goToItem(this.currentItem - this.options.slidesToScroll)
    }

    /**
     * déplace le carousel vers l'élément ciblé
     * @Param {number} index
     */
    goToItem(index) {
        if (index < 0) {
            index = this.items.length - this.options.slidesVisible
        } else if (index >= this.items.length || (this.items[this.currentItem + this.options.slidesVisible] === undefined && index > this.currentItem)) {
            index = 0
        }
        let translateX = -(100 / this.items.length) * index
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
        this.currentItem = index
        this.moveCallBacks.forEach(cb => cb(index))
    }

    /**
     * @param {moveCallBack} cb
     */
    onMove(cb) {
        this.moveCallBacks.push(cb)
    }

    request(option = {}) {
        this.request = new requestJsonData(option)
    }

    async getModalContent(url) {
        let modalContent = await fetchUrl(url)
        for (const [key, value] of Object.entries(modalContent)) {
            if (value === null) {
                modalContent[key] = "unkwown"
            }
            if (typeof (value) === "array") {
                modalContent[key] = modalContent[key].toString()
            }
        }
        return modalContent
    }

    /*addModal(item, url) {
        item.addEventListener("click", function () {
            console.log(url)
            // construction de la modal
            buildModal(url)
 
            // activation de la modal
            var modal = document.getElementById("filmSheet")
            modal.classList.toggle("active")
        })
    }*/
}


class requestJsonData {
    constructor(filterOption = {}) {
        this.filter = Object.assign({
            year: "",
            min_year: "",
            max_year: "",
            imdb_score: "",
            imdb_score_min: "",
            imdb_score_max: "",
            title: "",
            title_contains: "",
            genre: "",
            genre_contains: "",
            sort_by: "",
            director: "",
            director_contains: "",
            writer: "",
            writer_contains: "",
            actor: "",
            actor_contains: "",
            country: "",
            country_contains: "",
            lang: "",
            lang_contains: "",
            company: "",
            company_contains: "",
            rating: "",
            rating_contains: "",
        }, filterOption)

        this.rootApi = "http://localhost:8000/api/v1/titles/"
        this.buildRequest()
    }

    buildRequest() {
        this.filterString = "?format=json"
        for (const [key, value] of Object.entries(this.filter)) {
            if (value === "") { continue }
            this.filterString += "&" + key + "=" + value
        }
    }

    orderBy(champ = "", reverse = false) {
        if (reverse === true) {
            champ = "-" + champ
        }
        this.filter.sort_by = champ
        this.buildRequest()
    }

    async fetchData(nb_results = 5) {
        let tmpData = await fetchUrl(this.rootApi + this.filterString)
        let data = tmpData
        let maxItem = tmpData.count
        while ((data.results.length < nb_results) && (data.results.length < maxItem)) {
            tmpData = await fetchUrl(tmpData.next)
            data.next = tmpData.next
            tmpData.results.forEach(value => data.results.push(value))
        }
        return data
    }
}

class requestDataFromUrl {
    constructor(url) {
        this.url = url
    }

    async fetch() {
        let response = await fetch(url)
        let data = await response.json()
        return data
    }

    async fetchData(nb_results = 5) {
        let tmpData = await this.fetch()
        let data = tmpData
        let maxItem = tmpData.count
        while ((data.results.length < nb_results) && (data.results.length < maxItem)) {
            tmpData = await this.fetch(tmpData.next)
            data.next = tmpData.next
            tmpData.results.forEach(value => data.results.push(value))
        }
        return data
    }

}

/**
* @param {string} className
* @returns {HTMLElement} 
*/
function createDivWithClass(className) {
    let div = document.createElement('div')
    div.setAttribute('class', className)
    return div
}

/**
* @param {string} className classe du div
* @param {string} content contenu du champs HTML
* @returns {HTMLElement} 
*/
function createDivWithClassAndContent(className, content) {
    let div = document.createElement('div')
    div.setAttribute('class', className)
    div.innerHTML = content
    return div
}

/**
 * @param {Array[HTMLElement]} content Array de dimensions 2 pour la creation d'une table
 * @return {HTMLElement}
 */
function createTable(content) {
    let table = document.createElement("table")
    for (let x = 0; x < content.length; x++) {
        let row = document.createElement("tr")
        for (let y = 0; y < content[x].length; y++) {
            let column = document.createElement("td")
            column.appendChild(content[x][y])
            row.appendChild(column)
        }
        table.appendChild(row)
    }
    return table
}


/** 
 * fonction pour l'initialisation des carousels
 * @param {HTMLElement} element element de carousel
 * @param {Object} data liste des élements à afficher
 * @return {carousel} 
*/
function initCarousel(element, data) {
    let carousel = new Carousel(element,
        data,
        {
            slidesToScroll: 1,
            slidesVisible: 4
        })
    return carousel
}

/**
 * importe des données de test depuis moch_data
 * @returns 
 */
async function fetchMochData() {
    let response = await fetch("./mock_data.json")
    let data = await response.json()
    return data
}

/**
 * @param {URL} url adresse de la requete
 * @return {data}
 */
async function fetchUrl(url) {
    let response = await fetch(url)
    let data = await response.json()
    return data
}

// récupération de la fenêtre modal
var modal = document.getElementById("filmSheet");


// récupérer le bouton fermer de la modale
var modal_button = document.getElementsByClassName("close_button")[0];

// ferme la fenêtre quand l'utilisateur clique sur la croix rouge
debugger
if (modal_button !== undefined) {
    modal_button.onclick = function () {
        modal.classList.toggle("active")
        console.log("modale close")
    }
}


// ferme la fenpetre quand l'utilisateur clique partout ailleurs
window.addEventListener("click", function (event) {
    if (event.target == modal) {
        modal.classList.toggle("active")
        console.log("modale close")
    }
})

// debugger
/**
 * carousel Best Movies
 */
let requestCarouselBestMovies = new requestJsonData()
requestCarouselBestMovies.orderBy("imdb_score", true)

requestCarouselBestMovies.fetchData(10).then((response) => {
    let carouselElementBestMovies = document.querySelector("#bestScoredMovie")
    initCarousel(carouselElementBestMovies, response.results, requestCarouselBestMovies)
    /*
    if (document.readyState !== 'loading') {
        initCarousel(carouselElementBestMovies, response.results, requestCarouselBestMovies)
    } else {
        document.addEventListener("DOMContentLoaded", function () {
            initCarousel(carouselElementBestMovies, response.results, requestCarouselBestMovies)
        })
    }
    */
})

// debugger
/**
 * 1st carousel
 */
let requestCarousel_1 = new requestJsonData({
    genre: "comedy"
})
requestCarousel_1.orderBy("imdb_score", true)

requestCarousel_1.fetchData(10).then((responseCar_1) => {
    let carouselElement_1 = document.querySelector("#carousel_cat_1")
    initCarousel(carouselElement_1, responseCar_1.results)
    /*if (document.readyState !== 'loading') {
        initCarousel(carouselElement_1, responseCar_1.results)
    } else {
        document.addEventListener("DOMContentLoaded", function (event) {
            initCarousel(carouselElement_1, responseCar_1.results)
            event.stopPropagation()
        })
    }
    */
})

// debugger
/**
 *  2nd carousel
 */
let requestCarousel_2 = new requestJsonData({
    genre: "news"
})
requestCarousel_2.orderBy("imdb_score", true)

requestCarousel_2.fetchData(10).then((responseCar_2) => {
    let carouselElement_2 = document.querySelector("#carousel_cat_2")
    initCarousel(carouselElement_2, responseCar_2.results)
    /*
    if (document.readyState !== 'loading') {
        initCarousel(carouselElement_2, responseCar_2.results)
    } else {
        document.addEventListener("DOMContentLoaded", function (event) {
            initCarousel(carouselElement_2, responseCar_2.results)
            event.stopPropagation()
        })
    }
    */
})

/**
 *  3rd carousel
 */
let requestCarousel_3 = new requestJsonData({
    genre: "Fantasy"
})
requestCarousel_3.orderBy("imdb_score", true)

requestCarousel_3.fetchData(10).then((responseCar_3) => {
    let carouselElement_3 = document.querySelector("#carousel_cat_3")
    initCarousel(carouselElement_3, responseCar_3.results)
    /*
    if (document.readyState !== 'loading') {
        initCarousel(carouselElement_3, responseCar_3.results)
    } else {
        document.addEventListener("DOMContentLoaded", function (event) {
            initCarousel(carouselElement_3, responseCar_3.results)
            event.stopPropagation()
        })
    }
    */
})

// debugger
/*
let request = new requestJsonData({
    year: "1988"
})

var itemCarouselList = Array.from(document.getElementsByClassName("card__img"))
console.log(itemCarouselList)
itemCarouselList.forEach(element => addModal(element))

let myHeading = document.querySelector('h1')
myHeading.textContent = 'JustStreamIt'
*/