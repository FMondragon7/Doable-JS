import { tokenKey, root } from "./config.js";
import { getTasks } from "./services/tasks-service.js";
import { FilterTasks } from "./utils.js";
import STORE from "./store.js";
import LoginPage from "./pages/login-page.js";
import SignupPage from "./pages/signup-page.js";
import TaskPage from "./pages/tasks-page.js";
import DOMHandler from "./dom-handler.js";

const router = {
  login: LoginPage,
  signup: SignupPage,
  tasks: TaskPage,
};

async function App() {
  const token = sessionStorage.getItem(tokenKey);
  let module;

  if (!token) {
    if (["login", "signup"].includes(STORE.currentPage)) {
      module = router[STORE.currentPage];
    } else {
      module = LoginPage;
    }

    return DOMHandler.load(module(), root);
  }

  try {
    const tasks = await getTasks();
    STORE.setTasks(tasks);
    FilterTasks(STORE.grossFilterTasks);

    module = router[STORE.currentPage];
  } catch (error) {
    console.log(error);
    sessionStorage.removeItem(tokenKey);
    module = LoginPage;
  }

  return DOMHandler.load(module(), root);
}

export default App;
