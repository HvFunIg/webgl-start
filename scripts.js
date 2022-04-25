class CustomTr extends HTMLElement {
    /** Кастомный элемент для строки с цветами*/
    constructor() {
        super();
        let template = document.querySelector('#customTemplate')
        this.clone = template.content.cloneNode(true);
        this.td = this.clone.querySelectorAll("td");

       /* this.addEventListener("click", this.__cl.bind(this));
        this.addEventListener("mousedown", this.__dragStart.bind(this));
        this.addEventListener("dragend", this.__dragEnd.bind(this));
        this.addEventListener("drop", this.__dragEnd.bind(this));
        this.addEventListener("dragover", this.__dragOver.bind(this));
        this.addEventListener("dragleave", this.__dragLeave.bind(this));
   */ }
    __dragStart(e) {
       /* console.log("Dragstart:")
        console.log(e.target)
        e.target.classList.add(`rowSelected`);*/
    }
    __cl(e){
        console.log(e)

    }
    __dragEnd() {
        console.log(1)

        this.removeAttribute("over");
        this.removeAttribute("dragging");
    }

    __dragOver() {
        console.log(1)

        if (this.hasAttribute("dragging")) {
            this.removeAttribute("over");
        } else {
            this.setAttribute("over", "");
        }
    }

    __dragLeave() {
        console.log(1)

        this.removeAttribute("over");
    }
    connectedCallback() {
        console.log(`Color ${this.getAttribute('name')} added`)

        /** Берем значения аттрибутов и подставляем их> */
        let color= this.getAttribute('color')

        let rect = this.td[0].getElementsByTagName('rect')[0]
        rect.setAttribute('fill',color)
        this.setAttribute("draggable", "true");
        this.td[1].textContent = this.getAttribute('name') || "Name"
        this.td[2].textContent = this.getAttribute('type') || "Error"
        this.td[3].textContent = color ? color.toUpperCase() : "#000000"
        this.td[5].firstElementChild.addEventListener('click',(e)=>{
            deleteRow(e);
        })
        this.appendChild(this.clone)
    }

}
customElements.define('custom-tr', CustomTr);

const save = ()=>{
    /** Сохранение массива объектов в localStorage*/

    let tableRows = document.querySelectorAll('custom-tr');
    let colorPalette = [...tableRows].map(row => {
        return  {
            name:row.getAttribute('name'),
            type:row.getAttribute('type'),
            color:row.getAttribute('color'),
        };
    })

    localStorage.setItem('colors',JSON.stringify(colorPalette));
}
const load = () => {
    let rows = JSON.parse(localStorage.getItem('colors'));
    rows.forEach( ({name,type,color}) =>{
        insertRow({
            name,
            type,
            color
        });
    })
}
const cancelChanges = () =>{
    let table = document.querySelector('#tableBody');
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    load();
}
const deleteRow = (e) => {
    let node = e.target.closest("custom-tr");

    node.remove()
}
const getValues = (row) =>{
    let inputs = row.getElementsByTagName('input'); //nodeList
    /** Возвращаем объект, состоящий из значений инпутов
     *  ( в одной строке много, и мы знаем их индексы в nodeList)
     * Индексы странные из-за особенностей кастомного select */
    return  {
        name:inputs.item(0).value,
        color:inputs.item(7).value,
    };
}

const insertRow = ({color,name,type})=> {
    /** Добавление кастомного элемента в DOM */

    let table = document.querySelector('#tableBody');
    let row = document.createElement("custom-tr");
    row.setAttribute('name',name);
    row.setAttribute('color',color);
    row.setAttribute('type',type);

    table.appendChild(row)
}

modalForm.onsubmit = (e) =>{
    /** modalForm - это id формы */
    e.preventDefault();

    let data = new FormData(modalForm);
    let type = "";
    for (let entry of data.entries()) {
        /** .entries() достает единственную пару ключ-значение.
         * entry[0] - ключ, entry[1] - значение */
        type =  entry[1] ;
    };
    let {name,color} = getValues(e.target)
    insertRow({
        name,
        type,
        color
    });
}

window.onload = () => {
    load();
}
/***** Modal *****/

const addColor = (e) =>{
    e.preventDefault()
}
const onClose = () =>{

}
