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

    // Redirect to the remove_item page with the selected building as a query parameter
    window.location.href = `/editBuilding?building=${selectedBuilding}`;

}