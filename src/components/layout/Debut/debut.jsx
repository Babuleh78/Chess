import React, { useState } from 'react';
import "./debut.css";
import DebutBoard from '../../ui/DebutBoard/debutBoard';
import openingsData
 from './debutdata';
export default function Debut({ onBack }) {
  

    return(
        <>
            <DebutBoard
                onBack={onBack}
                openings={openingsData}
            />
        </>
    );
  
}