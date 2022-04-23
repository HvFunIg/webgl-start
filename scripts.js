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

        let name=this.getAttribute('name');
        let type=this.getAttribute('type');
        let color=this.getAttribute('color');
        td[1].textContent = name
        td[2].textContent = type
        td[3].textContent = color.toUpperCase()

        table.appendChild(clone)
    }
}
customElements.define('custom-tr', CustomTr);

const save = ()=>{
    /** Сохранение массива объектов в localStorage*/

    let tableRows = document.querySelectorAll('#tableBody tr');
    let colorPalette = [...tableRows].map(row => {
        let inputs = row.getElementsByTagName('input'); //nodeList
        /** Возвращаем объект, состоящий из значений инпутов
         *  ( в одной строке три инпута, и мы знаем их индексы в nodeList) */
        return  {
            name:inputs.item(0).value,
            type:inputs.item(1).value,
            color:inputs.item(2).value,
        };
    })
    localStorage.setItem('colors',colorPalette);
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

