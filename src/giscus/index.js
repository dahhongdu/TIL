import React, { useEffect, useRef, useState } from 'react';

const Giscus = () => {
  const [mounted, setMounted] = useState(false); // 타입 정의 제거
  const ref = useRef(null); // 타입 정의 제거

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, [mounted]);

  useEffect(() => {
    const scriptElement = document.createElement('script');
    scriptElement.setAttribute('src', 'https://giscus.app/client.js');
    scriptElement.setAttribute('data-repo', 'dahhongdu/TIL');
    scriptElement.setAttribute('data-repo-id', 'R_kgDOMdZqmw');
    scriptElement.setAttribute('data-category', 'General');
    scriptElement.setAttribute('data-category-id', 'DIC_kwDOMdZqm84ChaC8');
    scriptElement.setAttribute('data-mapping', 'pathname');
    scriptElement.setAttribute('data-strict', '0');
    scriptElement.setAttribute('data-reactions-enabled', '1');
    scriptElement.setAttribute('data-emit-metadata', '0');
    scriptElement.setAttribute('data-input-position', 'top');
    scriptElement.setAttribute('data-theme', 'light_high_contrast');
    scriptElement.setAttribute('data-lang', 'en');
    scriptElement.setAttribute('crossorigin', 'anonymous');
    scriptElement.async = true;

    if (ref.current) {
      ref.current.appendChild(scriptElement);
    }
  }, [mounted]);

  if (!mounted) return null;

  return <div ref={ref} />;
};

export default Giscus;
