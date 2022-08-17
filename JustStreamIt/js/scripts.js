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
        var modalContent = await this.getModalContent(url)

        //  blocs de la structures
        let header = createDivWithClass("modal_header")
        let body = createDivWithClass("modal_body")
        let footer = createDivWithClass("modal_footer")

        // titre et bouton fermeture
        let title = createDivWithClassAndContent("modal_title", modalContent["title"])
        let close_button = document.createElement("button")
        close_button.setAttribute("class", "modal_button close_button")
        close_button.onclick = function () { // ferme la fenêtre quand l'utilisateur clique sur la croix rouge
            close_modal("filmSheet")
            console.log("modal close")
        }
        header.appendChild(title)
        header.appendChild(close_button)

        // image et bouton lecture
        let picture = document.createElement("img")
        picture.setAttribute("src", modalContent["image_url"])
        picture.setAttribute("class", "modal_picture")

        let play_button = document.createElement("button")
        play_button.setAttribute("class", "modal_button play_button")
        let play_button_text = document.createElement("div")
        play_button_text.innerHTML = "Lecture"

        body.appendChild(picture)
        play_button.appendChild(play_button_text)
        body.appendChild(play_button)

        // creation des elements pour la table
        let genre_title = createDivWithClassAndContent("modal_champs title", "Genre : ")
        let genre_content = createDivWithClassAndContent("modal_champs info", modalContent["genres"].join(", "))

        let date_published_title = createDivWithClassAndContent("modal_champs title", "Date de sortie : ")
        let date_published_formatted = await formatDate(modalContent["date_published"])
        let date_published_content = createDivWithClassAndContent("modal_champs info", date_published_formatted)

        let avg_score_title = createDivWithClassAndContent("modal_champs title", "Score : ")
        let avg_score_content = createDivWithClassAndContent("modal_champs info", modalContent["avg_vote"])

        let imdb_score_title = createDivWithClassAndContent("modal_champs title", "Imdb : ")
        let imdb_score_content = createDivWithClassAndContent("modal_champs info", modalContent["imdb_score"])

        let directors_title = createDivWithClassAndContent("modal_champs title", "Réalisé par : ")
        let directors_content = createDivWithClassAndContent("modal_champs info", modalContent["directors"].join(", "))

        let actors_title = createDivWithClassAndContent("modal_champs title", "Acteurs : ")
        let actors_content = createDivWithClassAndContent("modal_champs info", modalContent["actors"].join(", "))

        let duration_title = createDivWithClassAndContent("modal_champs title", "Durée : ")
        let duration_content = createDivWithClassAndContent("modal_champs info", modalContent["duration"] + " min")

        let countries_title = createDivWithClassAndContent("modal_champs title", "Origine : ")
        let countries_content = createDivWithClassAndContent("modal_champs info", modalContent["countries"].join(", "))

        let box_office_result_title = createDivWithClassAndContent("modal_champs title", "Résultats au Box Office : ")
        let box_office_result_content = createDivWithClassAndContent("modal_champs info", modalContent["worldwide_gross_income"])

        // ajout des elements à la table
        let table_content = [
            [genre_title, genre_content],
            [date_published_title, date_published_content],
            [avg_score_title, avg_score_content],
            [imdb_score_title, imdb_score_content],
            [directors_title, directors_content],
            [actors_title, actors_content],
            [duration_title, duration_content],
            [countries_title, countries_content],
            [box_office_result_title, box_office_result_content]
        ]
        let table = createTable(table_content)
        body.appendChild(table)

        // description du film
        let long_description = createDivWithClassAndContent("modal_champs info", modalContent["long_description"])
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

        this.buildModal(urlModalContent).then(response => {
            var modal_construct = response

            img.addEventListener("click", () => {
                // contruction de la modal
                let modal = document.getElementById("filmSheet")
                let modal_container = modal.querySelector(".modal_container")
                for (let j = 0; j < 3; j++) {
                    modal_container.appendChild(modal_construct[j])
                }

                // activation de la modal
                modal.classList.toggle("active")
            }, false)
        })

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
        var modalContent = await fetchUrl(url)

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
        let data = await this.fetch()
        let maxItem = data.count
        while ((data.results.length < nb_results) && (data.results.length < maxItem)) {
            let tmpData = await this.fetch(tmpData.next)
            data.next = tmpData.next
            tmpData.results.forEach(value => data.results.push(value))
        }
        return data
    }
}

