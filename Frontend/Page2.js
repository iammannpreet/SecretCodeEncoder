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
    heading.style.transform = 'translateY(-50px)';
    heading.style.position = 'relative';

    // Create input field
    const inputField = document.createElement('input');
    inputField.id = 'input';
    inputField.type = 'text';
    inputField.placeholder = 'Enter your word here...';
    inputField.style.padding = '10px';
    inputField.style.fontSize = '16px';
    inputField.style.width = '80%';
    inputField.style.marginTop = '20px';
    inputField.style.border = '1px solid white';
    inputField.style.borderRadius = '4px';
    inputField.style.backgroundColor = 'transparent';
    inputField.style.color = 'white';
    inputField.style.caretColor = 'white';
    inputField.style.opacity = '0';
    inputField.style.transform = 'translateY(-50px)';
    inputField.style.position = 'relative';
    inputField.style.zIndex = '10';
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
    button.style.opacity = '0';
    button.style.transform = 'translateY(-50px)';
    button.style.position = 'relative';
    button.style.zIndex = '10';
    button.style.pointerEvents = 'auto';

    // Create notification container
    const notificationBox = document.createElement('div');
    notificationBox.style.backgroundColor = '#222';
    notificationBox.style.color = 'white';
    notificationBox.style.fontFamily = 'Arial, sans-serif';
    notificationBox.style.padding = '20px';
    notificationBox.style.marginTop = '20px';
    notificationBox.style.borderRadius = '8px';
    notificationBox.style.border = '1px solid #555';
    notificationBox.style.display = 'none'; // Initially hidden

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

            if (response.ok) {
                const { id } = await response.json(); // Expecting an `id` in the response
                console.log('Secret message created with ID:', id);

                // Show success message
                notificationBox.textContent = `Your secret message was created successfully! The ID is: ${id}`;
                notificationBox.style.display = 'block';
                gsap.fromTo(notificationBox, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power3.out' });
            } else {
                console.log('Error creating secret message.');
                notificationBox.textContent = 'An error occurred. Unable to create secret message.';
                notificationBox.style.display = 'block';
                notificationBox.style.color = 'red';
                gsap.fromTo(notificationBox, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power3.out' });
            }
        } catch (error) {
            console.error('Error creating secret message:', error);

            // Handle unexpected errors
            notificationBox.textContent = 'An error occurred. Please try again later.';
            notificationBox.style.display = 'block';
            notificationBox.style.color = 'red';
            gsap.fromTo(notificationBox, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power3.out' });
        }
    });

    // Append elements to the container
    container.appendChild(heading);
    container.appendChild(inputField);
    container.appendChild(button);
    container.appendChild(notificationBox);

    gsap.timeline()
        .to(heading, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .to(inputField, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '<')
        .to(button, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '<');
}
