/**
 * Intro Effect
 * Display flash photo and text
 * @class MANSION.GX.Splash
 */
import AbstractFilter from "libs/filters/AbstractFilter";

class Splash extends AbstractFilter {
    constructor(photos, nMaxSplash) {
        super();
        this.sClass = 'Splash';
        this.oCanvas = null;

        this.aText = null;
        this.oEasingAlpha = null;

        this.oPhoto = null;
        this.aPhotos = null;
        this.nPhotoTime = 0;
        this.oPhotoRect = null;
        this.nSplash = 0;
        this.nMaxSplash = 4;
        if (!!photos) {
            this.splash(photos, nMaxSplash);
        }
    }


    /**
     * Affiche le splash d'une photo.
     * La photo apparait à position / taille aléatoire
     * puis se dessine coorectement dans l'écran
     * @param photos liste d'images à afficher
     * @param nMaxSplash nombre de sautillement d'image (pour chaque photo)
     */
    splash(photos, nMaxSplash) {
        if (nMaxSplash) {
            this.nMaxSplash = nMaxSplash;
        }
        if (Array.isArray(photos)) {
            this.aPhotos = photos;
        } else {
            this.aPhotos = [photos];
        }
        this.nextPhoto();
    }

    nextPhoto() {
        this.oPhoto = this.aPhotos.shift();
        if (this.oPhoto) {
            this.nPhotoTime = 0;
            this.nSplash = this.nMaxSplash;
        } else {
            this.terminate();
        }
    }

    /** Fonction appelée par le gestionnaire d'effet pour recalculer l'état de l'effet
     */
    process() {
        if (!this.oCanvas) {
            return;
        }
        if (!!this.oPhoto) {
            if (this.nPhotoTime <= 0) {
                --this.nSplash;
                const pr = {
                    x: 0,
                    y: 0,
                    width: this.oPhoto.width,
                    height: this.oPhoto.height,
                };
                if (this.nSplash > 0) {
                    pr.x = -Math.random() * pr.width | 0;
                    pr.y = -Math.random() * pr.height | 0;
                    pr.width *= 2;
                    pr.height *= 2;
                    this.oPhotoRect = pr;
                    this.nPhotoTime = 2;
                } else if (this.nSplash === 0) {
                    pr.x = this.oCanvas.width - pr.width >> 1;
                    pr.y = this.oCanvas.height - pr.height >> 1;
                    this.oPhotoRect = pr;
                    this.nPhotoTime = 8;
                } else if (this.nSplash < 0) {
                    this.nextPhoto();
                }

            }
            --this.nPhotoTime;
        }
    }

    /** Fonction appelée par le gestionnaire d'effet pour le rendre à l'écran
     */
    render(cvs) {
        if (!this.oCanvas) {
            this.oCanvas = cvs;
            return;
        }
        const ctx = cvs.getContext('2d');
        if (this.oPhoto && this.oPhotoRect) {
            const p = this.oPhoto;
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, cvs.width, cvs.height);
            const pr = this.oPhotoRect;
            ctx.drawImage(
                this.oPhoto,
                0,
                0,
                p.width,
                p.height,
                pr.x,
                pr.y,
                pr.width,
                pr.height
            );
        }
    }
}

export default Splash;