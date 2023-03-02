let panel=document.getElementsById('loginform');

panel.addEventListener("click", expand());

function expand(){
  panel.style.width="300";
  panel.style.height="300";
  panel.style.fontSize="28pt";
}