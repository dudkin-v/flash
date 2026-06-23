import { useContext } from 'react';
import { ConsumerContext } from './consumerContext';


export function useConsumerContext() {
    return useContext(ConsumerContext);
}