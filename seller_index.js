const username = localStorage.getItem("vendorCookie");
console.log(username);

const dataBoxFrame = document.getElementById("data-box-frame");
const infoFrame = document.getElementById("info-frame");
const buyerCollection = db.collection("buyer")

// run the function after DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  //const vendorCookie = getCookie("vendorCookie");
  if (username) {
    db.collection("seller").doc(username).get()
      .then((doc) => {
        if (doc.exists) {
          sellerData = doc.data();
          //console.log(placeData);
          infoFrame.innerHTML +=
            `<p>哈囉，${sellerData.name}</p>
                <p>剩餘點數：${sellerData.point}</p>`;

          db.collection("buyer") // Firestore collection name
            .get()
            .then((querySnapshot) => {
              //every document loop
              querySnapshot.forEach((doc) => {
                const placeData = doc.data();
                const placeId = doc.id;
                sortedKeys = Object.keys(placeData.schedule).sort(); //get map keys
                lat = placeData.position.lat;
                lng = placeData.position.lng;
                /*console.log("Keys in the map:");
                sortedKeys.forEach((key) => {
                    console.log(key);
                });*/

                //新增每個地點的databox
                countKeysWithValue(placeId).then((count) => {
                  const pointNeededTotal = placeData.pointNeeded + count;
                  dataBoxFrame.innerHTML +=
                    `<div class='data-box' id="marker_${placeId}" name='${placeData.locationName}' position_tags='${placeId}'>
                        <div class="content-wrapper">
                            <div class="content-title">
                                <h2>${placeData.locationName}</h2>
                                <p>熱門程度: [熱門程度(9.2/10)]</p>
                            </div>
                            <div class="collapse-button">></div>
                        </div>
                        <div class="content-container">
                            <div class="content-box-a">
                                ${placeData.placeDescription}
                            </div>
                        <div class="picture-container">
                            <!-- picture -->
                        </div>

                        <div class="intro-container">
                            <h2>地點資訊</h2>
                            <p id="address_${placeId}">地址: </p>
                            <p>無障礙程度:
                                <ul>
                                    <li>無障礙入口: [是否提供無障礙入口]</li>
                                    <li>無障礙停車場: [是否提供無障礙停車場]</li>
                                </ul>
                            </p>
                        </div>
                        <!-- 可選的其他主題 -->
                        <div class="intro-container">
                            <h2>時段1</h2>
                            <p>時間: ${sortedKeys[0]}</p>
                            <p>預約點數: ${pointNeededTotal}</p>
                            <p>狀態: ${(placeData.schedule[sortedKeys[0]] == "" && !(sellerData.schedule[sortedKeys[0]])) ?
                      "可預約" : "無法預約"}</p>
                            ${(placeData.schedule[sortedKeys[0]] == "" && !(sellerData.schedule[sortedKeys[0]])) ?
                      `<button class='preserve-button' data-place-id=${placeId} data-time=${sortedKeys[0]}>預約</button>`
                      : ""}
                        </div>

                        <div class="intro-container">
                            <h2>時段2</h2>
                            <p>時間: ${sortedKeys[1]}</p>
                            <p>預約點數: ${pointNeededTotal}</p>
                            <p>狀態: ${(placeData.schedule[sortedKeys[1]] == "" && !(sellerData.schedule[sortedKeys[1]])) ? "可預約" : "無法預約"}</p>
                            ${(placeData.schedule[sortedKeys[1]] == "" && !(sellerData.schedule[sortedKeys[1]])) ?
                      `<button class='preserve-button' data-place-id=${placeId} data-time=${sortedKeys[1]}>預約</button>`
                      : ""}
                        </div>

                        <div class="intro-container">
                            <h2>時段3</h2>
                            <p>時間: ${sortedKeys[2]}</p>
                            <p>預約點數: ${pointNeededTotal}</p>
                            <p>狀態: ${(placeData.schedule[sortedKeys[2]] == "" && !(sellerData.schedule[sortedKeys[2]])) ? "可預約" : "無法預約"}</p>
                            
                            ${(placeData.schedule[sortedKeys[2]] == "" && !(sellerData.schedule[sortedKeys[2]])) ?
                      `<button class='preserve-button' data-place-id=${placeId} data-time=${sortedKeys[2]}>預約</button>`
                      : ""}
                        </div>

                        <div class="intro-container">
                            <h2>注意事項</h2>
                            <p>電話: [商家電話]</p>
                            <p>網站連結: <a href="[網站連結]">[網站名稱]</a></p>
                        </div>
                    </div>`

                  //點擊展開+marker顯示info
                  const dataBoxes = document.querySelectorAll(".data-box");
                  dataBoxes.forEach((dataBox) => {
                    const contentWrapper = dataBox.querySelector(".content-wrapper");

                    contentWrapper.addEventListener("click", () => {
                      dataBox.classList.toggle("expanded");
                      const placeId = dataBox.getAttribute('position_tags');
                      // 根據place_id查找相對應的標記（marker）
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
                })
              });
            })
            .catch((error) => {
              console.error("Error getting Firestore data: ", error);
            });
        }

        //地址
        const geocoder = new google.maps.Geocoder();
        db.collection("buyer").get()
          .then((querySnapshot) => {
            querySnapshot.forEach((placeDoc) => {
              if (placeDoc.exists) {
                placeData = placeDoc.data();
                const placeId = placeDoc.id;
                const lat = placeData.position.lat;
                const lng = placeData.position.lng;
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
              } else {
                console.log("Document does not exist.");
              }
            })
          }

          );
      });
  } else {
    infoFrame.innerHTML +=
      `<p>哈囉，<a href='seller_login.html'>[請先登入]</a></p>
                <p>剩餘點數：<a href='seller_login.html'>[請先登入]</a></p>`;
    //為每個地點創建databox
    db.collection("buyer")
      .get()
      .then((querySnapshot) => {
        //every document loop
        querySnapshot.forEach((doc) => {
          placeData = doc.data();
          const placeId = doc.id;
          sortedKeys = Object.keys(placeData.schedule).sort(); //get map keys
          lat = placeData.position.lat;
          lng = placeData.position.lng;

          //add databox for every doc(place)
          dataBoxFrame.innerHTML +=
            `<div class='data-box' id="marker_${placeId}" name='${placeData.locationName}' position_tags='${placeId}'>
                            <div class="content-wrapper">
                                <div class="content-title">
                                    <h2>${placeData.locationName}</h2>
                                    <p>熱門程度: [熱門程度(9.2/10)]</p>
                                </div>
                                <div class="collapse-button">></div>
                            </div>
                            <div class="content-container">
                                <div class="content-box-a">
                                    ${placeData.placeDescription}
                                </div>
                            <div class="picture-container">
                                <!-- picture -->
                            </div>
    
                            <div class="intro-container">
                                <h2>地點資訊</h2>
                                <p id="address_${placeId}">地址: </p>
                                <p>無障礙程度:
                                    <ul>
                                        <li>無障礙入口: [是否提供無障礙入口]</li>
                                        <li>無障礙停車場: [是否提供無障礙停車場]</li>
                                    </ul>
                                </p>
                            </div>
                            <!-- 可選的其他主題 -->
                            <div class="intro-container">
                                <h2>時段1</h2>
                                <p>時間: ${sortedKeys[0]}</p>
                                <p>預約點數: ${placeData.pointNeeded}</p>
                                <p>狀態: ${(placeData.schedule[sortedKeys[0]]) ?
              "可預約" : "無法預約"}</p>
                                ${(placeData.schedule[sortedKeys[0]]) ?
              `<a href='seller_login.html'><button>預約請先登入</button></a>`
              : ""}
                            </div>
    
                            <div class="intro-container">
                                <h2>時段2</h2>
                                <p>時間: ${sortedKeys[1]}</p>
                                <p>預約點數: ${placeData.pointNeeded}</p>
                                <p>狀態: ${(placeData.schedule[sortedKeys[1]] == "") ? "可預約" : "無法預約"}</p>
                                ${(placeData.schedule[sortedKeys[1]] == "") ?
              `<a href='seller_login.html'><button>預約請先登入</button></a>`
              : ""}
                            </div>
    
                            <div class="intro-container">
                                <h2>時段3</h2>
                                <p>時間: ${sortedKeys[2]}</p>
                                <p>預約點數: ${placeData.pointNeeded}</p>
                                <p>狀態: ${(placeData.schedule[sortedKeys[2]] == "") ? "可預約" : "無法預約"}</p>
                                
                                ${(placeData.schedule[sortedKeys[2]] == "") ?
              `<a href='seller_login.html'><button>預約請先登入</button></a>`
              : ""}
                            </div>
    
                            <div class="intro-container">
                                <h2>注意事項</h2>
                                <p>電話: [商家電話]</p>
                                <p>網站連結: <a href="[網站連結]">[網站名稱]</a></p>
                            </div>
                        </div>`
        });
        //點擊展開+marker顯示info
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
      })
      .catch((error) => {
        console.error("Error getting Firestore data: ", error);
      });
    //插入地址
    const geocoder = new google.maps.Geocoder();
    db.collection("buyer").get()
      .then((querySnapshot) => {
        querySnapshot.forEach((placeDoc) => {
          if (placeDoc.exists) {
            placeData = placeDoc.data();
            const placeId = placeDoc.id;
            const lat = placeData.position.lat;
            const lng = placeData.position.lng;
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
          } else {
            console.log("Document does not exist.");
          }
        })
      }

      );
    // alert("Please log in first.");
    // window.location.href = "./seller_login.html";
  }
});

//點按鈕預約
document.addEventListener("click", function (event) {
  //console.log(event.target);
  if (event.target && event.target.tagName == "BUTTON" && event.target.className.includes("preserve-button")) {

    //get values from attribute
    const placeId = event.target.getAttribute("data-place-id");
    const time = event.target.getAttribute("data-time");

    /*console.log("Place ID:", placeId);
    console.log("Time:", time);*/

    db.collection("buyer").doc(placeId)
      .get().then((placeDoc) => {
        db.collection("seller").doc(username)
          .get().then((sellerDoc) => {
            countKeysWithValue(placeId)
              .then((count) => {
                if (placeDoc.exists && sellerDoc.exists) {
                  placeData = placeDoc.data();

                  pointNeededTotal = placeData.pointNeeded + count;

                  sellerData = sellerDoc.data();
                  sellerPoint = sellerData.point;

                  placeData.schedule[time] = username;
                  sellerData.schedule[time] = placeId;

                  db.collection("buyer").doc(placeId)
                    .update({
                      schedule: placeData.schedule,
                    });
                  db.collection("seller").doc(username)
                    .update({
                      schedule: sellerData.schedule,
                      point: (sellerPoint - pointNeededTotal)
                    })
                    .then(() => {
                      alert("Preserve success");
                      location.reload();
                    })
                    .catch((error) => {
                      console.error("Error getting Firestore data: ", error);
                      alert("Preservation failed, please try again\nError: ", error);
                    })
                } else {
                  console.log("Document does not exist.");
                }
              })

          })
      })

  }
});

function countKeysWithValue(value) {
  return db.collection("seller").doc(username).get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();

        const schedule = data.schedule;
        let count = 0;
        for (const key in schedule) {
          if (schedule[key] == value) {
            count++;
          }
        }
        console.log(`Number of keys with a value of ${value}: ${count}`);
        return count;

      } else {
        console.log('Document not found.');
      }
    })
    .catch((error) => {
      console.error('Error getting document:', error);
    });
}



