import React from 'react';

const ButtonSpinner: React.FC = () => {
  return (
    <>
      <span className="spinner-border spinner-border-sm me-2"/>
      <span className="visually-hidden">Loading...</span>
    </>
  );
};

export default ButtonSpinner;