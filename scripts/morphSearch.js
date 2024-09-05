import { searchEngineAvailable } from "./compatibility";


export function displayMorphSearchButton() {
    const morphSearchButton = $('so-morph-search');

    if (searchEngineAvailable() && game.settings.get('sheet-only', 'morph-on-mobile') === true) {
        morphSearchButton.show();
    } else {
        morphSearchButton.hide();
    }
}