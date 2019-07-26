import Translator from '../translator/Translator';
import * as CONSTS from './consts';
import util from "util";

/**
 * Will transforme a text map into a serie of Renderer.setCellMaterial/Phys/offset calls
 */
class MapHelper {

    getAnimationKeyString(a) {
        return a.join(';');
    }

    getAnimation(renderer, a) {
        const ks = this.getAnimationKeyString(a);
        if (ks in this._animFactory) {
            return this._animFactory[ks];
        } else {
            return this._animFactory[ks] = renderer.buildSurfaceAnimation({start: a[0], length: a[1], duration: a[2], loop: a[3]});
        }
    }

    buildMaterialFace(renderer, f) {
        if (Array.isArray(f)) {
            return this.getAnimation(renderer, f);
        } else {
            return f;
        }
    }


    buildMaterialItem(renderer, m) {
        return {
            code: m.code,
            phys: 'phys' in m ? m.phys : CONSTS.PHYS_NONE,
            faces: {
                n: 'n' in m.faces ? this.buildMaterialFace(renderer, m.faces.n) : null,
                s: 's' in m.faces ? this.buildMaterialFace(renderer, m.faces.s) : null,
                w: 'w' in m.faces ? this.buildMaterialFace(renderer, m.faces.w) : null,
                e: 'e' in m.faces ? this.buildMaterialFace(renderer, m.faces.e) : null,
                f: 'f' in m.faces ? this.buildMaterialFace(renderer, m.faces.f) : null,
                c: 'c' in m.faces ? this.buildMaterialFace(renderer, m.faces.c) : null
            },
            offset: 'offset' in m ? m.offset : 0,
            light: 'light' in m ? m.light : null
        }
    }

    getMaterial(legend) {
        const m = this._materials[legend];
        if (!m) {
            throw new Error(util.format('[MapHelper] this material code does not exist : "%s"', legend));
        }
        return m;
    }

    build(renderer, oMap) {

        const rowProcess = row =>
            (Array.isArray(row)
                ? row
                : row.split('')
            ).map(cell =>
                translator.translate(cell)
            );

        this._animFactory = {};
        this._materials = [];
        const translator = new Translator();
        const {map, legend} = oMap;

        // all materials
        legend.forEach((material, i) => {
            const m = this.buildMaterialItem(renderer, material);
            renderer.registerCellMaterial(i, m.faces);
            this._materials[i] = m;
            translator.addRule(m.code, i);
        });

        // map
        const size = map.length;
        const mapData = map.map(rowProcess);
        const ps = renderer.options.metrics.spacing;
        renderer.setMapSize(size);
        mapData.forEach((row, y) => row.forEach((cell, x) => {
            const m = !!cell ? this.getMaterial(cell) : {phys: CONSTS.PHYS_NONE, offset: 0};
            renderer.setCellMaterial(x, y, cell);
            renderer.setCellPhys(x, y, m.phys);
            renderer.setCellOffset(x, y, m.offset);
            // add a light source in the block ?
            if ('light' in m && !!m.light) {
                renderer.addLightSource(
                    ps * x + (ps >> 1),
                    ps * y + (ps >> 1),
                    m.light.r0,
                    m.light.r1,
                    m.light.v
                );
            }
        }));

        // upper storey
        if ('uppermap' in oMap && !!oMap.uppermap) {
            const upperMap = oMap.uppermap;
            const storey = renderer.createStorey();
            const mapUpperData = upperMap.map(rowProcess);
            mapUpperData.forEach((row, y) => row.forEach((cell, x) => {
                const m = !!cell ? this.getMaterial(cell) : {phys: CONSTS.PHYS_NONE, offset: 0};
                storey.setCellMaterial(x, y, cell);
                storey.setCellPhys(x, y, m.phys);
                storey.setCellOffset(x, y, m.offset);
            }));
        }
    }
}

export default MapHelper;