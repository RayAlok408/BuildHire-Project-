import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import Button from './Button';
import Icon from './Icon';

// Accessible confirmation modal built on the native <dialog> element: focus is trapped, Esc closes,
// the page behind is inert and focus returns to the trigger on close.
function ConfirmDialog({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', tone = 'danger', onClose }) {
  const ref = useRef(null);
  const titleId = useId();
  const textId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const finish = result => {
    if (ref.current && ref.current.open) ref.current.close();
    onClose(result);
  };

  return (
    <dialog
      ref={ref}
      className="bh-dialog"
      aria-labelledby={titleId}
      aria-describedby={textId}
      onCancel={event => { event.preventDefault(); finish(false); }}
      onClick={event => { if (event.target === ref.current) finish(false); }}
    >
      <div className="bh-dialog__body">
        <span className={`bh-dialog__icon bh-dialog__icon--${tone}`}><Icon name={tone === 'danger' ? 'alert-circle' : 'info'} size={24} /></span>
        <h2 id={titleId} className="bh-dialog__title">{title}</h2>
        <p id={textId} className="bh-dialog__text">{message}</p>
        <div className="bh-dialog__actions">
          <Button variant="ghost" autoFocus onClick={() => finish(false)}>{cancelLabel}</Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={() => finish(true)}>{confirmLabel}</Button>
        </div>
      </div>
    </dialog>
  );
}

// const { confirm, dialog } = useConfirm();
// if (await confirm({ title, message, confirmLabel, cancelLabel })) doTheThing();   ...   {dialog}
export function useConfirm() {
  const [request, setRequest] = useState(null);
  const confirm = useCallback(options => new Promise(resolve => setRequest({ options, resolve })), []);
  const close = result => {
    if (request) request.resolve(result);
    setRequest(null);
  };
  const dialog = request ? <ConfirmDialog {...request.options} onClose={close} /> : null;
  return { confirm, dialog };
}

export default ConfirmDialog;
