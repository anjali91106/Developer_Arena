import { useNavigate } from 'react-router-dom';

const BackButton = ({ to = -1, className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to === -1) {
      navigate(-1);
    } else {
      navigate(to);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center space-x-2 text-pink-600 hover:text-pink-700 font-medium transition-colors ${className}`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span>Back</span>
    </button>
  );
};

export default BackButton;
