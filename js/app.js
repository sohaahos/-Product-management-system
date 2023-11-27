// == View input in variables ==
let title = document.getElementById("input-title");
let price = document.getElementById("input-price");
let taxes = document.getElementById("input-taxes");
let ads = document.getElementById("input-ads");
let reductions = document.getElementById("input-reductions");
let qty = document.getElementById("input-qty");
let total = document.getElementById("total");
let category = document.getElementById("input-category");
let create = document.getElementById("create");
let form = document.getElementById('form');





let mood = 'create';
let assistant;



let myInputs = document.querySelectorAll("input");
myInputs.forEach(input => {
  input.onfocus = () => {
    input.classList.remove("p-2");
    input.classList.add("p-1.5");
  }

  input.onblur = () => {
    input.classList.remove("p-1.5");
    input.classList.add("p-2");
  }
});



//                                          ==== Data Management ====

let data;
const jsonData = localStorage.getItem("product");

if (jsonData) {
   data = JSON.parse(jsonData);
} else {
    data = [];
}


// == Determine the total  ==

function getTotale(){
    if (price.value != "" && price.value != 0) {
        if (reductions.value == "") {
            reductions.value = 1;
        }
        let value_total = (+price.value )+ ((+taxes.value + +ads.value ) / +reductions.value );
        let dt_nm = value_total.toFixed(2);
        total.innerHTML = "Total : " + dt_nm;
        total.style.backgroundColor = "#35ff03";
        if (reductions.value == 0) {
            total.innerHTML = "error";
        }
    }else{
        total.innerHTML = "Total";
        total.style.backgroundColor = "red";
    }
}


 
 
// == When you press save ==
form.addEventListener('submit',function(event){
    event.preventDefault();
    Swal.fire(
        'Good',
        'Product added',
        'success',
    )
    datapro();
    rem();
    vipro();
    totalProduct();
    btnDe()
    total.innerHTML = "Total";
    total.style.backgroundColor = "red";
    let search = document.getElementById('search');
    search.value =''
});





// == Save Products in localStorage ==
function datapro() {

    let value_total = (+price.value ) + ((+taxes.value + +ads.value ) / +reductions.value);
    let dt_nm = value_total.toFixed(2);
    
    let nep = {
        title:title.value ,
        price:price.value ,
        taxes:taxes.value ,
        ads:ads.value ,
        reductions:reductions.value ,
        qty:qty.value ,
        total:dt_nm,
        category:category.value ,
    }
    
    if (mood === 'create') {
        if (nep.qty > 1) {
            for (let i = 0; i < nep.qty; i++) {
                data.push(nep); 
            }
        }else{
            data.push(nep); 
        }   
    }else{
        data[assistant]=nep
        mood = 'create'
        create.value = 'Create';
        qty.disabled = false;
    }
    
    localStorage.setItem("product", JSON.stringify(data));
}




// == remove input ==
function rem(){
    title.value = "";
    price.value = "";
    taxes.value = "";
    ads.value = "";
    reductions.value = "";
    qty.value = "";
    category.value = "";
}




// == view product ==
function vipro(){
    let table_pro = '' ;
    for (let i = 0; i < data.length; i++) {
        table_pro += `
        <tr>
            <th scope="row">${i+1}</th>
            <td>${data[i].title}</td>
            <td>${data[i].price}</td>
            <td>${data[i].taxes}</td>
            <td>${data[i].ads}</td>
            <td>${data[i].reductions}%</td>
            <td>${data[i].total}</td>
            <td>${data[i].category}</td>
            <td><i onclick = "update(${i})" class="fa-solid fa-pen-to-square"></i></td>
            <td><i onclick = "delet(${i})" class="fa-solid fa-trash-can"></i></td>
        </tr>          
        `;
    }
    document.querySelector("tbody").innerHTML = table_pro;
}
vipro();




// == View Number of Products ==
function totalProduct() {  
    document.getElementById("btn_all").innerHTML = `Total Products (${data.length})`
}
totalProduct()




// == Show the throw button ==
function btnDe(){  
let btnD = document.getElementById("btnDelet");
if (data.length > 0) {
    btnD.innerHTML = 
    '<button id="btnd" onclick="deletAll()" class="btn p-0" style="width: 100%; margin-left: 5px;">delet all</button>'      
}else{
    btnD.innerHTML = ""
} 
}
btnDe()




