import { input } from "../components/input.js";
import { login } from "../services/session-service.js";
import { tokenKey, root } from "../config.js";
import { getTasks } from "../services/tasks-service.js";
import DOMHandler from "../dom-handler.js";
import TaskPage from "./tasks-page.js";
import STORE from "../store.js";
import SignupPage from "./signup-page.js";

function render() {
  return `
    <section class="section-lg">
      <div class="container flex flex-column gap-8 items-center">
        <img src="/assets/images/doable-logo.png" alt="doable logo" />
        <h1 class="heading">Login</h1>
        <form action="" class="full-width container-sm flex flex-column gap-4 js-login-form">
          ${input({
            label: "email",
            id: "username",
            value: "fernando@hotmail.com",
            required: true,
            placeholder: "you@example.com",
          })}
          ${input({
            label: "Password",
            id: "password",
            required: true,
            value: "123456",
            type: "password",
            placeholder: "******",
          })}
          <button type="submit" class="button button--primary width-full">
            Login
          </button>
        </form>
        ${
          this.state.errors.form
            ? `
          <p class="error-300">${this.state.errors.form}</p>
        `
            : ""
        }
        <a class="js-create-account">Create Account</a>
      </div>
    </section>
  `;
}

function listenSubmit() {
  // Encuentro el punto de referencia
  const form = document.querySelector(".js-login-form");

  // Agrego oyentes de Eventos!
  // Declaro el evento que quiero escuchar
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Opero los valores que capture del evento.
    const { username, password } = event.target.elements;

    const credentials = {
      email: username.value,
      password: password.value,
    };

    try {
      const { token, ...user } = await login(credentials);
      sessionStorage.setItem(tokenKey, token);

      STORE.setUser(user);
      STORE.setCurrentPage("tasks");

      const tasks = await getTasks();
      STORE.setTasks(tasks);

      DOMHandler.load(TaskPage(), root);
    } catch (error) {
      this.state.errors.form = error.message;
      DOMHandler.reload();
    }
  });
}

function listenCreateAccount() {
  // Capturar el punto de referencia
  const link = document.querySelector(".js-create-account");

  // Agregar un escuchador de eventos
  // Declarar que evento va a escuchar
  // Efectuar cambios con los valores capturados del evento.
  link.addEventListener("click", (event) => {
    event.preventDefault();

    STORE.setCurrentPage("signup");
    DOMHandler.load(SignupPage(), root);
  });
}

function LoginPage() {
  return {
    toString() {
      return render.call(this);
    },
    addListeners() {
      listenSubmit.call(this);
      listenCreateAccount();
    },
    state: {
      errors: {},
      testPage: "LoginPage",
    },
  };
}

export default LoginPage;
