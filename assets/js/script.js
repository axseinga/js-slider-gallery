const init = function () {
  const imagesList = document.querySelectorAll(".gallery__item");
  imagesList.forEach((img) => {
    img.dataset.sliderGroupName = Math.random() > 0.5 ? "nice" : "good";
  });

  runJSSlider();
};

document.addEventListener("DOMContentLoaded", init);

let runInterval;

const startSlideShow = function () {
  if (!runInterval) {
    runInterval = setInterval(
      (function int() {
        onImageNext();
        return int;
      })(),
      2000
    );
  }
};

const stopSlideShow = function () {
  clearInterval(runInterval);
  runInterval = null;
  if (runInterval !== null) {
    runInterval = null;
  }
};

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
  navNext.addEventListener("mouseenter", stopSlideShow);
  navNext.addEventListener("mouseleave", startSlideShow);

  const navPrev = sliderRootElement.querySelector(".js-slider__nav--prev");
  navPrev.addEventListener("click", function (event) {
    event.stopPropagation();
    onImagePrev();
  });
  navPrev.addEventListener("mouseenter", stopSlideShow);
  navPrev.addEventListener("mouseleave", startSlideShow);

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

const getGroupName = function (event, imagesSelector) {
  const currGroup = event.currentTarget.getAttribute("data-slider-group-name");
  const imagesList = Array.from(document.querySelectorAll(imagesSelector));
  return (selectedImgs = imagesList.filter(
    (img) => img.getAttribute("data-slider-group-name") === currGroup
  ));
};

const createThumbs = function (selectedImgs, currImg, currSrc) {
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

const onImageClick = function (event, sliderRootElement, imagesSelector) {
  sliderRootElement.classList.add("js-slider--active");
  const currImg = event.currentTarget.querySelector("img");
  const currSrc = currImg.getAttribute("src");
  const sliderImage = document.querySelector(".js-slider__image");
  sliderImage.setAttribute("src", currSrc);
  getGroupName(event, imagesSelector);
  createThumbs(selectedImgs, currImg, currSrc);
  setTimeout(function () {
    startSlideShow();
  }, 2000);
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

const onClose = function (event) {
  const slider = document.querySelector(".js-slider");
  slider.classList.remove("js-slider--active");
  const sliderThumbsList = document.querySelectorAll(".js-slider__thumbs-item");
  const sliderThumb = document.querySelector(".js-slider__thumbs");
  sliderThumbsList.forEach(function (thumb) {
    if (!thumb.classList.contains("js-slider__thumbs-item--prototype")) {
      thumb.parentElement.removeChild(thumb);
    }
  });
  stopSlideShow();
};
