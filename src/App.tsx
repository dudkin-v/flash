import * as XLSX from 'xlsx';
import { Header } from './components/Header';
import { FileUploaderSection } from './components/FileUploaderSection';
import { ProfilesTable } from './components/ProfilesTable';
import { Button } from './components/ui/Button';
import { useProfilesContext } from './stores/profilesStore';
import './index.css';

export default function App() {
    const { rows, columns, updateRows, clearData } = useProfilesContext();

    function exportToExcel() {
        const ws = XLSX.utils.json_to_sheet(rows, { header: columns });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const date = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(wb, `export_${date}.xlsx`);
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Header />

            <main className="px-8 py-8 flex flex-col gap-5">
                <FileUploaderSection />

                {rows.length > 0 && (
                    <section className="rounded-2xl border border-white/8 bg-[#111111] p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-medium text-zinc-400">
                                <span className="text-white font-semibold">{rows.length}</span>{' '}
                                <span className="text-zinc-600 text-xs">рядків</span>
                            </h2>
                            <div className="flex items-center gap-2">
                                <Button size="sm" onClick={exportToExcel}>
                                    Експорт в Excel
                                </Button>
                                <Button variant="danger" size="sm" onClick={clearData}>
                                    Очистити
                                </Button>
                            </div>
                        </div>
                        <ProfilesTable
                            columns={columns}
                            rows={rows}
                            onChange={updateRows}
                        />
                    </section>
                )}
            </main>
        </div>
    );
}
