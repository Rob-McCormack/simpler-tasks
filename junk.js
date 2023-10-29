let taskMap = new Map();
let isFormatted = false;

// Event Listeners
document.getElementById("copy-button").addEventListener("click", function () {
    copyTextToClipboard("initial-list");
    alert("Text copied to clipboard!");
});

document.getElementById("fancy-tab").addEventListener("click", function () {
    reconcileTaskMapWithTextarea();
    sortAndGroup();
    displayTaskCounts(); // Ensure count is updated
});

document.getElementById("plain-tab").addEventListener("click", showPlainText);
document
    .getElementById("email-tab")
    .addEventListener("click", transferToEmailList);
document.getElementById("themeToggle").addEventListener("change", toggleTheme);

document.addEventListener("DOMContentLoaded", function () {
    initializeSampleTasks();
    reconcileTaskMapWithTextarea();
    sortAndGroup();
    displayTaskCounts();
    transferToEmailList();
});

function reconcileTaskMapWithTextarea() {
    const textArea = document.getElementById("initial-list");
    const lines = textArea.value.trim().split("\n");
    const newTaskMap = new Map();

    lines.forEach((line) => {
        const checkboxStatus = line.startsWith("x");
        newTaskMap.set(line, checkboxStatus);
    });

    taskMap = newTaskMap;
}

document.addEventListener("DOMContentLoaded", function () {
    transferToEmailList();
});

document.getElementById("initial-list").addEventListener("input", function () {
    clearTimeout(timeout); // Clear any existing timeouts
    // Reconcile the taskMap with the textarea content
    reconcileTaskMapWithTextarea();
    // Get the content of the textarea
    let content = this.value;

    // Check if the first line starts with "TITLE:"
    if (content.startsWith("TITLE:")) {
        // Extract the title
        let title = content.split("\n")[0].replace("TITLE:", "").trim();
        // Display it in the Fancy tab
        let fancyTab = document.getElementById("fancy");
        let titleElement = fancyTab.querySelector("h3.title");
        if (!titleElement) {
            titleElement = document.createElement("h3");
            titleElement.classList.add("title");
            fancyTab.prepend(titleElement);
        }
        titleElement.textContent = title;
    } else {
        let fancyTab = document.getElementById("fancy");
        let titleElement = fancyTab.querySelector("h3.title");
        if (titleElement) {
            titleElement.remove();
        }
    }
    reconcileTaskMapWithTextarea();
    displayTaskCounts();
});

// ... [remaining unchanged functions] ...

function sortAndGroup() {
    let notesContent = extractNotes(
        document.getElementById("initial-list").value
    );

    let specialTodayTask = [...taskMap.keys()].find((task) =>
        /^TODAY\s*:?\s+/i.test(task)
    );

    let todayElement = document.getElementById("specialTodayTask");
    let todayTextElement = todayElement.querySelector("#specialTodayText");

    if (specialTodayTask) {
        todayTextElement.textContent = specialTodayTask;
        todayElement.style.display = "block";
    } else {
        todayElement.style.display = "none";
    }

    if (!isFormatted) {
        let textArea = document.getElementById("initial-list");
        let lines = textArea.value.trim().split("\n").filter((line) => !line.startsWith("NOTES:"));
        taskMap.clear();
        lines.forEach((line) => {
            let checkboxStatus = taskMap.has(line) ? taskMap.get(line) : false;
            taskMap.set(line, checkboxStatus);
        });
    }

    isFormatted = true;
    let sortedList = document.getElementById("sortedTasks");

    let buildHeader = (title, colorClass = "") => {
        return `<h5 class="mt-3 ${colorClass}">${title}</h5>`;
    };

    sortedList.innerHTML = `
        ${buildHeader("Today", "text-danger")}
        ${[...taskMap.keys()].filter((task) => task.toLowerCase().includes("today") && !task.startsWith("TODAY")).join('<br>')}

        ${buildHeader("High Priority", "text-info")}
        ${[...taskMap.keys()].filter((task) => task.startsWith("!") && !task.toLowerCase().includes("today")).join('<br>')}

        ${buildHeader("Normal")}
        ${[...taskMap.keys()].filter((task) => !task.startsWith("!") && !task.startsWith("-") && !task.startsWith("x") && !task.toLowerCase().includes("today")).join('<br>')}

        ${buildHeader("Low Priority")}
        ${[...taskMap.keys()].filter((task) => task.startsWith("-") && !task.toLowerCase().includes("today")).join('<br>')}

        ${buildHeader("Done")}
        ${[...taskMap.keys()].filter((task) => task.startsWith("x")).join('<br>')}
    `;

    let notes = extractNotes(document.getElementById("initial-list").value);
    if (notes) {
        let formattedNotes = notes.replace(/(\r\n|\n|\r)/gm, "<br>");
        sortedList.innerHTML += `
            <h5 class="mt-3">NOTES:</h5>
            <p>${formattedNotes}</p>
        `;
    }
}

// ... [remaining unchanged functions] ...

