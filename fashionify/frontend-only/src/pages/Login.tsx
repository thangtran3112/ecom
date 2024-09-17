import { useState } from "react";

enum AuthState {
  Login = "Login",
  SignUp = "Sign Up",
}

const Login = () => {
  const [currentState, setCurrentState] = useState<AuthState>(AuthState.SignUp);
  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
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
          className="w-full px-3 py-2 border border-gray-800"
          type="text"
          placeholder="Name"
          required
        />
      )}
      <input
        className="w-full px-3 py-2 border border-gray-800"
        type="email"
        placeholder="Email"
        required
      />
      <input
        className="w-full px-3 py-2 border border-gray-800"
        type="password"
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
