// Implemented by Guilherme Domingues Cassiano
function toggleImage(element) {
    const imageContainer = element.querySelector('.image-container');
    if (imageContainer.style.display === 'none') {
        imageContainer.style.display = 'block';
    } else {
        imageContainer.style.display = 'none';
    }
}

function changeBuilding() {
    const selectedBuilding = document.getElementById('location-sidebar').value; // Get the selected building
    const selectedFloor = document.getElementById('floor-sidebar').value;
    window.location.href = `/editFloor?building=${selectedBuilding}&floor=${selectedFloor}`;
}

function changeFloor() {
    const selectedBuilding = document.getElementById('location-sidebar').value; // Get the selected building
    const selectedFloor = document.getElementById('floor-sidebar').value; // Get the selected floor
    window.location.href = `/editFloor?building=${selectedBuilding}&floor=${selectedFloor}`;
}