import React from 'react';
import PropTypes from 'prop-types';

const SubmitIcon = ({ size }) => (
  <img src="submit.png" style={{width: '20px'}} />
);

SubmitIcon.propTypes = {
  size: PropTypes.number
};

SubmitIcon.defaultProps = {
  size: 20
};

export default SubmitIcon;
