(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*jshint esversion: 6 */

$.fn.editable = function (options) {

    var STYLE_EDITABLE = {
        "cursor": "pointer",
        "text-decoration": "underline",
        "text-decoration-style": "dotted"
    };

    options = options || {};
    options.onChange = typeof options.onChange === 'function' ? options.onChange : function () {};

    function applyStyle(element, style) {
        Object.keys(style).forEach(function (property) {
            element.style[property] = style[property];
        });
    }

    function setEditableElementValue(editaleElement, value) {
        var textContent = editaleElement.textContent; // get old editable element value
        var triggerCallbackEvent = false;

        if (value.trim() !== '' && textContent !== value) {
            editaleElement.textContent = value;
            triggerCallbackEvent = true;
        }

        // if a new value has been set, we trigger the user's callback.
        if (triggerCallbackEvent) {
            options.onChange({
                target: editaleElement,
                oldValue: textContent,
                newValue: value
            });
        }
    }

    function toInput(editableElement) {
        // We add one 'ghost' hidden input because of the ability of the browsers
        // to submit on ENTER keyup if only one input is in the form.
        // This way the trigger wont occur since there are two inputs.
        var wrapper = "\n            <input type=\"text\" style=\"display:none\"/>\n            <div class=\"field\">\n                <div class=\"ui input\">\n                    <input type=\"text\" value=\"" + editableElement.textContent + "\" class=\"editable\"/>\n                </div>\n            </div>\n        ";

        var parent = editableElement.parentElement;
        // We get rid of the parent's classes so it's not stylized. This way the input should "fit" content...
        var parentClassList = [].concat(_toConsumableArray(parent.classList));
        parent.classList = "";
        parent.innerHTML = wrapper;

        var input = parent.querySelector('.input .editable');
        input.focus();
        input.select();

        // setTimeout so we don't block the UI. Check following link for further infos:
        // https://stackoverflow.com/questions/42266929/click-after-blur-doesnt-work
        input.addEventListener('blur', function (ev) {
            setTimeout(function () {
                setEditableElementValue(editableElement, ev.target.value);
                toEditableElement(parent, editableElement, parentClassList);
            }, 100);
        });

        input.addEventListener('keyup', function (ev) {
            ev.preventDefault();
            switch (ev.keyCode) {
                case 13:
                    // ENTER - apply value
                    setEditableElementValue(editableElement, ev.target.value);
                    toEditableElement(parent, editableElement, parentClassList);
                    break;
                case 27:
                    // ESC - get back to old value
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

    $.each($(this), function (index, editableElement) {
        applyStyle(editableElement, STYLE_EDITABLE);
        $(editableElement).on('click', function (ev) {
            return toInput(ev.target);
        });
    });
};

},{}]},{},[1]);
