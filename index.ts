import express from "express";
import { config } from "dotenv";
import { MongoClient } from "./config/mongo/mongo";
import { MongoUserRepository } from "./src/repositories/user/user.repository";
import { UserController } from "./src/controllers/user/user";
import cors from "cors";
import { TokenController } from "./src/controllers/token/token";
import { HttpStatusCode } from "./src/controllers/protocols";
import { auth } from "./config/jwt/jwt";
import { redisClient } from "./config/redis/redis";

const main = async () => {
  
  config();

  const app = express();
  const mongoUserRepository = new MongoUserRepository();

  // Cors
  app.use(cors());
  // Parser
  app.use(express.json());

  await MongoClient.connect();
  await redisClient.connect()

  app.get("/users", auth, async (req, res) => {
    const cachedData = await redisClient.get('users');
    if (cachedData) {
        return res.status(HttpStatusCode.OK).json({
            status: HttpStatusCode.OK,
            message: 'success',
            data   : JSON.parse(cachedData)
        });
    }

    const users = new UserController(mongoUserRepository);

    const { body, statusCode } = await users.list();
    
    if (statusCode != 200) {
      return res.status(statusCode).json({status:statusCode,message:body})
    }

    redisClient.setEx('users', 3600, JSON.stringify(body));

    res.status(statusCode).json({status:statusCode,message:"success", data:body});
  });

  app.post("/users", auth, async (req, res) => {
    const createUserController = new UserController(
      mongoUserRepository
    );

    const { body, statusCode } = await createUserController.create({
      body: req.body,
    });

    if (statusCode != 200) {
      return res.status(statusCode).json({status:statusCode,message:body})
    }

    // Delete cached data from Redis
    redisClient.del('users');

    res.status(statusCode).json({status:statusCode,message:"successfull", data:body});
  });

  app.put("/users/:id", auth, async (req, res) => {
    const updateUserController = new UserController(
      mongoUserRepository
    );

    const { body, statusCode } = await updateUserController.update({
      body: req.body,
      params: req.params,
    });

    if (statusCode != 200) {
      return res.status(statusCode).json({status:statusCode,message:body})
    }

    // Delete cached data from Redis
    redisClient.del('users');

    res.status(statusCode).json({status:statusCode,message:"successfull", data:body});
  });

  app.delete("/users/:id", auth, async (req, res) => {
    const deleteUserController = new UserController(
      mongoUserRepository
    );

    const { body, statusCode } = await deleteUserController.delete({
      params: req.params,
    });

    if (statusCode != 200) {
      return res.status(statusCode).json({status:statusCode,message:body})
    }

    // Delete cached data from Redis
    redisClient.del('users');

    res.status(statusCode).json({status:statusCode,message:"successfull deleted"});
  });

  app.get("/users/:identity/account", auth, async (req, res) => {
    const cachedData = await redisClient.get('users');
    if (cachedData) {
      const cachedDataParse = JSON.parse(cachedData)
      for (let i =0; i < cachedDataParse.length; i++) {
        if (cachedDataParse[i].accountNumber == req.params.identity) {
          return res.status(HttpStatusCode.OK).json({status:HttpStatusCode.OK,message:cachedDataParse[i]})
        }
      }
    }

    const userController = new UserController(
      mongoUserRepository
    );

    const { body, statusCode } = await userController.getUserByAccountNumber({
      params: req.params,
    });

    if (statusCode != 200) {
      return res.status(statusCode).json({status:statusCode,message:body})
    }

    res.status(statusCode).json({status:statusCode,message:"success", data:body});
  });

  app.get("/users/:identity/identity-number", auth, async (req, res) => {
    const cachedData = await redisClient.get('users');
    if (cachedData) {
      const cachedDataParse = JSON.parse(cachedData)
      for (let i =0; i < cachedDataParse.length; i++) {
        if (cachedDataParse[i].identityNumber == req.params.identity) {
          return res.status(HttpStatusCode.OK).json({status:HttpStatusCode.OK,message:cachedDataParse[i]})
        }
      }
    }

    const userController = new UserController(
      mongoUserRepository
    );

    const { body, statusCode } = await userController.getUserByIdentityNumber({
      params: req.params,
    });

    if (statusCode != 200) {
      return res.status(statusCode).json({status:statusCode,message:body})
    }

    res.status(statusCode).json({status:statusCode,message:"success", data:body});
  });


  app.get("/generate-token", async (req, res) => {
    const tokenController = new TokenController();
    const { body, statusCode } = await tokenController.createToken()
    res.status(statusCode).json({status:statusCode,message:"success", data:{token: body}});
  });

  const port = process.env.PORT || 8000;

  app.listen(port, () => console.log(`listening on port ${port}!`));
};

main();
