import { useState } from "react";
import Spinner from "./Spinner";

interface CardProps {
  title: string;
  imageSrc: string;
}

const Card = ({ title, imageSrc }: CardProps): JSX.Element => {
  const [loading, setLoading] = useState(true);

  const handleLoading = () => setLoading(false);
  return (
    <div>
      <h3 className="bold">{title}</h3>
      {loading && <Spinner />}
      <div className="h-64">
        <img
          src={imageSrc}
          alt={title}
          className={`rounded-md h-full w-full object-cover ${
            loading ? "hidden" : ""
          }`}
          onLoad={handleLoading}
        />
      </div>
    </div>
  );
};

export default Card;
