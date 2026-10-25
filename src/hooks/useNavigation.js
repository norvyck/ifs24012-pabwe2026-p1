import { useEffect, useState } from 'react';

export function currentRoute() {
  return `${window.location.pathname}${window.location.search}` || '/';
}

export function navigate(to) {
  if (currentRoute() === to) return;
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
}

export function useNavigation() {
  const [route, setRoute] = useState(currentRoute);

  useEffect(() => {
    const onLocationChange = () => setRoute(currentRoute());
    const onLinkClick = (event) => {
      const anchor = event.target.closest('a');
      const href = anchor?.getAttribute('href');
      if (
        !href ||
        !href.startsWith('/') ||
        href.startsWith('//') ||
        anchor.target === '_blank' ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
      ) return;

      event.preventDefault();
      navigate(href);
    };

    window.addEventListener('popstate', onLocationChange);
    document.addEventListener('click', onLinkClick);
    return () => {
      window.removeEventListener('popstate', onLocationChange);
      document.removeEventListener('click', onLinkClick);
    };
  }, []);

  return { route, navigate };
}
