import React from 'react'
import '../App.css'

export const ResultList = ({results}) => {
  console.log(results)
  return (
    <div className="result-list">
      {results.map((item) => (
        <div>{item.name}</div>
      ))}
    </div>
    
  )
}
