import { Header } from './components/Header';
import { FileUploaderSection } from './components/FileUploaderSection';
import { ProfilesTable } from './components/ProfilesTable';
import { Button } from './components/ui/Button';
import { useConsumerContext } from './stores/consumerStore';
import { useProfilesContext } from './stores/profilesStore';
import './index.css';

export default function App() {
    const { selectedConsumer } = useConsumerContext();
    const { profiles, updateProfiles, clearProfiles } = useProfilesContext();

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Header />

            <main className="px-8 py-8 flex flex-col gap-5">
                <FileUploaderSection />

                {profiles.length > 0 && selectedConsumer && (
                    <section className="rounded-2xl border border-white/8 bg-[#111111] p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-medium text-zinc-400">
                                {selectedConsumer.label} —{' '}
                                <span className="text-white font-semibold">
                                    {profiles.length}
                                </span>{' '}
                                <span className="text-zinc-600 text-xs">профілів</span>
                            </h2>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => selectedConsumer.exportToExcel(profiles)}
                                >
                                    Експорт в Excel
                                </Button>
                                <Button variant="danger" size="sm" onClick={clearProfiles}>
                                    Очистити
                                </Button>
                            </div>
                        </div>
                        <ProfilesTable
                            consumer={selectedConsumer}
                            profiles={profiles}
                            onChange={updateProfiles}
                        />
                    </section>
                )}
            </main>
        </div>
    );
}
