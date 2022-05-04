import { Connection } from '@salesforce/core/lib/connection';
import { Attachment, ContentVersion, ContentVersionCreateResult, ContentVersionCreateRequest, QueryResult } from './typeDefinitions';

export async function attachmentToContentVersion(conn: Connection, attachment: Attachment): Promise<ContentVersion> {
    const cvcr: ContentVersionCreateRequest = {
        FirstPublishLocationId: attachment.ParentId,
        PathOnClient: `/${attachment.Name}`,
        Title: attachment.Name,
        VersionData: attachment.Body
    };

    // Build the multi-part form data to be passed to the Request
    const formData = {
        entity_content: {
            value: JSON.stringify(cvcr),
            options: {
                contentType: 'application/json'
            }
        }
    };

    // POST the multipart form to Salesforce's API, can't use the normal "create" action because it doesn't support multipart
    // Had to bypass the type def to allow formData to pass through, will try and get it patched into the type def later
    // it is handled correctly by the underlying 'request' library.
    // https://github.com/request/request#multipartform-data-multipart-form-uploads
    const CV = ((await conn.request({
        url: `/services/data/v${conn.getApiVersion()}/sobjects/ContentVersion`,
        formData,
        method: 'POST'
    } as any)) as unknown) as ContentVersionCreateResult;

    const result = (await conn.query(`SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id='${CV.id}'`)) as QueryResult;
    return result.records[0] as ContentVersion;
}
