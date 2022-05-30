module.exports = {
  description: `Upload multiple files based on a csv`,
  filepath: `Path to csv file`,
  noOrgResults: `No results found for the org '%s'.`,
  username: `Username for the org`,
  examples: `
  $ sfdx punk:data:files:upload -f ~/FilesToUpload.csv

  You will need to format a csv with the following headers.

  Required:
    - PathOnClient
    - Title

  Optional:
    - FirstPublishLocationId`
};
