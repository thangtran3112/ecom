# Backend for Admin Dashboard

- Deployment on AWS Lambda with Express Adapter. [Example](https://github.com/thangtran3112/aws-serverless-samples/tree/main/serverless-full-stack-react-starter/backend)

## Express Typescript Scalfolding

- [Guideline 1](https://blog.logrocket.com/how-to-set-up-node-typescript-express/)
- [Guideline 2](https://kinsta.com/blog/express-typescript/)

```bash
npm init -y
npm i express
npm install -D @types/express @types/node typescript
npx tsc --init
```

- Change the `OutDir` properties

```tsconfig.json
  "compilerOptions": {
    ...
    "outDir": "./dist"
    ...
  }
```

## MongoDB Relationship Model with Lucid Chart

![ERD Diagram](./images/ERDDiagram.png)
