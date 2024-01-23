console.log('inside js')
const input = document.getElementById('header');
const output = document.getElementById('output');

function printInput(){
  //output.innerHTML = input.value;
  window.location.assign("http://www.google.com.br/search?q="+input.value);
}
function Redirect(){
  //output.innerHTML = input.value;
  window.location.assign("./enviar.html");
}

window.onload = function() {
    input.addEventListener("keyup", function(event) {

            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                // Cancel the default action, if needed
                event.preventDefault();
                // Trigger the button element with a click
                document.getElementById("button2").click();
            }
    });
}