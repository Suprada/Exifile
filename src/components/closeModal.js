export const closeModal = () => {
  // console.log("in close modal");
  const closeBtn =
    document.getElementsByClassName("icon-ic_close") &&
    document.getElementsByClassName("icon-ic_close_small");
  if (closeBtn.length > 0) {
    ("in closing");
    closeBtn[0].click();
  }
};
