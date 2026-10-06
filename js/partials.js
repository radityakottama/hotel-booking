async function loadPartials(selector, url) {
    const response = await fetch(url);
    document.querySelector(selector).innerHTML = await response.text();
}
loadPartials("#header-placeholder", "partials/header.html");