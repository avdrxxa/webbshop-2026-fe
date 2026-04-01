let searchBar= document.querySelector('.search-bar')
let filterBtn= document.querySelector('.flex div img')
let filterForm= document.querySelector('.filter-form')
let submitForm= document.querySelector('.filter-form .submit')

filterBtn.addEventListener('click', () => {
    filterForm.classList.toggle('active');
});