//selecting all required elements
document.getElementById('imagebox').classList.add('hide');
document.getElementById('download-btn').classList.add('hide');
const dropArea = document.querySelector(".drag-area"),
dragText = dropArea.querySelector("header"),
button = dropArea.querySelector("button"),
input = dropArea.querySelector("input");
let downbtn = document.getElementById('download-btn');
let img = document.getElementById('imagebox');
let file; //this is a global variable and we'll use it inside multiple functions

button.onclick = ()=>{
input.click(); //if user click on the button then the input also clicked

} 

input.addEventListener("change", function(){
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  
  file = this.files[0];

  dropArea.classList.add("active");
  showFile(); //calling function
});


//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", ()=>{
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one

  file = event.dataTransfer.files[0];
  showFile(); //calling function
});

function showFile(){
  let fileType = file.type; //getting selected file type
  let validExtensions = ["image/jpeg", "image/jpg", "image/png"]; //adding some valid image extensions in array
  if(validExtensions.includes(fileType)){ //if user selected file is an image file
    let fileReader = new FileReader(); //creating new FileReader object
    fileReader.onload = ()=>{
      let fileURL = fileReader.result; //passing user file source in fileURL variable
        // UNCOMMENT THIS BELOW LINE. I GOT AN ERROR WHILE UPLOADING THIS POST SO I COMMENTED IT
      let imgTag = `<img src="${fileURL}" alt="image">`; //creating an img tag and passing user selected file source inside src attribute
      dropArea.innerHTML = imgTag; //adding that created img tag inside dropArea container
    }
    
    fileReader.readAsDataURL(file);
  }else{
    alert("This is not an Image File!");
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
  /*   const formData = new FormData();
    formData.append('file', $('input[type=file]')[0].files[0]);
    var oReq = new XMLHttpRequest();
    oReq.open("POST", "http://127.0.0.1:5000/predict_image", true);
    oReq.responseType = 'blob';
    console.log("Sending file!")
    oReq.onload = function (e) {
        var blob = e.currentTarget.response;
    }
    oReq.send(formData); */
    
}

window.onload = () => {
	$('#send-image').click(() => {
        console.log("Sending file!")
		imagebox = $('#imagebox')
		
			let formData = new FormData();
			formData.append('image' , file);
			$.ajax({
				url: "/api/predict_image", // fix this to your liking
				type:"POST",
				data: formData,
				cache: false,
				processData:false,
				contentType:false,
				error: function(data){
					console.log("upload error" , data);
					console.log(data.getAllResponseHeaders());
				},
				success: function(data){
          document.getElementById('imagebox').classList.remove('hide');
          document.getElementById('send-image').classList.add('hide');
					// alert("hello"); // if it's failing on actual server check your server FIREWALL + SET UP CORS
					bytestring = data['status']
					image = bytestring.split('\'')[1]
					imagebox.attr('src' , 'data:image/jpg;base64,'+image)
          document.getElementById('download-btn').classList.remove('hide');

				}
			});
		
	});
};

downbtn.addEventListener('click',()=>{
  let imgpath = img.getAttribute('src');
  let filename = getfilename(imgpath);

  saveAs(imgpath, filename);

});

function getfilename(str){
  return str.substring(str.lastIndexOf('/')+1);
}