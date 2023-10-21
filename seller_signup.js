const signUpForm = document.querySelector('.signup-form');
const username = localStorage.getItem("vendorCookie");

signUpForm.addEventListener('submit', (e) => {
    e.preventDefault(); //Prevent HTML submission

    password = document.getElementById("password").value;
    passwordCheck = document.getElementById("passwordCheck").value;

    if (password == passwordCheck) {
        const account = document.getElementById("account").value;
        vendorName = document.getElementById("vendorName").value;
        vendorDescription = document.getElementById("vendorDescription").value;
        contactInfo = document.getElementById("vendorContact").value;


        const storageRef = firebase.storage().ref();
        
        const profilePicInput = document.getElementById("profile_pic");
        const profilePicFile = profilePicInput.files[0];
        
        const menuPicsInput = document.getElementById("menu_pics");

        const othersPicsInput = document.getElementById("others_pics");

        for (let i = 0; i < menuPicsInput.files.length; i++) {
            const menuPicsFile = menuPicsInput.files[i];
            if (menuPicsFile) {
                const menuPicsRef = storageRef.child(`${account}/menu/` + menuPicsFile.name);

                menuPicsRef.put(menuPicsFile).then((snapshot) => {
                    console.log("Image uploaded!");
                });
            } else {
                console.log("No file selected.");
            }
        }

        for (let i = 0; i < othersPicsInput.files.length; i++) {
            const othersPicsFile = othersPicsInput.files[i];
            if (othersPicsFile) {
                const othersPicsRef = storageRef.child(`${account}/others/` + othersPicsFile.name);

                othersPicsRef.put(othersPicsFile).then((snapshot) => {
                    console.log("Image uploaded!");
                });
            } else {
                console.log("No file selected.");
            }
        }

        if (profilePicFile) {
            const profilePicRef = storageRef.child(`${account}/profile_pic.jpg`);
            profilePicRef.put(profilePicFile).then((snapshot) => {
                console.log("Image uploaded!");
            });
        } else {
            console.log("No file selected.");
        }

        db.collection("seller").doc(account).get()
            .then((sellerDoc) => {
                if (sellerDoc.exists) {
                    alert("Invalid account")
                } else {
                    db.collection("seller").doc(account).set({
                        password: password,
                        name: vendorName,
                        vendorDescription: vendorDescription,
                        schedule: {},
                        point: 100,
                        score: 4,
                        contact: contactInfo
                    })
                        .then(() => {
                            alert("Sign up success.\nPlease log in.");
                            //go to log in page after user click confirm
                            window.location.href = "./seller_login.html";
                        })
                        .catch((error) => {
                            console.error("Error with setting firestore data: ", error);
                            alert("Sign up failed, please try again\nError: ", error);
                        })
                }
            })

    } else {
        alert("password check didn't match");
    }

});