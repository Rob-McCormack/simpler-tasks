function extractNotes(content) {
    const notesRegex = /^NOTES:\n([\s\S]*)$/m;
    const match = content.match(notesRegex);
    if (match && match[1]) {
        return { notes: match[1].trim() };
    }
    return { notes: null };
}
