let renderedApp;

export async function renderOnSidebar(app) {
    if (renderedApp && renderedApp.id !== app.id) {
        await renderedApp.close();
    }

    renderedApp = app;
    const sheetOnlySheet = document.getElementsByClassName("sheet-only-sheet")[0]
    addListener(sheetOnlySheet);
    modifySheetSize(sheetOnlySheet);
}

function addListener(sheetOnlySheet) {
    if (!sheetOnlySheet) return;

    renderedApp.addEventListener('close', () => {
        renderedApp = undefined;
        if (sheetOnlySheet) {
            sheetOnlySheet.style.width = "100%"
            sheetOnlySheet.style.maxWidth = "100%"
        };
    });
}

function modifySheetSize(sheetOnlySheet) {
    if (!sheetOnlySheet) return;

    console.warn(window.innerWidth, renderedApp.element.offsetWidth)
    sheetOnlySheet.style.width = window.innerWidth - renderedApp.element.offsetWidth + "px";
    sheetOnlySheet.style.maxWidth = window.innerWidth - renderedApp.element.offsetWidth + "px";
}

