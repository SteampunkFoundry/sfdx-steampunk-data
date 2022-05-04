interface BasicRecord {
  Id: string;
  Name?: string;
}

interface Attachment extends BasicRecord {
  Body: object;
  Description?: string;
  OwnerId: string;
  ParentId?: string;
}

interface ConvertedAttachment extends Attachment {
  ContentDocumentId: string;
  ContentVersionId: string;
}

interface ContentDocument extends BasicRecord {
  LatestPublishedVersionId: string;
}

interface ContentVersion extends BasicRecord {
  Title: string;
  FileExtension: string;
  VersionData: string;
  ContentDocumentId?: string;
}

interface ContentVersionCreateRequest {
  FirstPublishLocationId?: string;
  PathOnClient: string;
  Title?: string;
  VersionData: object
}

interface ContentVersionCreateResult {
  id: string;
  success: boolean;
  errors: string[];
  name: string;
  message: string;
}

interface QueryResult {
  totalSize: number;
  done: boolean;
  records: BasicRecord[];
}

export {
  BasicRecord,
  Attachment,
  ConvertedAttachment,
  ContentVersion,
  ContentDocument,
  ContentVersionCreateResult,
  ContentVersionCreateRequest,
  QueryResult
};
