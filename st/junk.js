function convertTasksToJSON(text) {
    const lines = text.split('\n').filter(line => line.trim() !== ''); // Filter out empty lines
    let tasksJSON = {};
    let taskId = 1;

    lines.forEach(line => {
        const words = line.trim().split(' ');
        const firstWord = words[0];
        const specialChar = specialChars.find(sc => sc.char === firstWord);

        let type, content;
        if (specialChar) {
            type = specialChar.meaning;
            content = words.slice(1).join(' ');
        } else {
            type = 'normal';
            content = line.trim();
        }

        tasksJSON[taskId.toString()] = { type: type, content: content };

        // If it's an update, we can extract mentions, locations, projects
        if (type === 'update') {
            tasksJSON[taskId.toString()].mentions = words.filter(word => word.startsWith('@')).map(mention => mention.substring(1));
            tasksJSON[taskId.toString()].locations = words.filter(word => word.startsWith('#')).map(location => location.substring(1));
            tasksJSON[taskId.toString()].projects = words.filter(word => word.startsWith('+')).map(project => project.substring(1));
        }

        taskId++;
    });

    return tasksJSON;
}
