// Function to automatically save content to localStorage
function autoSaveToLocalStorage() {
    const content = document.getElementById('tasks').value;
    localStorage.setItem('textareaContent', content);
    // <!-- console.log('Content saved:', content); // Console log for debugging -->
}

document.addEventListener('DOMContentLoaded', function () {
    const tasks = document.getElementById('tasks');

    tasks.addEventListener('input', function () {
        autoSaveToLocalStorage();
        autoAdjustHeight(this);
    });

    const savedContent = localStorage.getItem('textareaContent');
    if (savedContent) {
        tasks.value = savedContent;
        autoAdjustHeight(tasks);
    }
});

// Service worker code - required here.
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(reg => {
            console.log('Service Worker registered!', reg);
        })
        .catch(err => {
            console.error('Service Worker registration failed:', err);
        });

    function deleteCurrentLine() {
        const textarea = document.getElementById('tasks');
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
        autoSaveToLocalStorage();

        // Set the cursor at the top of the textarea
        textarea.selectionStart = 0;
        textarea.selectionEnd = 0;
        document.getElementById('tasks').focus();

    }

    function autoAdjustHeight(textarea) {
        textarea.style.height = 'auto'; // Reset the height
        textarea.style.height = textarea.scrollHeight + 'px'; // Set the height to scroll height
    }


    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }


    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullScreen);

    function toggleFullScreen() {
        const fsButton = document.getElementById('fullscreenBtn');

        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            fsButton.innerText = 'Exit Full Screen'; // Change button text when full screen
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                fsButton.innerText = 'Full Screen'; // Change back the button text when exiting full screen
            }
        }
    }

    // Send content as an email
    function sendEmail() {
        const content = document.getElementById('tasks').value;
        const mailtoLink = `mailto:?subject=test email&body=${encodeURIComponent(content)}`;
        window.location.href = mailtoLink;
    }
}

function fetchText() {
    fetch('https://raw.githubusercontent.com/Rob-McCormack/simpler-tasks/main/localstorage/sample.txt')
        .then(response => response.text())
        .then(data => {
            document.getElementById('tasks').value = data;
            autoSaveToLocalStorage(); // If you want to save the fetched text to localStorage as well
            autoAdjustHeight(document.getElementById('tasks')); // Adjust the height if needed
        })
        .catch(error => {
            console.error('Error fetching text:', error);
        });
}

function toggleWordWrap() {
    const textarea = document.getElementById('tasks');
    const wordWrapBtn = document.getElementById('wordWrapBtn');
    if (textarea.style.whiteSpace === 'pre-wrap') {
        textarea.style.whiteSpace = 'pre';
        wordWrapBtn.innerText = 'Word Wrap OFF';
    } else {
        textarea.style.whiteSpace = 'pre-wrap';
        wordWrapBtn.innerText = 'Word Wrap ON';
    }
}
