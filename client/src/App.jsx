import AppRoutes from "./routes/AppRoutes";
import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter as Router } from "react-router-dom";
function App() {
  return (
    <>
      <Router>
        <Provider store={store}>
          <AppRoutes />
        </Provider>
      </Router>
    </>
  )
}
export default App;