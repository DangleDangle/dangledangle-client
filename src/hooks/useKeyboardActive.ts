import { useCallback } from 'react';

function useKeyboardActive() {
  return useCallback(() => {
    const fakeInput = document.createElement('input');
    document.body.appendChild(fakeInput);
    fakeInput.style.position = 'fixed';
    fakeInput.style.bottom = '0';
    fakeInput.style.left = '-100vh';
    fakeInput.setAttribute('id', 'dangle_input_fake');
    fakeInput.focus();
    window.scrollTo(0, 0);
    fakeInput.addEventListener('blur', () => {
      document.getElementById('dangle_input_fake')?.remove();
    });
  }, []);
}
export default useKeyboardActive;
