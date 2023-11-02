document.addEventListener('DOMContentLoaded', function () {

    // Define constants at the top
    const specialChars = [
        { char: "!", meaning: "must-do", sortOrder: 1 },
        { char: "t", meaning: "today", sortOrder: 2 },
        { char: "h", meaning: "high priority", sortOrder: 3 },
        { char: "", meaning: "normal", sortOrder: 4 },
        { char: "l", meaning: "low priority", sortOrder: 5 },
        { char: "r", meaning: "recurring", sortOrder: 6 },
        { char: "n", meaning: "note", sortOrder: 7 },
        { char: "d", meaning: "done", sortOrder: 8 }
    ];

    const editTab = document.getElementById('edit-tab');
    const viewTab = document.getElementById('view-tab');
    const tasksTextArea = document.getElementById('tasks');
    const viewTasksDiv = document.getElementById('viewTasks');

    // editTab.addEventListener('click', () => {
    //     tasksTextArea.style.display = 'block';
    //     viewTasksDiv.style.display = 'none';
    // });

    editTab.addEventListener('click', () => {
        // Retrieve the processed tasks as an array without empty lines
        let tasksArray = convertTasksToJSON(tasksTextArea.value).map(taskObj => {
            // Prefix the special character to the task content if it's not normal
            const specialCharObj = specialChars.find(sc => sc.meaning === taskObj.type);
            const prefix = specialCharObj && taskObj.type !== 'normal' ? specialCharObj.char + ' ' : '';
            return prefix + taskObj.content;
        });
        // Join the array back into a string with new lines
        const processedTasks = tasksArray.join('\n');
        // Set the text area value to the processed tasks without empty lines
        tasksTextArea.value = processedTasks;

        // Display the correct area
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

    // This should be removed since it's a duplicate of the code above
    // viewTab.addEventListener('click', () => {
    //     // ... (rest of your viewTab click event code)
    //     // Update the tasks display
    //     viewTasksDiv.innerHTML = convertJSONToHTML(tasksJSON);
    //     tasksTextArea.style.display = 'none';
    //     viewTasksDiv.style.display = 'block';
    // });

    autoExpandTextarea(tasksTextArea);

    function convertTasksToJSON(text) {
        return text.split('\n').filter(line => line.trim() !== '').map(line => {
            // Convert the first character to lowercase before checking
            const specialChar = specialChars.find(sc => line.toLowerCase().startsWith(sc.char + ' '));
            if (specialChar) {
                return { type: specialChar.meaning, content: line.slice(2).trim() };
            } else {
                return { type: 'normal', content: line };
            }
        });
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

});
