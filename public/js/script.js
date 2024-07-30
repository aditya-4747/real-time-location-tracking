const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error(error)
        },{
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}

const map = L.map("map").setView([20,80], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: "Aditya Kumar Maddeshiya"
}).addTo(map);

const activeUsers = {};

socket.on("receive-location", (data) => {
    const {id, latitude, longitude} = data;
    if(activeUsers[id]){
        activeUsers[id].setLatLng([latitude,longitude]);
    } else {
        activeUsers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    delete activeUsers[id];
})