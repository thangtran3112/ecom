# Fullstack MERN with Backend Focus

- Techstacks: Material UI, Scss, Redux, ExpressJS, Mongo DB
- Utilize Aggregate Mongo features for data analytics

## Deployment steps

- Bundle the codes within backend folder:

```sh
    cd backend
    npm run bundle
```

```sh
    cd frontend
    npm run bundle
```

- Within `cdk` folder:

```sh
    cdk deploy
```

- Make sure to update the VITE_BACKEND_API_URL FrontEnd env variable to point to the deployed Backend Url in AWS
