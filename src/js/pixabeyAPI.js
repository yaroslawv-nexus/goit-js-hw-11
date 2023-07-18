import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = `https://pixabay.com/api/`;
const API_KEY = `38274690-471133f03d844111201a04d18`;
const PER_PAGE = 40;

async function getImages(search, page) {
    const options = {
       params: {
        key: API_KEY,
        q: search,
        image_type: `photo`,
        orientation: `horizontal`,
        safesearch: true,
        per_page: PER_PAGE,
        page: page,
       }
    }

    const resolve = await axios.get(BASE_URL, options);
    
    if(resolve.data.hits.length === 0 || !resolve) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        throw new Error("нічого не знайдено");
    }
   
    return resolve.data;
  }


  export {getImages};