
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
    /** Загрузка объекта, содержащего цвета, из localStorage*/

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
    /** Отмена изменений и загрузка предыдущего состояния localStorage*/
    let table = document.querySelector('#tableBody');
    while (table.firstChild)
        table.removeChild(table.firstChild);
    load();
}

const deleteRow = (e) => {
    /** Удаление строки из DOM*/
    e.target.closest("custom-tr").remove();
}

const getValues = (row) =>{
    let inputs = row.getElementsByTagName('input'); //nodeList
    /** Возвращаем объект, состоящий из значений инпутов
     *  (в одной строке их много, но мы знаем их индексы в nodeList)
     * Индексы странные из-за особенностей кастомного select */
    return  {
        name:inputs.item(0).value,
        color:inputs.item(7).value,
    };
}

const insertRow = ({color,name,type})=> {
    /** Добавление кастомного элемента в DOM */
    const table = document.querySelector('#tableBody');
    if (!document.getElementsByName(name).length) {
        /** Если такого цвета нет - создадим*/
        let row = document.createElement("custom-tr");
        row.setAttribute('name',name);
        row.setAttribute('color',color);
        row.setAttribute('type',type);
        table.appendChild(row);
    }
    else {
        /** Если такой цвет уже есть - редактируем существующий*/
        let row = document.getElementsByName(name)[0];
        row.setAttribute('name',name);
        row.setAttribute('color',color);
        row.setAttribute('type',type);
    }

}

window.onload = () => {
    /**  Загрузка данных из localStorage*/
    load();

    /**  Инициализация контекста для webgl*/
    /** Сфера, которая не похожа на сферу и без кастомизации света
     * (нужно подключить sphere.js) */
    // runWebGLApp()


}
