'use client';

import dynamic from 'next/dynamic';

const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false,
});

export default TileLayer;
