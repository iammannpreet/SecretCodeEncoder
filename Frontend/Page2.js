import { gsap } from 'gsap';

export default function renderPage2(container) {
    // Clear the container
    container.innerHTML = '';

    // Create elements
    const heading = document.createElement('h1');
    heading.textContent = 'Welcome to Page 2';
    heading.style.color = 'black';
    heading.style.opacity = '0'; // Start with invisible for animation

    const paragraph = document.createElement('p');
    paragraph.textContent = 'This content is displayed for the second texture.';
    paragraph.style.color = 'black';
    paragraph.style.opacity = '0'; // Start with invisible for animation

    // Append elements to the container
    container.appendChild(heading);
    container.appendChild(paragraph);

    // Animate elements with GSAP
    gsap.timeline()
        .to(heading, {
            opacity: 1,
            y: 0, // Move into place
            duration: 0.8,
            ease: 'power3.out',
        })
        .to(paragraph, {
            opacity: 1,
            y: 0, // Move into place
            duration: 0.8,
            ease: 'power3.out',
        }, '<'); // Start paragraph animation at the same time as heading
}
