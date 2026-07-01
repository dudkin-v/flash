import * as XLSX from 'xlsx';

const SOURCE_COLUMNS = [
    'Name',
    'BD',
    'SSN',
    'Address',
    'Address 2',
    'Address 3',
    'Address 4',
    'Phone',
    'Phone 2',
    'Email',
    'Email 2',
];

const SOURCE_EXAMPLE_ROW = {
    Name: 'John Smith',
    BD: '1990-05-15',
    SSN: '123456789',
    Address: '123 Main St',
    'Address 2': 'Apt 4B',
    'Address 3': 'CA',
    'Address 4': '',
    Phone: '2104224720',
    'Phone 2': '',
    Email: 'john.smith@example.com',
    'Email 2': '',
};

export function downloadSourceTemplate() {
    const ws = XLSX.utils.json_to_sheet([SOURCE_EXAMPLE_ROW], { header: SOURCE_COLUMNS });

    ws['!cols'] = SOURCE_COLUMNS.map((col) => ({
        wch: Math.max(col.length + 4, 18),
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Source');
    XLSX.writeFile(wb, 'source_template.xlsx');
}
