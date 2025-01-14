// Then to sign it


signer1.role, emailAddress, name
singer2.role, emailAddress, name
and the templateId, subject, message,
```ts
import * as DropboxSign from "@dropbox/sign";

const signatureRequestApi = new DropboxSign.SignatureRequestApi();

// Configure HTTP basic authorization: api_key
signatureRequestApi.username = "YOUR_API_KEY";

// or, configure Bearer (JWT) authorization: oauth2
// signatureRequestApi.accessToken = "YOUR_ACCESS_TOKEN";

const signer1: DropboxSign.SubSignatureRequestTemplateSigner = {
  role: "Client",
  emailAddress: "george@example.com",
  name: "George",
};

const signer2: DropboxSign.SubSignatureRequestTemplateSigner = {
  role: "Client",
  emailAddress: "george@example.com",
  name: "George",
};

const signingOptions: DropboxSign.SubSigningOptions = {
  draw: true,
  type: true,
  upload: true,
  phone: false,
  defaultType: DropboxSign.SubSigningOptions.DefaultTypeEnum.Draw,
};

const data: DropboxSign.SignatureRequestSendWithTemplateRequest = {
  templateIds: ["c26b8a16784a872da37ea946b9ddec7c1e11dff6"],
  subject: "Purchase Order",
  message: "Glad we could come to an agreement.",
  signers: [ signer1 ],
  ccs: [ cc1 ],
  customFields: [ customField1 ],
  signingOptions,
  testMode: true,
};

const result = signatureRequestApi.signatureRequestSendWithTemplate(data);
result.then(response => {
  console.log(response.body);
}).catch(error => {
  console.log("Exception when calling Dropbox Sign API:");
  console.log(error.body);
});
```



{
"signature_request": {
"signature_request_id": "223dcbb240b0046cc6a25d911b81b01dce329fbc",
"test_mode": true,
"title": "Test this sign",
"original_title": "Test this sign",
"subject": "Test this sign",
"message": "Please sign this",
"metadata": { },
"created_at": 1736849718,
"expires_at": null,
"is_complete": false,
"is_declined": false,
"has_error": false,
"custom_fields": [
{
"name": "PROPERTY_TRANSFER_DATE",
"type": "text",
"required": true,
"api_id": "20322253",
"editor": null,
"value": ""
},
{
"name": "SELLER_NAME",
"type": "text",
"required": true,
"api_id": "af28cde9",
"editor": null,
"value": ""
},
{
"name": "SELLER_ADDRESS",
"type": "text",
"required": true,
"api_id": "8c371059",
"editor": null,
"value": ""
},
{
"name": "SELLER_CITY",
"type": "text",
"required": true,
"api_id": "1175f1ad",
"editor": null,
"value": ""
},
{
"name": "SELLER_STATE",
"type": "text",
"required": true,
"api_id": "abaeb391",
"editor": null,
"value": ""
},
{
"name": "SELLER_ZIP_CODE",
"type": "text",
"required": true,
"api_id": "afbe4110",
"editor": null,
"value": ""
},
{
"name": "BUYER_NAME",
"type": "text",
"required": true,
"api_id": "42d51a2a",
"editor": null,
"value": ""
},
{
"name": "BUYER_ADDRESS",
"type": "text",
"required": true,
"api_id": "b5e0d371",
"editor": null,
"value": ""
},
{},
{},
{},
{},
{},
{},
{},
{},
{}
],
"response_data": [ ],
"signing_url": "https://app.hellosign.com/sign/223dcbb240b0046cc6a25d911b81b01dce329fbc",
"signing_redirect_url": null,
"final_copy_uri": "/v3/signature_request/final_copy/223dcbb240b0046cc6a25d911b81b01dce329fbc",
"files_url": "https://api.hellosign.com/v3/signature_request/files/223dcbb240b0046cc6a25d911b81b01dce329fbc",
"details_url": "https://app.hellosign.com/home/manage?guid=223dcbb240b0046cc6a25d911b81b01dce329fbc",
"requester_email_address": "siddharthsinghrana11@gmail.com",
"signatures": [
{
"signature_id": "1eb73d1ca5c1bd5f4ecd86dd00529e07",
"has_pin": false,
"has_sms_auth": false,
"has_sms_delivery": false,
"sms_phone_number": null,
"signer_email_address": "nixaws007@gmail.com",
"signer_name": "NIXBLACK",
"signer_role": "SELLER",
"order": null,
"status_code": "awaiting_signature",
"signed_at": null,
"last_viewed_at": null,
"last_reminded_at": null,
"error": null
},
{
"signature_id": "8cee047bb08893b951ef70db158147c9",
"has_pin": false,
"has_sms_auth": false,
"has_sms_delivery": false,
"sms_phone_number": null,
"signer_email_address": "siddharthsinghrana11@gmail.com",
"signer_name": "SIDDHARTH",
"signer_role": "BUYER",
"order": null,
"status_code": "awaiting_signature",
"signed_at": null,
"last_viewed_at": null,
"last_reminded_at": null,
"error": null
}
],
"cc_email_addresses": [ ],
"template_ids": [
"7b331d9e590bd4c07a586c02275910d4e61fd33c"
]
},
"warnings": [
{}
]
}

