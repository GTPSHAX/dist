(function () {
  // Readable version of getLocalStorageRF.js
  // Shows selected localStorage values and allows comparison with pasted JSON

  const storage = localStorage;

  const css = `*{box-sizing:border-box}.__p{position:fixed;left:0;width:100%;height:50%;background:#0b0e14;color:#e5e7eb;font:12px ui-monospace,monospace;border-top:1px solid #1f2430}.__w{position:relative;height:100%}.__t{width:100%;height:100%;background:transparent;color:inherit;border:0;padding:40px 14px 14px;resize:none;outline:none;line-height:1.4}.__h{position:absolute;top:12px;left:14px;font-size:11px;opacity:.6}.__c{position:absolute;top:10px;right:10px;width:26px;height:26px;border:1px solid #1f2430;border-radius:6px;background:#111827;display:flex;align-items:center;justify-content:center;cursor:pointer}.__c:hover{background:#1f2937}.__toast{position:absolute;top:12px;right:46px;font-size:11px;padding:3px 8px;border-radius:4px;background:#1f2937;opacity:0;transform:translateY(-4px);transition:.2s}.__show{opacity:1;transform:none}.__diff{background:#120b0d}`;

  const svg = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#c7d2fe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

  // Inject styles
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /**
   * Create a UI box showing the provided value and label.
   * Returns the outer container element so the caller can adjust it.
   */
  function createBox(value, label) {
    const container = document.createElement('div');
    const wrapper = document.createElement('div');
    const textarea = document.createElement('textarea');
    const copyBtn = document.createElement('button');
    const header = document.createElement('div');
    const toastEl = document.createElement('div');

    function showToast(message) {
      toastEl.textContent = message;
      toastEl.classList.add('__show');
      setTimeout(() => toastEl.classList.remove('__show'), 1200);
    }

    container.className = '__p';
    wrapper.className = '__w';
    textarea.className = '__t';
    copyBtn.className = '__c';
    header.className = '__h';
    toastEl.className = '__toast';

    header.textContent = label;
    textarea.value = value;
    textarea.readOnly = true;

    copyBtn.innerHTML = svg;
    copyBtn.onclick = () => navigator.clipboard.writeText(textarea.value)
      .then(() => showToast('Disalin. Silahkan melanjutkan langkah berikutnya'));

    textarea.addEventListener('copy', () => showToast('Disalin. Silahkan melanjutkan langkah berikutnya'));

    wrapper.append(header, textarea, copyBtn, toastEl);
    container.append(wrapper);
    document.body.appendChild(container);

    return container;
  }

  const localData = {
    user_id: storage.getItem('user_id'),
    session_id: storage.getItem('session_id'),
    uuid: storage.getItem('uuid')
  };

  const localDataJson = JSON.stringify(localData, null, 2);
  const topBox = createBox(localDataJson, 'LocalStorage');

  // Keep original behavior (the original used 0, keep that to avoid changing behavior)
  topBox.style.top = 0;

  const pasted = prompt('Silahkan paste (tempel) text yang ada pada clipboard Anda untuk melakukan pengecekan:');
  if (!pasted) return;

  try {
    // Compare normalized JSON strings (parse then stringify) to avoid formatting differences
    if (!pasted || JSON.stringify(JSON.parse(pasted)) !== JSON.stringify(JSON.parse(localDataJson))) {
      const bottomBox = createBox(pasted, 'Berbeda, silahkan copy secara manual dan lanjutkan ke langkah berikutnya');
      bottomBox.style.top = '50%';
      bottomBox.classList.add('__diff');
    } else {
      alert('Isi sama, silakan lanjut ke langkah berikutnya.');
    }
  } catch (err) {
    alert('Data tidak valid, silahkan copy secara manual dan lanjutkan ke langkah berikutnya.');
  }
})();
