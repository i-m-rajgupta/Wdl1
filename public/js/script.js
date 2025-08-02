// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

    let isClicked = false;
    const taxSwitch = document.getElementById("switchCheckReverse");
    taxSwitch.addEventListener("click",()=>{
      let prices = document.getElementsByClassName("price");
      for(let i=0 ; i < allListings.length ; i++){
      if(!isClicked){
        let taxedPrice = allListings[i].price + (0.18 * allListings[i].price);
        prices[i].innerHTML = taxedPrice.toLocaleString("en-IN") ;
      } else {
        prices[i].innerHTML = allListings[i].price.toLocaleString("en-IN") ;
      }
    }
    if(!isClicked){
   isClicked = true;
    } else {
  isClicked = false;
    }
    })