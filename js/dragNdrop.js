const tableDrag = document.querySelector('#tableBody');


tableDrag.addEventListener(`dragstart`, (e) => {
    /** Ставим класс при начале переноса*/
    e.target.classList.add(`rowSelected`);
});

tableDrag.addEventListener(`dragend`, (e) => {
    /** Убираем класс при окончании переноса*/
    e.target.classList.remove(`rowSelected`);
});

const getNextElement = (cursorPosition, currentElement) => {
    /** Выбираем следующий элемент в зависимости от того, перешел ли курсор за центр */
    const currentElementCoord = currentElement.getBoundingClientRect();
    const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

    const nextElement = (cursorPosition < currentElementCenter) ?
        currentElement :
        currentElement.nextElementSibling;
    return nextElement;
};

tableDrag.addEventListener(`dragover`, (e) => {
    e.preventDefault();
    /** Передвигаем строку */

    const activeElement = tableDrag.querySelector(`.rowSelected`);
    let currentElement = e.target.closest("tr")
    const isMoveable = activeElement !== currentElement
    if (!isMoveable) {
        return;
    }

    const nextElement = getNextElement(e.clientY, currentElement);
    if (
        nextElement &&
        activeElement === nextElement.previousElementSibling ||
        activeElement === nextElement
    )
        return;


    tableDrag.insertBefore(activeElement, nextElement);
});
