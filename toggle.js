(() => {
  const selector = 'body > div.side';
  const waitForSidebar = () =>
    new Promise(resolve => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      const obs = new MutationObserver(() => {
        const found = document.querySelector(selector);
        if (found) {
          obs.disconnect();
          resolve(found);
        }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    });

  const createButton = () => {
    const btn = document.createElement('button');
    btn.textContent = '▸';
    btn.title = 'Toggle sidebar (⌘⇧P / Ctrl‑M)';
    Object.assign(btn.style, {
      position: 'fixed',
      top: '50%',
      right: '0',
      transform: 'translateY(-50%)',
      width: '14px',
      height: '40px',
      padding: '0',
      lineHeight: '40px',
      textAlign: 'center',
      border: 'none',
      borderRadius: '4px 0 0 4px',
      background: '#333',  // dark grey background
      color: '#000',       // black arrow
      fontSize: '12px',
      cursor: 'pointer',
      zIndex: '2147483647',
      opacity: '0.6',
      transition: 'opacity .2s'
    });
    btn.addEventListener('mouseenter', () => (btn.style.opacity = '1'));
    btn.addEventListener('mouseleave', () => (btn.style.opacity = '0.6'));
    return btn;
  };

  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  waitForSidebar().then(sidebar => {
    const btn = createButton();
    let folded = false;

    const toggle = () => {
      folded = !folded;
      sidebar.style.display = folded ? 'none' : '';
      btn.textContent = folded ? '◂' : '▸';
    };

    btn.addEventListener('click', toggle);

    document.addEventListener('keydown', e => {
      // Command+Shift+P on macOS  OR  Ctrl+M on others
      if (isMac) {
        if (e.metaKey && e.shiftKey && e.key.toLowerCase() === 'p') {
          e.preventDefault();
          toggle();
        }
      } else {
        if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() == 'm') {
          e.preventDefault();
          toggle();
        }
      }
    }, true);

    document.body.appendChild(btn);
  });
})();