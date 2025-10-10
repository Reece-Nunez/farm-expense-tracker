import { createPortal } from 'react-dom';

const Portal = ({ children, container = document.body }) => {
  return createPortal(children, container);
};

export default Portal;