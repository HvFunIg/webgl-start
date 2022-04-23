class CustomTr extends HTMLElement {
    /** Кастомный элемент для строки с цветами*/
    connectedCallback() {
        let table = document.querySelector('#tableBody');
        let template = document.querySelector('#customTemplate')
        let html = document.importNode(template.content, true);
        table.appendChild(html);
    }
}
customElements.define('custom-tr', CustomTr);

const insertRow = ()=>{
    /** Добавление строки в DOM */

    let table = document.querySelector('#tableBody');
    let template = document.querySelector('#customTemplate')
    let html = document.importNode(template.content, true);
    table.appendChild(html)
}


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

/***** Modal *****/

const addColor = () =>{

}
const onClose = () =>{

}