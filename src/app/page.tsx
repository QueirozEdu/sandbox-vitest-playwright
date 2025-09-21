import { TodoContainer } from '@/components/TodoContainer';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tests with Vitest and Playwright',
};

export default function Home() {
  return <TodoContainer />;
}
