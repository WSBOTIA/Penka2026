import React from 'react';
import { Image } from 'react-native';
import { styled } from 'nativewind';

const StyledImage = styled(Image);

const Flag = ({ code }) => {
  if (!code) return null;

  return (
    <StyledImage
      source={{ uri: `https://flagsapi.com/${code}/flat/64.png` }}
      className="w-8 h-8"
    />
  );
};

export default Flag;
