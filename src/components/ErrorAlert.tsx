import React from 'react';

interface Props {
  message: string;
}

export const ErrorAlert: React.FC<Props> = ({ message }) => (
  <div className="alert alert-error">
    {message}
  </div>
);
