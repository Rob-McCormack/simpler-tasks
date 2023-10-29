function sortAndGroup() {
    // ... [rest of the code remains unchanged]

    let processTasks = (tasks) => {
        return tasks.map(task => formatUsernamesInTask(task)).join('<br>');
    };

    sortedList.innerHTML = `
        ${buildHeader("Must-Do Task for Today", "text-danger")}
        ${processTasks([...taskMap.keys()].filter(task => task.toLowerCase().startsWith("t ")))}

        ${buildHeader("Must-Do", "text-info")}
        ${processTasks([...taskMap.keys()].filter(task => task.startsWith("! ") && !task.toLowerCase().startsWith("t ")))}

        ${buildHeader("High Priority", "text-info")}
        ${processTasks([...taskMap.keys()].filter(task => task.toLowerCase().startsWith("h ") && !task.toLowerCase().startsWith("t ") && !task.startsWith("! ")))}

        ${buildHeader("Normal")}
        ${processTasks([...taskMap.keys()].filter(task => !task.startsWith("! ") && !task.startsWith("- ") && !task.startsWith("x ") && !task.toLowerCase().startsWith("h ") && !task.toLowerCase().startsWith("l ") && !task.toLowerCase().startsWith("t ") && !task.startsWith("TITLE: ")))}

        ${buildHeader("Low Priority")}
        ${processTasks([...taskMap.keys()].filter(task => task.toLowerCase().startsWith("l ") && !task.toLowerCase().startsWith("t ")))}

        ${buildHeader("Done")}
        ${processTasks([...taskMap.keys()].filter(task => task.toLowerCase().startsWith("x ")))}
    `;

    // ... [rest of the code remains unchanged]
}
