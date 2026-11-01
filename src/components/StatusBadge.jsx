import { STATUS_LABEL } from '../services/bookService.js';

const StatusBadge = ({ status }) => (
  <span className={`badge badge--${status}`}>{STATUS_LABEL[status]}</span>
);

export default StatusBadge;
