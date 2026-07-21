const BACKEND_URL = 'https://foyers-ameliores.onrender.com';
const slug = "le-foyer-qui-mumure-lavenir%3A-l%C3%A0-o%C3%B9-br%C3%BBle-un-foyer%2C-une-histoire-commence.--";
console.log(encodeURIComponent(slug));

fetch(`${BACKEND_URL}/api/news/slug/${encodeURIComponent(slug)}`)
  .then(r => console.log('encoded:', r.status))
  .catch(e => console.log(e));

fetch(`${BACKEND_URL}/api/news/slug/${slug}`)
  .then(r => console.log('unencoded:', r.status))
  .catch(e => console.log(e));
