
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
            console.log(this.elementsToDisplay[i])
            this.children.push(this.carouselItem(
                this.elementsToDisplay[i].title,
                this.elementsToDisplay[i].image_url
            ))
        }

        console.log("liste enfant" + this.children)

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
        console.log(title)
        console.log(url_image)
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

    next() {
        this.goToItem(this.currentItem + this.options.slidesToScroll)
    }

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

/**
* @param {string} className
* @returns {HTMLElement} 
*/
function createDivWithClass(className) {
    let div = document.createElement('div')
    div.setAttribute('class', className)
    return div
}

function initCarousel(data) {
    console.log("start carousel")
    new Carousel(document.querySelector("#test_carousel"),
        data,
        {
            slidesToScroll: 1,
            slidesVisible: 4
        })
}

const json_data = '{"tutu": {"id": 9,"url": "http://127.0.0.1:8000/api/v1/titles/9","title": "Miss Jerry"}}'
var obj = JSON.parse(json_data)
console.log(obj.tutu)

async function fetchMochData() {
    let response = await fetch("./mock_data.json")
    let data = await response.json()
    console.log(data[2].image_url)
    return data
}

fetchMochData().then((response) => {
    let data = response
    if (document.readyState !== 'loading') {
        console.log("doc chargé")
        console.log(data)
        initCarousel(data)
    } else {
        document.addEventListener("DOMContentLoaded", function () {
            console.log("reload carousel")
            initCarousel(data)
        })
    }
})

let myHeading = document.querySelector('h1')
myHeading.textContent = 'JustStreamIt'

