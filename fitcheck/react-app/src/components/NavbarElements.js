import styled from 'styled-components';
import { NavLink as Link } from 'react-router-dom';

export const Nav = styled.nav`

  background: #FE9EB9;
  height: 80px;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem calc((100vw - 1000px) / 2);
  z-index: 10;
   justify-content: flex-start; 
`;

export const NavLink = styled(Link)`
  color: #000;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  &.active {
    font-family: <style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300&display=swap');
</style>;
font-style: normal;
font-weight: bold;
font-size: 24px;
line-height: 28px;
letter-spacing: 0.02em;
text-decoration-line: underline;

color: #000000;
  }

`;


export const NavMenu = styled.div`
    position: absolute;
    width: 67px;
    height: 26px;
    left: 942px;
    top: 20px;

  display: flex;
  align-items: center;
  margin-right: -54px;
  font-family: Raleway;
  font-style: normal;
  font-weight: 100;
  font-size: 22px;
  line-height: 26px;
  letter-spacing: 0.02em;
  font-color: #000000;
 
  white-space: nowrap; 
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  margin-right: 24px;
  justify-content: flex-end;
  width: 100vw;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtnLink = styled(Link)`
  border-radius: 4px;
  background: #0000;
  padding: 10px 22px;
  color: #000;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

`;