import React, { useState, useEffect } from 'react';
import Question from './components/Question';
import Settings from './components/Settings';
import { nanoid } from 'nanoid';

export default function App() {
  const [start, setStart] = useState(false);
  const [questionsArray, setQuestionsArray] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [settingsArray, setSettingsArray] = useState([]);
  const [categoryId, setCategoryId] = useState(9);

  useEffect(() => {
    fetchData();
  }, [] && [categoryId]); // eslint-disable-line react-hooks/exhaustive-deps

  function fetchData() {
    const urls = [
      `${`https://opentdb.com/api.php?amount=5&category=${categoryId}&difficulty=easy&type=multiple`}`,
      'https://opentdb.com/api_category.php',
    ];

    Promise.all(
      urls.map((url) =>
        fetch(url).then((res) => {
          if (!res.ok) {
            throw new Error(
              `This is an HTTP error: the status is ${res.status}`
            );
          }
          return res.json();
        })
      )
    )
      .then((data) => {
        const data1 = data[0].results;
        const data2 = data[1].trivia_categories;

        const finalData = createObjArray(data1);
        setError(null);
        setQuestionsArray(finalData);
        setSettingsArray(data2);
        setIsChecked(false);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setIsFetched(true);
      });
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }

  function createObjArray(data1) {
    return (
      data1 &&
      data1.map((item) => {
        // Adding id to the existing objects (elements of the fetched array)
        return {
          ...item,
          id: nanoid(),
          correct_answer: convertCorrectToObj(item.correct_answer),
          incorrect_answers: convertIncorrectToObj(item.incorrect_answers),
          answers: shuffleAnswers([
            ...convertIncorrectToObj(item.incorrect_answers),
            convertCorrectToObj(item.correct_answer),
          ]),
        };
      })
    );
  }

  function convertCorrectToObj(correct_answer) {
    return {
      value: correct_answer,
      id: nanoid(),
      isHeld: false,
      isCorrect: true,
    };
  }

  function convertIncorrectToObj(incorrect_answers_array) {
    return incorrect_answers_array.map((item) => {
      return {
        value: item,
        id: nanoid(),
        isHeld: false,
        isCorrect: false,
      };
    });
  }

  function shuffleAnswers(answersArray) {
    return answersArray.sort(() => Math.random() - 0.5);
  }

  function answerHandleClick(answerId, questionId) {
    !isChecked &&
      setQuestionsArray((prevArray) => {
        return prevArray.map((question) => {
          return question.id === questionId
            ? {
                ...question,
                answers: question.answers.map((answer) => {
                  return answer.id === answerId
                    ? { ...answer, isHeld: true }
                    : { ...answer, isHeld: false };
                }),
              }
            : question;
        });
      });
  }

  function checkAnswer() {
    setIsChecked(true);
  }

  function handleScore() {
    let score = 0;
    for (let i = 0; i < questionsArray.length; i++) {
      for (let j = 0; j < questionsArray[i].answers.length; j++) {
        const answer = questionsArray[i].answers[j];
        if (answer.isHeld && answer.isCorrect) {
          score++;
        }
      }
    }
    return score;
  }

  function playAgain() {
    setIsFetched(false);
    fetchData();
  }

  function startQuiz() {
    setStart(true);
  }

  function renderCategoryList() {
    return (
      settingsArray &&
      settingsArray.map((item) => ({
        id: item.id,
        value: item.name,
      }))
    );
  }

  function handleCategory(id) {
    setCategoryId(id);
  }

  const questionsElements =
    questionsArray &&
    questionsArray.map((item) => {
      return (
        <Question
          key={item.id}
          question={item.question}
          answers={item.answers}
          id={item.id}
          handleClick={answerHandleClick}
          isChecked={isChecked}
        />
      );
    });

  return (
    <main>
      {!start ? (
        <div className="init-container">
          <div className="init-container--width">
            <h1 className="title">Quizzical</h1>
            <p className="title-description">
              This is a knowledge quiz app. Pick your answers from the options
              provided. It uses its data from Open Trivia Database - an open
              source database
            </p>
            <Settings
              options={renderCategoryList()}
              handleCategory={handleCategory}
            />
            <button className="btn btn-start" onClick={startQuiz}>
              Start quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="data-container">
          <div>{questionsArray && questionsElements}</div>
          {!isChecked ? (
            isFetched && (
              <button className="btn btn-check" onClick={checkAnswer}>
                Check answers
              </button>
            )
          ) : (
            <div className="score">
              <p>
                You scored {handleScore()}/{questionsArray.length} correct
                answers.
              </p>
              <button className="btn btn-play-again" onClick={playAgain}>
                Play again
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
