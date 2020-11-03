import sketch from 'sketch'
// documentation: https://developer.sketchapp.com/reference/api/

export default function() {
    let doc = sketch.getSelectedDocument()
    let libraries = sketch.getLibraries()

    let docData = doc.sketchObject.documentData()

    let currentSwatches = docData.allSwatches()

    let libraryName

    sketch.UI.getInputFromUser(
        "Select a library that you wish to use colors from:", {
            type: sketch.UI.INPUT_TYPE.selection,
            possibleValues: libraries.map(library => library.name)
        },
        (err, value) => {
            if (err) {
                return
            }
            libraryName = value
        }
    )

    let newLibrary = libraries.find(library => library.name == libraryName)
    let swatchRefs = newLibrary.getImportableSwatchReferencesForDocument(doc)

    currentSwatches.forEach(swatch => {
        let importableSwatch = swatchRefs.find(sw => sw.name == swatch.name())
        if (!importableSwatch) {
            return
        } else {
            let newSwatch = importableSwatch.import()
            docData
                .replaceInstancesOfColor_withColor_ignoreAlphaWhenMatching_replaceAlphaOfOriginalColor(
                    swatch.makeReferencingColor(),
                    newSwatch.referencingColor,
                    false,
                    false)
        }
    })

    sketch.UI.message("Colors in document updated to refer to colors from " + libraryName)
}
