import Link from 'next/link';
import { FC } from 'react';
import { styled } from '@mui/material/styles';

import { useFeature } from 'src/client/hooks/useFeatures';
import { buildServerSideProps } from 'src/client/ssr/buildServerSideProps';
import { BlogPost } from 'src/shared/types/blog-post';
import { fetch } from 'src/shared/utils/fetch';

const HomeWrapper = styled('div')`
  text-align: center;
  margin-top: 40vh;
`;

const HomeText = styled('div')`
  font-size: 60px;
  font-weight: bold;
`;

type THomeProps = {
  blogPosts: BlogPost[];
};

const Home: FC<THomeProps> = ({ blogPosts }) => {
  return (
    <HomeWrapper>
      <HomeText>Todo Management</HomeText>
    </HomeWrapper>
  );
};

export default Home;
