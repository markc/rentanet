/* Runs before first paint: pick the stored theme, else follow the system. */
(function () {
  var d = document.documentElement, t;
  try { t = localStorage.getItem('rentanet-theme'); } catch (e) { /* private mode */ }
  if (t !== 'light' && t !== 'dark') t = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  d.dataset.theme = t;
  d.classList.add('js');
  /* If the main script never arrives, drop the class so nothing stays hidden. */
  setTimeout(function () { if (!window.rentanetReady) d.classList.remove('js'); }, 4000);
})();
