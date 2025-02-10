//Matthew Guild
function filterAccounts() {
    // Get the selected filter type
    const filterType = document.getElementById('filterType').value;

    window.location.href = `/VoidStudent?filterType=${filterType}`;
}

