< !DOCTYPE html >
    <html lang="en">
        <head>
            <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Typewriter Effect with CSS Only</title>
                    <style>
                        @keyframes typing {
                            from {width: 0; }
                        to {width: 100%; }
    }

                        @keyframes blink {
                            50 % { border- color: transparent; }
    }

                        .typewriter {
                            font - family: monospace;
                        overflow: hidden; /* Ensures the content doesn't break out of container */
                        border-right: .15em solid orange; /* Cursor */
                        white-space: nowrap; /* Keeps the text in a single line */
                        margin: 0 auto; /* Centers the container */
                        letter-spacing: .15em; /* Adjusts spacing between characters */
                        animation:
                        typing 4s steps(30, end),
                        blink .75s step-end infinite;
      /* Adjust the timing (4s) and steps(30) based on content length for best effect */
    }

                        /* Style for the container or you might want to adjust it */
                        .container {
                            width: fit-content;
                        padding: 20px;
      /* Additional styling can go here */
    }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="typewriter">
                            Your animated text goes here.
                        </div>
                    </div>
                </body>
            </html>
