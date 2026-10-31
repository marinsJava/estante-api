const ActionButton = ({ variant = 'ghost', children, ...rest }) => (
  <button type="button" className={`btn btn--${variant}`} {...rest}>
    {children}
  </button>
);

export default ActionButton;
