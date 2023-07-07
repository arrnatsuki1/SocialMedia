const profileImageButton = document.getElementById('profile-image-button')
const form = document.getElementById('form-profileimage')
profileImageButton.onclick = function() {
    form.enctype = "multipart/form-data"
    form.submit();
}