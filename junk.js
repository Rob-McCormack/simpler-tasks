function sortAndGroup() {
    // ... [Rest of your function]

    // Extract the must-do task from the alert box:
    let mustDoTaskFromAlert = document.querySelector(".alert.alert-danger").textContent.trim();

    let mustDoHTML = "";
    let mustDoTasks = [...taskMap.keys()].filter(task => task.startsWith("! ") && !task.toLowerCase().startsWith("t "));

    // Exclude the must-do task from the main list if it's the same as the one in the alert
    if (mustDoTasks.length > 0 && mustDoTaskFromAlert !== mustDoTasks[0]) {
        mustDoHTML = `<div class="alert alert-danger" role="alert">${mustDoTasks[0]}</div>`;
    } else {
        mustDoTasks = [];  // Empty the array to avoid adding it again
    }

    let todayTasks = [...taskMap.keys()].filter(task => task.toLowerCase().includes("today") && !task.startsWith("TODAY") && !task.startsWith("TITLE:"));

    // Exclude tasks that start with "Today" from the main list
    todayTasks = todayTasks.filter(task => task !== mustDoTaskFromAlert);

    sortedList.innerHTML = `
    ${mustDoHTML}
    ${buildHeader("Today", "text-danger")}
    ${todayTasks.join('<br>')}
    // ... [Rest of your function]
    `;

    // ... [Rest of your function]
}
