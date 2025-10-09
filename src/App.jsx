import { Outlet } from "react-router-dom";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 y-8">
        <Outlet />
      </main>
    </>
  );
}

export default App;