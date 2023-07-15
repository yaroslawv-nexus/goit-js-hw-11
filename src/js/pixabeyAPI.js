import axios from "axios";


const BASE_URL = `https://pixabay.com/api/`;
const API_KEY = `38274690-471133f03d844111201a04d18`;

async function getImages(search, page) {
    const options = {
       params: {
        key: API_KEY,
        q: search,
        image_type: `photo`,
        orientation: `horizontal`,
        safesearch: true,
        per_page: "40",
        page: page,
       }
    }

    const resolve = await axios.get(BASE_URL, options);
    if(resolve.data.hits.length === 0) {
        throw new Error('Пустий масив');
    }
    return resolve.data;
  }

  export {getImages};