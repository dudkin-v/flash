import * as XLSX from 'xlsx';

const COLUMNS = [
    'name',
    'group_id',
    'domain_name',
    'username',
    'password',
    'cookie',
    'proxy_type',
    'proxy_host',
    'proxy_port',
    'proxy_user',
    'proxy_password',
    'remark',
];

const EXAMPLE_ROW = {
    name: 'Profile 1',
    group_id: '0',
    domain_name: 'facebook.com',
    username: 'user@example.com',
    password: 'mypassword',
    cookie: '',
    proxy_type: 'http',
    proxy_host: '123.0.0.1',
    proxy_port: '8080',
    proxy_user: 'proxyuser',
    proxy_password: 'proxypass',
    remark: 'Примечание',
};

export function downloadTemplate() {
    const ws = XLSX.utils.json_to_sheet([EXAMPLE_ROW], { header: COLUMNS });

    ws['!cols'] = COLUMNS.map((col) => ({
        wch: Math.max(col.length + 4, 16),
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Profiles');
    XLSX.writeFile(wb, 'adspower_template.xlsx');
}
