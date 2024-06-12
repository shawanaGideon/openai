import { Link } from "react-router-dom";

type Props = {
  to: string;
  bg: string;
  text: string;
  textColor: string;
  onClick?: () => Promise<void>;
};

const NavigationLink = (props: Props) => {
  const handleClick = async () => {
    if (props.onClick) {
      await props.onClick();
    }
  };

  return (
    <Link
      className="nav-link"
      to={props.to}
      style={{ background: props.bg, color: props.textColor }}
      onClick={handleClick}
    >
      {props.text}
    </Link>
  );
};

export default NavigationLink;

