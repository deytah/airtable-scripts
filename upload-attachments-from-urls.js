/*
 * Airtable Script: automate uploading images from URLs as Attachments
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
    if(record.getCellValue(myAttachment) == null) {

        // since we are using an attachment field...
        // we create an object, then use array syntax to apply the variable name
        const info = {a: ''};
        // delete bypasses syntax error detection
        delete info.a;
        info[myAttachment.name] = [
                { url: record.getCellValue(myURL)}
            ];
        await table.updateRecordAsync(record, info);
    }
}
