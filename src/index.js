import {getImages} from "./js/pixabeyAPI.js";

const refs = {
    form: document.querySelector(`.search-form`),
    loadMoreBt: document.querySelector(`.load-more`),
    galleryCont: document.querySelector(`.gallery`),
}

let preFindValue = ``;
let countPage = 1;


refs.form.addEventListener(`submit`, onSubmitFindForm);






function onSubmitFindForm(event) {
    event.preventDefault();
    const value = event.currentTarget.elements.searchQuery.value;
    if(value === preFindValue) {
        searchData(value, countPage);
        countPage += 1;
    } else {
        countPage = 1;
        searchData(value, countPage);
    }
    preFindValue = value;
}






async function searchData(searchWords, countPage) {
 try{
    renderGallery(await getImages(searchWords, countPage));
 }   catch(error) {
    console.log(error);
    console.log(`Sorry, there are no images matching your search query. Please try again.`);
 }
}



function renderGallery(data) {
    refs.galleryCont.insertAdjacentHTML('beforeend', getMarkForRender(data));
}


function getMarkForRender(data) {
     return data.hits.map(value => {
        return `
        <div class="photo-card">
  <img src="${value.webformatURL}" alt="${value.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes:${value.likes}</b>
    </p>
    <p class="info-item">
      <b>Views:${value.views}</b>
    </p>
    <p class="info-item">
      <b>Comments:${value.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads:${value.downloads}</b>
    </p>
  </div>
</div>`}).join(``);
}



