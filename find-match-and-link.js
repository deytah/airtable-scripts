/** 
 * This script finds a record based on the string on a field and creates a link for you.
 * This enables you to modify the string before lookup and run the search multiple ways.
 **/
const table = base.getTable("iObjects");
const textField = table.getField("Resource Parent");
const linkField = table.getField("API: Resource Parent");

table.selectRecordsAsync()

// Load all of the records in the table
let allRecords = await table.selectRecordsAsync();

function findRecordByName(name) {
    return allRecords.records.reduce((carry, rec) => {
        if(carry) return carry;
        return rec.getCellValueAsString('iObjects').toLowerCase() == name ? rec : carry;
    }, null)
}

// Find every record we need to update
const recordsWithParent = allRecords.records.filter((record) => record.getCellValueAsString('Resource Parent') != '')// && record.getCellValueAsString('API: Resource Parent') == '')
const promised = recordsWithParent.map(async record => {
    const id = record.id;
    const parent = record.getCellValueAsString('Resource Parent').replace(/"/g, '');
    const linked = record.getCellValueAsString('API: Resource Parent');
    let found = findRecordByName(parent.toLowerCase());
    if(!found) {
        found = findRecordByName(parent.toLowerCase().replace(/\(.*\)/, '').trim())
    }
    return Promise.resolve({id, parent, linked, found})
})

let results = await Promise.all(promised);

results = results.filter(item => !item.found)

// results.forEach(item => {
//     table.updateRecordAsync(item.id, {"API: Resource Parent": [item.found]})
// })

output.table(results);
