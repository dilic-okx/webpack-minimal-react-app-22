import React, { useEffect, useState } from 'react'

import './index.css'

interface CardProps {
  children: any
  [key: string]: any
}

const Card: React.FC = ({ children }: CardProps) => {
  return (
    <div className="mdc-card">
      <div className="mdc-card-wrapper__text-section">{children}</div>
    </div>
  )
}

export default Card
