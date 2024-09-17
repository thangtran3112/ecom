# Express Typescript

## Express Typescript Scalfolding

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
