
import { randomBytes } from 'crypto';
import { IUser, IUserInputDTO } from '../Interface/IUser';
import jwt from 'jsonwebtoken';

import { Logger } from 'winston';
import { Inject, Service } from "typedi";
import { JsonWebTokenError } from 'jsonwebtoken';
import argon2 from 'argon2';
import IRefreshToken from '../Interface/IRefreshToken';


@Service()
export class AuthService {
  constructor(
    @Inject("logger") private logger: Logger,
    @Inject("userModel") private userModel: Models.UserModel,
    @Inject("resfreshTokenModel")
    private refreshTokenModel: Models.RefreshTokeModel,
    @Inject("publicKey") private publicKey: any,
    @Inject("privateKey") private privateKey: any
  ) {}

  public async signUp(
    userInputDTO: IUserInputDTO
  ): Promise<{ user: IUser; token: any; refreshToken: any; message: string }> {
    try {
      const userRecord = await this.userModel.create({ ...userInputDTO});

      

      if (!userRecord) {
        throw new Error("unable to create user");
      }

      //userRecord.password = undefined;

      const user = userRecord.toObject();

      await this.userModel.assignDefaultRole(user._id);

      const token = this.generateToken(user);
      const refershToken = await this.generateRefreshToken(user);

      return {
        user: user,
        token: token,
        refreshToken: refershToken,
        message: "User signed up succesfully",
      };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public generateToken(user) {
    return jwt.sign(
      {
        _id: user._id, // We are gonna use this in the middleware 'isAuth'
        role: user.role,
        email: user.email,
      },
      this.privateKey,
      { algorithm: "RS256", expiresIn: "15m" }
    );
  }

  public async generateRefreshToken(user) {
    const refreshToken = await this.refreshTokenModel.create({
      refreshToken: this.generateHashToken(),
      user: user._id,
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return refreshToken.refreshToken;
  }

  public generateHashToken() {
    return randomBytes(40).toString("hex");
  }

  public async login(
    userInputDtO
  ): Promise<{ user: IUser; token: any; refreshToken: string }> {
    try {
      //fetch user by email

      const user = await this.userModel
        .findOne({ email: userInputDtO.email })
        .select("+password");
      if (!user) {
        throw new Error("User not found");
      }

      //verify user password

      this.logger.info(user.password);

      this.logger.info(userInputDtO.password);

      const verifyPassword = await argon2.verify(
        user.password,
        userInputDtO.password
      );

      if (verifyPassword) {
        this.logger.info("password verified succesfully");
        const token = this.generateToken(user);

        const refreshToken = await this.generateRefreshToken(user);

        return { user: user, token: token, refreshToken: refreshToken };
      } else {
        throw new Error("Email or password did not match");
      }
    } catch (e) {
      throw e;
    }
  }

  public async updatePassword(req) {
    try {
      const user = await this.userModel
        .findById(req.currentUser._id)
        .select("+password");
      if (!user) {
        throw new Error("User not found");
      }
      user.password = req.body.password;
      user.passwordConfirm = req.body.passwordConfirm;
      await user.save();

      return;
    } catch (e) {
      throw e;
    }
  }

  public async refreshToken(refreshTokenInput: any) {
    try {
      const user = await this.getRefreshToken(refreshTokenInput.refreshToken);
      if (!user) {
        throw new Error("User not found");
      }
      const token = this.generateToken(user);

      await this.removeRefreshToken(refreshTokenInput.refreshToken);

      const refreshToken = await this.generateRefreshToken(user);

      return { user,token, refreshToken };
    } catch (e) {
      throw e;
    }
  }

  public async invalidateAllToken(refreshTokenInput: IRefreshToken) {
    try {
      await this.removeRefreshToken(refreshTokenInput.refreshToken);
      return ;
    }catch(e){
      throw e;
    }
  }

  public async getRefreshToken(token: string) {
    const refreshToken = await this.refreshTokenModel
      .findOne({ refreshToken: token })
      .populate("user");
    return refreshToken.user;
  }

  public async removeRefreshToken(token: string) {
    await this.refreshTokenModel.deleteMany({ refreshToken: token });
  }


  public async aggreagteUserInfo(){
    const userStat = this.userModel.aggregate([
     { $match:{age:{$gte:5}}},
     {$addFields:{$totalAge:{$sum:"$age"}}},
     {$project:{$email:1,$firstname:1}}
    ]) 
  }
}

