import { core, flags, SfdxCommand } from "@salesforce/command";

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file.
// Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('@steampunk/sfdx-steampunk-data', 'convert');

export default class Convert extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');

  public static examples = [
    `sfdx punk:data:attachments:convert -q 'SELECT Id FROM Attachment`,
  ];

  protected static flagsConfig = {
    pathtocsv: flags.filepath({
      char: "q",
      description: messages.getMessage('queryFlagDescription'),
      required: true,
    }),
  };

  protected static requiresUsername = true;
}
