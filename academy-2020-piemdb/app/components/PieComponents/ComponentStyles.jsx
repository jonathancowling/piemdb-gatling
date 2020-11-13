import styled from 'styled-components';

export const Title = styled.h1`
display: flex;
justify-content: left;
font-family: Merriweather;
font-size: 2.25rem;
font-weight: 700;
line-height: 2.8rem;
letter-spacing: 0em;
text-align: left;
color: #0A46A6
`;

export const Subtitle = styled.h2`
font-family: Merriweather;
font-size: 1.75rem;
font-weight: 700;
line-height: 2.1875rem;
letter-spacing: 0em;
text-align: left;
color: #454545
`;
export const ContentTitle = styled.p`
margin:0;
padding:0;
font-family: Merriweather;
font-size: 1.20rem;
font-style: normal;
font-weight: 300;
line-height 1.5625rem;
letter-spacing: 0em;
text-align:left;
color: #0A46A6
`;

export const Content = styled.p`
margin:0;
padding:0;
font-family: Catamaran;
font-size: 1.20rem;
font-style: normal;
font-weight: 700;
line-height 1.5625rem;
letter-spacing: 0em;
text-align:left;
color: #0A46A6;
`;

export const ReviewWrapper = styled.div`
background-color: #F8F8F8;
padding: 0.5rem;
display: flex;
flex-direction: column;
width: calc(100% * 0.5 - 1rem);
flex: 1 0 45%;
margin: 1rem 1rem 1rem 1rem;
@media only screen and (max-width: 600px) {
  width: calc(100% - 2rem);
  margin-bottom: 1rem;
  margin-left: 1rem;
  margin-right: 1rem
} 
`;

export const ReviewHeader = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
`;

export const ReviwerName = styled.p`
font-family: Catamaran;
font-size: 1.5rem;
font-style: normal;
font-weight: 700;
line-height 2.0625rem;
letter-spacing: 0em;
text-align:left;
color: #454545;
margin-top:0;
margin-bottom:0;
`;

export const ReviewContent = styled.p`
font-family: Catamaran;
font-size: 1.25rem;
font-style: normal;
font-weight: 600;
line-height 2.4375rem;
letter-spacing: 0em;
text-align:left;
color: #454545;
`;
