import {isSheetOnly} from "./utils";
import {popupSheet} from "./sheet";

export async function onCloseUserConfig(){
    if (!isSheetOnly()) {
        return;
    }
    // Popup sheet after user selected their character
    await popupSheet()
}

export async function onRenderSettingsConfig(app, element, settings){
    if (!isSheetOnly()) {
        return;
    }

    app.setPosition({zIndex: 2000})

    if (window.innerWidth < 600) {
        app.setPosition({
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
        })

        const content = element.querySelector('.window-content');

        if (content) {
            content.style.flexDirection = 'column'
            content.style.overflowY = 'auto';
            content.style.maxHeight = '100vh';
        }
    }
}