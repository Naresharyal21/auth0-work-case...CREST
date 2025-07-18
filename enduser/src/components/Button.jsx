import { useState } from "react";

export default function Button() {
  const [num, setNum] = useState(0);

  const handle = () => {
    setNum(num + 1); // increment
  };

  return (
    <div>
      <p>Clicked {num} times</p>
      <button>Submit</button>
      <button>Cancel</button>
      <button>Cancel2</button>
      <button onClick={handle}>Cancel3</button>
    </div>
  );
}
