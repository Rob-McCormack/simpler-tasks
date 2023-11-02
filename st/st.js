document.addEventListener('DOMContentLoaded', function () {

    const specialChars = [
        { char: "!", meaning: "must-do", sortOrder: 1 },
        { char: "t", meaning: "today", sortOrder: 2 },
        { char: "h", meaning: "high priority", sortOrder: 3 },
        { char: "", meaning: "normal", sortOrder: 4 },
        { char: "l", meaning: "low priority", sortOrder: 5 },
        { char: "r", meaning: "recurring", sortOrder: 6 },
        { char: "n", meaning: "note", sortOrder: 7 },
        { char: "d", meaning: "done", sortOrder: 8 },
        { char: "title", meaning: "title", sortOrder: -1 },
        { char: "update", meaning: "update", sortOrder: -2 }

    ];

    const editTab = document.getElementById('edit-tab');
    const viewTab = document.getElementById('view-tab');
    const tasksTextArea = document.getElementById('tasks');
    const viewTasksDiv = document.getElementById('viewTasks');

    editTab.addEventListener('click', () => {
        let tasksArray = convertTasksToJSON(tasksTextArea.value).map(taskObj => {
            const specialCharObj = specialChars.find(sc => sc.meaning.toLowerCase() === taskObj.type.toLowerCase());
            const prefix = specialCharObj && taskObj.type !== 'normal' ? specialCharObj.char + ' ' : '';
            return prefix + taskObj.content;
        });
        tasksTextArea.value = tasksArray.join('\n');
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

    function convertTasksToJSON(text) {
        return text.split('\n').filter(line => line.trim() !== '').map(line => {
            const trimmedLine = line.trim();
            const firstWord = trimmedLine.split(' ')[0];
            const specialChar = specialChars.find(sc => sc.char.toLowerCase() === firstWord.toLowerCase());

            if (specialChar) {
                return { type: specialChar.meaning, content: trimmedLine.substring(firstWord.length).trim() };
            } else {
                return { type: 'normal', content: trimmedLine };
            }
        });
    }

    function convertJSONToHTML(json) {
        return json.map(task => `<div><strong>[${task.type}]</strong> ${task.content}</div>`).join('');
    }

    function sortTasks(tasks) {
        const sortOrder = specialChars.reduce((acc, char) => {
            acc[char.meaning.toLowerCase()] = char.sortOrder;
            return acc;
        }, {});

        return tasks.sort((a, b) => {
            return (sortOrder[a.type.toLowerCase()] || 1000) - (sortOrder[b.type.toLowerCase()] || 1000);
        });
    }

});
