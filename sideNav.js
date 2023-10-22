const sideNav = document.getElementById("mySidenav")

document.addEventListener("DOMContentLoaded", function () {
    sideNav.innerHTML +=
        `<a class="button is-black" onclick="homepage()">Back</a>
        <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
    <a href="seller_index.html">Home</a>
    ${!username ?
            "<a href='seller_login.html'>Log in</a>" :
            "<a href='seller_profile.html'>My Profile</a><a href='seller_schedule.html'>My Schedule</a><a onclick='logout()'>Log out</a>"
        }
    <a href="#">Contact</a>`
});

/*打開側欄，修改側欄寬度，主體左跨度、背景透明度*/
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}
/*關閉側欄，恢復原始側欄寬度，主體左跨度、背景透明度*/
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
}

function logout() {
    localStorage.clear();
    alert("Log out success.");
    window.location.href = "./seller_login.html";
}

function homepage() {
    localStorage.clear();
    window.location.href = 'https://louischang0126.github.io';
}