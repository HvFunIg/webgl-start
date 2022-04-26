

/*************************/
class CustomModal extends HTMLElement {
    /** Кастомный элемент для модального окна*/
    constructor() {
        super();
        this.template = document.querySelector('#modalTemplate');
        this.clone = this.template.content.cloneNode(true);
        this.inputs = this.clone.querySelectorAll('input');
        this.modal = this.clone.querySelector('.modal-wrapper')
    }

    connectedCallback() {
        /** Вызывается при рендере */
        this._render();
        this._attachEventHandlers();
    }
    _attachEventHandlers(){
        /** Добавляет события */
        this.addEventListener('submit',this._submit);
    }
    _submit(e){
        /** Отправка формы (добавить цвет) */
        e.preventDefault();
        let data = new FormData(e.target);
        let type = "";
        for (let entry of data.entries()) {
            /** .entries() достает единственную пару ключ-значение.
             * entry[0] - ключ, entry[1] - значение */
            type =  entry[1];
        };
        let {name,color} = getValues(e.target)
        insertRow({
            name,
            type,
            color
        });
        closeModal();
    }

    /** Набор геттеров и сеттеров для удобства работы с аттрибутами*/
    get modalcolor() { return this.getAttribute("modalcolor");}
    set modalcolor(value) {this.setAttribute("modalcolor", value);}
    set modalname(value) {this.setAttribute("modalname", value);}
    get modalname() { return this.getAttribute("modalname");}
    get modaltype() { return this.getAttribute("modaltype");}
    set modaltype(value) {this.setAttribute("modaltype", value);}

    get visible() { return this.hasAttribute("visible"); }
    set visible(value) {
        value ? this.setAttribute("visible", "") :
            this.removeAttribute("visible");
    }

    static get observedAttributes() { return ['modalname','modalcolor','modaltype','visible'];}
    attributeChangedCallback(name, oldValue, newValue) {
        /** Прослушиватель аттрибутов из observedAttributes*/
        switch (name) {
            case "modalname":
                this.inputs[0].value = newValue;
                break;
            case "modalcolor":
                this.inputs[7].value = newValue;
                break;
            case "modaltype":
                const types = this.modal.querySelector('.select-items').querySelectorAll('input');
                types.forEach(input =>{
                    if (input.value === name)
                        input.setAttribute("checked","true");
                })
                break;
            case "visible":
                if (newValue === null) {
                    this.modal.classList.remove("visible");
                } else {
                    this.modal.classList.add("visible");
                }
                break;
        }
    }

    _render(){
        /** Берем значения аттрибутов и подставляем их> */
        const inputs = this.clone.querySelectorAll('input');
        /** Из-за особенностей списка select нужны 0 и 7 input */
        inputs[0].value = this.name;
        inputs[7].value = this.color;

        /** Для особого select */
        const types = this.clone.querySelector('.select-items').querySelectorAll('input');
        types.forEach(input =>{
            if (input.value === this.type){
                input.setAttribute("checked","true");
            }
        })
        this.appendChild(this.clone);
    }
}
customElements.define('custom-modal', CustomModal);

const openModal = ({name,color,type} = {},source = null) =>{
    /** Открыть модальное окно. Либо с аттрибутами для редактирования,
     *  либо c базовывми значениями */
    let modal = document.querySelector('custom-modal');
    modal.setAttribute('visible',"");
    modal.setAttribute('modalname',name || "");
    modal.setAttribute('modalcolor',color || "#000000");
    modal.setAttribute('modaltype',type || "Main");
}

const closeModal = () =>{
    /** Закрыть модальное окно*/
    let modal = document.querySelector('custom-modal');
    modal.removeAttribute('visible');
}

document.addEventListener("editcolor", (e)=>{
    /** Открыть модальное окно для редактирования*/
    openModal(e.detail,e.target);
})

window.addEventListener('click',e =>{
    /** Закрыть модальное окно при клике на серой области извне*/
    if(e.target == document.querySelector('.modal-wrapper'))
        closeModal()
})
