import DOMHandler from "../dom-handler.js";
import ListPage from "./lists-page.js";
import LoginPage from "./login-page.js";
import STORE from "../store.js";
import { tokenKey, root } from "../config.js";
import { input } from "../components/input.js";
import { createUser } from "../services/users-service.js";
import { getLists } from "../services/lists-service.js";

function render() {
  return `
    <section class="section-lg">
      <div class="container flex flex-column gap-8 items-center">
        <img src="/assets/images/doable-logo.png" alt="doable logo" />
        <h1 class="heading">Create Account</h1>
        <form action="" class="full-width container-sm flex flex-column gap-4 js-signup-form">
          ${input({
            label: "email",
            id: "username",
            error: this.state.errors.username,
            placeholder: "you@example.com",
          })}
          ${input({
            label: "Password",
            id: "password",
            type: "password",
            placeholder: "******",
            error: this.state.errors.password,
          })}
          <button type="submit" class="button button--primary width-full">
            Create Account
          </button>
        </form>
        ${
          this.state.errors.form
            ? `
          <p class="error-300">${this.state.errors.form}</p>
        `
            : ""
        }
        <a class="js-login-link">Login</a>
      </div>
    </section>
  `;
}

function listenSubmit() {
  // Encuentro el punto de referencia
  const form = document.querySelector(".js-signup-form");

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
      const { token, ...user } = await createUser(credentials);
      sessionStorage.setItem(tokenKey, token);

      STORE.setUser(user);
      STORE.setCurrentPage("lists");

      const lists = await getLists();
      STORE.setLists(lists);

      DOMHandler.load(ListPage(), root);
    } catch (error) {
      this.state.errors.form = error.message;
      DOMHandler.reload();
    }
  });
}

function listenLoginLink() {
  const link = document.querySelector(".js-login-link");

  link.addEventListener("click", (event) => {
    event.preventDefault();

    STORE.setCurrentPage("login");
    DOMHandler.load(LoginPage(), root);
  });
}

function SignupPage() {
  return {
    toString() {
      return render.call(this);
    },
    addListeners() {
      listenSubmit.call(this);
      listenLoginLink();
    },
    state: {
      errors: {},
      testPage: "SignupPage",
    },
  };
}

export default SignupPage;
