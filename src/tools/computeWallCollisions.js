
/**
 * Détermine la collision entre le mobile et les murs du labyrinthe
 * @param xEntity {number} position x du mobile
 * @param yEntity {number} position y du mobile
 * @param dx {number} delta x de déplacement du mobile
 * @param dy {number} delta y de déplacement du mobile
 * @param nSize {number} demi-taille du mobile
 * @param nPlaneSpacing {number} taille de la grille
 * @param bCrashWall {boolean} si true alors il n'y a pas de correction de glissement
 * @param pSolidFunction {function} fonction permettant de déterminer si un point est dans une zone collisionnable
 */
export function computeWallCollisions(xEntity, yEntity, dx, dy, nSize, nPlaneSpacing, bCrashWall, pSolidFunction) {
    // by default : no collision detected
    let oWallCollision = {x: 0, y: 0, c: false};
    let x = xEntity;
    let y = yEntity;
    // une formule magique permettant d'igorer l'oeil "à la traine", evitant de se faire coincer dans les portes
    let iIgnoredEye = (Math.abs(dx) > Math.abs(dy) ? 1 : 0) | ((dx > dy) || (dx === dy && dx < 0) ? 2 : 0);
    let xClip, yClip, ix, iy, xci, yci;
    let bCorrection = false;
    // pour chaque direction...
    for (let i = 0; i < 4; ++i) {
        // si la direction correspond à l'oeil à la traine...
        if (iIgnoredEye === i) {
            continue;
        }
        // xci et yci valent entre -1 et 1 et correspondent aux coeficients de direction
        xci = (i & 1) * Math.sign(2 - i);
        yci = ((3 - i) & 1) * Math.sign(i - 1);
        ix = nSize * xci + x;
        iy = nSize * yci + y;
        // déterminer les col
        xClip = pSolidFunction(ix + dx, iy);
        yClip = pSolidFunction(ix, iy + dy);
        if (xClip) {
            oWallCollision.c = true;
            dx = 0;
            if (bCrashWall) {
                dy = 0;
                oWallCollision.y = yci || oWallCollision.y;
            }
            oWallCollision.x = xci || oWallCollision.x;
            bCorrection = true;
        }
        if (yClip) {
            oWallCollision.c = true;
            dy = 0;
            if (bCrashWall) {
                dx = 0;
                oWallCollision.x = xci || oWallCollision.x;
            }
            oWallCollision.y = yci || oWallCollision.y;
            bCorrection = true;
        }
    }
    x += dx;
    y += dy;
    if (bCorrection) {
        // il y a eu collsion
        // corriger la coordonée impactée
        if (oWallCollision.x > 0) {
            x = (x / nPlaneSpacing | 0) * nPlaneSpacing + nPlaneSpacing - 1 - nSize;
        } else if (oWallCollision.x < 0) {
            x = (x / nPlaneSpacing | 0) * nPlaneSpacing + nSize;
        }
        if (oWallCollision.y > 0) {
            y = (y / nPlaneSpacing | 0) * nPlaneSpacing + nPlaneSpacing - 1 - nSize;
        } else if (oWallCollision.y < 0) {
            y = (y / nPlaneSpacing | 0) * nPlaneSpacing + nSize;
        }
        return {
            pos: {x, y},
            speed: {x: x - xEntity, y: y - yEntity},
            wcf: oWallCollision
        };
    } else {
        return {
            pos: {x, y},
            speed: {x: dx, y: dy},
            wcf: oWallCollision
        }
    }
}
