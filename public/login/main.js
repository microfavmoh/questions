request("../eye-open.svg")
let password_shown = false;
let password_eye = document.querySelector(".show-password")
let password = document.querySelector(".password");
let password_feild = password.parentNode;
let inputs = document.querySelectorAll("input");
let error = document.querySelector(".error");
document.addEventListener("keyup", keyboard_manager);
password.addEventListener("keyup", password_checker);
password.addEventListener("focus", password_checker);
password.addEventListener("click", show_password);
password.removeEventListener("click", show_password);
password.addEventListener("focusout", function () {
    this.parentNode.style.border = "2px solid #808080";
});
function keyboard_manager(event) {
    event.preventDefault();
    if (event.key == "Enter") {
        var id = document.activeElement.id;
        if (id) {
            document.getElementById(`${(id > 2)? 1:+(id)+1}`).focus();
        }
    }
}
function password_checker() {
    if (password.value.length < 8) {
        password_feild.style.border = "2px solid #FF6347";
        return false;
    }
    else {
        password_feild.style.border = "2px solid #4169E1";
        return true;
    }
}
function show_password(){
    password_shown = !password_shown;
    if (password_shown) {
        password.type = "text";
        password_eye.src = "../eye-open.svg";
    }
    else {
        password.type = "password";
        password_eye.src = "../eye-close.svg";
    }
}
function submit() {
    var can_submit = true;
    if (!inputs[0].value && !inputs[1].value) {
        inputs[0].style.border = "2px solid #FF6347";
        inputs[1].style.border = "2px solid #FF6347";
        setTimeout(function () {
            inputs[0].style.border = "2px solid #808080";
            inputs[1].style.border = "2px solid #808080";
        }, 150);
        can_submit = false;
    }
    if (password.value.length < 8) {
        password_feild.style.border = "2px solid #FF6347";
        setTimeout(function () {
            password_feild.style.border = "2px solid #808080";
        }, 150);
        can_submit = false;
    }
    if (can_submit) {
        fetch(window.location.href, {
            method: "POST",
            body: JSON.stringify({
                phonenumber: inputs[0].value,
                email: inputs[1].value,
                password: password.value 
            })
        }).then((response) => {
            if (response.status == 200) {
                window.location.href = "/";
            }
            else if (response.status == 400) {
                response.text().then((body)=> {
                    error.innerHTML = body;
                });
            }
        });
    }
}