import { flags, SfdxCommand } from '@salesforce/command';
import { Connection, Messages } from '@salesforce/core';
import { AttachmentToConvert, BasicRecord, ContentVersion } from "../../../../common/typeDefinitions";
import { attachmentToContentVersion } from "../../../../common/attachmentToContentVersion";

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file.
// Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('@steampunk/sfdx-steampunk-data', 'convert');

export default class Convert extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');

  public static examples = [
    `sfdx punk:data:attachments:convert -c "ParentId = '00130000000014cAAA'"`,
  ];

  protected static flagsConfig = {
    criteria: flags.filepath({
      char: "c",
      description: messages.getMessage('criteriaFlagDescription'),
      required: true
    }),
  };

  protected static requiresUsername = true;

  private async retrieveAttachments(conn: Connection, criteria: string): Promise<any> {
    const query = `SELECT Id, Name, Body, ContentType, Description, OwnerId, ParentId FROM Attachment WHERE ${criteria}`;
    const queryResult = await conn.autoFetchQuery<AttachmentToConvert>(query, { autoFetch: true, maxFetch: 50000 });
    return queryResult?.records ?? [];
  }

  public async run(): Promise<any> {
    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();

    const criteria = this.flags.criteria;

    this.ux.startSpinner("Retrieving attachments to convert");

    let attachments = await this.retrieveAttachments(conn, criteria);

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
      this.ux.startSpinner(`Loading file ${i + 1} of ${attachments.length}`);
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
