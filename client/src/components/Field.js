import React, { useId } from 'react';
import Icon from './Icon';
import cx from './cx';

// Label + control. as: 'input' (default) | 'select' | 'textarea'. Extra props go to the control,
// so value/onChange/onKeyDown/name/placeholder behave exactly like a native element.
function Field({ label, as = 'input', hint, className = '', children, id, ...rest }) {
  const autoId = useId();
  const controlId = id || autoId;
  let control;
  if (as === 'select') {
    control = (
      <>
        <select id={controlId} className="bh-input bh-input--select" {...rest}>{children}</select>
        <Icon name="chevron-down" size={18} className="bh-field__chevron" />
      </>
    );
  } else if (as === 'textarea') {
    control = <textarea id={controlId} className="bh-input bh-input--textarea" {...rest} />;
  } else {
    control = <input id={controlId} className="bh-input" {...rest} />;
  }
  return (
    <div className={cx('bh-field', className)}>
      {label && <label className="bh-field__label" htmlFor={controlId}>{label}</label>}
      <div className="bh-field__control">{control}</div>
      {hint && <p className="bh-field__hint">{hint}</p>}
    </div>
  );
}

export default Field;
