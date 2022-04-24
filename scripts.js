class CustomTr extends HTMLElement {
    /** Кастомный элемент для строки с цветами*/
    constructor() {
        super();
    }
    connectedCallback() {
        let table = document.querySelector('#tableBody');
        let template = document.querySelector('#customTemplate')
        let clone = template.content.cloneNode(true);
        let td = clone.querySelectorAll("td");

        /** Берем значения аттрибутов и подставляем их> */
        let color= this.getAttribute('color')
        let rect = td[0].getElementsByTagName('rect')[0]
        rect.setAttribute('fill',color)

        td[1].textContent = this.getAttribute('name')
        td[2].textContent = this.getAttribute('type')
        td[3].textContent = color.toUpperCase()

        table.appendChild(clone)
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
    console.log(colorPalette)
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
function deleteRow(){
    console.log(this)
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
/***** Modal *****/

const addColor = (e) =>{
    e.preventDefault()
}
const onClose = () =>{

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
