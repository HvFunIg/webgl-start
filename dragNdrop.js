const tableDrag = document.querySelector('#tableBody');
/*const taskElements = tableDrag.getElementsByTagName(`custom-tr`);
for (const task of taskElements) {
    task.draggable = true;

}
*/
tableDrag.addEventListener(`dragstart`, (e) => {

    console.log("Dragstart:")
    console.log(e.target.closest('custom-tr'))
    e.target.classList.add(`rowSelected`);
   // e.target.closest('custom-tr').classList.add(`rowSelected`);
});

tableDrag.addEventListener(`dragend`, (e) => {
    console.log("Dragend:")

    e.target.classList.remove(`rowSelected`);
});
tableDrag.addEventListener(`onmousedown`, (e) => {
    console.log("mousedown:")

    console.log(e.target)
});
const getNextElement = (cursorPosition, currentElement) => {
    const currentElementCoord = currentElement.getBoundingClientRect();
    const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

    const nextElement = (cursorPosition < currentElementCenter) ?
        currentElement :
        currentElement.nextElementSibling;
    return nextElement;
};

tableDrag.addEventListener(`dragover`, (e) => {
    e.preventDefault();

    const activeElement = tableDrag.querySelector(`.rowSelected`);
    let currentElement = e.target.closest("custom-tr")

    const isMoveable = activeElement !== currentElement
    if (!isMoveable) {
        return;
    }

    const nextElement = getNextElement(e.clientY, currentElement);
    if (
        nextElement &&
        activeElement === nextElement.previousElementSibling ||
        activeElement === nextElement
    ) {
        return;
    }

    tableDrag.insertBefore(activeElement, nextElement);
});
