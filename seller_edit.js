const username = localStorage.getItem("vendorCookie");
console.log(username);

const editForm = document.querySelector('.edit-form');

document.addEventListener("DOMContentLoaded", function () {
  if (username) {
    const editInput = document.getElementById("edit-input");
    const seller = db.collection("seller").doc(username);

    seller.get()
      .then((sellerDoc) => {
        if (sellerDoc.exists) {
          sellerData = sellerDoc.data();
          editInput.innerHTML +=
            `<div class="input-box-a">
                  <label for="profile-picture" class="input-label">
                    頭貼：</label>
                  <input type="file" name="profilePicture" multiple="multiple">
                </div>
                <div class="input-box-a">
                  <label for="vendorName" class="input-label">
                    攤販名稱：</label>
                  <input name='vendorName' type="text" 
                  id="vendorName" class="input-text" 
                  value="${sellerData.name}" required />
                </div>
                <div class="input-box-multiline">
                  <label for="vendorDescription" class="input-label">
                    關於攤販：</label>
                  <textarea name='vendorDescription' type="text" 
                  id="vendorDescription" class="input-text-multiline"
                  value="${sellerData.vendorDescription}">${sellerData.vendorDescription}
                  </textarea>
                </div>
                <div class="input-box-a">
                  <label for="vendorContact" class="input-label">
                    聯絡方式：</label>
                  <input name='vendorContact' type="text" 
                  id="vendorContact" class="input-text"
                  value="${sellerData.contact}">
                </div>
                <div class="input-box-a">
                  <label for="menuPicture" class="input-label">
                    菜單：</label>
                  <input type="file" name="menuPicture[]" multiple="multiple">
                </div>
                <div class="input-box-a">
                  <label for="otherPicture" class="input-label">
                    其他照片：</label>
                  <input type="file" name="otherPicture" multiple="multiple">
                </div>`
        } else {
          console.log('Document does not exist.');
        }
      });
  } else {
    alert("Please log in first.");
    window.location.href = "./seller_login.html";
  }

})

editForm.addEventListener('submit', (e) => {
  e.preventDefault(); //Prevent HTML submission

  vendorName = document.getElementById("vendorName").value;
  vendorDescription = document.getElementById("vendorDescription").value;
  contactInfo = document.getElementById("vendorContact").value;

  db.collection("seller").doc(username).update({
    name: vendorName,
    vendorDescription: vendorDescription,
    contact: contactInfo
  })
    .then(() => {
      alert("Edit success.");
      window.location.href = "./seller_profile.html";
    })
    .catch((error) => {
      console.error("Error with setting firestore data: ", error);
      alert("Edit failed, please try again\nError: ", error);
    })

});