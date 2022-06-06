@steampunk/sfdx-steampunk-data
===================

Steampunk&#39;s SFDX Data Plugin

[![Version](https://img.shields.io/npm/v/@steampunk/sfdx-steampunk-data.svg)](https://www.npmjs.com/package/@steampunk/sfdx-steampunk-data)
[![Known Vulnerabilities](https://snyk.io/test/github/steampunkfoundry/sfdx-steampunk-data/badge.svg)](https://snyk.io/test/github/steampunkfoundry/sfdx-steampunk-data)
[![Downloads/week](https://img.shields.io/npm/dw/@steampunk/sfdx-steampunk-data.svg)](https://www.npmjs.com/package/@steampunk/sfdx-steampunk-data)
[![License](https://img.shields.io/npm/l/@steampunk/sfdx-steampunk-data.svg)](https://www.npmjs.com/package/@steampunk/sfdx-steampunk-data)

<!-- toc -->

<!-- tocstop -->
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g @steampunk/sfdx-steampunk-data
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
@steampunk/sfdx-steampunk-data/0.2.1 win32-x64 node-v16.15.1
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- usagestop -->
<!-- commands -->
* [`sfdx punk:data:files:upload -f <filepath> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-punkdatafilesupload--f-filepath--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx punk:data:files:upload -f <filepath> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Upload multiple files based on a csv

```
USAGE
  $ sfdx punk:data:files:upload -f <filepath> [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --filepath=filepath                                                           (required) Path to csv file

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE

    $ sfdx punk:data:files:upload -f ~/FilesToUpload.csv

    You will need to format a csv with the following headers.

    Required:
      - PathOnClient
      - Title

    Optional:
      - FirstPublishLocationId
```

_See code: [src/commands/punk/data/files/upload.ts](https://github.com/SteampunkFoundry/sfdx-steampunk-data/blob/v0.2.1/src/commands/punk/data/files/upload.ts)_
<!-- commandsstop -->
<!-- commandsstop -->
