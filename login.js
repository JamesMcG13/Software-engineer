//login function




var accounts = [
    {
        email: "foo",
        password: "bar"
    }
]

function loginUser() {//needs to be changed so that password hash is created client side and hash checked serverside.
    var email = document.getElementById("email").value
    var password = document.getElementById("pwd").value
    

    for(i=0; i<accounts.length; i++){
        if(email==accounts[i].email&&password==accounts[i].password){//if username and password in objPeople, redirect to index.html
            console.log("you have logged in")
            window.location.href = "http://localhost:3000/index.html";
        }else{
            console.log("incorrect details")
        }``
    }
}