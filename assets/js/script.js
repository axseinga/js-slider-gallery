const init = function () {
  const imagesList = document.querySelectorAll(".gallery__item");
  imagesList.forEach((img) => {
    img.dataset.sliderGroupName = Math.random() > 0.5 ? "nice" : "good";
  }); // za każdym przeładowaniem strony przydzielaj inną nazwę grupy dla zdjęcia

  runJSSlider();
};

document.addEventListener("DOMContentLoaded", init);

const runJSSlider = function () {
  const imagesSelector = ".gallery__item";
  const sliderRootSelector = ".js-slider";

  const imagesList = document.querySelectorAll(imagesSelector);
  const sliderRootElement = document.querySelector(sliderRootSelector);

  initEvents(imagesList, sliderRootElement);
  initCustomEvents(imagesList, sliderRootElement, imagesSelector);
};

const initEvents = function (imagesList, sliderRootElement) {
  imagesList.forEach(function (item) {
    item.addEventListener("click", function (e) {
      fireCustomEvent(e.currentTarget, "js-slider-img-click");
    });
  });

  const navNext = sliderRootElement.querySelector(".js-slider__nav--next");
  navNext.addEventListener("click", function (event) {
    event.stopPropagation();
    onImageNext();
  });

  const navPrev = sliderRootElement.querySelector(".js-slider__nav--prev");
  navPrev.addEventListener("click", function (event) {
    event.stopPropagation();
    onImagePrev();
  });

  const zoom = sliderRootElement.querySelector(".js-slider__zoom");
  zoom.addEventListener("click", onClose);
};

const fireCustomEvent = function (element, name) {
  console.log(element.className, "=>", name);

  const event = new CustomEvent(name, {
    bubbles: true,
  });

  element.dispatchEvent(event);
};

const initCustomEvents = function (
  imagesList,
  sliderRootElement,
  imagesSelector
) {
  imagesList.forEach(function (img) {
    img.addEventListener("js-slider-img-click", function (event) {
      onImageClick(event, sliderRootElement, imagesSelector);
    });
  });

  sliderRootElement.addEventListener("js-slider-img-next", onImageNext);
  sliderRootElement.addEventListener("js-slider-img-prev", onImagePrev);
  sliderRootElement.addEventListener("js-slider-close", onClose);
};

const onImageClick = function (event, sliderRootElement, imagesSelector) {
  sliderRootElement.classList.add("js-slider--active");
  const currImg = event.currentTarget.querySelector("img");
  const currSrc = currImg.getAttribute("src");
  const sliderImage = document.querySelector(".js-slider__image");
  sliderImage.setAttribute("src", currSrc);
  const currGroup = event.currentTarget.getAttribute("data-slider-group-name");
  const imagesList = Array.from(document.querySelectorAll(imagesSelector));
  const selectedImgs = imagesList.filter(
    (img) => img.getAttribute("data-slider-group-name") === currGroup
  );
  const sliderThumbs = document.querySelector(".js-slider__thumbs");
  const sliderThumb = document.querySelector(".js-slider__thumbs-item");
  selectedImgs.forEach(function (img) {
    const prevImg = img.querySelector("img");
    const newThumb = sliderThumb.cloneNode([true]);
    newThumb.classList.remove("js-slider__thumbs-item--prototype");
    const src = prevImg.getAttribute("src");
    const thumbImg = newThumb.querySelector("img");
    thumbImg.setAttribute("src", src);
    sliderThumbs.appendChild(newThumb);
  });
  const thumbImages = Array.from(sliderThumbs.querySelectorAll("img"));
  thumbImages.forEach(function (img) {
    const src = img.getAttribute("src");
    if (src === currSrc) {
      img.classList.add("js-slider__thumbs-image--current");
    } else {
      img.classList.remove("js-slider__thumbs-image--current");
    }
  });
};

const changeImg = function (newElement, startImg, currImg) {
  if (
    newElement &&
    !newElement.classList.contains("js-slider__thumbs-item--prototype")
  ) {
    const newImg = newElement.querySelector("img");
    if (newImg) {
      currImg.classList.remove("js-slider__thumbs-image--current");
      newImg.classList.add("js-slider__thumbs-image--current");
    }
    const sliderImg = document.querySelector(".js-slider__image");
    const newSrcCurr = newImg.getAttribute("src");
    sliderImg.setAttribute("src", newSrcCurr);
  } else {
    currImg.classList.remove("js-slider__thumbs-image--current");
    startImg.classList.add("js-slider__thumbs-image--current");
    const sliderImg = document.querySelector(".js-slider__image");
    const newSrcCurr = startImg.getAttribute("src");
    sliderImg.setAttribute("src", newSrcCurr);
  }
};

