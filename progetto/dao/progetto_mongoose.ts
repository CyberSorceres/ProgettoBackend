import { ProgettoDao } from "./progetto_dao";
import { Progetto } from "../progetto";
import { Mongoose } from "../../database/mongoose";
import { Schema } from "mongoose";
import { Model } from "mongoose";
import { EpicStory } from "../epic_story";
import { UserStory, Feedback } from "../user_story";

export class ProgettoMongoose implements ProgettoDao {
  private mongoose: Mongoose;
  private ProgettoModel: Model<Progetto>;

  constructor(mongoose: Mongoose) {
    this.mongoose = mongoose;
    const userStorySchema = new Schema({
      tag: String,
      description: String,
      assigned: String,
      unitTest: String,
      feedback: [{ creatorId: String, description: String }],
    });
    const epicStorySchema = new Schema({
      description: String,
      userStories: [userStorySchema],
    });
    this.ProgettoModel = this.mongoose.connection.model<Progetto>(
      "Progetto",
      new Schema({
        name: String,
        validated: Boolean,
        epicStories: [epicStorySchema],
        ai: String,
        users: [String],
      }).loadClass(Progetto),
    );
  }

  private convertToClass(obj) {
    return new Progetto(
      obj.name,
      obj.validated,
      obj.epicStories.map(
        (epic) =>
          new EpicStory(
            epic.description,
            epic.userStories.map(
              (u) =>
                new UserStory(
                  u.tag,
                  u.description,
                  u.assigned,
                  u.unitTest,
                  u._id,
                ),
            ),
            epic._id,
          ),
      ),
      obj._id,
      obj.ai,
      obj.users,
    );
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
  async insertUserStory(
    id: string,
    epicStoryId: string,
    userStory: UserStory,
  ): Promise<boolean> {
    await this.ProgettoModel.findOneAndUpdate(
      {
        _id: id,
        "epicStories._id": epicStoryId,
      },
      {
        $push: {
          "epicStories.$.userStories": userStory,
        },
      },
    );
    return true;
  }

  async assignDev(id, userStoryId, userId): Promise<boolean> {
    await this.ProgettoModel.findOneAndUpdate(
      {
        _id: id,
        epicStories: {
          $elemMatch: {
            "userStories._id": userStoryId,
          },
        },
      },
      {
        $set: {
          "epicStories.$.userStories.$.assigned": userId,
        },
      },
    );
    return true;
  }
  async setUnitTest(id, userStoryId, unitTest: string): Promise<boolean> {
    await this.ProgettoModel.findOneAndUpdate(
      {
        _id: id,
        epicStories: {
          $elemMatch: {
            "userStories._id": userStoryId,
          },
        },
      },
      {
        $set: {
          "epicStories.$.userStories.$.unitTest": unitTest,
        },
      },
    );
    return true;
  }
  async getEpicStory(id, epicStoryId): Promise<EpicStory> {
    const query = await this.ProgettoModel.aggregate().project({
      epicStories: {
        $filter: {
          input: "$epicStories",
          as: "epicStory",
          cond: {
            $eq: ["$$epicStory._id", epicStoryId],
          },
        },
      },
    });
    if (!query.length || !query[0].epicStories.length) {
      return null;
    }
    return query[0].epicStories[0];
  }
  async getUserStory(id, userStoryId): Promise<UserStory> {
    try {
      return (
        await this.ProgettoModel.aggregate([
          {
            $match: { _id: id },
          },
          {
            $unwind: "$epicStories",
          },
          {
            $project: {
              "epicStories.userStories": {
                $filter: {
                  input: "$epicStories.userStories",
                  as: "epicStory",
                  cond: {
                    $eq: ["$$epicStory._id", userStoryId],
                  },
                },
              },
            },
          },
          {
            $group: {
              _id: "$_id",
              userStories: {
                $first: "$epicStories.userStories",
              },
            },
          },
        ])
      )[0].userStories[0];
    } catch (e) {
      return null;
    }
  }

  async insertFeedback(id, userStoryId, feedback: Feedback): Promise<boolean> {
    await this.ProgettoModel.findOneAndUpdate(
      {
        _id: id,
        epicStories: {
          $elemMatch: {
            "userStories._id": userStoryId,
          },
        },
      },
      {
        $push: {
          "epicStories.$.userStories.$.feedbacks": feedback,
        },
      },
    );
    return true;
  }

  async deleteUserStory(id, userStoryId): Promise<boolean> {
    await this.ProgettoModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $pull: {
          "epicStories.$[].userStories": {
            _id: userStoryId,
          },
        },
      },
    );
    return true;
  }
  async getUserStoryByUser(
    userId,
  ): Promise<{ projectId: string; userStories: UserStory[] }[]> {
    return await this.ProgettoModel.aggregate([
      {
        $unwind: "$epicStories",
      },
      {
        $project: {
          "epicStories.userStories": {
            $filter: {
              input: "$epicStories.userStories",
              as: "userStories",
              cond: {
                $eq: ["$$userStories.assigned", userId],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          projectId: "$_id",
          userStories: "$epicStories.userStories",
        },
      },
    ]);
  }
  async addToProject(id, userId): Promise<boolean> {
    await this.ProgettoModel.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          users: userId,
        },
      },
    );
    return true;
  }
}
