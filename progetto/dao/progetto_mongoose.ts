import { ProgettoDao } from "./progetto_dao";
import { Progetto } from "../progetto";
import { Mongoose } from "../../database/mongoose";
import { Schema } from "mongoose";
import { Model } from "mongoose";
import { EpicStory } from "../epic_story";

export class ProgettoMongoose implements ProgettoDao {
  private mongoose: Mongoose;
  private ProgettoModel: Model<Progetto>;

  constructor(mongoose: Mongoose) {
    this.mongoose = mongoose;
    this.ProgettoModel = this.mongoose.connection.model<Progetto>(
      "Progetto",
      new Schema({
        name: String,
        validated: Boolean,
        epicStories: [],
      }).loadClass(Progetto),
    );
  }

  private convertToClass(obj) {
    return new Progetto(obj.name, obj.validated, obj.epicStories);
  }

  async findAll(): Promise<Progetto[]> {
    return (await this.ProgettoModel.find({})).map((p) =>
      this.convertToClass(p),
    );
  }
  async findById(id: any): Promise<Progetto> {
    return this.convertToClass(await this.ProgettoModel.findById(id));
  }

  async insertProgetto(progetto: Progetto): Promise<string> {
    try {
      const ret = await new this.ProgettoModel(progetto).save();
      return ret._id;
    } catch (e) {
      return null;
    }
  }

  async updateProgetto(progetto: Progetto): Promise<boolean> {
    try {
      await this.ProgettoModel.findOneAndReplace(progetto, progetto);
      return true;
    } catch (e) {
      return false;
    }
  }
  async deleteProgetto(progetto: Progetto): Promise<boolean> {
    try {
      await this.ProgettoModel.findOneAndDelete(progetto);
      return true;
    } catch (e) {
      return false;
    }
  }

  async insertEpicStory(id, epicStory: EpicStory): Promise<boolean> {
    await this.ProgettoModel.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          epicStories: epicStory,
        },
      },
    );
    return true;
  }
}
