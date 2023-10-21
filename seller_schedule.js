//read cookie
const username = localStorage.getItem("vendorCookie");
console.log(username);

document.addEventListener("DOMContentLoaded", function () {
    //const vendorCookie = getCookie("vendorCookie");
    const dataBoxFrame = document.getElementById("data-box-frame");
    const infoFrame = document.getElementById("info-frame");

    const seller = db.collection("seller").doc(username);

    seller.get()
        .then((doc) => {
            if (doc.exists) {
                sellerData = doc.data();
                sortedKeys = Object.keys(sellerData.schedule).sort(); //get map keys
                //console.log(sortedKeys.length);
                infoFrame.innerHTML +=
                    `<p>${sellerData.name}'s schedule</p>`
                for (let i = 0; i < sortedKeys.length; i++) {
                    const placeId = sellerData.schedule[sortedKeys[i]]
                    dataBoxFrame.innerHTML +=
                        `<div class="data-box" id="marker_${sellerData.schedule[sortedKeys[i]]}" position_tags="${sellerData.schedule[sortedKeys[i]]}">
                <div class="content-wrapper">
                    <div class="content-title">
                        時段${i + 1}
                        <div class="content-sub-title">時間: ${sortedKeys[i]}</div>
                        <div class="content-sub-title" id="location_${placeId}">地點: </div>
                        <button class="submit-button delete-button" 
                        delete-place-id=${sellerData.schedule[sortedKeys[i]]} delete-time=${sortedKeys[i]}>取消此排程</button>
                    </div>
                    <div class="collapse-button">></div>
                </div>
                <div class="content-container">
                    <div class="picture-container">
                    </div>
                    <div class="intro-container">
                        <h2>地點資訊</h2>
                        <p id="address_${sellerData.schedule[sortedKeys[i]]}">地址: </p>
                        <p>無障礙程度:
                        <ul>
                            <li>無障礙入口: [是否提供無障礙入口]</li>
                            <li>無障礙停車場: [是否提供無障礙停車場]</li>
                        </ul>
                        </p>
                    </div>
                    <!-- 可選的其他主題 -->
                    <div class="intro-container">
                        <h2>注意事項</h2>
                        <p></p>
                    </div>
                </div>
                        </div>`
                }
                db.collection("buyer").get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((placeDoc) => {
                            if (placeDoc.exists) {
                                placeData = placeDoc.data();
                                const placeId = placeDoc.id;
                                const lat = placeData.position.lat;
                                const lng = placeData.position.lng;
                                const geocoder = new google.maps.Geocoder();
                                geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                                    if (status === 'OK') {
                                        if (results[0]) {
                                            const addressResult = results[0].formatted_address;
                                            const address_p = document.querySelectorAll(`#address_${placeId}`);
                                            //console.log(address_p.length)
                                            for (let i = 0; i < address_p.length; i++) {
                                                address_p[i].innerHTML += addressResult;
                                            }
                                        } else {
                                            console.log('No results found');
                                        }
                                    } else {
                                        console.log('Geocoder failed: ' + status);
                                    }
                                });
                                const location_p = document.querySelectorAll(`#location_${placeId}`)
                                for (let i = 0; i < location_p.length; i++) {
                                    location_p[i].innerHTML += placeData.locationName;
                                }
                            } else {
                                console.log("Document does not exist.");
                            }
                        })
                    }

                    );
                //點擊展開並顯示marker窗口
                const dataBoxes = document.querySelectorAll(".data-box");
                dataBoxes.forEach((dataBox) => {
                    const contentWrapper = dataBox.querySelector(".content-wrapper");

                    contentWrapper.addEventListener("click", () => {
                        dataBox.classList.toggle("expanded");
                        const placeId = dataBox.getAttribute('position_tags');
                        const marker = findMarkerByPlaceId(placeId);
                        console.log(marker);
                        // 顯示標記（marker）
                        if (marker || infoWindow) {
                            // 關閉之前打開的信息窗口
                            markers.forEach(() => {
                                infoWindow.close();
                            });
                            // 打開當前標記的信息窗口
                            infoWindow.setContent(`${marker.title}`);
                            infoWindow.open(map, marker);
                        }
                    });
                });
            } else {
                console.log('Document does not exist.');
            }
        });
})

//點擊按鈕刪除預約行程
document.addEventListener("click", function (event) {
    //console.log(event.target);
    if (event.target && event.target.tagName == "BUTTON" && event.target.className.includes("delete-button")) {
        //get values from attribute
        const placeId = event.target.getAttribute("delete-place-id");
        const time = event.target.getAttribute("delete-time");

        // Get the document data
        db.collection("buyer").doc(placeId)
            .get().then((placeDoc) => {
                db.collection("seller").doc(username)
                    .get().then((sellerDoc) => {
                        if (placeDoc.exists && sellerDoc.exists) {

                            sellerData = sellerDoc.data();
                            placeData = placeDoc.data();

                            // Modify the data to remove the key-value pair you want to delete
                            delete sellerData.schedule[time];
                            placeData.schedule[time] = "";

                            // Update the document in Firestore with the modified data
                            db.collection("seller").doc(username).update({ schedule: sellerData.schedule })
                            db.collection("buyer").doc(placeId).update({ schedule: placeData.schedule })
                                .then(() => {
                                    console.log("Key-value pair updated successfully.");
                                    alert("delete success");
                                    location.reload();
                                })
                                .catch((error) => {
                                    console.error("Error updating document: ", error);
                                    alert("delete failed\nError updating document: ", error);
                                    location.reload();
                                });

                        } else {
                            console.log("Document does not exist.");
                        }
                    })
            })
            .catch((error) => {
                console.error("Error getting document: ", error);
            });
    }
});

