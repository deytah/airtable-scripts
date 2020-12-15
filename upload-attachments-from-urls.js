/*
 * Airtable Script: automate uploading images from URLs as Attachments
 *
 * Based on a reply found in the Airtable Community: https://community.airtable.com/t/url-to-attachment/28569/3
 * using Script Settings: https://support.airtable.com/hc/en-us/articles/360043041074-Scripting-app-overview
 */

const settings = input.config ({
    title: 'Attachment Automator',
    description: 'Automate attaching files as URLs to an attachment field.',
    items: [
        input.config.table('myTable', {
            label: 'Table',
            description: 'Select the table with your URL and Attachment fields.'
        }),
        input.config.field('myURL', {
            label: 'URL Field',
            description: 'Select the URL Field to use as an attachment.',
            parentTable: 'myTable'
        }),
        input.config.field('myAttachment', {
            label: 'Attachment Field',
            description: 'Select the Attachment Field to use.',
            parentTable: 'myTable'
        })
    ]
});

const myTable = settings.myTable;
const myURL = settings.myURL;
const myAttachment = settings.myAttachment;

let table = myTable;

let query = await table.selectRecordsAsync();

for (let record of query.records) {
    // if the attachment field is empty
    if(record.getCellValue(myURL) && record.getCellValue(myAttachment) == null) {
        let recordId = await table.updateRecordAsync(record, {
            [myAttachment.id]: [
                {url: record.getCellValue(myURL)}
            ]
        })
    }
}

output.text('Click the settings gear to edit Settings for your next Run.')
