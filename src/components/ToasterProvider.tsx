'use client';

import { Toaster } from 'react-hot-toast';

export default function ToasterProvider() {
  return (
    <Toaster 
      position="top-right"
      containerStyle={{
        zIndex: 999999,
      }}
      toastOptions={{
        style: {
          background: '#0a192f',
          color: '#fff',
          border: '1px solid #00e5ff',
          zIndex: 1000000,
        },
      }}
    />
  );
}
