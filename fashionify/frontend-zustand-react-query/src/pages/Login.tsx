import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../common/constants";

enum AuthState {
  Login = "Login",
  SignUp = "Sign Up",
}

const Login = () => {
  const [currentState, setCurrentState] = useState<AuthState>(AuthState.Login);
  const { token, setToken, navigate } = useContext(ShopContext);
  const [name, setName] = useState<string>("");
  const [password, setPasword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (currentState === AuthState.SignUp) {
        const response = await axios.post(BACKEND_URL + "/api/user/register", {
          name,
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        //Login case
        const response = await axios.post(BACKEND_URL + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className=" border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === AuthState.Login ? null : (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required
        />
      )}
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />
      <input
        onChange={(e) => setPasword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer hover:underline">Forgot your password?</p>
        {currentState === AuthState.Login ? (
          <p
            onClick={() => setCurrentState(AuthState.SignUp)}
            className="cursor-pointer text-rose-500 hover:underline"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState(AuthState.Login)}
            className="cursor-pointer text-rose-500 hover:underline"
          >
            Login here
          </p>
        )}
      </div>
      <button
        type="submit"
        className="bg-black text-white font-light px-8 py-2 mt-4"
      >
        {currentState === AuthState.Login ? AuthState.Login : AuthState.SignUp}
      </button>
    </form>
  );
};

export default Login;
