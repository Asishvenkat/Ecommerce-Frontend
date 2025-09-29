import React from 'react';
import Navbar from '../components/Navbar';
import Announcement from '../components/Announcement';
import Slider from '../components/Slider';
import Categories from '../components/Categories';
import Products from '../components/Products';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import styled from 'styled-components';

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 600;
  margin: 30px 0 10px 30px;
  color: #333;
  text-transform: uppercase;
`;

function Home() {

  return (
     <div>
       <Announcement />
      <Navbar />
      <Slider />

      <Categories />
      
      <SectionTitle>Trending</SectionTitle>
      <Products />

      <Newsletter />
      <Footer />
    </div>
  );
}

export default Home;
