//read log in cookie
const username = localStorage.getItem("vendorCookie");
console.log(username);
const storage = firebase.storage();
const storageRef = storage.ref();

document.addEventListener("DOMContentLoaded", function () {
    const profileWrapper = document.getElementById("profile-wrapper");
    if (username) {
        const seller = db.collection("seller").doc(username);
        seller.get()
            .then((sellerDoc) => {
                if (sellerDoc.exists) {
                    sellerData = sellerDoc.data();
                    profileWrapper.innerHTML +=
                        `<div class="main-profile">
            <img class="profile-picture">
            <h2>${sellerData.name}</h2>
            <div class="content-box-a">
                ${sellerData.vendorDescription}
            </div>
        </div>
        <div class="profile-detail">
            <h4>剩餘點數: ${sellerData.point}</h4>
            <h4>評分: ${sellerData.score}/5</h4>
            <h4>聯絡方式: ${sellerData.contact}</h4>
            <div class="contact-info">
                <a href="mailto:sallyh.en11@nycu.edu.tw">
                    <img class="contact-icon" src="./email-icon.png"></a>
                <a href="https://www.facebook.com/sallyhuang0812">
                    <img class="contact-icon" src="./FB-icon.png"></a>
                <a href="https://www.instagram.com/oscar_small_cake/">
                    <img class="contact-icon" src="./IG-icon.png"></a>
                <a href="https://restaurant-1114288.business.site/">
                    <img class="contact-icon" src="./web-icon.png"></a>
            </div>
        </div>`
                    // Get the image URL from Firebase Storage
                    const imageRef = storageRef.child(`${username}/profile_pic.jpg`); // Replace with the correct path to your image
                    const menuFolderRef = storage.ref(`${username}/menu/`);
                    const menuContainer = document.getElementById("menu_pics");
                    const othersFolderRef = storage.ref(`${username}/others/`);
                    const othersContainer = document.getElementById("others_pics");

                    imageRef.getDownloadURL()
                        .then((url) => {
                            // Set the 'src' attribute of the HTML 'img' element to the retrieved URL
                            const imgElement = document.querySelector('.profile-picture');
                            imgElement.src = url;
                        })
                        .catch((error) => {
                            console.error('Error getting image URL:', error);
                        });
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

                } else {
                    console.log('Document does not exist.');
                }
            });
    }else{
        alert("Please log in first.");
        window.location.href = "./seller_login.html";
    }

});

