

function sortAndGroup() {
    let extractionResult = extractNotes(document.getElementById("initial-list").value);
    let notesContent = extractionResult.notes;

    // Use extractionResult.content for further processing instead of the original content
    let specialTodayTask = [...taskMap.keys()].find((task) => /^TODAY\s*:?\s+/i.test(task));

    // ... [rest of your sortAndGroup function without extracting notes again]

    if (notesContent) {
        sortedList.innerHTML += `
            <h5 class="mt-3">NOTES:</h5>
            <p>${notesContent.replace(/(\r\n|\n|\r)/gm, "<br>")}</p>
        `;
    }
}
