import { ChooseFileStep } from '@/components/ChooseFileStep';
import { PowerPointToPdfConverter } from '@/components/PowerPointToPdfConverter';

const Home = async () => (
  <main className="w-full max-w-[420px]">
    <ChooseFileStep/>
    <PowerPointToPdfConverter />
  </main>
);

export default Home;
