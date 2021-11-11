// DRAG N DROP API
// https://web.dev/drag-and-drop/#creating-draggable-content
// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

import { setToLocalStorage, getFromLocalStorage } from "./helper.js";

const movies = document.querySelector(".movies");

export const initializeDragnDrop = () => {
    let elementsOrderHolder = {};

    const initializeList = () => {
        const alreadySavedList = getFromLocalStorage();

        if (!!alreadySavedList) {
            elementsOrderHolder = { ...alreadySavedList };
        } else {
            elementsOrderHolder = {
                isOrderChanged: false,
                order: "",
            };
        }

        // update UI
        if (elementsOrderHolder.isOrderChanged) {
            movies.innerHTML = elementsOrderHolder.order;
        }
    };

    initializeList();

    const dragabbleElements = movies.querySelectorAll("[draggable]");

    dragabbleElements.forEach((element) => {
        element.addEventListener("dragstart", handleDragStart);
        element.addEventListener("dragenter", handleDragEnter);
        element.addEventListener("dragover", handleDragOver);
        element.addEventListener("dragleave", handleDragLeave);
        element.addEventListener("drop", handleDrop);
        element.addEventListener("dragend", handleDragEnd);
    });

    let dragSrcEl = null;

    function handleDragStart(e) {
        e.stopPropagation();
        this.style.opacity = "0.4";

        dragSrcEl = this;

        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", this.innerHTML);
    }

    function handleDragOver(e) {
        //To make an element a drop target you listen for its dragover event and you either return false from it, or you call preventDefault() on the event passed

        if (e.preventDefault) {
            e.preventDefault();
        }

        e.dataTransfer.dropEffect = "move";

        return false;
    }

    function handleDragEnter(e) {
        this.classList.add("drag-over");
    }

    function handleDragEnd(e) {
        this.style.opacity = "1";

        dragabbleElements.forEach((elem) => {
            elem.classList.toggle("drag-over", false);
        });

        elementsOrderHolder.isOrderChanged = true;
        elementsOrderHolder.order = document.querySelector(".movies").innerHTML;
        setToLocalStorage(elementsOrderHolder);
        // nakon prevlacenja categorie elementa draggable elementi gube attachirane evente pa mora da se ponovi

        movies.querySelectorAll("[draggable]").forEach((element) => {
            element.addEventListener("dragstart", handleDragStart);
            element.addEventListener("dragenter", handleDragEnter);
            element.addEventListener("dragover", handleDragOver);
            element.addEventListener("dragleave", handleDragLeave);
            element.addEventListener("drop", handleDrop);
            element.addEventListener("dragend", handleDragEnd);
        });
        //e.dataTransfer.clearData();
    }

    function handleDragLeave(e) {
        this.classList.remove("drag-over");
    }

    function handleDrop(e) {
        //e.stopPropagation(); // stops the browser from redirecting.
        e.preventDefault();

        if (
            dragSrcEl != this &&
            dragSrcEl.dataset.dropto === this.dataset.dropto
        ) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData("text/html");
            //this.replaceWith(this, dragSrcEl);
        }

        return false;
    }
};
