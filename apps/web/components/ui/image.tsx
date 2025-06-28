'use client';

import React, { useCallback, useState } from 'react';

import { Image as IKImage, IKImageProps } from '@imagekit/next';

const urlEndpoint: string = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ?? '';

interface CustomImageProps extends IKImageProps {
  lqip?: boolean;
}

const Image = React.memo((props: CustomImageProps) => {
  const { src, lqip = false, transformation = [], ...rest } = props;

  const [isLoading, setIsLoading] = useState(true);

  const lowQualityTransformation = [{ w: 20, q: 5, blur: 10 }];

  const handleOnLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <IKImage
      urlEndpoint={urlEndpoint}
      src={src}
      transformation={isLoading && lqip ? lowQualityTransformation : transformation}
      onLoad={handleOnLoad}
      style={{
        height: props.height ?? 'auto',
        width: props.width ?? 'auto',
      }}
      {...rest}
    />
  );
});

Image.displayName = 'Image';

export default Image;
