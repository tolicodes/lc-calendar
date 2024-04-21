import React from 'react';
import { DayProps } from './types';
import styled, { css } from 'styled-components';

export const locationColorMapping: Record<string, string> = {
  SoHo: '#A2D2FF',
  'Prospect Park': '#A1E3D8',
  'Big Meet': '#FFDE59'
};

const format12HourTime = (date: Date): string => {
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}${ampm}`;
  };

const Day: React.FC<DayProps> = ({ date, events, onDayClick }) => {
  const eventForDay = events.find(event => 
    new Date(event.dateStart).toDateString() === date.toDateString()
  );

  const handleClick = () => {
    if (eventForDay) {
      onDayClick(eventForDay.url);
    }
  };

  return (
    <Box
      style={{
        backgroundColor: eventForDay ? locationColorMapping[eventForDay.location] : 'transparent',
        cursor: eventForDay ? 'pointer' : 'default',
        padding: '5px',
       
      }}
      onClick={handleClick}
    >
      <div style={{ fontWeight: 'bold' }}>{date.getDate()}</div>
      <div
        style={{
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            marginTop: '10px'
        }}
      >
        {eventForDay && <div>{`${format12HourTime(new Date(eventForDay.dateStart))}-${format12HourTime(new Date(eventForDay.dateEnd))}`}</div>}
      </div>
    </Box>
  );
};

export default Day;


const Box = styled.div`
    height: 100px;
    fontSize: 25px;

  ${() => css`
    @media (max-width: 600pc) {
      height: 50px;
    }
  `}
`;