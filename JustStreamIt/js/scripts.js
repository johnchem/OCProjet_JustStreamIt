
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
            this.children.push(this.carouselItem(
                this.elementsToDisplay[i].title,
                this.elementsToDisplay[i].image_url
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
            item.appendChild(child)
            this.container.appendChild(item)
            return item
        })
        this.setStyle()
        this.createNavigation()
        this.moveCallBacks.forEach(cb => cb(0))
    }

    /**
         * @param {string} title
         * @param {string} url_image url pour la mignature de image
         * @returns {HTMLElement}
         */

    carouselItem(title, url_image) {
        this.title = title
        this.url_image = url_image
        // cree un container pour un item du carousel
        this.container = createDivWithClass("item")

        // cree la partie de l'image pour l'image
        let pictureContainer = createDivWithClass("card__img")
        let img = document.createElement('img')
        img.setAttribute('src', this.url_image)
        pictureContainer.appendChild(img)
        this.container.appendChild(pictureContainer)

        // cree la partie pour le titre
        let titleElement = createDivWithClass("card__title")
        titleElement.innerHTML = this.title
        this.container.appendChild(titleElement)

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

    async fetch(url = this.rootApi + this.filterString) {
        let response = await fetch(url)
        let data = await response.json()
        return data
    }

    async fetchData(nb_results = 5) {
        let tmpData = await this.fetch()
        let data = tmpData
        while (data.results.length < nb_results) {
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
 * carousel Best Movies
 */
let requestCarouselBestMovies = new requestJsonData()
requestCarouselBestMovies.orderBy("imdb_score", true)

requestCarouselBestMovies.fetchData(10).then((response) => {
    let carouselElementBestMovies = document.querySelector("#bestScoredMovie")
    if (document.readyState !== 'loading') {
        initCarousel(carouselElementBestMovies, response.results)
    } else {
        document.addEventListener("DOMContentLoaded", function () {
            initCarousel(carouselElementBestMovies, response.results)
        })
    }
})

/**
 * 1st carousel
 */
let requestCarousel_1 = new requestJsonData({
    genre: "comedy"
})

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

request.orderBy("imdb_score", true)
request.fetchData(11).then(response => {
    console.log(response)
}
)

let myHeading = document.querySelector('h1')
myHeading.textContent = 'JustStreamIt'

