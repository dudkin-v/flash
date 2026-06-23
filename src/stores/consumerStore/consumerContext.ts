import { createContext } from 'react';
import type { UnknownConsumer } from '../../lib/types';

export interface ConsumerContextValue {
    selectedConsumer: UnknownConsumer | null;
    selectConsumer: (key: UnknownConsumer['key']) => void;
}

export const ConsumerContext = createContext<ConsumerContextValue>({
    selectedConsumer: null,
    selectConsumer: () => {},
});
