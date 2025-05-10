import { useState } from 'react';

const Quiz = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const topics = ['Arte', 'Entretenimiento', 'Deporte', 'Ciencia', 'Historia'];

  const handleTopicSelect = async (topic) => {
    setLoading(true);
    setSelectedTopic(topic);
    setQuestions([]);
    setUserAnswers({});
    setScore(null);

    try {
      const response = await fetch('http://localhost:3001/api/chat/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error al cargar las preguntas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(userAnswers).length < questions.length) {
      alert('Por favor responde todas las preguntas');
      return;
    }

    const questionsWithAnswers = questions.map((q, index) => ({
      ...q,
      userAnswer: userAnswers[index]
    }));

    const correctAnswers = questions.reduce((acc, q, index) => {
      return acc + (q.correctAnswer === userAnswers[index] ? 1 : 0);
    }, 0);

    try {
      await fetch('http://localhost:3001/api/chat/quiz/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: selectedTopic,
          questions: questionsWithAnswers,
          score: correctAnswers
        }),
      });

      setScore(correctAnswers);
    } catch (error) {
      console.error('Error al guardar los resultados:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Quiz de Conocimientos Generales</h2>
      
      {!selectedTopic && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => handleTopicSelect(topic)}
              className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {topic}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Cargando preguntas...</p>
        </div>
      )}

      {questions.length > 0 && !loading && (
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <p className="font-semibold mb-4">{index + 1}. {question.question}</p>
              <div className="space-y-2">
                {question.options.map((option, optIndex) => (
                  <label key={optIndex} className="block">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={userAnswers[index] === option}
                      onChange={() => handleAnswerSelect(index, option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {!score && (
            <button
              onClick={handleSubmit}
              className="w-full bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors mt-4"
            >
              Enviar Respuestas
            </button>
          )}
        </div>
      )}

      {score !== null && (
        <div className="mt-6 text-center">
          <h3 className="text-xl font-bold">Resultados</h3>
          <p className="text-lg mt-2">
            Tus respuestas correctas fueron: {score}/5
          </p>
          <button
            onClick={() => {
              setSelectedTopic('');
              setQuestions([]);
              setUserAnswers({});
              setScore(null);
            }}
            className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors mt-4"
          >
            Nuevo Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
