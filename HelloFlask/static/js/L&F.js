<script>
    function filterItems() {
    // Get the selected filter type
    const filterType = document.getElementById('filterType').value;

    // Redirect to the L&F page with the filterType as a query parameter
    window.location.href = `/L&F?filterType=${filterType}`;
}
</script>

