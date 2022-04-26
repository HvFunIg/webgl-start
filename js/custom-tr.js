
class CustomTr extends HTMLElement {
    /** Кастомный элемент для строки с цветами*/
    constructor() {
        super();
        this.template = document.querySelector('#customTemplate')
        this.clone = this.template.content.cloneNode(true);
        this.td = this.clone.querySelectorAll("td");

        /** Квадратик с цветом*/
        this.rect = this.td[0].getElementsByTagName('rect')[0]

    }
    connectedCallback() {
        /** Вызывается при рендере */
        this._render();
        this._attachEventHandlers();

    }
    _render(){
        /** Для цвета (svg) */
        this.rect.setAttribute('fill',this.color)

        this.td[1].textContent = this.name
        this.td[2].textContent = this.type
        this.td[3].textContent = this.color
        this.appendChild(this.clone)
    }
    _attachEventHandlers(){
        /** Добавляет события */

        /** firstElementChild, потому что ищем иконку svg;
         *  При нажатии на иконку создается событие, которое
         *  всплывает до уровня document. В событии - инфо о редактируемой
         *  строке.
         * */
        this.td[0].addEventListener('click',(e)=>{
            const color = this.color;
            this.dispatchEvent(new CustomEvent ('modifycanvas',{
                bubbles: true,
                detail:{
                    color
                }
            }))
        })
        this.td[4].firstElementChild.addEventListener('click',(e)=>{
            const name = this.name;
            const color = this.color;
            const type = this.type;
            this.dispatchEvent(new CustomEvent ('editcolor',{
                bubbles: true,
                detail:{
                    name,
                    color,
                    type
                }
            }))
        })
        this.td[5].firstElementChild.addEventListener('click',(e)=>{
            deleteRow(e);
        })
    }

    /** Набор геттеров и сеттеров для удобства работы с аттрибутами*/
    get color() { return this.getAttribute('color') ? this.getAttribute('color').toUpperCase() : "#000000";}
    set color(value) {this.setAttribute("color", value);}
    get name() { return this.getAttribute("name" || "Name");}
    set name(value) {this.setAttribute("name", value);}
    get type() { return this.getAttribute("type" || "Error");}
    set type(value) {this.setAttribute("type", value);}


    /** Для рендера новых значений при изменении свойств*/
    static get observedAttributes() {
        return ['name','color','type'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "name":
                this.td[1].textContent = newValue;
                break;
            case "type":
                this.td[2].textContent = newValue;
                break;
            case "color":
                this.td[3].textContent = newValue;
                this.rect.setAttribute('fill',newValue)

                break;
        }
    }
}
customElements.define('custom-tr', CustomTr);
