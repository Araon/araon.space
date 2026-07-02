import React from "react";

const useMousePosition = (ref) => {
  const [mousePosition, setMousePosition] = React.useState({
    x: null,
    y: null,
  });

  React.useEffect(() => {
    const updateMousePosition = (ev) => {
      if (!ref.current) {
        return;
      }

      const rect = ref.current.getBoundingClientRect();

      setMousePosition({
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top,
      });
    };
    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [ref]);

  return mousePosition;
};

export default useMousePosition;