/**
 * revoie une liste contenant l'ensemble des films ayant le meilleur score imdb dans la categorie specifie
 * @Param {string} genre selection des film avec le meilleur score selon imdb filtre par genres
 * @return {list} liste des films avec le meilleur score imdb  
 */
async function getTopImdbScore(genre) {
    let request = new requestJsonData({
        genre: genre,
        sort_by: "-imdb_score"
    })
    let tmpData = await request.fetchData()
    let bestScore = tmpData.results[0]

    let topRankedFilmCollected = false
    while (topRankedFilmCollected === false) {
        let nextPageUrl = tmpData.next
        tmpData.results.forEach(element => data.push(element))
        console.log(tmpData.results)
        if (tmpData.results[tmpData.results.length].imdb_score === bestScore) {
            let nextPageRequest = new requestDataFromUrl(nextPageUrl)
            tmpData = await nextPageRequest.fetch()
        } else {
            topRankedFilmCollected = true
        }
    }

    for (var i = data.results.length; i > 0; i--) {
        if (data.results[i].imdb_score !== bestScore) {
            delete data.results[i]
        }
    }

    return data
}

/**
 * renvoie le meilleur film selon imdb et le publique
 * @param {string} genre meilleur film selon par catégorie
 * @return {object} fiche du meilleur film
 */
function getBestToAllMovie(genre) {
    let topImdbScore = getTopImdbScore(genre).then(result => { return result })
    topImdbScore.forEach(element => {
        elementDetailedPage = new requestDataFromUrl(element.url)
        element = elementDetailedPage.then(result => result)
    })

    topImdbScore.sort((a, b) => a.avg_vote - b.avr_vote)

    return topImdbScore[0]
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

function close_modal(id_modal) {
    var modal = document.getElementById(id_modal)
    var modal_container = modal.querySelector(".modal_container")
    // retire les éléments de l'ancienne fenêtre modal
    while (modal_container.firstChild) {
        modal_container.removeChild(modal_container.firstChild);
    }
    // passe la fenêtre en masqué
    modal.classList.toggle("active")
}
/**
 * 
 * @param {string} str_date date au format YYYY-MM-DD
 * @returns {string} date au format DD/MM/YYYY
 */
async function formatDate(input_date) {
    const year = input_date.split("-")[0]
    const month = input_date.split("-")[1]
    const day = input_date.split("-")[2]
    const d = new Date(year, month, day)

    const str_date = ('0' + d.getDate()).slice(-2)
    const str_month = ('0' + (d.getMonth() + 1)).slice(-2)
    const str_year = d.getFullYear()
    const output_date = `${str_date}/${str_month}/${str_year}`
    return output_date
}

// récupération de la fenêtre modal
var modal = document.getElementById("filmSheet");

// ferme la fenetre quand l'utilisateur clique partout ailleurs
window.addEventListener("click", function (event) {
    if (event.target == modal) {
        close_modal("filmSheet")
        //modal.classList.toggle("active")
        console.log("modal close")
    }
})

/**
 * Best Movie 
 */
bestMovieData = getBestToAllMovie()
let bestMovieElement = document.getElementById("bestMovie")
bestMovieElement.querySelector(".title").innerHTML = bestMovieData.title
bestMovieElement.querySelector("img").src = image_url
bestMovieElement.querySelector(".long_description") = bestMovieData.long_description

/**
 * carousel Best Movies
 */
let requestCarouselBestMovies = new requestJsonData()
requestCarouselBestMovies.orderBy("imdb_score", true)

requestCarouselBestMovies.fetchData(10).then((response) => {
    let carouselElementBestMovies = document.querySelector("#bestScoredMovie")
    initCarousel(carouselElementBestMovies, response.results, requestCarouselBestMovies)
    carouselElementBestMovies.querySelector(".categorie__title").innerHTML = "Films les mieux notés"
})

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
    carouselElement_1.querySelector(".categorie__title").innerHTML = "Comedy"
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
    carouselElement_2.querySelector(".categorie__title").innerHTML = "News"
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
    carouselElement_3.querySelector(".categorie__title").innerHTML = "Fantasy"
})