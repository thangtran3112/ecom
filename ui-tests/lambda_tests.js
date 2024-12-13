const { runTest } = require("./test_runner.js");

exports.handler = async (event) => {
  await runTest(true);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Warmup complete" }),
  };
};
