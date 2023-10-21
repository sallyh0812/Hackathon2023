var map;
const markers = [];

// init google map
async function initMap() {
    // 預設顯示的地點：東區
    let location = {
        lat: 24.79299194, // 經度
        lng: 120.9921822 // 緯度
    };
    // 建立地圖
    this.map = new google.maps.Map(
        document.getElementById('map'),
        {
            center: location, // 中心點座標
            zoom: 14, // 1-20，數字愈大，地圖愈細：1是世界地圖，20就會到街道
            /*
              roadmap 顯示默認道路地圖視圖。
              satellite 顯示 Google 地球衛星圖像。
              hybrid 顯示正常和衛星視圖的混合。
              terrain 顯示基於地形信息的物理地圖。
            */
            mapTypeId: 'roadmap'
        });

    //build markers by getting position data from db
    db.collection('buyer')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                if (!doc.exists) {
                    console.log('No such document!');
                } else {
                    data = doc.data();
                    const marker = new google.maps.Marker({
                        position: data.position,
                        title: data.locationName,
                        map: map,
                        id: `marker_${doc.id}`,
                    })
                    markers.push(marker);
                    infoWindow = new google.maps.InfoWindow();

                    // Add a click event listener to the markers
                    markers.forEach(function (marker) {
                        marker.addListener('click', () => {
                            infoWindow.setContent(`${marker.title}`);
                            //console.log(`This is ${marker.id}`);
                            infoWindow.open(map, marker);
                            const markerId = marker.id;

                            // 滾動到相應的餐廳卡片
                            const dataBoxId = `${markerId}`;
                            const dataBox = document.getElementById(dataBoxId);
                            if (dataBox) {
                                dataBox.scrollIntoView({ behavior: 'smooth' });
                            }
                        });
                    });
                }
            });


        });

}


function findMarkerByPlaceId(placeId) {
    const markerId = `marker_${placeId}`;
    console.log(markerId);
    // 使用 Array.find 方法在 markers 數組中查找匹配的標記
    return markers.find(function (marker) {
        return marker.id === markerId;
    });
}
initMap();