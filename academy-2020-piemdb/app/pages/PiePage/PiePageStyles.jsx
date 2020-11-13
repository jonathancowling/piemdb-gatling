import styled from 'styled-components';

export const Banner = styled.div`
background-color: #F3F8FF;
padding: 1rem;
display flex;
flex-direction: row;
justify-content: center;
`;

export const PieDetails = styled.div`
display: flex
flex-direction: column;
max-width: 75rem;
width: 100%;
justify-content: center;
@media only screen and (max-width: 600px) {
  flex-direction:column;
}
`;
export const Row = styled.div`
display: flex;
justify-content: space-between;
flex-direction: row;
max-width: 75rem;
width: 100%;
flex-grow: 1;
@media only screen and (max-width: 600px) {
  flex-direction:column;
}

`;

export const Col = styled.div`
display:flex;
flex-direction: column;
width: 50%;
justify-content: space-between;
@media only screen and (max-width: 600px) {
  width: 100%
}
`;

export const SurroundingDiv = styled.div`
background-color: #FFFFFF;
`;

export const ButtonHolder = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
`;

export const ReviewSectionHeader = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
margin: auto;
max-width: 75rem;
margin-top: 2rem;
align-self: stretch;
@media only screen and (max-width: 600px) {
  flex-direction:column;
  align-items:center;
}
`;

export const SubmitReviewHolder = styled.div`
display: flex;
flex-direction: column;
align-items: center;
margin: auto;
`;

export const ReviewHolder = styled.div`
max-width: 75rem;
display: flex;
flex-grow: 1;
flex-wrap: wrap;
align-items: space-between;
margin: auto;
@media only screen and (max-width: 600px) {
    flex-direction:column;
}
`;
