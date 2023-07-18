import {getImages} from "./js/pixabeyAPI.js";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    form: document.querySelector(`.search-form`),
    loadMoreBt: document.querySelector(`.load-more`),
    galleryCont: document.querySelector(`.gallery`),
}

let preFindValue = null;
let countPage = 1;

refs.form.addEventListener(`submit`, onSubmitFindForm);
refs.loadMoreBt.addEventListener(`click`, onClickLoadBt);
let lightbox = new SimpleLightbox('.gallery a', {captionsData: `alt`, captionDelay: 250,});






function onSubmitFindForm(event) {
    event.preventDefault();
    const value = event.currentTarget.elements.searchQuery.value;
    if(!value){return};
    
    newValueSearch(value);
   

    countPage += 1;
    preFindValue = value;
}




async function newValueSearch(value) {
  hideBtLoadMore();

  countPage = 1;
  refs.galleryCont.innerHTML = ``;
  try{
    const resolve = await searchData(value);
    renderGallery(resolve);
    Notify.success(`Hooray! We found ${resolve.totalHits} images.`);
    showBtLoadMore();
    checkLimitHits(resolve.totalHits);} 
    catch(e) {
      console.log(e);
    }

}

function onClickLoadBt() {
  hideBtLoadMore();

  searchData(preFindValue).then(resolve => {
    renderGallery(resolve);
    showBtLoadMore();
    checkLimitHits(resolve.totalHits);
  });
  countPage += 1;
}






async function searchData(searchWords) {
    return await getImages(searchWords, countPage);
}



function renderGallery(data) {
    refs.galleryCont.insertAdjacentHTML('beforeend', getMarkForRender(data));
    lightbox.refresh();
}


function getMarkForRender(data) {
     return data.hits.map(value => {
        return `<div class="photo-card">
        <a class="photo-card" href="${value.largeImageURL}">
  <img src="${value.webformatURL}" alt="${value.tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <b>${value.likes}</b>
    </p>
    <p class="info-item">
      <b>Views</b>
      <b>${value.views}</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <b>${value.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <b>${value.downloads}</b>
    </p>
  </div></div>`}).join(``);
}

function showBtLoadMore() {
  refs.loadMoreBt.hidden = false;
  console.log("show");
}

function hideBtLoadMore() {
  refs.loadMoreBt.hidden = true;
  
}

function checkLimitHits(maxNum) {
  const amountColl = refs.galleryCont.children.length;

  if(amountColl >= maxNum) {
    hideBtLoadMore();
    Notify.failure("We're sorry, but you've reached the end of search results.");
  }
}



