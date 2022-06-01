import { Container, Row } from "react-bootstrap";

import { RepoForm } from "./containers";
import { RepoContextProvider } from "./context";
import { Board } from "./containers/board";
import { Nav } from "./containers/nav";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <RepoContextProvider>
      <Container>
        <Row>
          <RepoForm />
        </Row>
        <Row>
          <Nav />
        </Row>
        <Board />
      </Container>
    </RepoContextProvider>
  );
}

export default App;
