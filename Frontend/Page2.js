import { gsap } from 'gsap';

export default function renderPage2(container) {
    // Clear the container
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // Create heading element
    const heading = document.createElement('h1');
    heading.textContent = 'Generate Secret Message:';
    heading.style.color = 'white';
    heading.style.opacity = '0'; // Start invisible for animation
    heading.style.position = 'relative';
    heading.style.fontFamily = 'Copperplate';

    // Create input field
    const inputField = document.createElement('input');
    inputField.id = 'input';
    inputField.type = 'text';
    inputField.placeholder = 'Enter your word here...';
    inputField.style.padding = '10px';
    inputField.style.fontSize = '16px';
    inputField.style.width = '80%';
    inputField.style.fontFamily = 'Copperplate';
    inputField.style.marginTop = '20px';
    inputField.style.border = '1px solid white';
    inputField.style.borderRadius = '4px';
    inputField.style.backgroundColor = 'transparent';
    inputField.style.color = 'white';
    inputField.style.caretColor = 'white';
    inputField.style.opacity = '0';
    inputField.style.position = 'relative';
    inputField.style.zIndex = '10';
    inputField.style.pointerEvents = 'auto';

    // Create button
    const button = document.createElement('button');
    button.textContent = 'Submit';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.marginTop = '20px';
    button.style.fontFamily = 'Copperplate';
    button.style.border = '1px solid white';
    button.style.borderRadius = '4px';
    button.style.backgroundColor = 'white';
    button.style.color = 'black';
    button.style.cursor = 'pointer';
    button.style.opacity = '0';
    button.style.position = 'relative';
    button.style.zIndex = '10';
    button.style.pointerEvents = 'auto';

    // Create terminal-like output container
    const terminalBox = document.createElement('div');
    terminalBox.style.backgroundColor = '#000';
    terminalBox.style.color = '#0f0';
    terminalBox.style.fontFamily = 'Courier, monospace';
    terminalBox.style.padding = '20px';
    terminalBox.style.marginTop = '20px';
    terminalBox.style.borderRadius = '8px';
    terminalBox.style.border = '1px solid #333';
    terminalBox.style.fontFamily = 'Copperplate';
    terminalBox.style.minHeight = '200px';
    terminalBox.style.width = '100%';
    terminalBox.style.overflow = 'auto';
    terminalBox.style.whiteSpace = 'pre';

    button.addEventListener('click', async () => {
        const inputText = inputField.value.trim();

        if (!inputText) {
            alert('Please enter some text!');
            return;
        }

        try {
            // Make a POST request to the backend
            const response = await fetch('http://localhost:3000/generate-secret-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input: inputText }),
            });

            // Clear the terminal box
            terminalBox.textContent = '';

            if (response.ok) {
                // Access the 'key' field from the backend response
                const { key } = await response.json();
                console.log('Unique ID retrieved:', key);

                // Display the unique ID in the terminal
                const uniqueIdMessage = document.createElement('div');
                uniqueIdMessage.textContent = `Unique ID: ${key}`;
                uniqueIdMessage.style.opacity = '0'; // Start invisible
                uniqueIdMessage.style.color = '#0f0'; // Green text
                terminalBox.appendChild(uniqueIdMessage);

                gsap.to(uniqueIdMessage, {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power3.out',
                });
            } else {
                console.log('Error retrieving unique ID.');
                const notFoundMessage = document.createElement('div');
                notFoundMessage.textContent = 'Error: Unable to generate secret message.';
                notFoundMessage.style.opacity = '0'; // Start invisible
                notFoundMessage.style.color = 'red';
                terminalBox.appendChild(notFoundMessage);

                gsap.to(notFoundMessage, {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power3.out',
                });
            }
        } catch (error) {
            console.error('Error fetching unique ID:', error);

            const errorMessage = document.createElement('div');
            errorMessage.textContent = 'An error occurred. Please try again later.';
            errorMessage.style.color = 'red';
            terminalBox.appendChild(errorMessage);
        }
    });



    // Append elements to the container
    container.appendChild(heading);
    container.appendChild(inputField);
    container.appendChild(button);
    container.appendChild(terminalBox);

    gsap.timeline()
        .to(heading, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .to(inputField, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '<')
        .to(button, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '<');
}
