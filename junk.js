function convertJSONToHTML(tasksJSON) {
    let html = '';
    for (const id in tasksJSON) {
        if (tasksJSON.hasOwnProperty(id)) {
            const task = tasksJSON[id];
            html += `<div class="task">`;
            html += `<div class="type">${task.type}</div>`;
            html += `<div class="description">${task.description}</div>`;
            // Add other task properties here
            html += `</div>`;
        }
    }
    return html;
}
