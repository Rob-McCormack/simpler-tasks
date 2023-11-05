<script>
    // Function to automatically save content to localStorage
  function autoSaveToLocalStorage() {
        const content = document.getElementById('myTextarea').value;
  localStorage.setItem('textareaContent', content);
  console.log('Content saved:', content); // Console log for debugging
    }

  // Setup the autosave feature after the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('myTextarea').addEventListener('input', autoSaveToLocalStorage);

  // Load content from localStorage when the page loads
  const savedContent = localStorage.getItem('textareaContent');
  if (savedContent) {
    document.getElementById('myTextarea').value = savedContent;
        }
    });

  // Service worker code
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('Service Worker registered!', reg);
      })
      .catch(err => {
        console.error('Service Worker registration failed:', err);
      });
    }
</script>
