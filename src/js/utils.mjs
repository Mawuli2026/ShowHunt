export function getParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

