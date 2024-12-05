import { gsap } from 'gsap';

export default function renderPage1(container) {
    // Clear the container
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // Create heading element
    const heading = document.createElement('h1');
    heading.textContent = 'Enter the secret link:';
    heading.style.color = 'white';
    heading.style.opacity = '0'; // Start invisible for animation
    heading.style.transform = 'translateY(-50px)'; // Start above position for animation
    heading.style.position = 'relative';

    // Create input field
    const inputField = document.createElement('input');
    inputField.id = 'input';
    inputField.type = 'text';
    inputField.placeholder = 'Enter your link here...';
    inputField.style.padding = '10px';
    inputField.style.fontSize = '16px';
    inputField.style.width = '80%';
    inputField.style.marginTop = '20px';
    inputField.style.border = '1px solid white';
    inputField.style.borderRadius = '4px';
    inputField.style.backgroundColor = 'transparent';
    inputField.style.color = 'white';
    inputField.style.caretColor = 'white';
    inputField.style.opacity = '0'; // Start invisible for animation
    inputField.style.transform = 'translateY(-50px)'; // Start above position for animation
    inputField.style.position = 'relative';
    inputField.style.zIndex = '10'; // Raise above canvas
    inputField.style.pointerEvents = 'auto';

    // Create button
    const button = document.createElement('button');
    button.textContent = 'Submit';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.marginTop = '20px';
    button.style.border = '1px solid white';
    button.style.borderRadius = '4px';
    button.style.backgroundColor = 'white';
    button.style.color = 'black';
    button.style.cursor = 'pointer';
    button.style.opacity = '0'; // Start invisible for animation
    button.style.transform = 'translateY(-50px)'; // Start above position for animation
    button.style.position = 'relative';
    button.style.zIndex = '10'; // Raise above canvas
    button.style.pointerEvents = 'auto';

    // Create terminal-like output container
    const terminalBox = document.createElement('div');
    terminalBox.style.backgroundColor = '#000'; // Black background for terminal effect
    terminalBox.style.color = '#0f0'; // Green text for terminal effect
    terminalBox.style.fontFamily = 'Courier, monospace'; // Monospaced font for alignment
    terminalBox.style.padding = '20px';
    terminalBox.style.marginTop = '20px';
    terminalBox.style.borderRadius = '8px';
    terminalBox.style.border = '1px solid #333';
    terminalBox.style.minHeight = '200px';
    terminalBox.style.width = '100%';
    terminalBox.style.overflow = 'auto';
    terminalBox.style.whiteSpace = 'pre'; // Preserve spacing and newlines

    button.addEventListener('click', async () => {
        const inputText = inputField.value.trim();

        if (!inputText) {
            alert('Please enter some text!');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/render-pixelated-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input: inputText }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const { renderedText } = await response.json();

            console.log(renderedText);

            // Clear the terminal box
            terminalBox.textContent = '';

            // Sequentially render lines with a fade-in effect
            renderedText.forEach((line, index) => {
                const lineElement = document.createElement('div');
                lineElement.textContent = line; // Set the text directly
                lineElement.style.opacity = '0'; // Start invisible
                terminalBox.appendChild(lineElement);

                // Fade in each line sequentially
                gsap.to(lineElement, {
                    opacity: 1,
                    duration: 0.5,
                    delay: index * 0.3, // Stagger animation
                    ease: 'power3.out',
                });
            });
        } catch (error) {
            console.error('Error fetching pixelated text:', error);
        }
    });

    // Append elements to the container
    container.appendChild(heading);
    container.appendChild(inputField);
    container.appendChild(button);
    container.appendChild(terminalBox);

    // Animate elements using GSAP
    gsap.timeline()
        .to(heading, {
            opacity: 1,
            y: 0, // Move to original position
            duration: 0.8,
            ease: 'power3.out',
        })
        .to(inputField, {
            opacity: 1,
            y: 0, // Move to original position
            duration: 0.8,
            ease: 'power3.out',
        }, '<') // Sync with heading animation
        .to(button, {
            opacity: 1,
            y: 0, // Move to original position
            duration: 0.8,
            ease: 'power3.out',
        }, '<'); // Sync with input field animation
}
