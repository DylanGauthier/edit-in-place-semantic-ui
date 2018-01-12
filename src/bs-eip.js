/*jshint esversion: 6 */

$.fn.editable = function (options) {

    const STYLE_EDITABLE = {
        "cursor": "pointer",
        "text-decoration": "underline",
        "text-decoration-style": "dotted"
    };

    options          = options || {};
    options.onChange = (typeof options.onChange === 'function') ? options.onChange : function () {};

    function applyStyle(element, style) {
        Object.keys(style).forEach((property) => {
            element.style[property] = style[property];
        });
    }

    function setEditableElementValue(editableElement, parent, event) {
        const value = event.target.value;
        const textContent = editableElement.textContent; // get old editable element value
        let triggerCallbackEvent = false;

        if (value.trim() !== '' && textContent !== value) {
            editableElement.textContent = value;
            triggerCallbackEvent = true;
        }

        // if a new value has been set, we trigger the user's callback.
        if (triggerCallbackEvent) {
            setTimeout(function(){
                options.onChange({
                    parent: parent,
                    editableElement: editableElement,
                    event: event,
                    oldValue: textContent,
                    newValue: value
                });
            }, 100);
        }
    }

    function toInput(editableElement) {
        // We add one 'ghost' hidden input because of the ability of the browsers
        // to submit on ENTER keyup if only one input is in the form.
        // This way the trigger wont occur since there are two inputs.
        const wrapper = `
            <input type="text" style="display:none"/>
            <div class="form-group bs-input has-editable" style="margin: 0px;">
                <input type="text" class="form-control bs-editable" value="${editableElement.textContent}"/>
            </div>
        `;

        const parent = editableElement.parentElement;
        // We get rid of the parent's classes so it's not stylized. This way the input should "fit" content...
        const parentClassList = [...parent.classList];
        parent.classList = "";
        parent.innerHTML = wrapper;

        const input = parent.querySelector('.bs-input .bs-editable');
        input.focus();
        input.select();

        // setTimeout so we don't block the UI. Check following link for further infos:
        // https://stackoverflow.com/questions/42266929/click-after-blur-doesnt-work
        input.addEventListener('blur', (ev) => {
            setTimeout(() => {
                setEditableElementValue(editableElement, parent, ev);
                toEditableElement(parent, editableElement, parentClassList);
            }, 100);
        });

        input.addEventListener('keyup', (ev) => {
            ev.preventDefault();
            switch (ev.keyCode) {
                case 13: // ENTER - apply value
                    setEditableElementValue(editableElement, parent, ev);
                    toEditableElement(parent, editableElement, parentClassList);
                    break;
                case 27: // ESC - get back to old value
                    toEditableElement(parent, editableElement, parentClassList);
                    break;
            }
        });
    }

    function toEditableElement(parent, editableElement, parentClassList) {
        parent.classList = parentClassList.join(' ');
        parent.innerHTML = "";
        parent.appendChild(editableElement);
    }

    $.each($(this), (index, editableElement) => {
        applyStyle(editableElement, STYLE_EDITABLE);
        $(editableElement).on('click', (ev) => toInput(ev.target));
    });
};