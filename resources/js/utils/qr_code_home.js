document.addEventListener('DOMContentLoaded', () => {
  const logo = document.getElementById('odea-logo');
  if (!logo) return;
  const logoSrc = 'resources/odea_edu_logo_dark3.jpg';
  const qrSrc = 'resources/qr_home.jpg';

  logo.addEventListener('click', () => {
    logo.style.opacity = '0';
    const onFadedOut = (e) => {
      if (e.propertyName !== 'opacity') return;
      logo.removeEventListener('transitionend', onFadedOut);

      logo.src = logo.src.includes(logoSrc) ? qrSrc : logoSrc;
      logo.style.opacity = '1';
    };
    logo.addEventListener('transitionend', onFadedOut);
  });
});