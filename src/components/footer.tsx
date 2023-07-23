import Container from "./container";
import { EXAMPLE_PATH } from "../utils/constants";

const Footer = () => {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <Container>
        <div className="flex flex-col items-center py-28 lg:flex-row">
          <h3 className="mb-10 text-center text-4xl font-bold leading-tight tracking-tighter lg:mb-0 lg:w-1/2 lg:pr-4 lg:text-left lg:text-[2.5rem]">
            2023 &copy; Copyright notice Jason Varbdian
          </h3>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
