import { core, flags, SfdxCommand } from "@salesforce/command";
import { Connection } from '@salesforce/core/lib/connection';
import { attachmentToContentVersion } from "../../../../common/attachmentToContentVersion";
import { Attachment, ConvertedAttachment, ContentVersion } from "../../../../common/typeDefinitions";

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file.
// Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('@steampunk/sfdx-steampunk-data', 'convert');

export default class Convert extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');

  public static examples = [
    `sfdx punk:data:attachments:convert -c "ParentId = '00130000000014cAAA'"`,
  ];

  protected static flagsConfig = {
    criteriaFilter: flags.filepath({
      char: "c",
      description: messages.getMessage('criteriaFlagDescription'),
      required: true
    }),
  };

  protected static requiresUsername = true;

  private async retrieveAttachments(conn: Connection, criteriaFilter: string): Promise<any> {
    const query = `SELECT Id, Name, Body, ContentType, Description, Name, OwnerId, ParentId FROM Attachment WHERE ${criteriaFilter}`;
    const result = await conn.autoFetchQuery<ConvertedAttachment>(query, { autoFetch: true, maxFetch: 50000 });

    return result;
  }

  public async run(): Promise<any> {
    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();

    const criteriaFilter = this.flags.criteriaFilter;

    this.ux.startSpinner("Retrieving attachments to convert");

    let attachments = await this.retrieveAttachments(conn, criteriaFilter);

    this.ux.stopSpinner();

    this.ux.startSpinner("Loading files");

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
        { id: "Error", title: "Error" }
      ],
    });

    for (let [i, attachment] of attachments.entries()) {
      let success = [];
      let failure = [];
      this.ux.startSpinner(`Loading file ${i + 1}`);
      try {
        const CV = (await attachmentToContentVersion(
          conn,
          attachment
        )) as ContentVersion;

        attachment.ContentDocumentId = CV.ContentDocumentId;
        attachment.ContentVersionId = CV.Id;
        success.push(attachment);
        await successWriter.writeRecords(success);
      } catch (error) {
        attachment.Error = error;
        failure.push(attachment);
        await errorWriter.writeRecords(failure);
      } finally {
        this.ux.stopSpinner();
      }
    }

    return "Success";
  }
}
