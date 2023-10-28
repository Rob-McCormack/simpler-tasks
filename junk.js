function sortAndGroup() {
    // ... [Your existing code for sorting tasks by priority]

    // ---- START OF NEW CODE FOR GROUPING BY USERS ----

    // Extract usernames from the tasks
    let allTasks = [...taskMap.keys()];
    let allUsernames = new Set();
    allTasks.forEach(task => {
        let usernames = extractUsernames(task);
        usernames.forEach(username => allUsernames.add(username));
    });

    // Now, for each username, group tasks under them
    let userGroupedTasks = '';
    allUsernames.forEach(username => {
        let tasksForUser = allTasks.filter(task => task.includes(`@${username}`));
        if (tasksForUser.length) {
            let badgeColor = getBadgeColorForUser(username);
            userGroupedTasks += `
                <h5 class="mt-3"><span class="badge rounded-pill ${badgeColor} lighter-text">@${username}</span></h5>
                ${tasksForUser.join('<br>')}
            `;
        }
    });

    // Append the user-grouped tasks to the sortedTasks div
    sortedList.innerHTML += userGroupedTasks;

    // ---- END OF NEW CODE FOR GROUPING BY USERS ----

    // Extract notes from the initial list and store in a variable
    let notes = extractNotes(document.getElementById('initial-list').value);

    // ... [Rest of your existing code for NOTES and other functionalities]
}
