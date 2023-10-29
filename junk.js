let buildGroup = (tasks, status) => {
    return tasks
        .map((task, index) => {
            let taskContent = task;

            // Format the @usernames in the task content
            taskContent = formatUsernamesInTask(taskContent);

            // Now, return the formatted task content without the checkbox
            return `${taskContent}<br>${note}`;
        })
        .join("");
};
