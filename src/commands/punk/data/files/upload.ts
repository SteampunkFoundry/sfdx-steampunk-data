import * as csv from "csv-parser";
import * as fs from "fs-extra";
import { Flags, SfCommand } from "@salesforce/sf-plugins-core";
import { AuthInfo, Connection, Messages, Org, SfError } from "@salesforce/core";
import { fileToContentVersion } from "../../../../common/fileToContentVersion";
import { ContentVersion } from "../../../../common/typeDefinitions";

Messages.importMessagesDirectory(__dirname);
const messages = Messages.load("@steampunk/sfdx-steampunk-data", "upload", [
  "description",
  "filepath",
  "noOrgResults",
  "username",
  "examples",
]);

export default class Upload extends SfCommand<Any> {
  public static description = messages.getMessage("description");
  public static examples = [messages.getMessage("examples")];

  public static flags = {
    username: Flags.string({
      char: "u",
      description: messages.getMessage("username"),
      required: true,
    }),
    filepath: Flags.file({
      char: "f",
      description: messages.getMessage("filepath"),
      required: true,
    }),
  };

  private async readFile(filepath: string): Promise<any> {
    let rows = [];

    return new Promise<any>((resolve) => {
      fs.createReadStream(filepath)
        .pipe(csv())
        .on("data", (data) => {
          rows.push(data);
        })
        .on("end", () => {
          resolve(rows);
        });
    });
  }

  public async run(): Promise<any> {
    const { flags } = await this.parse(Upload);

    this.spinner.start("Reading CSV");

    let filesToUpload = await this.readFile(flags.filepath);

    this.spinner.stop();

    this.spinner.start("Loading files");

    const createCsvWriter = require("csv-writer").createObjectCsvWriter;

    const successWriter = createCsvWriter({
      path: "success.csv",
      header: [
        { id: "PathOnClient", title: "PathOnClient" },
        { id: "Title", title: "Title" },
        { id: "FirstPublishLocationId", title: "FirstPublishLocationId" },
        { id: "ContentDocumentId", title: "ContentDocumentId" },
      ],
    });

    const errorWriter = createCsvWriter({
      path: "error.csv",
      header: [
        { id: "PathOnClient", title: "PathOnClient" },
        { id: "Title", title: "Title" },
        { id: "FirstPublishLocationId", title: "FirstPublishLocationId" },
        { id: "Error", title: "Error" },
      ],
    });

    const providedOrg = await Org.create({ aliasOrUsername: flags.username });
    const conn = providedOrg.getConnection();

    for (let [i, file] of filesToUpload.entries()) {
      let success = [];
      let failure = [];
      this.spinner.start(`Loading file ${i + 1} of ${filesToUpload.length}`);
      try {
        const CV = (await fileToContentVersion(
          conn,
          file.PathOnClient,
          file.Title,
          file.FirstPublishLocationId
        )) as ContentVersion;

        file.ContentDocumentId = CV.ContentDocumentId;
        success.push(file);
        await successWriter.writeRecords(success);
      } catch (error) {
        file.Error = error;
        failure.push(file);
        await errorWriter.writeRecords(failure);
      } finally {
        this.spinner.stop();
      }
    }

    return "Success";
  }
}
