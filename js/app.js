
function navigate(page){
  document.getElementById("app").innerHTML = pages[page] || "<h2>404</h2>";
}
window.navigate = navigate;

document.addEventListener("DOMContentLoaded", ()=>{
  navigate("home");
});
