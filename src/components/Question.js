import React from 'react';
import { unEscape } from '../Utillity';
import Answer from './Answer'

export default function Question(props) {
  
  const answersElements = props.answers.map((item) => {
    return (
      <Answer 
        key={item.id}
        isHeld={item.isHeld}
        isCorrect={item.isCorrect}
        value={item.value}
        isChecked={props.isChecked}
        handleClick={() => props.handleClick(item.id, props.id)}
      />
    )
  })

  return (
    <div className="question">
      <p className="question__list">{unEscape(props.question)}</p>
      <div className="answers">{answersElements}</div>
    </div>
  );
}
