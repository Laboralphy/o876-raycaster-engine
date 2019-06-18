import {fetchJSON} from "../../lib/src/fetch-json";

class Interface {



    static clear(target) {
        while (!!target.firstChild) {
            target.removeChild(target.firstChild);
        }
    }


    static buildProgressBar() {
        return `<div>
    <style scoped="scoped">

progress {
    width: 50%;
    margin: 25%;
    margin-top: 25%;
}

    </style>
    <progress min="0" max="100" value="0"></progress>
</div>`;
    }


    static async buildLevelSelectionPage() {

        const htmlTitle = `<h2>Level selection</h2>`;

        const aLevels = await fetchJSON('/game/levels');
        const htmlLevels = aLevels
            .filter(level => level.exported)
            .map(({preview, name}) =>


// template of level thumbnail
`<figure class="level" data-level="${name}">
    <img src="${preview}" alt="Preview of ${name}"/>
    <figcaption>${name}</figcaption>
</figure>`

            ).join('\n');
        const htmlStyles =


// template of scoped styles
`<style scoped="scoped">
figure {
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 8px;
    font-family: "Courier New", Courier, monospace;
    font-size: 12px;
    font-weight: bold;
    color: white;
    cursor: pointer;
}

figure:hover {
    filter: brightness(150%);
    background-color: rgb(32, 32, 32);
}

figcaption {
    margin-top: 4px;
}

h2 {
    font-family: "Courier New", Courier, monospace;
    margin: 16px;
    color: white;
}
</style>`;


        return htmlTitle + htmlStyles + htmlLevels;
    }
}


export default Interface;