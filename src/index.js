import './css/styles.css';
import {getImages} from "./js/pixabeyAPI.js";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const refs = {
    form: document.querySelector(`.search-form`),
    loadMoreBt: document.querySelector(`.load-more`),
    galleryCont: document.querySelector(`.gallery`),
    guardScroll: document.querySelector(`.ward`),
    
}

let preFindValue = null;
let countPage = 1;

refs.form.addEventListener(`submit`, onSubmitFindForm);
let lightbox = new SimpleLightbox('.gallery a', {captionsData: `alt`, captionDelay: 250,});
let options = {
  root: null,
  rootMargin: "300px",
  threshold: 0,
};

let observer = new IntersectionObserver(onLoadMoreScroll, options);




function onSubmitFindForm(event) {
    event.preventDefault();
    const value = event.currentTarget.elements.searchQuery.value;
    if(!value){return};
    newValueSearch(value);
    countPage += 1;
    preFindValue = value;
}



async function newValueSearch(value) {
  countPage = 1;
  refs.galleryCont.innerHTML = ``;
  try{
    const resolve = await searchData(value);
    renderGallery(resolve);
    Notify.success(`Hooray! We found ${resolve.totalHits} images.`);
    setObserverIfNotEnd(resolve);
    } 
    catch(e) {
      console.log(e);
    }
}




function onLoadMoreScroll(entries, observer) {
  entries.forEach((entry) => {
    if(entry.isIntersecting){
      searchData(preFindValue).then(resolve => {
        renderGallery(resolve);
        if(resolve.totalHits <= getLengthGallery()) {
          Notify.failure("We're sorry, but you've reached the end of search results.");
          observer.unobserve(entry.target);
        }
      });
      countPage += 1;
    }
  })
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



function getLengthGallery() {
  return refs.galleryCont.children.length;
}


function setObserverIfNotEnd(resolve) {
  if(resolve.totalHits <= getLengthGallery()) {
    Notify.failure("We're sorry, but you've reached the end of search results.");
  } else {
    setTimeout(() => {observer.observe(refs.guardScroll)}, 500);
  }
}

