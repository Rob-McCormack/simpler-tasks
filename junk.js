function sortAndGroup() {
    // ... [Previous part of your sortAndGroup function]

    let notesContent = extractNotes(document.getElementById("initial-list").value);
    let specialTodayTask = [...taskMap.keys()].find((task) => /^TODAY\s*:?\s+/i.test(task));
    let todayElement = document.getElementById("specialTodayTask");
    let todayTextElement = todayElement.querySelector("#specialTodayText");
    // ... [rest of your code till this point]

    // Convert special characters to lowercase
    const tasks = [...taskMap.keys()];
    for (let task of tasks) {
        for (let item of specialChars) {
            if (task.startsWith(item.char.toUpperCase() + " ")) {
                const modifiedTask = task.charAt(0).toLowerCase() + task.slice(1);
                taskMap.delete(task);
                taskMap.set(modifiedTask, false);
            }
        }
    }

    // ... [Continue with the rest of your sortAndGroup function]
}
