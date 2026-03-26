// project-folder/controls.js

// Flap dragon on spacebar or canvas click
export function setupControls(dragonObj, canvas) {
    // Keyboard flap
    window.addEventListener('keydown', e => {
        if (e.code === 'Space') {
            dragonObj.velocity = dragonObj.lift;
        }
    });

    // Mouse / tap flap
    canvas.addEventListener('click', () => {
        dragonObj.velocity = dragonObj.lift;
    });
}