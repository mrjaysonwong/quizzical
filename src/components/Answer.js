import React from 'react';
import { unEscape } from '../Utillity';

export default function Answer(props) {
  let styles;
  if (props.isChecked) {
    if (props.isCorrect) {
      styles = {
        backgroundColor: 'var(--bg-color-correct)',
        color: '#000',
        border: props.isHeld ? 'none' : 'none',
      };
    } else if (props.isHeld) {
      styles = {
        backgroundColor: props.isHeld ? 'var(--purple)' : 'var(--bg-color-correct)',
        color: '#000',
        border: props.isHeld ? '1px solid var(--purple)' : 'none',
      };
    }
  } else {
    styles = {
      backgroundColor: props.isHeld ? 'var(--purple)' : 'transparent',
      color: props.isHeld ? '#000' : '#fff',
    };
  }

  return (
    <div>
      <button
        className="btn btn-answer"
        onClick={props.handleClick}
        style={styles}
      >
        {unEscape(props.value)}
      </button>
    </div>
  );
}
