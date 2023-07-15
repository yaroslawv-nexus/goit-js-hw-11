import {getImages} from "./js/pixabeyAPI.js";

const refs = {
    form: document.querySelector(`.search-form`),
    loadMoreBt: document.querySelector(`.load-more`),
    galleryCont: document.querySelector(`.gallery`),
}

let preFindValue = null;
let countPage = 1;


refs.form.addEventListener(`submit`, onSubmitFindForm);
refs.loadMoreBt.addEventListener(`click`, onClickLoadBt);







function onSubmitFindForm(event) {
    event.preventDefault();
    hideBtLoadMore();
    const value = event.currentTarget.elements.searchQuery.value;
    if(value === preFindValue) {
        searchData(value, countPage);
    } else {
        countPage = 1;
        refs.galleryCont.innerHTML = ``;
        searchData(value, countPage);
    }
    countPage += 1;
    preFindValue = value;
    setTimeout(showBtLoadMore(), 500);
}

function onClickLoadBt() {
  hideBtLoadMore();
  searchData(preFindValue, countPage);
  countPage += 1;
  setTimeout(showBtLoadMore(), 500);
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

function showBtLoadMore() {
  refs.loadMoreBt.hidden = false;
}

function hideBtLoadMore() {
  refs.loadMoreBt.hidden = true;
}



