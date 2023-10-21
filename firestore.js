var firebaseConfig = {
    apiKey: "AIzaSyB7vD0mWILRt5tTSfT2kIzwfcTfUaKfyUY",
    authDomain: "hackathon-machu.firebaseapp.com",
    projectId: "hackathon-machu",
    storageBucket: "hackathon-machu.appspot.com",
    messagingSenderId: "51829601565",
    appId: "1:51829601565:web:3334d8973225340da71df4"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

//上面的東西直接放進程式最上面
//下面是操作教學

//輸入資料
function send(){
    //collection是集合
    //doc是文件
    //set是建置文件
    //set內塞JSON
    var a_JSON={
        name: "Apple",
        email: "apple@example.com"
    };
    db.collection("test").doc("test2").set(a_JSON);

    //也可以一起寫:
    /*
    db.collection("contact").doc("loren").set({
        name: "John Doe",
        email: "john@example.com"
    });
    */
}

//獲得資料
function get(){
    //路徑:
    var path=db.collection("contact").doc("loren");
    //獲取路徑資料
    var data=path.get();

    //也可以一起寫:
    //var data = db.collection("contact").doc("loren").get();
}

//刪除資料
function del(){
    //路徑:
    var path=db.collection("contact").doc("loren");
    //獲取路徑資料
    var data=path.delete();

    //也可以一起寫:
    //var data = db.collection("contact").doc("loren").delete();
}