// == delet product ==
function delet(i) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
            data.splice(i,1);
            localStorage.product = JSON.stringify(data);
            vipro();
            btnDe();
            totalProduct();  
        }
    })
    
}
function deletAll() { 
    Swal.fire({
        title: 'Are you sure?',
        text: "Throw out all products!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
        )
        data.splice(0);
        localStorage.clear();
        vipro();
        totalProduct();
        }
    }) 
    
}




// == update
function update(i) {  
    title.value = data[i].title;
    price.value = data[i].price;
    taxes.value = data[i].taxes;
    ads.value = data[i].ads;
    reductions.value = data[i].reductions;
    getTotale();
    qty.disabled = true;
    category.value = data[i].category;
    create.value = 'Update';
    mood = 'update';
    assistant = i
    scroll({
        top:0,
        behavior:'smooth'
    })
}



// == search ==
let searchpro = 'title';
function search(id){  
    let search = document.getElementById('search')
    if (id == 'btn_title') {
        searchpro = 'title'
        search.placeholder = 'Search by title'
    }else{
        searchpro = 'category'; 
        search.placeholder = 'Search by category'
    }
    search.focus()
    search.value = ''
    vipro()
}


let table_pro ;
function searchProduct(value) { 
    let table_pro = '';
    for (let i = 0; i < data.length; i++) { 
        if (searchpro == 'title') {
            if (data[i].title.toUpperCase().includes(value.toUpperCase())){  
                table_pro += `
                <tr>
                    <th scope="row">${i+1}</th>
                    <td>${data[i].title}</td>
                    <td>${data[i].price}</td>
                    <td>${data[i].taxes}</td>
                    <td>${data[i].ads}</td>
                    <td>${data[i].reductions}%</td>
                    <td>${data[i].total}</td>
                    <td>${data[i].category}</td>
                    <td><i onclick = "update(${i})"  class="fa-solid fa-pen-to-square"></i></td>
                    <td><i onclick = "delet(${i}) ; onclickNow();" class="fa-solid fa-trash-can"></i></td>
                </tr>`;
                
            }
        }else{
            if (data[i].category.toUpperCase().includes(value.toUpperCase())) {
                table_pro += `
                <tr>
                    <th scope="row">${i+1}</th>
                    <td>${data[i].title}</td>
                    <td>${data[i].price}</td>
                    <td>${data[i].taxes}</td>
                    <td>${data[i].ads}</td>
                    <td>${data[i].reductions}%</td>
                    <td>${data[i].total}</td>
                    <td>${data[i].category}</td>
                    <td><i onclick = "update(${i})" class="fa-solid fa-pen-to-square"></i></td>
                    <td><i onclick="delet(${i}) ; onclickNow();" class="fa-solid fa-trash-can"></i></td>
                </tr>`;
            }
        }  
    } 
    document.querySelector("tbody").innerHTML = table_pro;
}




window.onload = ()=>{
    scroll({
        top:1,
    })
}



















































// function btnSe(val){  
//     let b = document.getElementById("btnDelet");
//     if (table_pro != '') {
//         b.innerHTML = 
//         '<button id="btnd" class="btn p-0" style="width: 100%; margin-left: 5px;">delet al</button>'
//     }else{
//         b.innerHTML = ""
//     }
//     for (let i = 0; i < data.length; i++) { 
//         if (searchpro == 'title') {
//             if (data[i].title.toUpperCase().includes(val.toUpperCase())){  
//                 b.addEventListener('click',()=>{
//                     data.splice(i,1)
//                     localStorage.setItem("product", JSON.stringify(data));
//                     document.querySelector("tbody").innerHTML = '';
//                     vipro();;
//                 })
//             }
//         }else{
//             if (data[i].category.toUpperCase().includes(val.toUpperCase())) {
//                 b.addEventListener('click',()=>{
//                     data.splice(i,1)
//                     localStorage.setItem("product", JSON.stringify(data));
//                     document.querySelector("tbody").innerHTML = '';
//                     vipro();
//                 })
//             }  
//         } 
//     }                   
// } 