const onImageNext = function (event) {
  console.log(this, "onImageNext");
  // [this] wskazuje na element [.js-slider]
  const currImg = document.querySelector(".js-slider__thumbs-image--current");
  const newElement = currImg.parentElement.nextElementSibling;
  const startImg = currImg.parentElement.parentElement
    .querySelector("*:nth-child(2)")
    .querySelector("img");
  changeImg(newElement, startImg, currImg);
};

const onImagePrev = function (event) {
  console.log(this, "onImagePrev");

  const currImg = document.querySelector(".js-slider__thumbs-image--current");
  const newElement = currImg.parentElement.previousElementSibling;
  const startImg =
    currImg.parentElement.parentElement.lastElementChild.querySelector("img");
  changeImg(newElement, startImg, currImg);
};

/*

/*const onImageNext = function (event) {
  console.log(this, "onImageNext");
  // [this] wskazuje na element [.js-slider]

  const currImg = document.querySelector(".js-slider__thumbs-image--current");
  const parent = currImg.parentElement;
  const nextElement = parent.nextElementSibling;
  if (
    nextElement &&
    !nextElement.classList.contains("js-slider__thumbs-item--prototype")
  ) {
    const nextImg = nextElement.querySelector("img");
    if (nextImg) {
      currImg.classList.remove("js-slider__thumbs-image--current");
      nextImg.classList.add("js-slider__thumbs-image--current");
    }
    const sliderImg = document.querySelector(".js-slider__image");
    const newSrcCurr = nextImg.getAttribute("src");
    sliderImg.setAttribute("src", newSrcCurr);
  } else {
    const firstImg = currImg.parentElement.parentElement
      .querySelector("*:nth-child(2)")
      .querySelector("img");
    currImg.classList.remove("js-slider__thumbs-image--current");
    firstImg.classList.add("js-slider__thumbs-image--current");
    const sliderImg = document.querySelector(".js-slider__image");
    const newSrcCurr = firstImg.getAttribute("src");
    sliderImg.setAttribute("src", newSrcCurr);
  }
};

const onImagePrev = function (event) {
  console.log(this, "onImagePrev");

  const currImg = document.querySelector(".js-slider__thumbs-image--current");
  const parent = currImg.parentElement;
  const prevElement = parent.previousElementSibling;
  if (
    prevElement &&
    !prevElement.classList.contains("js-slider__thumbs-item--prototype")
  ) {
    const prevImg = prevElement.querySelector("img");
    if (prevImg) {
      currImg.classList.remove("js-slider__thumbs-image--current");
      prevImg.classList.add("js-slider__thumbs-image--current");
    }
    const sliderImg = document.querySelector(".js-slider__image");
    const newSrcCurr = prevImg.getAttribute("src");
    sliderImg.setAttribute("src", newSrcCurr);
  } else {
    const lastImg =
      currImg.parentElement.parentElement.lastElementChild.querySelector("img");
    currImg.classList.remove("js-slider__thumbs-image--current");
    lastImg.classList.add("js-slider__thumbs-image--current");
    const sliderImg = document.querySelector(".js-slider__image");
    const newSrcCurr = lastImg.getAttribute("src");
    sliderImg.setAttribute("src", newSrcCurr);
  }
};*/

const onClose = function (event) {
  const slider = document.querySelector(".js-slider");
  slider.classList.remove("js-slider--active");
  const sliderThumbsList = document.querySelectorAll(".js-slider__thumbs-item");
  const sliderThumb = document.querySelector(".js-slider__thumbs");
  console.log(sliderThumb);
  sliderThumbsList.forEach(function (thumb) {
    if (!thumb.classList.contains("js-slider__thumbs-item--prototype")) {
      thumb.parentElement.removeChild(thumb);
    }
  });
};

//* PYTANIE: czy lepiej jest po kilka razy ustalac zmiennie w kazdej funkcji czy lepiej jest je wyciagnac poza funkcje?*/
