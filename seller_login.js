const username = localStorage.getItem("vendorCookie");
console.log(username);
const logInForm = document.querySelector('.login-form');

function setCookie(name, value, path) {
    // Calculate the expiration date
    const date = new Date();
    date.setTime(date.getTime() + (3 * 24 * 60 * 60 * 1000)); // set three days as default

    // Create the Cookie string with the provided name, value, and expiration date
    const cookieString = `${name}=${value};expires=${date.toUTCString()};path=${path}`;

    // Set the Cookie in the document
    document.Cookie = cookieString;
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.Cookie.split(';');
    console.log(ca);
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        //console.log(c);
        if (c.indexOf(name) == 0) {
            console.log("Cookie= " + c.substring(name.length, c.length));
            return (c.substring(name.length, c.length));
        }
    }
    console.log("");
    return ("");
}

function checkCookie() {
    let user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}

logInForm.addEventListener('submit', (e) => {
    e.preventDefault(); //Prevent HTML submission
    const account = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    db.collection("seller")
        .get()
        .then((querySnapShot) => {
            var check = false;
            querySnapShot.forEach((doc) => {
                id = doc.id;
                vendor = doc.data();
                if (account == id && password == vendor.password) {
                    check = true;
                    // setCookie("vendorCookie", username, "./seller_index.html");
                    // console.log(document.Cookie);
                    localStorage.setItem("vendorCookie", `${account}`);
                    alert(`Log in success\nWelcome ${vendor.name}`);
                    window.location.href = "./seller_index.html";
                }
            })
            if (!check) {
                alert("Account not found or wrong password");
                window.location.href = "./seller_login.html";
            }
        })

});

