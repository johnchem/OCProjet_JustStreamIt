
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
        this.element = element
        this.elementsToDisplay = elementsToDisplay
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1,
            loop: false
        }, options)

        // récupération des éléments du carousel
        this.children = []
        for (const i in this.elementsToDisplay) {
            this.children.push(this.carouselItem(this,
                this.elementsToDisplay[i]
            ))
        }

        //creation du div pour le carousel et le container
        let ratio = this.children.length / this.options.slidesVisible
        this.currentItem = 0
        this.root = createDivWithClass('carousel')

        // creation d'un container pour les elements visible
        this.container = createDivWithClass('carousel__container')
        this.container.style.width = (ratio * 100) + "%" // largeur du container pour les éléments visible

        // modification du HTML de la page
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)
        this.moveCallBacks = []
        this.items = this.children.map((child) => {
            let item = createDivWithClass('carousel__item')
            // this.addModal(item,)
            item.appendChild(child)
            this.container.appendChild(item)
            return item
        })
        this.setStyle()
        this.createNavigation()
        this.moveCallBacks.forEach(cb => cb(0))
    }

    buildModal(url) {
        this.modalContent = this.getModalContent(url)
        //en-tête et image
        document.getElementsByClassName("modal-title").innerHTML = this.modalContent.title
        document.getElementsByClassName("modal-picture").innerHTML = this.modalContent.image_url

        // table d'info
        document.getElementById("genres").innerHTML = this.modalContent["genres"]
        document.getElementById("date_published").innerHTML = this.modalContent["date_published"]
        document.getElementById("avg_vote").innerHTML = this.modalContent["genres"]
        document.getElementById("imdb_score").innerHTML = this.modalContent["imdb_score"]
        console.log(modalContent["directors"])
        document.getElementById("directors").innerHTML = this.modalContent["directors"]
        document.getElementById("actors").innerHTML = this.modalContent["actors"]
        document.getElementById("duration").innerHTML = this.modalContent["duration"] + " min"
        document.getElementById("countries").innerHTML = this.modalContent["countries"]
        document.getElementById("box_office_result").innerHTML = this.modalContent["worldwide_gross_income"]
        document.getElementById("long_description").innerHTML = this.modalContent["long_description"]
    }

    /**
     * @param {string} title
     * @param {string} url_image url pour la mignature de image
     * @returns {HTMLElement}
     */
    carouselItem(carousel, element) {
        this.title = element.title
        this.url_image = element.image_url
        this.urlModalContent = element.url
        // cree un container pour un item du carousel
        this.container = createDivWithClass("item")

        // cree la partie de l'image pour l'image
        let pictureContainer = createDivWithClass("card__img")
        let img = document.createElement('img')
        pictureContainer.appendChild(img)
        this.container.appendChild(pictureContainer)

        // cree la partie pour le titre
        let titleElement = createDivWithClass("card__title")
        titleElement.innerHTML = this.title
        this.container.appendChild(titleElement)

        // ajout de la fenêtre modal et ajout de l'image
        img.setAttribute('src', this.url_image)
        // this.addModal(img, this.urlModalContent)
        img.addEventListener("click", function (carousel) {
            console.log(this.urlModalContent)
            // construction de la modal
            carousel.buildModal(this.urlModalContent)

            // activation de la modal
            var modal = document.getElementById("filmSheet")
            modal.classList.toggle("active")
        })

        return this.container
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

    addModal(item, url) {
        item.addEventListener("click", function () {
            console.log(url)
            // construction de la modal
            buildModal(url)

            // activation de la modal
            var modal = document.getElementById("filmSheet")
            modal.classList.toggle("active")
        })
    }
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
 * fonction pour l'initialisation des carousels
 * @param {HTMLElement} element element de carousel
 * @param {Object} data liste des élements à afficher
 * @return {carousel} 
*/
function initCarousel(element, data) {
    var carousel = new Carousel(element,
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

// ferme la fenêtre quand l'utilisateur clique sur le boutton
modal_button.onclick = function () {
    modal.classList.toggle("active")
    console.log("modale close")
}

// ferme la fenpetre quand l'utilisateur clique partout ailleurs
window.onclick = function (event) {
    if (event.target == modal) {
        modal.classList.toggle("active")
        console.log("modale close")
    }
}

/**
 * carousel Best Movies
 */
let requestCarouselBestMovies = new requestJsonData()
requestCarouselBestMovies.orderBy("imdb_score", true)

requestCarouselBestMovies.fetchData(10).then((response) => {
    let carouselElementBestMovies = document.querySelector("#bestScoredMovie")
    if (document.readyState !== 'loading') {
        initCarousel(carouselElementBestMovies, response.results, requestCarouselBestMovies)
    } else {
        document.addEventListener("DOMContentLoaded", function () {
            initCarousel(carouselElementBestMovies, response.results, requestCarouselBestMovies)
        })
    }
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

    if (document.readyState !== 'loading') {
        initCarousel(carouselElement_1, responseCar_1.results)
    } else {
        document.addEventListener("DOMContentLoaded", function () {
            initCarousel(carouselElement_1, responseCar_1.results)
        })
    }
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
    if (document.readyState !== 'loading') {
        initCarousel(carouselElement_2, responseCar_2.results)
    } else {
        document.addEventListener("DOMContentLoaded", function () {
            initCarousel(carouselElement_2, responseCar_2.results)
        })
    }
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

    if (document.readyState !== 'loading') {
        initCarousel(carouselElement_3, responseCar_3.results)
    } else {
        document.addEventListener("DOMContentLoaded", function () {
            initCarousel(carouselElement_3, responseCar_3.results)
        })
    }
})

let request = new requestJsonData({
    year: "1988"
})

var itemCarouselList = Array.from(document.getElementsByClassName("card__img"))
console.log(itemCarouselList)
itemCarouselList.forEach(element => addModal(element))


let myHeading = document.querySelector('h1')
myHeading.textContent = 'JustStreamIt'