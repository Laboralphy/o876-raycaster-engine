const DD_ID = 'data-drag-drop-id';
const DD_DROPZONE_LIGHT = 'data-drag-drop-dropzone-light';
const DD_DROPZONE = 'data-drag-drop-dropzone';

class DragDrop {

    constructor() {
        this.onDrop = null; // évènement : on lache un élémnet dans une drop zone - (dropZone, item)
        this.onDragOver = null; // évènement : on déplace un élément au dessus de la drop zone
        this.onDragItem = null; // évènement : on commence à déplacer un élément draggable
        this.onReleaseItem = null; // évènement : on relache un élément
        this.onDropZoneLightens = null;
        this.onDropZoneDarkens = null;
    }

    /**
     * Drag Start Event Handler
     * @param oEvent
     * @returns
     */
    handleDragStart(oEvent) {
        let oTarget = oEvent.target;
        if (this.onDragItem) {
            this.onDragItem(oEvent.target);
        }
        oEvent.dataTransfer.effectAllowed = 'move';
        let id = oTarget.getAttribute(DD_ID);
        if (id === undefined) {
            throw new Error('draggable items must have "' + DD_ID + '" attribute set');
        }
        oEvent.dataTransfer.setData('Text', id);
    }

    handleDragEnd(oEvent) {
        if (this.onReleaseItem) {
            this.onReleaseItem(oEvent.target);
        }
    }

    handleDragOver(oEvent) {
        if (oEvent.preventDefault) {
            oEvent.preventDefault();
        }
        oEvent.dataTransfer.dropEffect = 'move';
        return false;
    }

    handleDragEnter(oEvent) {
        let oTarget = this.getDropZone(oEvent.target);
        this.dropZoneLight(oTarget, true);
    }

    handleDragLeave(oEvent) {
        let oTarget = this.getDropZone(oEvent.target);
        this.dropZoneLight(oTarget, false);
    }

    handleDrop(oEvent) {
        if (oEvent.stopPropagation) {
            oEvent.stopPropagation();
        }
        if (oEvent.preventDefault) {
            oEvent.preventDefault();
        }
        let oTarget = this.getDropZone(oEvent.target);
        let origTarget = document.querySelector('[' + DD_ID + '="' + oEvent.dataTransfer.getData('Text') + '"]');
        this.dropZoneLight(oTarget, false);
        if (this.onDrop) {
            this.onDrop(oTarget, origTarget);
        }
        if (this.onReleaseItem) {
            this.onReleaseItem(origTarget);
        }
        return false;
    }

    /**
     * Défini la surbrillance de la dropzone, gère les conflits de priorités des event Enter/Leave
     */
    dropZoneLight(dz, bOn) {
        let nLight = parseInt(dz.getAttribute(DD_DROPZONE_LIGHT)) + (bOn ? 1 : -1);
        dz.setAttribute(DD_DROPZONE_LIGHT, nLight);
        if (nLight > 0) {
            if (this.onDropZoneLightens) {
                this.onDropZoneLightens(dz);
            }
        } else {
            if (this.onDropZoneDarkens) {
                this.onDropZoneDarkens(dz);
            }
        }
    }

    /**
     * Renvoie la drop zone qui contient l'élément spécifié
     */
    getDropZone(oElement) {
        while (!this.isDropZone(oElement)) {
            oElement = oElement.parentNode;
            if (!oElement) {
                throw new Error('specified element is not inside a droppable element');
            }
        }
        return oElement;
    }

    /**
     * Défini une drop zone
     */
    setDropZone(oItem, bDZ) {
        oItem.setAttribute(DD_DROPZONE_LIGHT, 0);
        oItem.setAttribute(DD_DROPZONE, bDZ ? '1' : '0');
    }

    /**
     * Renvoie true si l'objet spécifié est une dropzone
     */
    isDropZone(oItem) {
        return parseInt(oItem.getAttribute(DD_DROPZONE));
    }

    /**
     * On effectue un traitement pour chaque entité d'un ensemble :
     * on lui ajoute la fonctionnalité de dragging.
     */
    setDraggableEntities(aSet) {
        aSet.forEach(oEnt => {
            if (oEnt.getAttribute('draggable') != 'true') { // pas draggable
                oEnt.setAttribute('draggable', 'true');
                oEnt.addEventListener('dragstart', event => this.handleDragStart(event), false);
                oEnt.addEventListener('dragend', event => this.handleDragEnd(event), false);
            }
        });
    }

    setDroppableEntities($set) {
        let self = this;
        $set.each(function() {
            let $ent = $(this);
            if (!self.isDropZone(this)) { // pas dropable
                self.setDropZone(this, true);
                let oEnt = $ent.get(0);
                let pEventOver = self.handleDragOver.bind(self);
                let pEventEnter = self.handleDragEnter.bind(self);
                let pEventLeave = self.handleDragLeave.bind(self);
                let pEventDrop = self.handleDrop.bind(self);
                $ent.data('dropEventHandlers', {
                    over: pEventOver,
                    enter: pEventEnter,
                    leave: pEventLeave,
                    drop: pEventDrop
                });
                oEnt.addEventListener('dragover', pEventOver, false);
                oEnt.addEventListener('dragenter', pEventEnter, false);
                oEnt.addEventListener('dragleave', pEventLeave, false);
                oEnt.addEventListener('drop', pEventDrop, false);
            }
        });
    }

    /**
     * Remove draggable capability of an item
     * @param oItem
     */
    removeDraggableFlag(oItem) {
        let $ent = $(oItem);
        $ent.removeAttr('draggable');
        let pEvent = $ent.data('dragEventHandlers');
        oItem.removeEventListener('dragstart', pEvent.start, false);
        oItem.removeEventListener('dragend', pEvent.end, false);
    }

    removeDroppableFlag(oItem) {
        let $ent = $(oItem);
        if (this.isDropZone(oItem)) { // dropable : virer le flag
            let pEvent = $ent.data('dropEventHandlers');
            this.setDropZone(oItem, false);
            oItem.removeEventListener('dragover', pEvent.over);
            oItem.removeEventListener('dragenter', pEvent.enter);
            oItem.removeEventListener('dragleave', pEvent.leave);
            oItem.removeEventListener('drop', pEvent.drop);
        }
    }


}