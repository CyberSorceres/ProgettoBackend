import { InviteDao } from "./invite_dao";
import { Invite } from "../invite";
import { Mongoose } from "../../database/mongoose";
import { Model } from "mongoose";
import { Schema } from "mongoose";

export class InviteMongoose implements InviteDao {
  private mongoose: Mongoose;
  private InviteModel: Model<Invite & { _id: string }>;

  constructor(mongoose: Mongoose) {
    this.mongoose = mongoose;
    this.InviteModel = this.mongoose.connection.model<Invite & { _id: string }>(
      "Invite",
      new Schema({
        id: {
          type: String,
        },
        projectId: String,
        role: Number,
      }),
    );
  }
  async insertInvite(invite: Invite): Promise<boolean> {
    await new this.InviteModel(invite).save();
    return true;
  }
  async removeInvite(invite: Invite): Promise<boolean> {
    this.InviteModel.findOneAndDelete({ id: invite.id });
    return true;
  }
  async getInvite(id: string): Promise<Invite> {
    return this.InviteModel.findOne({ id: id });
  }
}
