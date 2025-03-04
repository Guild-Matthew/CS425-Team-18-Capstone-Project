// Implemented by Guilherme Domingues Cassiano
function filterAccounts() {
    // Get the selected filter type
    const filterType = document.getElementById('filterType').value;

    window.location.href = `/VoidStudentSuper?building=${filterType}`;
}

function changeBuilding() {
    const selectedBuilding = document.getElementById('location-sidebar').value; // Get the selected building
    window.location.href = `/VoidStudentSuper?building=${selectedBuilding}`;
}
