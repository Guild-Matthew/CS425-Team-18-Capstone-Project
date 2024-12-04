function initMap() {
    const restrictedBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(39.537064704469685, -119.81803893571075),  // Southwest corner of NYC
        new google.maps.LatLng(39.55024426280125, -119.81330216925673)   // Northeast corner of NYC
    );

    const mapStyles = [
        {
            featureType: "all",
            elementType: "labels",
            stylers: [{ visibility: "off" }]  // Hides all labels
        },
    ];


    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.54200731395531, lng: - 119.81499098680625 },
        zoom: 17,
        minZoom: 15,
        maxZoom: 20,
        restriction: {
            latLngBounds: restrictedBounds,
            strictBounds: false,
        },
        styles: mapStyles 
    });

    fetch('/api/buildings')
        .then(response => response.json())
        .then(data => {
            // Add markers dynamically from the fetched data
            data.forEach(({ buildingCode, latitude, longitude, itemCount, claimedCount}) => {
                const marker = new google.maps.Marker({
                    position: { lat: latitude, lng: longitude },
                    map,
                    title: `Building ${buildingCode}\nLost Items: ${itemCount}\nClaimed Items: ${claimedCount}`, 
                });

                // Add a click listener for each marker
                marker.addListener('click', function () {
                    const building = encodeURIComponent(buildingCode);  // Safely encode the title for the URL
                    window.location.href = `/L&F?building=${building}`;
                });
            });
        })
        .catch(error => console.error('Error fetching building data:', error));
}

window.onload = function () {
    initMap();
};

