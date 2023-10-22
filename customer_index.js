const dataBoxFrame = document.getElementById("data-box-frame");
const infoFrame = document.getElementById("info-frame");
const buyerCollection = db.collection("buyer");
const storage = firebase.storage();
const customerId = 'sally';

// run the function after DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  //const vendorCookie = getCookie("vendorCookie");
  db.collection("customer").doc(customerId).get()
    .then((customerDoc) => {
      if (customerDoc.exists) {
        const customerData = customerDoc.data();
        db.collection("seller").get()
          .then((querySnapshot) => {
            querySnapshot.forEach((vendorDoc) => {
              const vendorData = vendorDoc.data();
              const vendorId = vendorDoc.id;
              var isVendorLiked = customerData.likedVendor.includes(vendorId);
              sortedKeys = Object.keys(vendorData.schedule).sort();
              dataBoxFrame.innerHTML +=
                `<div class="data-box">
          <div class="content-wrapper">
            <div class="content-title">
              <h2>${vendorData.name}</h2>
              <p>評分: ${vendorData.score}/5</p>
              ${(isVendorLiked) ?
                `<button class='unlike-button' unlike-vendor-id=${vendorId}>收回讚</button>`
                  : `<button class='like-button' like-vendor-id=${vendorId}>讚</button>`}
            </div>
            <div class="collapse-button">></div>
          </div>
          <div class="content-container" id="vendor_${vendorId}">
            <div class="content-box-a">
              ${vendorData.vendorDescription}
            </div>
            <div class="intro-container" name="菜單">
              <div class="content-wrapper">
                <div class="content-title">
                  菜單
                </div>
              </div>
              <div class="scroll-x-box" id="menu_pics_${vendorId}"></div>
            </div>

            <div class="intro-container" name="照片">
              <div class="content-wrapper">
                <div class="content-title">
                  照片
                </div>
              </div>
              <div class="scroll-x-box" id="others_pics_${vendorId}"></div>
            </div>
            </div>
            </div>`
              const contentContainer = document.getElementById(`vendor_${vendorId}`)
              for (let i = 0; i < sortedKeys.length; i++) {
                const placeId = vendorData.schedule[sortedKeys[i]];

                contentContainer.innerHTML +=
                  `<div class="intro-container" id="marker_${placeId}" position_tags='${placeId}'>
              <div class="content-wrapper">
                <div class="content-title">
                  <h3>時段${i + 1}</h3>
                  <p>時間: ${sortedKeys[i]}</p>
                  <p id="location_${placeId}">地點: </p>
                </div>
                <div class="content-detail">
                  <p id="address_${placeId}">地址: </p>
                  <p>無障礙程度:
                  <ul>
                    <li>無障礙入口: [是否提供無障礙入口]</li>
                    <li>無障礙停車場: [是否提供無障礙停車場]</li>
                  </ul>
                  </p>
                </div>`
              }
              contentContainer.innerHTML +=
                `<div class="intro-container" name="其他">
            <div class="content-wrapper">
              <div class="content-title">
                <h3>其他</h3>
                <p>聯絡方式: ${vendorData.contact}</p>
                <p>網站連結: <a href="[網站連結]">[網站名稱]</a></p>
              </div>
            </div>
          </div>
        </div>
          </div>`
              console.log(vendorId);

            });

            //塞地址和地點名稱
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
              });

            //點擊展開
            const dataBoxes = document.querySelectorAll(".data-box");
            dataBoxes.forEach((dataBox) => {
              const contentWrapper = dataBox.querySelector(".content-wrapper");

              contentWrapper.addEventListener("click", () => {
                dataBox.classList.toggle("expanded");
              });
            });

            //點擊展開+marker顯示info
            const introContainers = document.querySelectorAll(".intro-container");
            introContainers.forEach((introContainer) => {
              const contentWrapper = introContainer.querySelector(".content-wrapper");

              contentWrapper.addEventListener("click", () => {
                const placeId = introContainer.getAttribute('position_tags');
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
          .catch((error) => {
            console.error("Error getting Firestore data: ", error);
          });

        //把相片塞進去  
        db.collection("seller").get()
          .then((querySnapshot) => {
            querySnapshot.forEach((vendorDoc) => {
              const vendorId = vendorDoc.id;
              const menuFolderRef = storage.ref(`${vendorId}/menu/`);
              const menuContainer = document.getElementById(`menu_pics_${vendorId}`);
              const othersFolderRef = storage.ref(`${vendorId}/others/`);
              const othersContainer = document.getElementById(`others_pics_${vendorId}`);

              menuFolderRef.listAll()
                .then(function (result) {
                  result.items.forEach(function (item) {
                    item.getDownloadURL()
                      .then(function (url) {
                        const img = document.createElement('img');
                        img.src = url;
                        menuContainer.appendChild(img);
                      })
                      .catch(function (error) {
                        console.error("Error getting image download URL:", error);
                      });
                  });
                })
                .catch(function (error) {
                  console.error("Error listing items in the folder:", error);
                });
              othersFolderRef.listAll()
                .then(function (result) {
                  result.items.forEach(function (item) {
                    item.getDownloadURL()
                      .then(function (url) {
                        const img = document.createElement('img');
                        img.src = url;
                        othersContainer.appendChild(img);
                      })
                      .catch(function (error) {
                        console.error("Error getting image download URL:", error);
                      });
                  });
                })
                .catch(function (error) {
                  console.error("Error listing items in the folder:", error);
                });
            });
          });
      }
    })


});

//按讚店家
document.addEventListener("click", function (event) {
  //console.log(event.target);
  if (event.target && event.target.tagName == "BUTTON" && event.target.className.includes("like-button")) {

    //get values from attribute
    const vendorId = event.target.getAttribute("like-vendor-id");
    const customerId = "sally";

    db.collection("seller").doc(vendorId)
      .get().then((sellerDoc) => {
        db.collection("customer").doc(customerId)
          .get().then((customerDoc) => {
            if (sellerDoc.exists && customerDoc.exists) {
              sellerData = sellerDoc.data();
              customerData = customerDoc.data();

              // Modify the data to remove the key-value pair you want to delete
              sellerData.likes += 1;
              customerData.likedVendor.push(vendorId);

              // Update the document in Firestore with the modified data
              db.collection("seller").doc(vendorId).update({ likes: sellerData.likes })
              db.collection("customer").doc(customerId).update({ likedVendor: customerData.likedVendor })
                .then(() => {
                  alert("Send like success");
                  location.reload();
                })
                .catch((error) => {
                  console.error("Error getting Firestore data: ", error);
                  alert("Send like failed, please try again\nError: ", error);
                })
            } else {
              console.log("Document does not exist.");
            }
          })
      })
  }
});

//收回讚
document.addEventListener("click", function (event) {
  //console.log(event.target);
  if (event.target && event.target.tagName == "BUTTON" && event.target.className.includes("unlike-button")) {

    //get values from attribute
    const vendorId = event.target.getAttribute("unlike-vendor-id");
    const customerId = "sally";

    db.collection("seller").doc(vendorId)
      .get().then((sellerDoc) => {
        db.collection("customer").doc(customerId)
          .get().then((customerDoc) => {
            if (sellerDoc.exists && customerDoc.exists) {
              sellerData = sellerDoc.data();
              customerData = customerDoc.data();

              // Modify the data to remove the key-value pair you want to delete
              sellerData.likes -= 1;

              deleteIndex = customerData.likedVendor.indexOf(vendorId);
              if (deleteIndex !== -1) {
                customerData.likedVendor.splice(deleteIndex, 1);
              }

              // Update the document in Firestore with the modified data
              db.collection("seller").doc(vendorId).update({ likes: sellerData.likes })
              db.collection("customer").doc(customerId).update({ likedVendor: customerData.likedVendor })
                .then(() => {
                  alert("Unsend like success");
                  location.reload();
                })
                .catch((error) => {
                  console.error("Error getting Firestore data: ", error);
                  alert("Unsend like failed, please try again\nError: ", error);
                })
            } else {
              console.log("Document does not exist.");
            }
          })
      })
  }
});

