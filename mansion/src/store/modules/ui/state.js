export default {
    popup: {
        text: '',
        icon: '',
        time: 0,
        visible: false,
        queue: []
    },

    visible: true,

    shot: { // information sur le dernier tir
        visible: false,
        value: 0, // valeur du score,
        distance: 0, // distance à laquelle à été prise la photo
        angle: 0, // difference d'angle entre la camera et le fantome
        energy: 0, // quantité d'energy disponible lors du shot
        targets: 0, // nombre de cible touché par le shot
        shutter: false, // photo prise pendant le shutter chance
    }
};