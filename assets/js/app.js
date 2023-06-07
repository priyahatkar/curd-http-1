const cl = console.log;

const postContainer = document.getElementById('postContainer');

const postForm = document.getElementById('postForm');
const titleControl = document.getElementById('title');
const contentControl = document.getElementById('content');
const submitBtn =document.getElementById('submitBtn');
const updateBtn =document.getElementById('updateBtn');

// 1 create one object / inst using XMLHttpRequest.

// some methods
// 1 GET
// 2 POST
// 3 PATCH
// 1 PUT
// 1 DELETE
let baseUrl = `https://jsonplaceholder.typicode.com`;

// cl(baseUrl)
let postUrl =`${baseUrl}/posts`;
// cl(postUrl)
let userUrl =`${baseUrl}/users`;

let postArray = [];

const templating =(arr)=>{
    let result = "";

    arr.forEach(ele =>{
        result += `
            <div class="card mb-4" id="${ele.id}">
                <div class="card-header">
                    <h2>${ele.title}</h2>
                </div>
                <div class="card-body">
                    <p>${ele.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-info" onclick="onEditBtn(this)">Edit</button>
                    <button class="btn btn-danger" onclick="onDeleteBtn(this)">Delete</button>
                </div>
            </div>
        `
    })
    postContainer.innerHTML=result;
}
templating(postArray)



// let xhr = new XMLHttpRequest();


// 2 configuration API

// xhr.open(`GET`, postUrl, true);

// xhr.onload = function(){
//     // cl(xhr.status)
//     if(xhr.status === 200 || xhr.status === 201){
//     postArray = JSON.parse(xhr.response)
//     cl(postArray)
//     templating(postArray)
//     }else{
//         alert("something went wrong")
//     }
// }

// xhr.send();
const makeApiCall =(method, apiUrl, body) =>{

    let xhr = new XMLHttpRequest();
    xhr.open(method, apiUrl);

    xhr.onload = function() {
        if(xhr.status === 200 || xhr.status === 201){
            if(method === 'GET'){
                cl(xhr.readyState)
                postArray= JSON.parse(xhr.response);
                if(Array.isArray(postArray)){
                    templating(postArray)
            }else{
                cl(postArray)
                titleControl.value=postArray.title;
                contentControl.value=postArray.body;
            }
        }else if(method === 'POST'){
            cl(xhr.response)
            cl(body)
            let obj = {
                ... JSON.parse(body),
                ... JSON.parse(xhr.response)
            }
            postArray.push(obj);
            templating(postArray);
        }else if(method === "PATCH"){
            cl(xhr.response)
            cl(body)
            let res = JSON.parse(xhr.response);
            let id= res.id;
            let card = [...document.getElementById(id).children];
            cl(card)
            card[0].innerHTML = `<h3>${JSON.parse(body).title}</h3>`;
            card[1].innerHTML = `<p>${JSON.parse(body).body}</p>`
        }else if(method === 'DELETE'){
            let deleteId = localStorage.getItem("deleteId");

            localStorage.removeItem('deleteId');

            document.getElementById(deleteId).remove();
        }
    }else{
        alert('something went wrong while fetching data')
    }
}
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer Take token localstorage, which we get when user login')
    xhr.send(body)
}

makeApiCall('GET',`${postUrl}`)

const onPostSubmit = (eve) => {
    eve.preventDefault();
    // cl("clicked")

    let postObj ={
    title : titleControl.value,
    body : contentControl.value.trim(),
    userId : Math.ceil(Math.random() * 10)
    }
    makeApiCall("post", postUrl, JSON.stringify(postObj))
    eve.target.reset();
}

const onEditBtn = (ele)=>{
    let editId = ele.closest(".card").id;
    let editUrl =`${baseUrl}/posts/${editId}`;
    localStorage.setItem("editId", editId);
    updateBtn.classList.remove('d-none');
    submitBtn.classList.add('d-none');
    makeApiCall("GET", editUrl)
}

const onDeleteBtn = (ele)=>{
    cl(ele)
    let deleteId = ele.closest('.card').id;
    localStorage.setItem("deleteId", deleteId)
    let deleteUrl = `${baseUrl}/posts/${deleteId}`
    makeApiCall("DELETE", deleteUrl)
}

const onUpdate = () => {
    let UpdateId = localStorage.getItem("editId");
    let UpdateUrl = `${baseUrl}/posts/${UpdateId}`
    cl(UpdateUrl)
    let obj ={
        title : titleControl.value,
        body : contentControl.value
    }
    cl(obj)

    makeApiCall("PATCH",UpdateUrl,JSON.stringify(obj))
    submitBtn.classList.remove('d-none');
    updateBtn.classList.add('d-none');
    postForm.reset();
}

postForm.addEventListener("submit", onPostSubmit);

updateBtn.addEventListener("click", onUpdate)