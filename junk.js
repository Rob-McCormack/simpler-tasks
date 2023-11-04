const specialFormats = [
    { char: "@", formatStart: "<b>", formatEnd: "</b>" },
    { char: "#", formatStart: "<i>", formatEnd: "</i>" },
    { char: "+", formatStart: "<u>", formatEnd: "</u>" }
];

// Later, in your convertJSONToHTML function, you'd use these formats:

function applySpecialFormats(content) {
    let formattedContent = content;
    specialFormats.forEach(special => {
        const regex = new RegExp(`\\${special.char}\\w+`, 'g'); // Match the special character followed by any word characters
        formattedContent = formattedContent.replace(regex, match => {
            // Wrap the matched text with the specified formatting
            return `${special.formatStart}${match}${special.formatEnd}`;
        });
    });
    return formattedContent;
}

function convertJSONToHTML(json) {
    return json.map(task => {
        const formattedContent = applySpecialFormats(task.content);
        return `<div><strong>[${task.type}]</strong> ${formattedContent}</div>`;
    }).join('');
}
