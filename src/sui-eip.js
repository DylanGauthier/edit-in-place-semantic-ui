/*jshint esversion: 6 */

$.fn.editable = function (options) {

    const STYLE_EDITABLE = {
        "cursor": "pointer",
        "text-decoration": "underline",
        "text-decoration-style": "dotted"
    };

    options = options || {};
    options.onChange = (typeof options.onChange === 'function') ? options.onChange : function () {};

    function applyStyle(element, style) {
        Object.keys(style).forEach((property) => {
            element.style[property] = style[property];
        });
    }

    function setEditableElementValue(editaleElement, value) {
        const textContent = editaleElement.textContent; // get old editable element value
        let triggerCallbackEvent = false;

        if (value.trim() !== '' && textContent !== value) {
            editaleElement.textContent = value;
            triggerCallbackEvent = true;
        }

        // if a new value has been set, we trigger the user's callback.
        if (triggerCallbackEvent) {
            options.onChange({
                target:editaleElement,
                oldValue: textContent,
                newValue: value
            });
        }
    }

    function toInput(editableElement) {
        // We add one 'ghost' hidden input because of the ability of the browsers
        // to submit on ENTER keyup if only one input is in the form.
        // This way the trigger wont occur since there are two inputs.
        const wrapper = `
            <input type="text" style="display:none"/>
            <div class="field">
                <div class="ui input">
                    <input type="text" value="${editableElement.textContent}" class="editable"/>
                </div>
            </div>
        `;

        const parent = editableElement.parentElement;
        // We get rid of the parent's classes so it's not stylized. This way the input should "fit" content...
        const parentClassList = [...parent.classList];
        parent.classList = "";
        parent.innerHTML = wrapper;

        const input = parent.querySelector('.input .editable');
        input.focus();
        input.select();

        // setTimeout so we don't block the UI. Check following link for further infos:
        // https://stackoverflow.com/questions/42266929/click-after-blur-doesnt-work
        input.addEventListener('blur', (ev) => {
            setTimeout(() => {
                setEditableElementValue(editableElement, ev.target.value);
                toEditableElement(parent, editableElement, parentClassList);
            }, 100);
        });

        input.addEventListener('keyup', (ev) => {
            ev.preventDefault();
            switch (ev.keyCode) {
                case 13: // ENTER - apply value
                    setEditableElementValue(editableElement, ev.target.value);
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