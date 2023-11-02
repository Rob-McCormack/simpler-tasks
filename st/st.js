document.addEventListener('DOMContentLoaded', function () {
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
        tasksJSON = sortTasks(tasksJSON); // Sort the tasks
        console.log(tasksJSON);
        viewTasksDiv.innerHTML = convertJSONToHTML(tasksJSON);
        tasksTextArea.style.display = 'none';
        viewTasksDiv.style.display = 'block';
    });

    function convertTasksToJSON(tasks) {
        return tasks.split('\n').reduce((acc, task) => {
            if (task.trim() !== '') {
                const parts = task.split(' ');
                const taskType = parts.shift();
                acc.push({ type: taskType, content: parts.join(' ') });
            }
            return acc;
        }, []);
    }

    function convertJSONToHTML(json) {
        return json.map(task => `<div><strong>${task.type}</strong>: ${task.content}</div>`).join('');
    }

    // Function to sort tasks according to the defined sortOrder
    function sortTasks(tasks) {
        const sortOrder = {
            '!': 1,
            'title': 2,
            'update': 3,
            'h': 4,
            'normal': 5,
            'l': 6,
            'r': 7,
            'n': 8
        };

        // Assign 'normal' type if no special character is found
        tasks.forEach(task => {
            if (!sortOrder[task.type]) {
                task.type = 'normal';
            }
        });

        // Sort tasks based on the sortOrder mapping
        return tasks.sort((a, b) => {
            return (sortOrder[a.type] || sortOrder['normal']) - (sortOrder[b.type] || sortOrder['normal']);
        });
    }
});
