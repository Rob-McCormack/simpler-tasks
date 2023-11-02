document.addEventListener('DOMContentLoaded', function () {

    // Define constants at the top
    const specialChars = [
        { char: "title", meaning: "title", sortOrder: 1 },
        { char: "update", meaning: "update", sortOrder: 2 },
        { char: "!", meaning: "must-do", sortOrder: 3 },
        { char: "t", meaning: "today", sortOrder: 4 },
        { char: "h", meaning: "high priority", sortOrder: 5 },
        { char: "", meaning: "normal", sortOrder: 6 }, // Make sure to include this
        { char: "l", meaning: "low priority", sortOrder: 7 },
        { char: "r", meaning: "recurring", sortOrder: 8 },
        { char: "n", meaning: "note", sortOrder: 100 },
        { char: "d", meaning: "done", sortOrder: 101 }
    ];


    const editTab = document.getElementById('edit-tab');
    const viewTab = document.getElementById('view-tab');
    const tasksTextArea = document.getElementById('tasks');
    const viewTasksDiv = document.getElementById('viewTasks');

    editTab.addEventListener('click', () => {
        tasksTextArea.style.display = 'block';
        viewTasksDiv.style.display = 'none';
    });

    viewTab.addEventListener('click', () => {
        const tasks = tasksTextArea.value;
        let tasksJSON = convertTasksToJSON(tasks);
        tasksJSON = sortTasks(tasksJSON);
        viewTasksDiv.innerHTML = convertJSONToHTML(tasksJSON);
        tasksTextArea.style.display = 'none';
        viewTasksDiv.style.display = 'block';
    });

    function autoExpandTextarea(textarea) {
        textarea.style.height = 'inherit';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    tasksTextArea.addEventListener('input', function () {
        autoExpandTextarea(this);
    });

    autoExpandTextarea(tasksTextArea);

    function convertTasksToJSON(tasks) {
        return tasks.split('\n').map(task => {
            if (task.trim() !== '') {
                let type = 'normal';
                let content = task;
                specialChars.forEach(sc => {
                    if (task.startsWith(sc.char + ' ')) {
                        type = sc.meaning;
                        content = task.substring(sc.char.length).trim();
                    }
                });
                return { type: type, content: content };
            }
            return null;
        }).filter(t => t !== null); // Filter out any nulls that were added for empty lines
    }

    function convertJSONToHTML(json) {
        return json.map(task => `<div><strong>[${task.type}]</strong> ${task.content}</div>`).join('');
    }

    function sortTasks(tasks) {
        const sortOrder = specialChars.reduce((acc, char) => {
            acc[char.meaning] = char.sortOrder;
            return acc;
        }, {});

        return tasks.sort((a, b) => {
            return (sortOrder[a.type] || 1000) - (sortOrder[b.type] || 1000);
        });
    }

    // const specialChars = [
    //     { char: "title", meaning: "title", sortOrder: 1 },
    //     { char: "update", meaning: "update", sortOrder: 2 },
    //     { char: "!", meaning: "must-do", sortOrder: 3 },
    //     { char: "t", meaning: "today", sortOrder: 4 },
    //     { char: "h", meaning: "high priority", sortOrder: 5 },
    //     { char: "", meaning: "normal", sortOrder: 6 },
    //     { char: "l", meaning: "low priority", sortOrder: 7 },
    //     { char: "r", meaning: "recurring", sortOrder: 8 },
    //     { char: "n", meaning: "note", sortOrder: 100 },
    //     { char: "d", meaning: "done", sortOrder: 101 }
    // ];
});
