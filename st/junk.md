Before we go much further with `applySpecialFormats()`
I think we should change our JSON format to:

<!-- TODOX  -->

```js
{
  "1": {
    "type": "title",
    "content": "TITLE"
  },
  "2": {
    "type": "update",
    "content": "UPTDATE",
    "mentions": ["james"],
    "locations": ["home", "work"],
    "projects": ["logodesign"]
  },
  ...
}
```


Here is the function you provided before in this Chat:

```js
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

        tasksJSON[taskId] = { type: type, content: content };

        // If it's an update, we can extract mentions, locations, projects
        if (type === 'update') {
            tasksJSON[taskId].mentions = words.filter(word => word.startsWith('@')).map(mention => mention.substring(1));
            tasksJSON[taskId].locations = words.filter(word => word.startsWith('#')).map(location => location.substring(1));
            tasksJSON[taskId].projects = words.filter(word => word.startsWith('+')).map(project => project.substring(1));
        }

        taskId++;
    });

    return tasksJSON;
}
```

How do we implement this?
