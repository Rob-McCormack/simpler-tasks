
<script>
  function deleteCurrentLine() {
    const textarea = document.getElementById('myTextarea');
  const cursorPos = textarea.selectionStart;
  const textLines = textarea.value.split('\n');

  let currentLine = 0;
  let charCount = 0;

  // Find the current line
  for (let i = 0; i < textLines.length; i++) {
    charCount += textLines[i].length + 1; // +1 for newline character
      if (charCount > cursorPos) {
    currentLine = i;
  break;
      }
    }

  // Remove the current line
  textLines.splice(currentLine, 1);
  textarea.value = textLines.join('\n');

  // Save to localStorage
  saveToLocalStorage();
  }
</script>

